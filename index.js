const PORT = process.env.PORT || 5192;

import express from "express";
import { createServer } from "http";

import { establish } from "./userModules/socket.js";
import routes from "./userModules/routes.js";

const index = express();
const server = createServer(index);

establish(server);

index.set("view engine", "ejs");

index.use(express.static("assets"));
index.use(express.urlencoded({ extended: true }));

index.use(routes);

server.listen(PORT, () => {
	console.log(`Server Initiated at port ${PORT}`);
});
