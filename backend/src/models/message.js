import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Number,
    },
    sentAt: {
        type: Number,
        immutable: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false,
});

messageSchema.pre('save', function (next) {
    if (!this.sentAt) {
        this.sentAt = Date.now();
    }
    next();
});
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;