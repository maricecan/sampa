// Function called by the Google Maps SDK - Initializes our app
function init() {
    // Instantiate the Google Geocoder Object - This Object is capable of decoding addresses
    var geocoder = new google.maps.Geocoder();
    // Fetches the previously stored coordinates
    fetchStoredCoordinates(geocoder);
    // Initializes the address event listener
    initializeAddressEventListener(geocoder);
}

// Fetches the previously stored coordinates
function fetchStoredCoordinates(geocoder)
{    
    // Call data.php as Ajax to retrieve the existent coordinates from the backend
    $.ajax({
        type        : 'GET',
        url         : 'data.php',
        dataType    : 'json',
        encode      : true
    }).done(function(data) {
        resolveAddress(geocoder, 'Sao Paulo');                
    });
}

// Initializes the address event listener
function initializeAddressEventListener(geocoder)
{
    // Everytime the address input changes its value, we capture the event and trigger a function
    document.querySelector('#address').addEventListener('change', function(event){
        resolveAddress(geocoder, event.target.value);
    });
}

function resolveAddress(geocoder, address)
{
    // Using Google's geocoder to decode the address to a coordinate
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            var coordinates = results[0].geometry.location; // this data structure can be found at the Maps JS SDK doc
            var latLon      = {'lat': coordinates.lat(), 'lng': coordinates.lng()};

            // If coordinate is decoded, we send the information to the backend to persist the coordinate
            $.ajax({
                type        : 'POST',
                url         : 'data.php',
                data        : {'coordinate': latLon}, // this data structure can be found at the Maps JS SDK doc
                dataType    : 'json',
                encode      : true
            }).done(function(data) {
                renderMap(data, latLon);
            });
        }
    });
}

// Renders the MAP with the given coordinates
function renderMap(data, defaultCoordinate)
{
    // if no data, do not execute
    if (data.length === 0) {
        return;
    }
    // The backend will return all its persisted coordinates
    // Set the first coordinate as main coordinate
    if (!defaultCoordinate) {
        var defaultElement    = data[0];
        defaultCoordinate = {lat: parseFloat(defaultElement.lat), 'lng': parseFloat(defaultElement.lng)};
    }

    // Instantiate the Google Maps object - So we can draw the map at the selected div
    var map               = new google.maps.Map(document.querySelector('#map'), {
        center: defaultCoordinate,
        zoom: 12 // Optional: (data.length === 1) ? 18 : 1 // If the backend returns just one coordinate, zoom to 18 (close), otherwise zoom 1 (far)
    });

    // Loop through all coordinates
    data.forEach(function(coordinate){
        // For each coordinate, create a new PIN/Marker at the map
        new google.maps.Marker({
            map: map, // The map element created above
            position: {lat: parseFloat(coordinate.lat), 'lng': parseFloat(coordinate.lng)} // The current coordinate from the loop
        });
    });
  }