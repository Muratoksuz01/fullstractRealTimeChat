import { Server } from 'socket.io';  
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const userSocketMap = {};
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    },
});
export function getReceiverSocketId(userId)  {
    return userSocketMap[userId];
} 
io.on('connection', (socket) => {
    console.log('New client connected ', socket.id);
    const userid=socket.handshake.query.userId;
    if(userid){
        userSocketMap[userid]=socket;
    }
    //io.emit() is used to send message to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
        delete userSocketMap[socket.id];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
   
}); 

export { io, server, app };
