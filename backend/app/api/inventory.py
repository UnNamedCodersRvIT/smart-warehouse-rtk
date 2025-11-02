from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
import io
import csv
from datetime import datetime

from app.db.session import get_session
from app.db.models import User, Product, InventoryHistory
from app.api.deps import get_current_user
from app.schemas.inventory import InventoryHistoryListResponse, InventoryHistoryItem


router = APIRouter(prefix="/api/inventory")


@router.post("/import")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):

    content = await file.read()
    try:
        text = content.decode("utf-8-sig")
    except Exception:
        try:
            text = content.decode("utf-8")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to decode uploaded file as UTF-8",
            )

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
        row = {
            k.strip().lower() if k is not None else k: (
                v.strip() if isinstance(v, str) else v
            )
            for k, v in row.items()
        }

        product_id = row.get("product_id") or row.get("product")
        product_name = row.get("product_name") or row.get("name")
        quantity_raw = row.get("quantity")
        zone = row.get("zone")
        scanned_at_raw = (
            row.get("scanned_at") or row.get("scannedat") or row.get("date")
        )

        if not product_id or not quantity_raw or not zone or not scanned_at_raw:
            failed += 1
            errors.append(
                {
                    "row": idx,
                    "error": "Missing required field(s): product_id, quantity, zone, scanned_at",
                }
            )
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
                scanned_at = (
                    datetime.fromisoformat(scanned_at_raw)
                    if fmt == "%Y-%m-%dT%H:%M:%S" and "T" in scanned_at_raw
                    else datetime.strptime(scanned_at_raw, fmt)
                )
                break
            except Exception:
                scanned_at = None
        if scanned_at is None:
            try:
                scanned_at = datetime.fromisoformat(scanned_at_raw)
            except Exception:
                failed += 1
                errors.append(
                    {
                        "row": idx,
                        "error": f"Invalid scanned_at datetime: {scanned_at_raw}",
                    }
                )
                continue
        try:
            product = db.get(Product, product_id)
            if product is None:
                pname = (
                    product_name
                    if (product_name and product_name != "")
                    else product_id
                )
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


@router.get("/history", response_model=InventoryHistoryListResponse)
def get_inventory_history(
    from_date: datetime | None = Query(None, alias="from"),
    to_date: datetime | None = Query(None, alias="to"),
    zone: str | None = None,
    status: str | None = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=1000),
    db: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    query = db.query(InventoryHistory)

    if from_date:
        query = query.filter(InventoryHistory.scanned_at >= from_date)
    if to_date:
        query = query.filter(InventoryHistory.scanned_at <= to_date)
    if zone:
        query = query.filter(InventoryHistory.zone == zone)
    if status:
        query = query.filter(InventoryHistory.status == status)

    total = query.count()

    offset = (page - 1) * per_page
    items = (
        query.order_by(InventoryHistory.scanned_at.desc())
        .offset(offset)
        .limit(per_page)
        .all()
    )
    item_schemas = []
    for item in items:
        item.product_name = item.product.name if item.product else "Unknown"
        item_schemas.append(InventoryHistoryItem.model_validate(item))

    pagination = {"page": page, "per_page": per_page, "offset": offset}
    return InventoryHistoryListResponse(
        total=total, items=item_schemas, pagination=pagination
    )
