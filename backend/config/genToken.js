import jwt from "jsonwebtoken";

const generateToken = (id) => {
    try {
        const token = jwt.sign(
            { id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );
        return token;
    } catch (error) {
        console.log("token error:", error.message);
    }
};

export default generateToken;
