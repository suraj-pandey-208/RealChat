import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {                     // ✅ ADD THIS
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
        // ❌ unique हटाओ (password unique नहीं होना चाहिए)
    },
    image: {
        type: String,
        default: ""
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;