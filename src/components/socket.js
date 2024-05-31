import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Cambia la URL al endpoint de tu servidor

export default socket;
