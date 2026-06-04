from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.services.transit import handle_latest_transit_data
from src.schemas.transit import TransitResponse
from src.core.database import get_db

router = APIRouter(prefix="/transit")

@router.get("/latest", response_model=list[TransitResponse])
async def latest(db: Session = Depends(get_db)):
    """
    Latest transit data
    """
    return handle_latest_transit_data(db=db)
