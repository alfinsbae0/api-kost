import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.userId;
        req.name = decoded.name;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') return res.status(403).json({ msg: "Akses ditolak, bukan admin" });
    next();
};

export const isUser = (req, res, next) => {
    if (req.role !== 'user') return res.status(403).json({ msg: "Akses ditolak, bukan user" });
    next();
};