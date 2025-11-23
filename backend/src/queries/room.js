import mongoose from "mongoose";
import Room from "../models/room.js";
import { handleDbError } from "../utils/handleDbError.js";

export const createRoomByUserId = handleDbError(async (roomData) => {
  const newRoom = new Room(roomData);
  await newRoom.save();
  await newRoom.populate([
    { path: 'members', select: 'username fullname profilePic' },
    { path: 'lastMessage' },
  ]);
  return newRoom;
});

export const getRoomById = handleDbError(async (roomId) => {
  const room = await Room.findById(roomId).populate("users", "-password");
  return room;
});

export const updateRoomById = handleDbError(async (roomId, updateData) => {
  await Room.findByIdAndUpdate(roomId, updateData);
  return true;
});

export const getRoomsByUserId = handleDbError(async (userId, limit = 10) => {
  const rooms = await Room.find({ members: userId })
    .sort({ updatedAt: -1 }) // Latest updated first
    .populate({
      path: 'members',
      select: 'username fullname profilePic',
    })
    .populate({
      path: 'lastMessage',
    })
    .populate({
      path: 'groupSettings',
      select: 'groupName groupImage createdBy admins',
    });
    return rooms.map((room) => {
    if (room.lastMessage?.isDeleted) {
      room.lastMessage.content = '';
    }
    return room;
    });
});
export const getRoomIdsByUserId = handleDbError(async (userId) => {
  const rooms = await Room.find({ members: userId }).select('_id');
  return rooms;
});
export const getRoomByUserId = handleDbError(async (userId, roomId) => {
  const room = await Room.findOne({ _id: roomId, members: userId })
    .populate("members", "-email -password")
    .populate("groupSettings");
  return room;
});

export const getFriends = handleDbError(async (userId) => {
  const rooms = await Room.find(
    { isGroup: false, members: userId },
    'members'
  ).lean();

  const allMembers = [userId];

  rooms.forEach(room => {
    const other = room.members.find(id => id.toString() !== userId.toString());
    if (other) allMembers.push(other);
  });
  return allMembers;
})
export const areFriends = handleDbError(async (userIds) => {
  return Room.find({
    isGroup: false,
    members: { $all: userIds, $size: 2 }
  });
})

export const addMemberToRoom = handleDbError(async (roomId, userId) => {
  const room = await Room.findOne({ _id: roomId, isGroup: true });
  if(!room) return null;
  room.members.addToSet(userId);
  await room.save();
  await room.populate([
    { path: 'members', select: 'username fullname profilePic' },
    { path: 'lastMessage' },
  ]);
  return room;
});

export const isValidRoomId = handleDbError(async (roomId, userId) => {
  return await Room.exists({ _id: roomId, members: userId });
});