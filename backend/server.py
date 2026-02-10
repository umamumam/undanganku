from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
MUSIC_DIR = UPLOAD_DIR / "music"
MUSIC_DIR.mkdir(exist_ok=True)

# MongoDB connection
import certifi
mongo_url = os.environ['MONGO_URL']
# Add SSL/TLS options for MongoDB Atlas with certifi
client = AsyncIOMotorClient(
    mongo_url,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000
)
db = client[os.environ.get('DB_NAME', 'undanganku')]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'wedding-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Serve static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# ============ THEME DEFINITIONS ============

THEMES = {
    "adat": {
        "id": "adat",
        "name": "Adat/Traditional",
        "description": "Tema dengan ornamen tradisional Indonesia",
        "primary_color": "#8B4513",
        "secondary_color": "#F5DEB3",
        "accent_color": "#D4AF37",
        "font_heading": "Cinzel",
        "font_body": "Manrope",
        "ornaments": {
            "top_left": "https://images.unsplash.com/photo-1762111067760-1f0fc2aa2866?w=400",
            "top_right": "https://images.unsplash.com/photo-1761517099247-71400d18ccd8?w=400",
            "bottom": "https://images.unsplash.com/photo-1761515315519-7fa1af1d3e06?w=400",
            "divider": "https://images.unsplash.com/photo-1762111067760-1f0fc2aa2866?w=200"
        },
        "background_pattern": "batik"
    },
    "floral": {
        "id": "floral",
        "name": "Floral/Bunga",
        "description": "Tema dengan dekorasi bunga yang elegan",
        "primary_color": "#B76E79",
        "secondary_color": "#F5E6E8",
        "accent_color": "#D4AF37",
        "font_heading": "Playfair Display",
        "font_body": "Manrope",
        "ornaments": {
            "top_left": "https://images.unsplash.com/photo-1581720848095-2b72764b08a2?w=400",
            "top_right": "https://images.unsplash.com/photo-1581720848209-9721f8fa30ff?w=400",
            "bottom": "https://images.unsplash.com/photo-1762805088436-ffa7b89779a9?w=400",
            "divider": "https://images.unsplash.com/photo-1581720848095-2b72764b08a2?w=200"
        },
        "background_pattern": "floral"
    },
    "modern": {
        "id": "modern",
        "name": "Modern/Minimalist",
        "description": "Tema modern dengan desain minimalis",
        "primary_color": "#2C3E50",
        "secondary_color": "#ECF0F1",
        "accent_color": "#E74C3C",
        "font_heading": "Montserrat",
        "font_body": "Open Sans",
        "ornaments": {
            "top_left": "",
            "top_right": "",
            "bottom": "",
            "divider": ""
        },
        "background_pattern": "none"
    }
}

# ============ MODELS ============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Couple/Mempelai Models
class CoupleInfo(BaseModel):
    name: str
    full_name: str
    photo: Optional[str] = ""
    father_name: str
    mother_name: str
    child_order: str
    instagram: Optional[str] = ""

class EventInfo(BaseModel):
    name: str
    date: str
    time_start: str
    time_end: str
    venue_name: str
    address: str
    maps_url: Optional[str] = ""
    maps_embed: Optional[str] = ""

class LoveStoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    title: str
    description: str
    image: Optional[str] = ""

class GalleryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    caption: Optional[str] = ""

class GiftAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bank_name: str
    account_number: str
    account_holder: str

# Music Item Model
class MusicItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    source_type: Literal["mp3", "youtube", "upload"] = "mp3"
    url: str
    is_active: bool = False

class InvitationSettings(BaseModel):
    music_url: Optional[str] = ""
    music_list: List[MusicItem] = []
    active_music_id: Optional[str] = ""
    primary_color: Optional[str] = "#B76E79"
    secondary_color: Optional[str] = "#F5E6E8"
    accent_color: Optional[str] = "#D4AF37"
    font_heading: Optional[str] = "Playfair Display"
    font_body: Optional[str] = "Manrope"
    auto_scroll: Optional[bool] = True
    show_countdown: Optional[bool] = True
    show_love_story: Optional[bool] = True
    show_gallery: Optional[bool] = True
    show_video: Optional[bool] = True
    show_gift: Optional[bool] = True
    show_rsvp: Optional[bool] = True
    show_messages: Optional[bool] = True

