from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # <-- specify length
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    tasks = relationship("Task", back_populates="category")
