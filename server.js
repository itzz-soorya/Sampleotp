const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory OTP store (equivalent to C# ConcurrentDictionary)
const otpStore = new Map();

// OTP Record class equivalent
class OtpRecord {
    constructor(otp, expiryTime) {
        this.otp = otp;
        this.expiryTime = expiryTime;
    }
}

// Generate OTP endpoint
app.post('/api/otp/generate', (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber || phoneNumber.trim() === '') {
        return res.status(400).json({ 
            error: 'Phone number is required' 
        });
    }

    // Check if OTP already exists and rate limiting (30 seconds)
    if (otpStore.has(phoneNumber)) {
        const existingOtp = otpStore.get(phoneNumber);
        const generatedTime = new Date(existingOtp.expiryTime.getTime() - 5 * 60 * 1000); // 5 minutes before expiry
        const now = new Date();
        const timeDifference = (now - generatedTime) / 1000; // in seconds

        if (timeDifference < 30) {
            const remaining = 30 - Math.floor(timeDifference);
            return res.status(400).json({ 
                error: `Please wait ${remaining} seconds before requesting a new OTP.` 
            });
        }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create OTP record with 5-minute expiry
    const record = new OtpRecord(
        otp,
        new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    );

    // Store OTP
    otpStore.set(phoneNumber, record);

    // Log OTP for debugging (in production, this would be sent via SMS)
    console.log(`[OTP DEBUG] Phone: ${phoneNumber} | OTP: ${otp}`);

    res.json({ 
        message: 'OTP sent to your phone number successfully. Please check your messages.',
        success: true
    });
});

// Verify OTP endpoint
app.post('/api/otp/verify', (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ 
            error: 'Phone number and OTP are required' 
        });
    }

    // Check if OTP exists for this phone number
    if (!otpStore.has(phoneNumber)) {
        return res.status(400).json({ 
            error: 'No OTP found for this number' 
        });
    }

    const storedOtp = otpStore.get(phoneNumber);

    // Check if OTP has expired
    if (new Date() > storedOtp.expiryTime) {
        otpStore.delete(phoneNumber);
        return res.status(400).json({ 
            error: 'OTP expired' 
        });
    }

    // Verify OTP
    if (storedOtp.otp !== otp) {
        return res.status(400).json({ 
            error: 'Invalid OTP' 
        });
    }

    // OTP verified successfully, remove from store
    otpStore.delete(phoneNumber);
    res.json({ 
        message: 'OTP verified successfully' 
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        activeOtps: otpStore.size
    });
});

// Cleanup expired OTPs every minute
setInterval(() => {
    const now = new Date();
    for (const [phoneNumber, record] of otpStore.entries()) {
        if (now > record.expiryTime) {
            otpStore.delete(phoneNumber);
            console.log(`[CLEANUP] Expired OTP removed for phone: ${phoneNumber}`);
        }
    }
}, 60000); // Run every minute

app.listen(PORT, () => {
    console.log(`🚀 OTP Server running on http://localhost:${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to test the OTP verification`);
});
