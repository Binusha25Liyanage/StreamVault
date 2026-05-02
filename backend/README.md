# StreamVault Backend API

FastAPI-based backend for StreamVault mobile app that handles YouTube video information retrieval and streaming URL generation using yt-dlp.

## Setup

### Requirements
- Python 3.8+
- pip

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "online",
  "version": "2.4.0"
}
```

### Get Video Info
```
POST /video-info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=..."
}
```

Returns detailed video information including:
- Title, thumbnail, duration
- Channel info (name, avatar, subscriber count, view count)
- Available formats with resolutions and file sizes
- Audio-only format option

### Get Stream URL
```
POST /stream-url
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=...",
  "format_id": "22"
}
```

Returns the direct streaming URL that expires in 6 hours.

## Deployment

For production, use a proper ASGI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Notes

- Stream URLs are temporary and expire after 6 hours
- Rate limiting is configured via slowapi
- CORS is enabled for all origins
- yt-dlp is used for video extraction
