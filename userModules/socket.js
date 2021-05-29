import { Server } from "socket.io";

const establish = (httpServer) => {
	global.io = new Server(httpServer);

	io.on("connection", (socket) => {
		global.id = socket.id;
	});
};

const sendData = (data) => {
	io.to(id).emit("incoming", data);
};

const sendError = (errorData) => {
	io.to(id).emit("error", errorData);
};

export { establish, sendData, sendError };
