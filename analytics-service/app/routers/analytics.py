from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.schemas import PollAnalytics, PollSummary, PlatformStats
from app.services import analytics_service

router = APIRouter(tags=["analytics"])


@router.get("/polls", response_model=List[PollSummary])
def list_polls_summary(db: Session = Depends(get_db)):
    return analytics_service.get_all_polls_summary(db)


@router.get("/polls/{poll_id}", response_model=PollAnalytics)
def get_poll_analytics(poll_id: int, db: Session = Depends(get_db)):
    result = analytics_service.get_poll_analytics(db, poll_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Poll {poll_id} not found")
    return result


@router.get("/stats", response_model=PlatformStats)
def get_platform_stats(db: Session = Depends(get_db)):
    return analytics_service.get_platform_stats(db)
