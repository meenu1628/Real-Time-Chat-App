import express from 'express'
import {getRooms,getRoom,createRoom,updateRoom,deleteRoom} from '../controllers/roomController.js';

const rooms = express.Router();
rooms.route("/").get(getRooms).post(createRoom);
rooms.route("/:roomId").get(getRoom).patch(updateRoom).delete(deleteRoom);

export default rooms;