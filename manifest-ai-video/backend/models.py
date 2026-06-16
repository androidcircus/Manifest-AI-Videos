from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from database import Base
from datetime import datetime
import uuid

class VideoJob(Base):
    __tablename__ = "video_jobs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False)
    task_id = Column(String(255))
    prompt = Column(Text, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    style = Column(String(50))
    status = Column(String(50), default="queued")
    progress = Column(Float, default=0.0)
    current_stage = Column(String(255))
    video_url = Column(String(1024))
    video_path = Column(String(1024))
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
