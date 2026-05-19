from sqlalchemy import Column, Integer, BigInteger, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.database import Base


class PollStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    ENDED = "ENDED"


class Poll(Base):
    __tablename__ = "polls"

    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(1000))
    status = Column(String(20), nullable=False, default="DRAFT")
    created_by = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    ends_at = Column(DateTime(timezone=True))

    options = relationship("PollOption", back_populates="poll", lazy="joined")


class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(BigInteger, primary_key=True, index=True)
    poll_id = Column(BigInteger, ForeignKey("polls.id"), nullable=False)
    option_text = Column(String(200), nullable=False)
    display_order = Column(Integer, default=0)

    poll = relationship("Poll", back_populates="options")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(BigInteger, primary_key=True, index=True)
    poll_id = Column(BigInteger, nullable=False, index=True)
    option_id = Column(BigInteger, nullable=False)
    voter_fingerprint = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
