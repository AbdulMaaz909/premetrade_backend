import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import { upload } from '../controllers/authController.js'
import fs from 'fs'
import path from 'path'

const router = express.Router();

// get user profile (Protected)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// update user profile (name + optional photo)
// Accepts multipart/form-data with fields: name (text), photo (file)
router.put('/profile', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
        const { name } = req.body || {};
        const file = req.file;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // store previous photo to remove if replaced and is a local upload
        const previousPhoto = user.photo;

        if (name) user.name = name;
        if (file) {
            // store new photo path (served from /uploads)
            user.photo = `/uploads/${file.filename}`;
        }

        await user.save();

        // remove old uploaded file if it was stored locally (not an external URL)
        if (file && previousPhoto && !previousPhoto.startsWith('http')) {
            // previousPhoto might be like '/uploads/12345.png' or 'uploads/12345.png'
            const prevFilename = path.basename(previousPhoto);
            const prevPath = path.join(process.cwd(), 'uploads', prevFilename);
            fs.unlink(prevPath, (err) => {
                // ignore errors (file might not exist)
                if (err) console.log('Failed to remove old photo:', err.message);
            });
        }

        const updated = await User.findById(req.user.id).select('-password');
        res.json({ message: 'Profile updated', user: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;