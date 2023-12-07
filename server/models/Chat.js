import mongoose from 'mongoose';

const chatUsers = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    newMessage: {
        type: Number,
        default: 0,
    }
})

const chatSchema = new mongoose.Schema({
    users: {
        type: [chatUsers],
        validate: {
            validator: function(array) {
                return array.length > 0;
            },
            message: "Users array mush have at least one element."
        },
        required: true,
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    }
}, { timestamps: true })

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
