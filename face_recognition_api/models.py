from sqlalchemy import Column, Integer,String, LargeBinary
from db import Base

class PatientFace(Base):
    __tablename__ = "patient_faces"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(36), index=True)
    encoding = Column(LargeBinary)
