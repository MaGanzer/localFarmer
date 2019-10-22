

let map;

function initMap() {
    let options = {
        center: {lat: 49.0,lng: 8.4},
        zoom: 4,
    };
    map = new google.maps.Map(document.getElementById("karte"), options);
}