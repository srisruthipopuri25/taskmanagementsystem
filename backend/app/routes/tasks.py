from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Create task
@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_task = Task(**task.model_dump(), user_id=user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Get tasks with optional filters
@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    query = db.query(Task).filter(Task.user_id == user.id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if category_id:
        query = query.filter(Task.category_id == category_id)
    return query.all()

# Update task
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

# Delete task
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}
