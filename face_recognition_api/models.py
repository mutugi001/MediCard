from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional


@dataclass
class PatientFace:
    patient_id: str
    encoding: List[float]
    created_at: Optional[datetime] = None
