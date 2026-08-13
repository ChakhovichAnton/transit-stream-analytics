from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

class DigiTransitVehiclePos(BaseModel):
    desi: str
    dir: Literal["1", "2"]
    drst: Literal[0, 1] | None
    lat: float | None = Field(default=None, ge=-90, le=90)
    long: float | None = Field(default=None, ge=-180, le=180)
    spd: float | None = Field(ge=0)
    tst: datetime
    veh: int = Field(gt=0)
    dl: int
    route: str
