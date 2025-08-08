const  express = require('express');
const path = require("path");
const app  = express();


const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);



app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

const users = {};

io.on("connection",function(socket){

    console.log("User connected:",socket.id);

    socket.on("send-location", function(data){

        users[socket.id] = {nam: data.nam, latitude: data.latitude, longitude: data.longitude}

        io.emit("receive-location" ,{id: socket.id, ...users[socket.id] });
    });


    
    socket.on("disconnect",function(){

        console.log("User disconnected:",socket.id);
        delete users[socket.id];
        io.emit("user-disconnected", socket.id);
    });
});


app.get("/", function (req, res){
    res.render("index");
})



server.listen(3000, () => console.log("Server running on port 3000"));