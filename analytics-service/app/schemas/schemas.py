from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime


class OptionStats(BaseModel):
    option_id: int
    option_text: str
    vote_count: int
    percentage: float

    class Config:
        from_attributes = True


class PollAnalytics(BaseModel):
    poll_id: int
    poll_title: str
    poll_status: str
    total_votes: int
    options: List[OptionStats]
    created_at: Optional[datetime]
    ends_at: Optional[datetime]

    class Config:
        from_attributes = True


class PollSummary(BaseModel):
    poll_id: int
    poll_title: str
    poll_status: str
    total_votes: int
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class PlatformStats(BaseModel):
    total_polls: int
    active_polls: int
    ended_polls: int
    draft_polls: int
    total_votes: int
    most_voted_poll: Optional[PollSummary]
