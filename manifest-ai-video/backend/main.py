from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid
import os
from sqlalchemy.orm import Session
from celery.result import AsyncResult

from database import get_db, engine, Base
from models import VideoJob
from tasks import generate_video_task

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Manifest AI Video API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=10)
    duration_minutes: int = Field(1, ge=1, le=30)
    style: str = "cinematic"

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/generate")
async def generate(request: GenerateRequest, db: Session = Depends(get_db)):
    job_id = str(uuid.uuid4())
    
    job = VideoJob(
        id=job_id,
        user_id="demo",
        prompt=request.prompt,
        duration_minutes=request.duration_minutes,
        style=request.style,
        status="queued",
        created_at=datetime.utcnow()
    )
    db.add(job)
    db.commit()
    
    task = generate_video_task.delay({
        "job_id": job_id,
        "prompt": request.prompt,
        "duration_minutes": request.duration_minutes,
        "style": request.style
    })
    
    job.task_id = task.id
    db.commit()
    
    return {"job_id": job_id, "status": "queued", "estimated_time": request.duration_minutes * 60}

@app.get("/api/status/{job_id}")
async def status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
    if not job:
        raise HTTPException(404, "Job not found")
    
    return {
        "job_id": job.id,
        "status": job.status,
        "progress": job.progress or 0,
        "current_stage": job.current_stage or "Initializing",
        "video_url": job.video_url,
        "error_message": job.error_message
    }

@app.get("/api/download/{job_id}")
async def download(job_id: str, db: Session = Depends(get_db)):
    job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
    if not job or not job.video_path or not os.path.exists(job.video_path):
        raise HTTPException(404, "Video not found")
    
    return FileResponse(job.video_path, media_type="video/mp4", filename=f"manifest_{job_id}.mp4")

@app.get("/")
async def root():
    return {"message": "Manifest AI Video API", "docs": "/docs"}
