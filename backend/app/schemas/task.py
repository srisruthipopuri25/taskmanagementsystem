from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.task import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.pending
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[date] = None
    category_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    status: Optional[TaskStatus]
    priority: Optional[TaskPriority]
    due_date: Optional[date]
    category_id: Optional[int]

class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True
