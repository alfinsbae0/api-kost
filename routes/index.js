import express from "express";
import { getUser, register, login, logout, update } from '../controllers/UserController.js';
import { getKost, addKost, updateKost, deleteKost } from "../controllers/KostController.js";
import { verifyToken, isAdmin } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const routes = express.Router();

// Auth routes
routes.get('/users', verifyToken, isAdmin, getUser);
routes.put('/users/:id', verifyToken, update);
routes.post('/register', register);
routes.post('/login', login);
routes.delete('/logout', logout);
routes.get('/token', refreshToken);

// Kost routes
routes.get('/kost', verifyToken, isAdmin, getKost);
routes.post('/kost', verifyToken, isAdmin, upload.single('image'), addKost);
routes.put('/kost/:id', verifyToken, isAdmin, upload.single('image'), updateKost);
routes.delete('/kost/:id', verifyToken, isAdmin, deleteKost);

export default routes;
