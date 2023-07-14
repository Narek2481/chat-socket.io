const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./router/router");
const { addUser, findUser, getRoomUsers } = require("./users");

try {
    dotenv.config()
    const app = express();

    app.use(cors({ origin: "*" }));
    app.use(router);

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("join", ({ name, room }) => {
            socket.join(room);

            const { user, isExist } = addUser({ name, room });

            const userMessage = isExist
                ? `${user.name}, here you go again`
                : `Hey my love ${user.name}`;

            socket.emit("message", {
                data: { user: { name: "Admin" }, message: userMessage },
            });

            socket.broadcast.to(user.room).emit("message", {
                data: { user: { name: "Admin" }, message: `${user.name} has joined` },
            });

            io.to(user.room).emit("room", {
                data: { users: getRoomUsers(user.room) },
            });
        });

        socket.on("sendMessage", ({ message, params }) => {
            const user = findUser(params);

            if (user) {
                io.to(user.room).emit("message", { data: { user, message } });
            }
        });

        socket.on("leftRoom", ({ params }) => {
            const user = removeUser(params);

            if (user) {
                const { room, name } = user;

                io.to(room).emit("message", {
                    data: { user: { name: "Admin" }, message: `${name} has left` },
                });

                io.to(room).emit("room", {
                    data: { users: getRoomUsers(room) },
                });
            }
        });

        io.on("disconnect", () => {
            console.log("Disconnect");
        });
    });

    server.listen(process.env.PORT, () => {
        console.log("Server is running in port  " + process.env.PORT);
    });
} catch (e) {
    console.log(e);
}