class InvitationCreate(BaseModel):
    theme: Literal["adat", "floral", "modern"] = "floral"
    cover_photo: Optional[str] = ""
    groom: CoupleInfo
    bride: CoupleInfo
    events: List[EventInfo]
    love_story: List[LoveStoryItem] = []
    gallery: List[GalleryItem] = []
    gifts: List[GiftAccount] = []
    opening_text: Optional[str] = "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan"
    closing_text: Optional[str] = "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
    video_url: Optional[str] = ""
    streaming_url: Optional[str] = ""
    quran_verse: Optional[str] = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
    quran_surah: Optional[str] = "Q.S Ar-Rum : 21"
    settings: InvitationSettings = InvitationSettings()

class InvitationResponse(BaseModel):
    id: str
    user_id: str
    theme: str
    cover_photo: str
    groom: CoupleInfo
    bride: CoupleInfo
    events: List[EventInfo]
    love_story: List[LoveStoryItem]
    gallery: List[GalleryItem]
    gifts: List[GiftAccount]
    opening_text: str
    closing_text: str
    video_url: str
    streaming_url: str
    quran_verse: str
    quran_surah: str
    settings: InvitationSettings
    created_at: str
    updated_at: str

# RSVP Model
class RSVPCreate(BaseModel):
    guest_name: str
    phone: Optional[str] = ""
    attendance: str
    guest_count: int = 1

class RSVPResponse(BaseModel):
    id: str
    invitation_id: str
    guest_name: str
    phone: str
    attendance: str
    guest_count: int
    created_at: str

# Message/Ucapan Model
class MessageCreate(BaseModel):
    guest_name: str
    message: str

class MessageReply(BaseModel):
    reply: str

class MessageResponse(BaseModel):
    id: str
    invitation_id: str
    guest_name: str
    message: str
    reply: Optional[str] = ""
    created_at: str

# Stats Model
class StatsResponse(BaseModel):
    total_rsvp: int
    attending: int
    not_attending: int
    uncertain: int
    total_guests: int
    total_messages: int

# ============ AUTH HELPERS ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ UTILITY FUNCTIONS ============

def convert_youtube_to_embed(url: str) -> str:
    """Convert YouTube URL to embed URL"""
    if not url:
        return ""
    
    video_id = None
    
    # Handle various YouTube URL formats
    if "youtube.com/watch?v=" in url:
        video_id = url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1].split("?")[0]
    elif "youtube.com/embed/" in url:
        return url  # Already embed URL
    elif "youtube.com/shorts/" in url:
        video_id = url.split("shorts/")[1].split("?")[0]
    
    if video_id:
        return f"https://www.youtube.com/embed/{video_id}"
    
    return url

def get_youtube_audio_url(url: str) -> str:
    """Get YouTube video ID for audio playback"""
    if not url:
        return ""
    
    video_id = None
    
    if "youtube.com/watch?v=" in url:
        video_id = url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1].split("?")[0]
    elif "youtube.com/embed/" in url:
        video_id = url.split("embed/")[1].split("?")[0]
    
    if video_id:
        return video_id
    
    return ""

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": data.email,
        "password": hash_password(data.password),
        "name": data.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, data.email)
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user_id, email=data.email, name=data.name)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"])
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user["id"], email=user["email"], name=user["name"])
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(id=user["id"], email=user["email"], name=user["name"])

# ============ THEME ROUTES ============

@api_router.get("/themes")
async def get_themes():
    """Get all available themes"""
    return list(THEMES.values())

@api_router.get("/themes/{theme_id}")
async def get_theme(theme_id: str):
    """Get specific theme by ID"""
    if theme_id not in THEMES:
        raise HTTPException(status_code=404, detail="Theme not found")
    return THEMES[theme_id]

# ============ MUSIC UPLOAD ROUTE ============

