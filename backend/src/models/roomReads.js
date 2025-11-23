import mongoose from "mongoose";

const roomReadsSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastReadMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    readAt: {
        type: Number,
        default: Date.now()
    }
}, {
    timestamps: false,
});

const RoomReads = mongoose.models.RoomReads || mongoose.model('RoomReads', roomReadsSchema);
export default RoomReads;