export const mapsConfig = {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    defaultCenter: {
        lat: 40.7128, // New York City coordinates as default
        lng: -74.0060
    },
    defaultZoom: 13,
    libraries: ['places'],
    options: {
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    }
};

export const validateMapsConfig = () => {
    if (!mapsConfig.apiKey) {
        console.error('Google Maps API key is missing. Please check your .env file.');
        return false;
    }
    return true;
}; 