import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users)
    } catch (error) {
        console.error(error);
    }
}

export const register = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password tidak sama" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        res.json({ msg: "Berhasil Mendaftar" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        })

        if (user.length === 0) return res.status(404).json({ msg: "Email tidak ditemukan" });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Password tidak sesuai" });

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const role = user[0].role;
        const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken, role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
}



export const update = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({ msg: "User berhasil diperbarui", user });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
}


export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })

    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id

    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    })

    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}

