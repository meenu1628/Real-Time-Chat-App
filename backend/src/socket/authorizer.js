import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/token.js';


const authorizer = (socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) return next(new Error("No cookie found"));

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.jwt;

  if (!token) return next(new Error("Token missing in cookie"));

  try {
    const decoded =verifyToken(token);
    socket.user = {
                  ...socket.user,
                  id: decoded.userId
                 };
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
};
export default authorizer;
