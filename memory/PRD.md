# Wedding Invitation (Undangan Digital) - Product Requirements Document

## Original Problem Statement
Aplikasi undangan pernikahan digital dengan fitur:
1. **Multiple Themes**: Pengguna dapat memilih dari berbagai tema visual (Floral, Adat/Traditional, Modern)
2. **Improved Cover/Opening**: Halaman pembuka yang lebih menarik dengan foto dan ornamen dekoratif
3. **Flexible Media**: Video YouTube embed, playlist musik
4. **Timeline Love Story**: Animasi timeline dengan dots dan garis penghubung
5. **Guest Management**: Dashboard untuk mengelola daftar tamu dan generate link personal

## User Personas
- Calon pengantin yang ingin membuat undangan pernikahan digital
- Admin yang mengelola data undangan, RSVP, tamu, dan ucapan

## Technology Stack
- **Frontend**: React.js, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (local/provisioned)

## Code Architecture
```
/app
├── backend/
│   └── server.py              # FastAPI server with all endpoints
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── invitation/    # Invitation components
    │   │   │   ├── CoverSection.js      # Cover with horizontal names, gold frame
    │   │   │   ├── HeroSection.js       # Hero with photo animation
    │   │   │   ├── CoupleSection.js     # NEW: Couple with floral frames
    │   │   │   ├── LoveStoryTimeline.js # Timeline with animated dots
    │   │   │   ├── CountdownSection.js
    │   │   │   ├── QuoteSection.js
    │   │   │   └── ...
    │   │   └── ui/            # Shadcn components
    │   ├── pages/
    │   │   ├── InvitationPage.js
    │   │   ├── LoginPage.js
    │   │   └── admin/
    │   │       ├── DashboardHome.js
    │   │       ├── GuestManagementPage.js  # NEW: Guest management
    │   │       └── ...
    │   └── themes/
    │       ├── ThemeProvider.js
    │       ├── FloralTheme.css
    │       ├── AdatTheme.css
    │       └── ModernTheme.css
```

## What's Been Implemented

### February 10, 2026
- ✅ **Cover Section Redesign** (based on user reference):
  - Photo frame with gold border (centered, not too high)
  - Names displayed **horizontally** (Ahmad & Siti)
  - Decorative circles and curved lines in background
  - "The Wedding Of" text styled but readable
  
- ✅ **Couple Section with Floral Frames**:
  - Photo frames with SVG floral decorations
  - Background card with opacity for section separation
  - Side floral decorations

- ✅ **Guest Management Dashboard** (NEW):
  - `/admin/tamu/:invitationId` route
  - Add/Edit/Delete guests
  - Copy individual or all invitation links
  - RSVP status tracking (Hadir/Tidak Hadir/Pending)
  - Search functionality
  - Statistics cards

- ✅ Backend API for guests:
  - `GET /api/invitations/:id/guests`
  - `POST /api/invitations/:id/guests`
  - `PUT /api/invitations/:id/guests/:guestId`
  - `DELETE /api/invitations/:id/guests/:guestId`

### Previous Implementation
- Love Story Timeline with animated dots and connecting line
- Multiple themes (Floral, Adat, Modern)
- User authentication (register/login with JWT)
- Dashboard admin with statistics
- RSVP and message systems
- Gift section with bank accounts
- Video and music player support

## API Endpoints
### Authentication
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`

### Invitations
- `GET/POST /api/invitations`, `GET/PUT/DELETE /api/invitations/:id`
- `GET /api/public/invitation/:id`

### Guests (NEW)
- `GET /api/invitations/:id/guests` - List all guests
- `POST /api/invitations/:id/guests` - Add guest
- `PUT /api/invitations/:id/guests/:guestId` - Update guest
- `DELETE /api/invitations/:id/guests/:guestId` - Delete guest

### RSVP & Messages
- `POST /api/public/rsvp/:id`, `POST /api/public/messages/:id`
- `GET /api/invitations/:id/rsvps`, `GET /api/invitations/:id/messages`

## Database Schema
**guests** (NEW):
```
{
  id: String,
  invitation_id: String,
  name: String,
  rsvp_status: String | null,
  created_at: String
}
```

## Prioritized Backlog

### P0 (Critical)
- None currently

### P1 (High Priority)
- Bird flying / particle animation effects
- Custom template builder (drag & drop)

### P2 (Medium Priority)
- MongoDB Atlas connection fix (requires user IP whitelist)
- Import guests from Excel/CSV
- More theme variations

### P3 (Low Priority)
- Admin dashboard UI modernization
- MP3 file upload system
- Gallery lightbox feature
- Image upload (currently using URLs)
- Email/WhatsApp sharing integration
- QR code generator

## Test Credentials
- Email: newuser123@example.com
- Password: Test123456
- Test invitation ID: b8a65192-d96d-4369-bfbd-a35bdca93bc5
