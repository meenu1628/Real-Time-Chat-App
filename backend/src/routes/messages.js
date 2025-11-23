import express from 'express';
import { getMessages } from '../controllers/messageController.js';
import { validateRoomId } from '../middlewares/validate.js';
const messages = express.Router();
messages.get("/:roomId", validateRoomId,getMessages);
export default messages;