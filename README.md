# OTP Verification System

A complete OTP (One-Time Password) verification system with Node.js backend and HTML/CSS/JavaScript frontend.

## Features

- 📱 Phone number validation
- 🔐 6-digit OTP generation
- ⏱️ 5-minute OTP expiry
- 🚫 30-second rate limiting
- 🔄 Resend OTP functionality
- ✅ Real-time verification
- 🎨 Professional UI with animations
- 🧹 Automatic cleanup of expired OTPs

## Technologies Used

**Backend (Node.js):**
- Express.js for REST API
- CORS for cross-origin requests
- In-memory storage for OTP records

**Frontend:**
- HTML5
- CSS3 with animations
- Vanilla JavaScript with Fetch API

## Project Structure

```
Sampleotp/
├── server.js          # Node.js backend server
├── home.html          # Frontend HTML page
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Installation & Setup

1. **Install Node.js dependencies:**
   ```powershell
   npm install
   ```

2. **Start the server:**
   ```powershell
   npm start
   ```
   
   Or for development with auto-restart:
   ```powershell
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Endpoints

### Generate OTP
- **URL:** `POST /api/otp/generate`
- **Body:** `{ "phoneNumber": "1234567890" }`
- **Response:** `{ "message": "OTP generated...", "otp": "123456" }`

### Verify OTP
- **URL:** `POST /api/otp/verify`
- **Body:** `{ "phoneNumber": "1234567890", "otp": "123456" }`
- **Response:** `{ "message": "OTP verified successfully" }`

### Health Check
- **URL:** `GET /health`
- **Response:** `{ "status": "OK", "timestamp": "...", "activeOtps": 0 }`

## How It Works

1. **User enters phone number** and clicks "Send OTP"
2. **Backend generates** a 6-digit random OTP
3. **OTP is stored** in memory with 5-minute expiry
4. **Frontend shows OTP section** for verification
5. **User enters OTP** and clicks "Verify OTP"
6. **Backend validates** the OTP against stored value
7. **Success/Error message** is displayed accordingly

## Security Features

- ⏰ **Rate Limiting:** 30-second cooldown between OTP requests
- ⌛ **Expiry:** OTPs expire after 5 minutes
- 🗑️ **Auto Cleanup:** Expired OTPs are automatically removed
- 🔒 **Validation:** Input validation on both frontend and backend

## Development Notes

- OTPs are logged to console for testing purposes
- In production, integrate with SMS gateway (Twilio, etc.)
- Consider using database for persistent storage
- Add user authentication and session management
- Implement proper error logging and monitoring

## Testing

1. Enter any 10-digit phone number
2. Click "Send OTP" - check console for generated OTP
3. Enter the OTP shown in console
4. Click "Verify OTP" to complete verification

## Conversion from C# to Node.js

This project is a direct conversion from C# ASP.NET Core to Node.js:

**C# → Node.js Mappings:**
- `ConcurrentDictionary` → `Map`
- `IActionResult` → JSON responses
- `[HttpPost]` → `app.post()`
- `BadRequest()` → `res.status(400).json()`
- `Ok()` → `res.json()`
- `DateTime` → `Date`

The functionality remains identical to the original C# implementation.
