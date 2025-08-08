const socket = io();
const nam = prompt("Enter your name");

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const{latitude, longitude} = position.coords;
        socket.emit("send-location",{nam ,latitude, longitude});
        },
        (error)=>{
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge:0
        }
    );
}

const map = L.map("map").setView([30.900965, 75.857277], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Sahil Khurana"
}).addTo(map)

console.log(nam);

const markers = {};

socket.on("receive-location",(data)=>{
    const {id,latitude, longitude} = data;
    map.setView([latitude,longitude],16);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map).bindTooltip(nam, { permanent: true, direction: "auto" }).openTooltip();
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});