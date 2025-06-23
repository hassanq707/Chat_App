import USER from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { setUser } from '../service/token.js';
import cloudinary from '../config/cloudinary.js';

const registerUser = async (req, res) => {
    const { fullname, email, password, bio } = req.body;
    try {
        const exists = await USER.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Email already exists" });
        }
        const hashPass = await bcrypt.hash(password, 10);
        const user = await USER.create({ fullname, email, bio, password: hashPass });
        const token = setUser(user._id);
        res.json({ success: true, user, token, message: "Account created successfully" });

    } catch (error) {
        res.json({ success: false, message: "Error creating user" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await USER.findOne({ email });
        if (!user) return res.json({ success: false, message: "Email/Password is wrong" });
        const isMatchPass = await bcrypt.compare(password, user.password);
        if (!isMatchPass) return res.json({ success: false, message: "Email/Password is wrong" });

        const token = setUser(user._id);
        res.json({ success: true, token, user, message: "Successfully login" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in Login" });
    }
};

const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user })
}

const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullname } = req.body;

        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await USER.findByIdAndUpdate(userId,
                { bio, fullname }
                , { new: true }
            )
        } else {
            const upload = await cloudinary.uploader.upload(profilePic,{
                folder : "Chat_Images"
            });
            updatedUser = await USER.findByIdAndUpdate(userId,
                { bio, fullname, profilePic: upload.secure_url },
                { new: true }
            )
        }

        res.json({
            success: true,
            user: updatedUser,
        });

    } catch (err) {
        res.json({ success: false, message: "Server error" });
    }
};


export {
    loginUser,
    registerUser,
    checkAuth,
    updateProfile,
};