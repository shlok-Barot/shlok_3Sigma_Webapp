export const autoComplete = () => {
    return new Promise((resolve, reject) => {
        var autocomplete;
        autocomplete = new window.google.maps.places.Autocomplete((document.getElementById("search_input")))
        window.google.maps.event.addListener(autocomplete, 'place_changed', function () {
            const near_place = autocomplete.getPlace();
            const country = near_place.address_components.find((elem) => elem.types[0] === 'country')
            const state = near_place.address_components.find((elem) => elem.types[0] === 'administrative_area_level_1')
            const city = near_place.address_components.find((elem) => elem.types[0] === 'locality')
            const object = {
                lat: near_place.geometry.location.lat(),
                lng: near_place.geometry.location.lng(),
                country: country.long_name,
                state: state.long_name,
                city: city.long_name
            }
            resolve(object);
        });
    })
}