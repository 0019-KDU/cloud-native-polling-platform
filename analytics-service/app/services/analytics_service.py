from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional

from app.models.models import Poll, PollOption, Vote
from app.schemas.schemas import PollAnalytics, OptionStats, PlatformStats, PollSummary
import logging

logger = logging.getLogger(__name__)


def get_poll_analytics(db: Session, poll_id: int) -> Optional[PollAnalytics]:
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        return None

    total_votes = db.query(func.count(Vote.id)).filter(Vote.poll_id == poll_id).scalar() or 0

    option_counts = (
        db.query(Vote.option_id, func.count(Vote.id).label("vote_count"))
        .filter(Vote.poll_id == poll_id)
        .group_by(Vote.option_id)
        .all()
    )
    counts_by_option = {row.option_id: row.vote_count for row in option_counts}

    option_stats = []
    for option in poll.options:
        count = counts_by_option.get(option.id, 0)
        percentage = round((count / total_votes * 100), 2) if total_votes > 0 else 0.0
        option_stats.append(OptionStats(
            option_id=option.id,
            option_text=option.option_text,
            vote_count=count,
            percentage=percentage,
        ))

    return PollAnalytics(
        poll_id=poll.id,
        poll_title=poll.title,
        poll_status=poll.status,
        total_votes=total_votes,
        options=option_stats,
        created_at=poll.created_at,
        ends_at=poll.ends_at,
    )


def get_all_polls_summary(db: Session) -> List[PollSummary]:
    polls = db.query(Poll).order_by(desc(Poll.created_at)).all()
    result = []
    for poll in polls:
        total = db.query(func.count(Vote.id)).filter(Vote.poll_id == poll.id).scalar() or 0
        result.append(PollSummary(
            poll_id=poll.id,
            poll_title=poll.title,
            poll_status=poll.status,
            total_votes=total,
            created_at=poll.created_at,
        ))
    return result


def get_platform_stats(db: Session) -> PlatformStats:
    total_polls = db.query(func.count(Poll.id)).scalar() or 0
    active_polls = db.query(func.count(Poll.id)).filter(Poll.status == "ACTIVE").scalar() or 0
    ended_polls = db.query(func.count(Poll.id)).filter(Poll.status == "ENDED").scalar() or 0
    draft_polls = db.query(func.count(Poll.id)).filter(Poll.status == "DRAFT").scalar() or 0
    total_votes = db.query(func.count(Vote.id)).scalar() or 0

    most_voted = (
        db.query(Vote.poll_id, func.count(Vote.id).label("vote_count"))
        .group_by(Vote.poll_id)
        .order_by(desc("vote_count"))
        .first()
    )

    most_voted_summary = None
    if most_voted:
        poll = db.query(Poll).filter(Poll.id == most_voted.poll_id).first()
        if poll:
            most_voted_summary = PollSummary(
                poll_id=poll.id,
                poll_title=poll.title,
                poll_status=poll.status,
                total_votes=most_voted.vote_count,
                created_at=poll.created_at,
            )

    return PlatformStats(
        total_polls=total_polls,
        active_polls=active_polls,
        ended_polls=ended_polls,
        draft_polls=draft_polls,
        total_votes=total_votes,
        most_voted_poll=most_voted_summary,
    )
