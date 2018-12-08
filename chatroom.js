const net = require('net');
const server = net.createServer();

let counter = 0;
let sockets = {};

let timestamp = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, 0)}`
};

let randomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

server.on("connection", socket => {
    socket.id = counter++;
    console.log("client connected \n");
    socket.write("Plyz provide your name: \n");

    socket.on("data", data => {
        if (!sockets[socket.id]) {
            socket.name = data.toString().trim();
            socket.color = randomColor();
            socket.write(`Welcome ${socket.name} \n`);
            sockets[socket.id] = socket;
            return;
        }
        Object.entries(sockets).forEach(([key, clientSocket]) => {
            if (socket.id == key) return;
            const message = {
                name: socket.name,
                color: socket.color,
                timestamp: timestamp()
            };
            clientSocket.write(JSON.stringify(message));
        });
    });

    socket.on("end", () => {
        delete sockets[socket.id];
        console.log(`id:${socket.id} - name: ${socket.name} disconnected at ${timestamp()}`)
    });
    //socket.setEncoding("utf8")
});


const port = 9000;
server.listen(port, () => {
    console.log("Server started at port " + port)
});

server.on("error", err => {
    console.log(err)
});
