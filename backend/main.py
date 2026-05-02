from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import re
import asyncio
from slowapi import Limiter
from slowapi.util import get_remote_address

app = FastAPI(title="StreamVault API", version="2.4.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

# YouTube URL validation pattern
YT_URL_PATTERN = re.compile(
    r'(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/)[\w\-]+'
)


class VideoRequest(BaseModel):
    url: str
    format_id: str = "best"


def validate_url(url: str) -> bool:
    """Validate if URL is a valid YouTube URL"""
    if not YT_URL_PATTERN.match(url):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    return True


def format_size(bytes_val):
    """Format bytes to human-readable size"""
    if not bytes_val:
        return "Unknown"
    units = ['B', 'KB', 'MB', 'GB', 'TB']
    bytes_val = float(bytes_val)
    i = 0
    while bytes_val >= 1024 and i < len(units) - 1:
        bytes_val /= 1024
        i += 1
    return f"{bytes_val:.1f} {units[i]}"


def get_badge(height):
    """Determine badge type based on video height"""
    if height >= 2160:
        return "HDR"
    if height >= 720:
        return "HD"
    if height >= 480:
        return "SD"
    return "LQ"


def get_label(height):
    """Get format label based on video height"""
    labels = {
        2160: "4K Ultra",
        1440: "1440p Pro",
        1080: "1080p Full",
        720: "720p Std",
        480: "480p Mobile",
        360: "360p Data Saver",
    }
    return labels.get(height, f"{height}p")


@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "online", "version": "2.4.0"}


@app.post("/video-info")
def get_video_info(req: VideoRequest):
    """Fetch video information including available formats"""
    validate_url(req.url)

    try:
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": False,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(req.url, download=False)

        formats = []
        seen_heights = set()

        # Process video formats
        for fmt in sorted(
            info.get("formats", []),
            key=lambda x: x.get("height") or 0,
            reverse=True,
        ):
            height = fmt.get("height")

            # Skip if no height or already seen
            if not height or height in seen_heights:
                continue

            # Skip if not video format
            if fmt.get("ext") not in ["mp4", "webm"]:
                continue

            seen_heights.add(height)
            size = fmt.get("filesize") or fmt.get("filesize_approx")

            formats.append(
                {
                    "format_id": fmt["format_id"],
                    "label": get_label(height),
                    "resolution": f"{fmt.get('width', 0)}x{height}",
                    "quality": f"{height}p",
                    "codec": fmt.get("vcodec", "H.264").split(".")[0].upper(),
                    "ext": fmt.get("ext", "mp4"),
                    "file_size": size,
                    "file_size_label": format_size(size),
                    "badge_type": get_badge(height),
                    "stream_url": fmt["url"],
                }
            )

        # Get duration in MM:SS format
        duration_seconds = int(info.get("duration", 0))
        minutes = duration_seconds // 60
        seconds = duration_seconds % 60
        duration_str = f"{minutes}:{seconds:02d}"

        return {
            "title": info.get("title", "Unknown"),
            "thumbnail": info.get("thumbnail", ""),
            "duration": duration_str,
            "channel_name": info.get("uploader", "Unknown"),
            "channel_avatar": info.get("uploader_url", ""),
            "subscriber_count": str(info.get("channel_follower_count", "")),
            "view_count": f"{info.get('view_count', 0):,}",
            "upload_date": info.get("upload_date", ""),
            "formats": formats,
            "audio_format": {
                "format_id": "bestaudio",
                "label": "Audio Only",
                "codec": "FLAC",
                "file_size_label": "~45 MB",
                "stream_url": "",
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching video info: {str(e)}"
        )


@app.post("/stream-url")
def get_stream_url(req: VideoRequest):
    """Get streaming URL for a specific format"""
    validate_url(req.url)

    try:
        ydl_opts = {
            "format": req.format_id,
            "quiet": True,
            "no_warnings": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(req.url, download=False)

        return {
            "stream_url": info.get("url", ""),
            "expires_in": 21600,  # 6 hours
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stream URL: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )
