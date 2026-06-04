from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.crud.transit import latest_transit_data, test
from src.schemas.transit import TransitResponse
from src.core.database import get_db

router = APIRouter(prefix="/transit")

@router.get("/latest", response_model=list[TransitResponse])
async def latest(db: Session = Depends(get_db)):
    """
    Latest transit data
    """
    return latest_transit_data(db=db)
