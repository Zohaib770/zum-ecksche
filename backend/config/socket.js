const { Server } = require('socket.io');

let io;

module.exports = {
    initializeSocket: (server, frontendUrl) => {
        io = new Server(server, {
            cors: {
                origin: frontendUrl,
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log('Client verbunden:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client getrennt:', socket.id);
            });
        });

        return io; // Gib die initialisierte io-Instanz zurück
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.IO wurde noch nicht initialisiert.");
        }
        return io;
    }
};