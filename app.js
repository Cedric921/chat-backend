const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io')
const userRoutes = require('./routes/userRoute');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes)

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((response) => {
		console.log(`connected to mongodb server`);
	})
	.catch((error) => console.error(error));

const server = app.listen(process.env.PORT, () => {
	console.log(`server start on port ${process.env.PORT}`);
});

//real times
const io = socket(server, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true,
	}
});

global.onlineUsers = new Map();

io.on("connection", socket => {
	global.chatSocket = socket;
	socket.on("add-user", userId => {
		onlineUsers.set(userId, socket.id)
	})

	socket.on('send-msg', data => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit('msg-receive', data.message);
		}
	})
})