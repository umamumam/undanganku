# Wedding Invitation (Undangan Digital) - Product Requirements Document

## Original Problem Statement
Aplikasi undangan pernikahan digital dengan fitur:
1. **Multiple Themes**: Pengguna dapat memilih dari berbagai tema visual (Floral, Adat/Traditional, Modern)
2. **Improved Cover/Opening**: Halaman pembuka yang lebih menarik dengan foto dan ornamen dekoratif
3. **Flexible Media**: 
   - Video: Embed YouTube video
   - Music: Playlist musik dari MP3 atau YouTube
4. **Timeline Love Story**: Animasi timeline dengan dots dan garis penghubung yang bergerak saat scroll

## User Personas
- Calon pengantin yang ingin membuat undangan pernikahan digital
- Admin yang mengelola data undangan, RSVP, dan ucapan

## Core Requirements
1. Sistem autentikasi (register/login)
2. Dashboard admin untuk kelola undangan
3. Halaman undangan publik dengan berbagai fitur
4. RSVP dan sistem ucapan
5. Multiple themes dengan visual yang berbeda

## Technology Stack
- **Frontend**: React.js, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (local/provisioned)

## Code Architecture
```
/app
├── backend/
│   └── server.py          # FastAPI server with all endpoints
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── invitation/    # Invitation components
    │   │   │   ├── CoverSection.js
    │   │   │   ├── HeroSection.js
    │   │   │   ├── LoveStoryTimeline.js
    │   │   │   ├── CountdownSection.js
    │   │   │   ├── QuoteSection.js
    │   │   │   ├── VideoSection.js
    │   │   │   └── MusicPlayer.js
    │   │   └── ui/           # Shadcn components
    │   ├── pages/
    │   │   ├── InvitationPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   └── admin/
    │   └── themes/
    │       ├── ThemeProvider.js
    │       ├── FloralTheme.css
    │       ├── AdatTheme.css
    │       └── ModernTheme.css
```

## What's Been Implemented

### December 10, 2025
- ✅ Redesigned **Cover Section** with full background, corner ornaments, floating particles
- ✅ Improved **Hero Section** with rotating ring animation around photo
- ✅ Enhanced **Couple Section** with animated photo frames
- ✅ Modernized **Events Section** with prominent date display
- ✅ Created **Love Story Timeline** with animated dots and connecting line that grows on scroll
- ✅ Improved **Countdown Section** with animated boxes and "Event Passed" message
- ✅ Updated **Quote Section** with decorative quotes
- ✅ Three themes: Floral (pink/rose), Adat (brown/gold), Modern (navy/gold)
- ✅ Full background without cuts across all sections
- ✅ Mobile responsive design

### Previous Implementation
- User authentication (register/login with JWT)
- Dashboard admin with statistics
- Create/Edit/Delete invitations
- RSVP system
- Message/Ucapan system with replies
- Gift section with bank accounts
- Video section (YouTube embed)
- Music player with playlist support

## API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/themes` - Get available themes
- `POST /api/invitations` - Create invitation
- `GET /api/invitations` - Get user's invitations
- `PUT /api/invitations/:id` - Update invitation
- `DELETE /api/invitations/:id` - Delete invitation
- `GET /api/public/invitation/:id` - Get public invitation
- `POST /api/public/rsvp/:id` - Submit RSVP
- `POST /api/public/messages/:id` - Submit message
- `GET /api/public/messages/:id` - Get messages

## Database Schema
**invitations**: 
```
{
  id: String,
  user_id: String,
  theme: "floral" | "adat" | "modern",
  groom: CoupleInfo,
  bride: CoupleInfo,
  events: EventInfo[],
  love_story: LoveStoryItem[],
  gallery: GalleryItem[],
  gifts: GiftAccount[],
  settings: InvitationSettings
}
```

## Known Issues
1. MongoDB Atlas connection requires IP whitelist (currently using local MongoDB)
2. ESLint warnings for missing useEffect dependencies (non-critical)

## Prioritized Backlog

### P0 (Critical)
- None currently

### P1 (High Priority)
- MongoDB Atlas connection fix (requires user to whitelist IP 0.0.0.0/0)
- Admin dashboard UI modernization

### P2 (Medium Priority)
- MP3 file upload system for music
- More theme variations
- Gallery lightbox feature
- Image upload for photos (currently using URLs)

### P3 (Low Priority)
- Email/WhatsApp sharing integration
- QR code generator for invitation link
- Analytics dashboard
