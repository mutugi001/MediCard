FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_NO_CACHE_DIR=1

# Build dependencies for face_recognition/dlib
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	cmake \
	g++ \
	libopenblas-dev \
	liblapack-dev \
	libjpeg62-turbo-dev \
	libpng-dev \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel \
	&& pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}"]
