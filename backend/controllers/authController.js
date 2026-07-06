import generateToken from "../config/genToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// SIGNUP
export const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        });

        const { password: _, ...safeUser } = user.toObject();
        return res.status(201).json(safeUser);

    } catch (error) {
        console.log("SIGNUP ERROR:", error.message);
        return res.status(500).json({ msg: "Signup failed" });
    }
};


// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "user does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        });

        const { password: _, ...safeUser } = user.toObject();
        return res.status(200).json(safeUser);

    } catch (error) {
        console.log("LOGIN ERROR:", error.message);
        return res.status(500).json({ msg: `login error ${error}` });
    }
};


// LOGOUT
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        console.log("LOGOUT ERROR:", error.message);
        return res.status(500).json({ msg: "Logout failed" });
    }
};
