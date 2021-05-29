const PORT = process.env.PORT || 5192;

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

import { scrapper, filterURL } from "./scrapper.js";

const index = express();
const server = createServer(index);

const io = new Server(server);

let urlObj = new Object();

io.on("connection", (socket) => {
	socket.on("established", (id) => {
		const urlList = urlObj[id];
		urlList.forEach((url) => {
			scrapper(url, (data) => {
				if (data.error) io.to(socket.id).emit("error", data);
				else io.to(socket.id).emit("incoming", data);
			});
		});
		delete urlObj[id];
	});
});

index.set("view engine", "ejs");

index.use(express.static("assets"));
index.use(express.urlencoded({ extended: true }));

index.get("/", (req, res) => {
	res.render("home");
});

index.post("/scrap", (req, res) => {
	const urlList = filterURL(req.body.urlList);
	if (urlList.length > 0) {
		const tempID = nanoid(21);
		urlObj[tempID] = urlList;
		res.render("results", { id: tempID, length: urlList.length });
	} else {
		res.render("results", { length: 0 });
	}
});

server.listen(PORT, () => {
	console.log(`Server Initiated at port ${PORT}`);
});
