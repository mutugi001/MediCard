import numpy as np
from fastapi import UploadFile, File
from fastapi import FastAPI
import face_recognition
import io
from sqlalchemy.orm import Session
from db import SessionLocal
from models import PatientFace
from uuid import UUID

app = FastAPI()

@app.post("/register-face/{patient_id}")
async def register_face(patient_id: UUID, file: UploadFile = File(...)):
    patient_id_str = str(patient_id)
    image_bytes = await file.read()
    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        return {"success": False, "message": "No face detected."}

    encoding = encodings[0]
    encoding_bytes = encoding.tobytes()

    db: Session = SessionLocal()
    face_entry = PatientFace(patient_id=patient_id_str, encoding=encoding_bytes)
    db.add(face_entry)
    db.commit()
    db.close()

    return {"success": True}

@app.post("/match")
async def match_face(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    unknown_encodings = face_recognition.face_encodings(image)

    if not unknown_encodings:
        return {"match": False, "reason": "No face detected"}

    unknown_encoding = unknown_encodings[0]

    db: Session = SessionLocal()
    all_faces = db.query(PatientFace).all()

    best_match = None
    best_distance = float("inf")

    for face in all_faces:
        known_encoding = np.frombuffer(face.encoding, dtype=np.float64)
        distance = face_recognition.face_distance([known_encoding], unknown_encoding)[0]

        # If it's the best (smallest) distance so far, store it
        if distance < best_distance:
            best_distance = distance
            best_match = face

    db.close()

    if best_match and best_distance < 0.55:  # threshold for high confidence
        return {
            "match": True,
            "patient_id": best_match.patient_id,
            "confidence": round((1 - best_distance) * 100, 2)  # percentage-like confidence
        }
    else:
        return {"match": False, "reason": "No match found"}