import React, { useEffect, useState, useRef } from "react";

const InputMaps = (props) => {
    const [location, setLocation] = useState({ lat: 28.6138954, lng: 77.2090057 });
    const [input, setInput] = useState("");
    const [marker, setMarker] = useState(null);
    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);
    let map;

    useEffect(() => {
        initMap();
        initAutocomplete();

    }, []);

    useEffect(() => {
        if (props.value) {
            if (props.value['address']) {
                if (props.value?.address !== "") {
                    setInput(props.value.address)
                    setLocation({ lat: props.value.coords.latitude, lng: props.value.coords.longitude });
                }
            }
        }
    }, [props.value]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.panTo(location);
            if (marker) {
                marker.setPosition(location);
            } else {
                const newMarker = new window.google.maps.Marker({
                    position: location,
                    map: mapRef.current,
                });
                setMarker(newMarker);
            }
        }
    }, [location]);

    const initMap = () => {
        map = new window.google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 13,
        });
        mapRef.current = map;
    };

    const handleLocationChange = async () => {
        const locationName = input;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    locationName
                )}&key=AIzaSyBcNWq7pVUi9n2C4JCVC8oSR2lX3l546ZQ`
            );
            const data = await response.json();
            const coordinates = data.results[0].geometry.location;
            setLocation(coordinates);

        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    };
    const handleChange = (event) => {
        setInput(event.target.value);
        handleLocationChange()
    }
    let autocomplete;
    const initAutocomplete = () => {
        autocomplete = new window.google.maps.places.Autocomplete(
            autocompleteRef.current,
            { types: ['geocode'] }
        );
        autocomplete.addListener('place_changed', handlePlaceChanged);
    };
    const handlePlaceChanged = (e) => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
            const coordinates = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setInput(place.formatted_address);
            setLocation(coordinates);
            props.onChange(props.name, place.formatted_address, coordinates)
        }
    };

    const handleCurrentLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setLocation(currentPosition);
                },
                (error) => {
                    console.error('Error getting current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="map_inputs">
            <label className="form-label">
                {props.label} <span className="text-danger">{props.isRequired && "*"}</span>
            </label>
            {props.type === "location" && <img src={"assets/img/world.png"} alt="img" onClick={handleCurrentLocationClick} className="form-icons" />}
            <input
                {...props}
                placeholder="Search for an address"
                type="text"
                onChange={handleChange}
                value={input}
                ref={autocompleteRef} />
            <div id="map" style={{ height: '160px', width: '100%', marginTop: '10px' }}></div>
        </div>
    );
}

export default InputMaps
