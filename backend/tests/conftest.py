from pathlib import Path
import sys


def pytest_configure():
    backend_root = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(backend_root))
