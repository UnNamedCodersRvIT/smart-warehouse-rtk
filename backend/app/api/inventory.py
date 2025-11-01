from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File

from app.db.session import get_session
from sqlalchemy.orm import Session
from app.db.models import User, Product, InventoryHistory

from app.api.deps import get_current_user

import io
import csv
from datetime import datetime


router = APIRouter(prefix="/api/inventory")


@router.post("/import")
async def import_csv(
    file: UploadFile = File(...), db: Session = Depends(get_session), user: User = Depends(get_current_user)
):
    
    
    content = await file.read()
    try:
        text = content.decode("utf-8-sig")
    except Exception:
        try:
            text = content.decode("utf-8")
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to decode uploaded file as UTF-8")

    sample = text[:4096]
    try:
        sniffer = csv.Sniffer()
        dialect = sniffer.sniff(sample)
        delimiter = dialect.delimiter
    except Exception:
        first_line = text.splitlines()[0] if text.splitlines() else ""
        delimiter = ";" if ";" in first_line else ","

    reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)
    success = 0
    failed = 0
    errors: list[dict] = []

    for idx, row in enumerate(reader, start=1):
        row = {k.strip().lower() if k is not None else k: (v.strip() if isinstance(v, str) else v) for k, v in row.items()}

        product_id = row.get("product_id") or row.get("product")
        product_name = row.get("product_name") or row.get("name")
        quantity_raw = row.get("quantity")
        zone = row.get("zone")
        scanned_at_raw = row.get("scanned_at") or row.get("scannedat") or row.get("date")

        if not product_id or not quantity_raw or not zone or not scanned_at_raw:
            failed += 1
            errors.append({"row": idx, "error": "Missing required field(s): product_id, quantity, zone, scanned_at"})
            continue

        try:
            quantity = int(float(quantity_raw))
        except Exception:
            failed += 1
            errors.append({"row": idx, "error": f"Invalid quantity: {quantity_raw}"})
            continue

        def parse_optional_int(value):
            if value is None or value == "":
                return None
            try:
                return int(float(value))
            except Exception:
                return None

        row_number = parse_optional_int(row.get("row_number") or row.get("row"))
        shelf_number = parse_optional_int(row.get("shelf_number") or row.get("shelf"))
        robot_id = row.get("robot_id") or row.get("robot")
        status_val = row.get("status")

        scanned_at = None
        for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
            try:
                scanned_at = datetime.fromisoformat(scanned_at_raw) if fmt == "%Y-%m-%dT%H:%M:%S" and "T" in scanned_at_raw else datetime.strptime(scanned_at_raw, fmt)
                break
            except Exception:
                scanned_at = None
        if scanned_at is None:
            try:
                scanned_at = datetime.fromisoformat(scanned_at_raw)
            except Exception:
                failed += 1
                errors.append({"row": idx, "error": f"Invalid scanned_at datetime: {scanned_at_raw}"})
                continue
        try:
            product = db.get(Product, product_id)
            if product is None:
                pname = product_name if (product_name and product_name != "") else product_id
                product = Product(id=product_id, name=pname)
                db.add(product)
                db.commit()
                db.refresh(product)

            inv = InventoryHistory(
                product_id=product.id,
                quantity=quantity,
                zone=zone,
                row_number=row_number,
                shelf_number=shelf_number,
                robot_id=robot_id,
                status=status_val,
                scanned_at=scanned_at,
            )
            db.add(inv)
            db.commit()
            success += 1
        except Exception as exc:
            db.rollback()
            failed += 1
            errors.append({"row": idx, "error": str(exc)})

    return {"success": success, "failed": failed, "errors": errors}
