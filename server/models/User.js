import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50,
    },
    friends: {
        type: Array,
        default: [],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    picturePath: {
        type: String,
        default: '',
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;