/*Normas a usar
1. 'use strict'
2. ES6 ()=> , let, const
3. No espanenglish
4. POO (Programacion usando onjetos literales)
*/

'use strict';

const app = {
    
    item : {
        map: undefined,
        inputOrigin: undefined,
        inputDestination: undefined,
        directionsService: undefined,
        directionsDisplay: undefined
    },

    init : function() {
        //Inicializacion de todas las variables de Item
        app.item.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 5, //nivel de profundidad
            center: { lat: -9.1191427, lng: -77.0349046},
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false
        });

        app.setup();  
        app.item.inputOrigin = document.getElementById('inputOrigin');
        app.changeLocation(app.item.inputOrigin);
        app.item.inputDestination = document.getElementById('inputDestination');
        app.changeLocation(app.item.inputDestination);
        
        app.item.directionsService = new google.maps.DirectionsService;
        app.item.directionsDisplay = new google.maps.DirectionsRenderer;
        app.item.directionsDisplay.setMap(app.item.map);
    },

    setup : function () {
        document.getElementById("foundMe").addEventListener("click", app.foundMe);
        document.getElementById("route").addEventListener("click", function(){
            app.drowRoute(app.item.directionsService, app.item.directionsDisplay)
        });
    },

    /*funcion que encuentra mi ubicacion*/
    foundMe : function () {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(app.markerMyLocation,app.funcionError);
        }
    },
    //funcion markerMyLocation
    markerMyLocation : function(posicion) {
        var myLatitude,myLongitude;
        myLatitude = posicion.coords.latitude;
        myLongitude = posicion.coords.longitude;

        var location = new google.maps.InfoWindow();
        var marker = app.createMarker(app.item.map);

        marker.setPosition(new google.maps.LatLng(myLatitude,myLongitude));
        app.item.map.setCenter({lat:myLatitude,lng:myLongitude});
        app.item.map.setZoom(17); 
        marker.setVisible(true);

        location.setContent('<div><strong>Mi ubicación actual</strong><br>');
        location.open(app.item.map, marker);
    },
    //funcion Error
    funcionError : function(error) {
        alert("Tenemos un problema para encontrar tu ubicación");
    },

    /*funcion que encuentra la ubicacion del input*/
    changeLocation : function (input) {
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', app.item.map);
        var location = new google.maps.InfoWindow();
        var marker = app.createMarker(app.item.map);
        autocomplete.addListener('place_changed', function() {
            location.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            app.markerLocation(place, location, marker);
        });
    },

    //funcion que crea el icono en la ubicacion
    createMarker : function (map) {
        var icon = {
            url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icon,
            anchorPoint: new google.maps.Point(0, -29)
        });

        return marker;
    },

    //funcion que crea la nota de la ubicacion.
    markerLocation : function(place, location, marker) {
        if (!place.geometry) {
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            app.item.map.fitBounds(place.geometry.viewport);
        } else {
            app.item.map.setCenter(place.geometry.location);
            app.item.map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        location.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        location.open(app.item.map, marker);
    },

    /*Funcion que dibuja la ruta*/
    drowRoute : function(directionsService, directionsDisplay) {
        var origin = document.getElementById("inputOrigin").value;
        var destination = document.getElementById('inputDestination').value;

        if(destination != "" && origin != "") {
            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    directionsDisplay.setDirections(response);
                } else {
                    app.functionErrorRoute();
                }
            });
        }
    },

    functionErrorRoute : function() {
        alert("No ingresaste un origen y un destino validos");
    }  
}    

function initMap(){
	app.init();
}
