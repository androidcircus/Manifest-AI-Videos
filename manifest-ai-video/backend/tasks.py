import time
import logging
from celery import Celery
from database import SessionLocal
from models import VideoJob
from datetime import datetime
import os

logger = logging.getLogger(__name__)

celery_app = Celery("manifest_ai", broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"))

@celery_app.task(bind=True)
def generate_video_task(self, request):
    job_id = request["job_id"]
    logger.info(f"Starting generation for {job_id}")
    
    stages = [
        ("Analyzing your story", 10),
        ("Writing script", 25),
        ("Designing shots", 40),
        ("Generating video", 70),
        ("Enhancing audio", 85),
        ("Finalizing", 100)
    ]
    
    for stage_name, progress in stages:
        self.update_state(state="PROCESSING", meta={"current_stage": stage_name, "progress": progress})
        time.sleep(2)
    
    db = SessionLocal()
    try:
        job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
        if job:
            job.status = "completed"
            job.progress = 100
            job.current_stage = "Complete"
            job.video_url = f"/api/download/{job_id}"
            job.video_path = f"/app/outputs/{job_id}.mp4"
            job.completed_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()
    
    return {"status": "success", "job_id": job_id}
