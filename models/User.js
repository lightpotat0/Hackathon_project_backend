import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password_am: { type: String, required: true }, 
    date: { type: String, required: true }, 
    telefone: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);