from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class TaskStatus(str, enum.Enum):
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"

class TaskPriority(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True) 
    status = Column(Enum(TaskStatus), default=TaskStatus.pending)
    priority = Column(Enum(TaskPriority), default=TaskPriority.medium)
    due_date = Column(Date, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    user = relationship("User", back_populates="tasks")
    category = relationship("Category", back_populates="tasks")
