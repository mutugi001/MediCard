import numpy as np
from fastapi import UploadFile, File, HTTPException
from fastapi import FastAPI
import face_recognition
import io
from datetime import datetime
from db import patient_faces_collection
from models import PatientFace
from uuid import UUID
from PIL import Image, ImageEnhance, ImageOps
from typing import Optional, Tuple, List

app = FastAPI()

# ============== Configuration ==============
# Use "cnn" for higher accuracy (requires GPU for speed), "hog" for CPU-only
FACE_DETECTION_MODEL = "hog"  # Change to "cnn" if you have GPU support
NUM_JITTERS = 5  # Number of times to re-sample face when calculating encoding (higher = more accurate but slower)
ENCODING_MODEL = "large"  # "large" (more accurate) or "small" (faster)

# Matching thresholds (lower distance = better match)
THRESHOLD_HIGH_CONFIDENCE = 0.45  # Very confident match
THRESHOLD_MEDIUM_CONFIDENCE = 0.52  # Likely match
THRESHOLD_LOW_CONFIDENCE = 0.58  # Possible match (use with caution)

# Face quality requirements
MIN_FACE_SIZE = 80  # Minimum face width/height in pixels
MIN_FACE_AREA_RATIO = 0.02  # Face must be at least 2% of image area


# ============== Helper Functions ==============

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess image to improve face detection accuracy.
    - Normalize brightness and contrast
    - Convert to RGB
    - Resize if too large (for performance)
    """
    # Load with PIL for preprocessing
    pil_image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if pil_image.mode != "RGB":
        pil_image = pil_image.convert("RGB")
    
    # Auto-adjust contrast
    pil_image = ImageOps.autocontrast(pil_image, cutoff=1)
    
    # Slight sharpening for better feature detection
    enhancer = ImageEnhance.Sharpness(pil_image)
    pil_image = enhancer.enhance(1.2)
    
    # Resize if image is very large (keeps aspect ratio)
    max_dimension = 1200
    if max(pil_image.size) > max_dimension:
        pil_image.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
    
    return np.array(pil_image)


def check_face_quality(image: np.ndarray, face_location: Tuple[int, int, int, int]) -> Tuple[bool, str]:
    """
    Check if the detected face meets quality requirements.
    Returns (is_valid, reason).
    """
    top, right, bottom, left = face_location
    face_width = right - left
    face_height = bottom - top
    
    # Check minimum face size
    if face_width < MIN_FACE_SIZE or face_height < MIN_FACE_SIZE:
        return False, f"Face too small ({face_width}x{face_height}px). Move closer to camera."
    
    # Check face area ratio
    image_area = image.shape[0] * image.shape[1]
    face_area = face_width * face_height
    area_ratio = face_area / image_area
    
    if area_ratio < MIN_FACE_AREA_RATIO:
        return False, "Face too far from camera. Please move closer."
    
    return True, "OK"


def detect_faces_with_quality_check(image: np.ndarray) -> Tuple[List, List, Optional[str]]:
    """
    Detect faces and filter by quality.
    Returns (valid_face_locations, all_face_locations, error_message).
    """
    # Detect face locations
    face_locations = face_recognition.face_locations(image, model=FACE_DETECTION_MODEL)
    
    if not face_locations:
        return [], [], "No face detected in image."
    
    # Check quality of each face
    valid_locations = []
    quality_issues = []
    
    for loc in face_locations:
        is_valid, reason = check_face_quality(image, loc)
        if is_valid:
            valid_locations.append(loc)
        else:
            quality_issues.append(reason)
    
    if not valid_locations:
        return [], face_locations, quality_issues[0] if quality_issues else "Face quality check failed."
    
    return valid_locations, face_locations, None


def get_face_encoding_with_jitter(image: np.ndarray, face_location: Tuple[int, int, int, int]) -> np.ndarray:
    """
    Get face encoding with multiple jitters for better accuracy.
    """
    encodings = face_recognition.face_encodings(
        image,
        known_face_locations=[face_location],
        num_jitters=NUM_JITTERS,
        model=ENCODING_MODEL
    )
    
    if not encodings:
        return None
    
    return encodings[0]


def calculate_match_confidence(distance: float) -> Tuple[float, str]:
    """
    Convert face distance to confidence percentage and level.
    """
    # Convert distance to confidence (0-100%)
    confidence = round((1 - distance) * 100, 2)
    
    if distance < THRESHOLD_HIGH_CONFIDENCE:
        level = "high"
    elif distance < THRESHOLD_MEDIUM_CONFIDENCE:
        level = "medium"
    elif distance < THRESHOLD_LOW_CONFIDENCE:
        level = "low"
    else:
        level = "no_match"
    
    return confidence, level


# ============== API Endpoints ==============

@app.post("/register-face/{patient_id}")
async def register_face(patient_id: UUID, file: UploadFile = File(...)):
    """
    Register a face for a patient. Stores high-quality encoding.
    Supports multiple registrations per patient for better matching.
    """
    patient_id_str = str(patient_id)
    image_bytes = await file.read()
    
    # Preprocess image
    image = preprocess_image(image_bytes)
    
    # Detect faces with quality check
    valid_locations, all_locations, error = detect_faces_with_quality_check(image)
    
    if error:
        return {
            "success": False,
            "message": error,
            "faces_detected": len(all_locations)
        }
    
    if len(valid_locations) > 1:
        return {
            "success": False,
            "message": "Multiple faces detected. Please ensure only one face is in the image.",
            "faces_detected": len(valid_locations)
        }
    
    # Get encoding with jitter for better accuracy
    face_location = valid_locations[0]
    encoding = get_face_encoding_with_jitter(image, face_location)
    
    if encoding is None:
        return {"success": False, "message": "Failed to encode face."}
    
    face_entry = PatientFace(
        patient_id=patient_id_str,
        encoding=encoding.astype(np.float64).tolist(),
        created_at=datetime.utcnow(),
    )

    patient_faces_collection.insert_one({
        "patient_id": face_entry.patient_id,
        "encoding": face_entry.encoding,
        "created_at": face_entry.created_at,
    })

    encoding_count = patient_faces_collection.count_documents({"patient_id": patient_id_str})

    return {
        "success": True,
        "message": "Face registered successfully.",
        "total_encodings": encoding_count,
        "tip": "For best accuracy, register 3-5 photos with different lighting/angles."
    }


@app.post("/match")
async def match_face(file: UploadFile = File(...)):
    """
    Match an uploaded face against registered patients.
    Uses improved matching with confidence levels.
    """
    image_bytes = await file.read()
    
    # Preprocess image
    image = preprocess_image(image_bytes)
    
    # Detect faces with quality check
    valid_locations, all_locations, error = detect_faces_with_quality_check(image)
    
    if error:
        return {
            "match": False,
            "reason": error,
            "faces_detected": len(all_locations)
        }
    
    # Use the largest face if multiple detected
    if len(valid_locations) > 1:
        # Sort by face area (largest first)
        valid_locations.sort(
            key=lambda loc: (loc[2] - loc[0]) * (loc[1] - loc[3]),
            reverse=True
        )
    
    face_location = valid_locations[0]
    unknown_encoding = get_face_encoding_with_jitter(image, face_location)
    
    if unknown_encoding is None:
        return {"match": False, "reason": "Failed to encode face."}
    
    all_faces = list(patient_faces_collection.find({}, {"patient_id": 1, "encoding": 1, "_id": 0}))

    if not all_faces:
        return {"match": False, "reason": "No registered faces in database."}

    # Group encodings by patient for multi-encoding matching
    patient_encodings = {}
    for face in all_faces:
        pid = face["patient_id"]
        if pid not in patient_encodings:
            patient_encodings[pid] = []
        known_encoding = np.array(face["encoding"], dtype=np.float64)
        patient_encodings[pid].append(known_encoding)

    # Find best match across all patients
    best_patient_id = None
    best_distance = float("inf")
    best_match_count = 0  # How many encodings matched for this patient

    for patient_id, encodings in patient_encodings.items():
        # Calculate distance to each encoding for this patient
        distances = face_recognition.face_distance(encodings, unknown_encoding)

        # Use minimum distance (best match) for this patient
        min_distance = np.min(distances)

        # Count how many encodings are within threshold (for confidence)
        match_count = np.sum(distances < THRESHOLD_LOW_CONFIDENCE)

        # Prefer patient with lowest distance, or more matching encodings if tied
        if min_distance < best_distance or (
            min_distance == best_distance and match_count > best_match_count
        ):
            best_distance = min_distance
            best_patient_id = patient_id
            best_match_count = match_count

    # Calculate confidence and level
    confidence, level = calculate_match_confidence(best_distance)

    if level != "no_match":
        return {
            "match": True,
            "patient_id": best_patient_id,
            "confidence": confidence,
            "confidence_level": level,
            "distance": round(best_distance, 4),
            "matching_encodings": int(best_match_count)
        }

    return {
        "match": False,
        "reason": "No match found above confidence threshold.",
        "best_distance": round(best_distance, 4),
        "best_confidence": confidence
    }


@app.delete("/faces/{patient_id}")
async def delete_patient_faces(patient_id: UUID):
    """
    Delete all face encodings for a patient.
    """
    patient_id_str = str(patient_id)
    
    result = patient_faces_collection.delete_many({"patient_id": patient_id_str})

    return {
        "success": True,
        "deleted_encodings": result.deleted_count
    }


@app.get("/faces/{patient_id}/count")
async def get_patient_encoding_count(patient_id: UUID):
    """
    Get the number of registered face encodings for a patient.
    """
    patient_id_str = str(patient_id)
    
    count = patient_faces_collection.count_documents({"patient_id": patient_id_str})

    return {
        "patient_id": patient_id_str,
        "encoding_count": count,
        "recommendation": "3-5 encodings recommended for best accuracy." if count < 3 else "Good coverage."
    }