import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();

// HTTP Server on Top of express server
// Along with CORS fix
// FrontEnd URL
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:["http://localhost:3000"],
        methods:["GET", "POST"]
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId : socketId}

io.on('connection', (socket) => {
    console.log("A User Connected", socket.id);

    // To fetch the query we have set in SocketContext in the frontend
    const userId = socket.handshake.query.userId;

    if(userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on is used to listen to the events, can be used
    // on client and server side
    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {app, io, server};