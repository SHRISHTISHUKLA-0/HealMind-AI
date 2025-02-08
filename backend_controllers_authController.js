const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { tokenId } = req.body;
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { sub, name, email, picture } = ticket.getPayload();
        
        let user = await User.findOne({ googleId: sub });
        
        if (!user) {
            user = new User({ googleId: sub, name, email, picture });
            await user.save();
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: 'Google login failed' });
    }
};