@api_router.post("/upload/music")
async def upload_music(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """Upload music file (MP3)"""
    if not file.filename.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a')):
        raise HTTPException(status_code=400, detail="Only audio files are allowed")
    
    # Generate unique filename
    file_ext = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = MUSIC_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL
    return {
        "filename": file.filename,
        "url": f"/uploads/music/{unique_filename}",
        "message": "Music uploaded successfully"
    }

# ============ INVITATION ROUTES (ADMIN) ============

@api_router.post("/invitations", response_model=InvitationResponse)
async def create_invitation(data: InvitationCreate, user: dict = Depends(get_current_user)):
    invitation_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Convert video URL to embed
    video_embed = convert_youtube_to_embed(data.video_url)
    
    doc = {
        "id": invitation_id,
        "user_id": user["id"],
        **data.model_dump(),
        "video_url": video_embed,
        "created_at": now,
        "updated_at": now
    }
    
    # Set defaults for new fields if not present
    if "theme" not in doc:
        doc["theme"] = "floral"
    if "cover_photo" not in doc:
        doc["cover_photo"] = ""
    if "quran_verse" not in doc:
        doc["quran_verse"] = data.quran_verse or ""
    if "quran_surah" not in doc:
        doc["quran_surah"] = data.quran_surah or ""
    
    await db.invitations.insert_one(doc)
    
    result = await db.invitations.find_one({"id": invitation_id}, {"_id": 0})
    return result

@api_router.get("/invitations", response_model=List[InvitationResponse])
async def get_user_invitations(user: dict = Depends(get_current_user)):
    invitations = await db.invitations.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    
    # Add default values for old invitations
    for inv in invitations:
        if "theme" not in inv:
            inv["theme"] = "floral"
        if "cover_photo" not in inv:
            inv["cover_photo"] = ""
        if "quran_verse" not in inv:
            inv["quran_verse"] = ""
        if "quran_surah" not in inv:
            inv["quran_surah"] = ""
        if "settings" not in inv:
            inv["settings"] = InvitationSettings().model_dump()
        elif "music_list" not in inv.get("settings", {}):
            inv["settings"]["music_list"] = []
            inv["settings"]["active_music_id"] = ""
    
    return invitations

@api_router.get("/invitations/{invitation_id}", response_model=InvitationResponse)
async def get_invitation(invitation_id: str, user: dict = Depends(get_current_user)):
    invitation = await db.invitations.find_one(
        {"id": invitation_id, "user_id": user["id"]}, {"_id": 0}
    )
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Add default values
    if "theme" not in invitation:
        invitation["theme"] = "floral"
    if "cover_photo" not in invitation:
        invitation["cover_photo"] = ""
    if "quran_verse" not in invitation:
        invitation["quran_verse"] = ""
    if "quran_surah" not in invitation:
        invitation["quran_surah"] = ""
    
    return invitation

@api_router.put("/invitations/{invitation_id}", response_model=InvitationResponse)
async def update_invitation(invitation_id: str, data: InvitationCreate, user: dict = Depends(get_current_user)):
    existing = await db.invitations.find_one({"id": invitation_id, "user_id": user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Convert video URL to embed
    video_embed = convert_youtube_to_embed(data.video_url)
    
    update_doc = {
        **data.model_dump(),
        "video_url": video_embed,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.invitations.update_one({"id": invitation_id}, {"$set": update_doc})
    
    result = await db.invitations.find_one({"id": invitation_id}, {"_id": 0})
    return result

@api_router.delete("/invitations/{invitation_id}")
async def delete_invitation(invitation_id: str, user: dict = Depends(get_current_user)):
    result = await db.invitations.delete_one({"id": invitation_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Also delete related RSVPs and messages
    await db.rsvps.delete_many({"invitation_id": invitation_id})
    await db.messages.delete_many({"invitation_id": invitation_id})
    
    return {"message": "Invitation deleted successfully"}

# ============ PUBLIC INVITATION ROUTE ============

@api_router.get("/public/invitation/{invitation_id}")
async def get_public_invitation(invitation_id: str):
    invitation = await db.invitations.find_one({"id": invitation_id}, {"_id": 0})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Add default values for old invitations
    if "theme" not in invitation:
        invitation["theme"] = "floral"
    if "cover_photo" not in invitation:
        invitation["cover_photo"] = ""
    if "quran_verse" not in invitation:
        invitation["quran_verse"] = ""
    if "quran_surah" not in invitation:
        invitation["quran_surah"] = ""
    if "settings" not in invitation:
        invitation["settings"] = InvitationSettings().model_dump()
    elif "music_list" not in invitation.get("settings", {}):
        invitation["settings"]["music_list"] = []
        invitation["settings"]["active_music_id"] = ""
    
    # Get theme data
    theme_data = THEMES.get(invitation["theme"], THEMES["floral"])
    invitation["theme_data"] = theme_data
    
    return invitation

# ============ RSVP ROUTES ============

@api_router.post("/public/rsvp/{invitation_id}", response_model=RSVPResponse)
async def create_rsvp(invitation_id: str, data: RSVPCreate):
    invitation = await db.invitations.find_one({"id": invitation_id})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    rsvp_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "id": rsvp_id,
        "invitation_id": invitation_id,
        **data.model_dump(),
        "created_at": now
    }
    await db.rsvps.insert_one(doc)
    
    result = await db.rsvps.find_one({"id": rsvp_id}, {"_id": 0})
    return result

@api_router.get("/invitations/{invitation_id}/rsvps", response_model=List[RSVPResponse])
async def get_invitation_rsvps(invitation_id: str, user: dict = Depends(get_current_user)):
    invitation = await db.invitations.find_one({"id": invitation_id, "user_id": user["id"]})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    rsvps = await db.rsvps.find({"invitation_id": invitation_id}, {"_id": 0}).to_list(1000)
    return rsvps

@api_router.delete("/rsvps/{rsvp_id}")
async def delete_rsvp(rsvp_id: str, user: dict = Depends(get_current_user)):
    rsvp = await db.rsvps.find_one({"id": rsvp_id})
    if not rsvp:
        raise HTTPException(status_code=404, detail="RSVP not found")
    
    invitation = await db.invitations.find_one({"id": rsvp["invitation_id"], "user_id": user["id"]})
    if not invitation:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.rsvps.delete_one({"id": rsvp_id})
    return {"message": "RSVP deleted successfully"}

# ============ MESSAGE ROUTES ============

@api_router.post("/public/messages/{invitation_id}", response_model=MessageResponse)
async def create_message(invitation_id: str, data: MessageCreate):
    invitation = await db.invitations.find_one({"id": invitation_id})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    message_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "id": message_id,
        "invitation_id": invitation_id,
        **data.model_dump(),
        "reply": "",
        "created_at": now
    }
    await db.messages.insert_one(doc)
    
    result = await db.messages.find_one({"id": message_id}, {"_id": 0})
    return result

@api_router.get("/public/messages/{invitation_id}", response_model=List[MessageResponse])
async def get_public_messages(invitation_id: str):
    messages = await db.messages.find(
        {"invitation_id": invitation_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return messages

@api_router.get("/invitations/{invitation_id}/messages", response_model=List[MessageResponse])
async def get_invitation_messages(invitation_id: str, user: dict = Depends(get_current_user)):
    invitation = await db.invitations.find_one({"id": invitation_id, "user_id": user["id"]})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    messages = await db.messages.find(
        {"invitation_id": invitation_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return messages

@api_router.put("/messages/{message_id}/reply", response_model=MessageResponse)
async def reply_message(message_id: str, data: MessageReply, user: dict = Depends(get_current_user)):
    message = await db.messages.find_one({"id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    invitation = await db.invitations.find_one({"id": message["invitation_id"], "user_id": user["id"]})
    if not invitation:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.messages.update_one({"id": message_id}, {"$set": {"reply": data.reply}})
    
    result = await db.messages.find_one({"id": message_id}, {"_id": 0})
    return result

@api_router.delete("/messages/{message_id}")
async def delete_message(message_id: str, user: dict = Depends(get_current_user)):
    message = await db.messages.find_one({"id": message_id})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    invitation = await db.invitations.find_one({"id": message["invitation_id"], "user_id": user["id"]})
    if not invitation:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.messages.delete_one({"id": message_id})
    return {"message": "Message deleted successfully"}

# ============ STATS ROUTE ============

@api_router.get("/invitations/{invitation_id}/stats", response_model=StatsResponse)
async def get_invitation_stats(invitation_id: str, user: dict = Depends(get_current_user)):
    invitation = await db.invitations.find_one({"id": invitation_id, "user_id": user["id"]})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    rsvps = await db.rsvps.find({"invitation_id": invitation_id}, {"_id": 0}).to_list(1000)
    messages = await db.messages.count_documents({"invitation_id": invitation_id})
    
    attending = sum(1 for r in rsvps if r["attendance"] == "hadir")
    not_attending = sum(1 for r in rsvps if r["attendance"] == "tidak_hadir")
    uncertain = sum(1 for r in rsvps if r["attendance"] == "belum_pasti")
    total_guests = sum(r["guest_count"] for r in rsvps if r["attendance"] == "hadir")
    
    return StatsResponse(
        total_rsvp=len(rsvps),
        attending=attending,
        not_attending=not_attending,
        uncertain=uncertain,
        total_guests=total_guests,
        total_messages=messages
    )

# ============ ROOT ============

@api_router.get("/")
async def root():
    return {"message": "Wedding Invitation API", "version": "2.0"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
