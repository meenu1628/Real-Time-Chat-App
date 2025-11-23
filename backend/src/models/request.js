import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sentAt:{
        type:Number,
        default: Date.now,
        immutable: true
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        trim: true,
        default: ""
    },
},{
    timestamps: false});
const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;