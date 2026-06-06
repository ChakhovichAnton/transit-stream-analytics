from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from src.services.transit import (
    handle_aggregated_data_for_date,
    handle_available_dates,
    handle_get_window_length,
    handle_latest_aggregated_transit_data,
    handle_latest_transit_data
)
from src.schemas.transit import AggregatedTransitDateResponse, TransitResponse, AggregatedTransitResponse
from src.core.database import get_db

router = APIRouter(prefix="/transit")

@router.get("/latest", response_model=list[TransitResponse])
async def latest(db: Session = Depends(get_db)):
    """
    Latest transit data
    """
    return handle_latest_transit_data(db=db)

@router.get("/aggregated/latest", response_model=list[AggregatedTransitResponse])
async def latest_aggregated(db: Session = Depends(get_db)):
    """
    Latest aggregated transit data
    """
    return handle_latest_aggregated_transit_data(db=db)

@router.get("/aggregated/window-length", response_model=list[int])
async def window_length(db: Session = Depends(get_db)):
    """
    Get window length
    """
    return handle_get_window_length(db=db)

@router.get("/aggregated/window/{window_length}/dates", response_mode=list[AggregatedTransitDateResponse])
async def dates(window_length: int, db: Session = Depends(get_db)):
    """
    Get dates with data for the specified window length given in seconds
    """
    if window_length <= 0:
        raise HTTPException(status_code=400, detail="Bad Request: window_length must be a positive integer")

    return handle_available_dates(db, window_length)

@router.get("/aggregated/window/{window_length}/start/{start_timestamp}", response_model=list[AggregatedTransitResponse])
async def aggregated_period(window_length: int, start_timestamp: datetime, db: Session = Depends(get_db)):
    """
    Get aggregated data for the specified window length and start timestamp
    """
    if window_length <= 0:
        raise HTTPException(status_code=400, detail="Bad Request: window_length must be a positive integer")

    return handle_aggregated_data_for_date(db, window_length, start_timestamp)
