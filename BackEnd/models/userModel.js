import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength : 6
    },
    profilePic : {
        type : String,
    },
    bio : {
        type: String,
    }    
},{timestamps : true});

const USER = mongoose.model('user', userSchema);

export default USER;