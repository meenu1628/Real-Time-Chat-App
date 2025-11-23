import { createRequest, deleteRequest, getRequest, isRequestExistsForDirect } from "../../queries/request.js";
import { addMemberToRoom, areFriends, createRoomByUserId, updateRoomById } from "../../queries/room.js";
import { isValidUserId } from "../../queries/user.js";
import { getSocketId, isUserOnline } from "../managers/onlineUsers.js";

export const registerRequestHandlers = (io, socket) => {
    socket.on("request:send", (data) => onSendRequest(io, socket, data));
    socket.on("request:unsend", (data) => onUnsendRequest(io, socket, data));
    socket.on("request:accept", (data) => onAcceptRequest(io, socket, data));
    socket.on("request:reject", (data) => onRejectRequest(io, socket, data));
}

const onAcceptRequest = async (io, socket, data) => {
    const { requestId } = data;
    if (!requestId) {
        return socket.emit("error", { message: "Invalid Request ID" });
    }
    try {
        let room;
        const request = await getRequest(requestId);
        if (!request) {
            return socket.emit("error", { message: "Request not found" });
        }
        if (request.isGroup) {
            room = await addMemberToRoom(request.room, socket.user.id);
            if (!room) {
                return socket.emit("error", { message: "Failed to add member to room" });
            }
            socket.to(room._id+'').emit("request:accepted", { room, requestId });
        
        } else {
            room = await createRoomByUserId({
                members: [request.sender._id, socket.user.id],
                isGroup: false,
            });
            if (!room) {
                return socket.emit("error", { message: "Failed to create room" });
            }
             if (isUserOnline(request.sender._id)) {
            socket.to(getSocketId(request.sender._id)).emit("request:accepted", { room, requestId });
        }
        }
        socket.emit("request:accepted", { room, requestId });
        await deleteRequest(requestId);
    } catch (error) {
        console.error("Error accepting request:", error);
        socket.emit("error", { message: "Failed to accept request" });
    }
}

const onSendRequest = async (io, socket, data) => {
    const { userIds, groupName } = data;
    if (!userIds || userIds.length === 0) {
        return socket.emit("error", { message: "Invalid User ID" });
    }
    try {
        let request;
        if (userIds.length == 1) {
            if (await areFriends([userIds[0], socket.user.id])) {
                socket.emit("error", { message: "Room Already Exists" })
            }
            request = await isRequestExistsForDirect(socket.user.id, userIds[0]);
            if (!request) {
                request = await createRequest(socket.user.id, userIds[0]);
            }
            if (isUserOnline(userIds[0])) {
                socket.to(getSocketId(userIds[0])).emit("request:received", { request });
            }
            socket.emit("request:sent", { request });
        } else {
            const room = await createRoomByUserId({
                members: [socket.user.id],
                isGroup: true,
                createdAt: Date.now(),
                groupSettings: {
                    groupName: groupName || "",
                    createdBy: socket.user.id,
                    admins: [socket.user.id],
                },
            });
            userIds.forEach(async (userId) => {
                request = await createRequest(socket.user.id, userId, room._id, groupName);
                if (isUserOnline(userId)) {
                    socket.to(getSocketId(userId)).emit("request:received", { request });
                }
                socket.emit("request:sent", { request ,room});
            })
        }
    } catch (error) {
        console.error("Error sending request:", error);
        socket.emit("error", { message: "Failed to send request" });
    }
}

const onRejectRequest = async (io, socket, data) => {
    const { requestId } = data;
    if (!requestId) {
        return socket.emit("error", { message: "Invalid Request ID" });
    }
    try {
        await deleteRequest(requestId);
    } catch (error) {
        console.error("Error rejecting request:", error);
    }
}

const onUnsendRequest = async (io, socket, data) => {
    const { requestId } = data;
    if (!requestId) {
        return socket.emit("error", { message: "Invalid Request ID" });
    }
    try {
        const request = await deleteRequest(requestId);
        if (!request)    return 
        if (isUserOnline(request.receiver._id)) {
            socket.to(getSocketId(request.receiver._id)).emit("request:unsent", { requestId });
        }
    } catch (error) {
        console.error("Error unsending request:", error);
        socket.emit("error", { message: "Failed to unsend request" });
    }
}