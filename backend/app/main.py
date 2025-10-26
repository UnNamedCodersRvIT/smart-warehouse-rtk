from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine
from app.api.hello import router as hello_router
from app.api.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    # create missing tables automatically
    Base.metadata.create_all(engine)

    yield

    # shutdown
    pass


def create_app() -> FastAPI:
    app = FastAPI(title="Умный склад API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(hello_router)
    app.include_router(auth_router)

    return app


app = create_app()
