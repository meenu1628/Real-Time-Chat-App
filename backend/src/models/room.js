import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    createdAt: {
        type: Number,
        immutable: true,
    },
    lastMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    isGroup:{
        type: Boolean,
        default: false,
    },
    isPinned:{
        type: Boolean,
        default: false,
    },
    isFavourite:{
        type: Boolean,
        default: false,
    },
    isArchived:{
        type: Boolean,
        default: false,
    }, groupSettings:{
        admins:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        groupName: {
            type: String,
            trim: true,
        },
        groupProfilepic: {
            type: String,
            default:"",
        }
    }},
    {timestamps: false});

roomSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
    next();

});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
export default Room;