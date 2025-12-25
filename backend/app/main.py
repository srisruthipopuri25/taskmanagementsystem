from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.models.user import User
from app.models.task import Task
from app.models.category import Category
from app.routes import auth, tasks, categories

# Create FastAPI
app = FastAPI()

# cors
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# models
Base.metadata.create_all(bind=engine)

# routes
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(categories.router)
