import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from "react";

export default ({ borders, city, removeWaypoint, filteredData, setFilteredData, marker, setMarker }) => {
    mapboxgl.accessToken = "pk.eyJ1IjoiYW5kcmVzZGVqb25nZSIsImEiOiJjbGh5am1oNWcxNGtvM2lxYTQzMnBidWpvIn0.pPJCqvrKLJKeyQaWfZ7qvQ";
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(city.lng);
    const [lat, setLat] = useState(city.lat);
    const [zoom, setZoom] = useState(city.zoom);
    const [loaded, setLoaded] = useState(false);

    const ensureInitialized = (_map) => {
        if (_map.current) return
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/andresdejonge/clhyjvtnq009201qu1lhi0p3y',
            center: [lng, lat],
            zoom: zoom,
        })
    }

    // add marker on click
    const handleMapClick = (event) => {
        const { lngLat } = event;
        const longitude = lngLat.lng;
        const latitude = lngLat.lat;
        setMarker({ latitude, longitude });
    };


    function place_marker(marker) {

        if (map.current && marker && marker.latitude && marker.longitude) {

            // remove old marker first
            if (map.current.getSource('marker-source')) {
                map.current.removeLayer('marker');
                map.current.removeSource('marker-source');
            }

            /* MARKER */
            map.current.addSource('marker-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [marker.longitude, marker.latitude]
                            }
                        }
                    ]
                }
            });

            map.current.addLayer({
                id: 'marker',
                type: 'circle',
                source: 'marker-source',
                paint: {
                    'circle-radius': 6,
                    // TODO change color or icon
                    'circle-color': colorMappings["color-secondary-1-4"]
                }
            });
        }
    };

    // load map source once when rendering for the first time
    useEffect(() => {
        ensureInitialized(map);
        map.current.on("load", () => initializeSources(map, city, parseWaypoints(filteredData, borders), setLoaded));
        map.current.on('click', handleMapClick); // handleMapClick for marker
    }, []);

    // reload map source when 'data' hook changes
    useEffect(() => {
        ensureInitialized(map);
        loaded && map.current.getSource(city.key).setData(parseWaypoints(filteredData, borders).data)
    }, [filteredData, loaded]);

    // flyTo marker's new position and place marker when marker changes
    useEffect(() => {
        // fly to coordinates
        if (marker.latitude && marker.longitude) {
            map.current.flyTo({
                center: [marker.longitude, marker.latitude],
                duration: 1500
            });
        }
        // place marker at coordinates
        place_marker(marker);
    }, [marker]);

    return <div ref={mapContainer} className="map-container" />;
}

// add initial standard data that only needs to be added once
const initializeSources = (map, city, geoJson, setLoaded) => {
    map.current.addSource(city.key, geoJson)

    /* BORDERS */
    map.current.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': city.key,
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 3
        }
    });

    /* WAYPOINTS */
    map.current.addLayer({
        'id': 'waypoints',
        'type': 'circle',
        'source': city.key,
        'paint': {
            'circle-radius': 6,
            'circle-color': colorMappings["color-primary-0"]
        },
        'filter': ['==', '$type', 'Point']
    });
    setLoaded(true)
}

const parseWaypoints = (values, borders) => Object({
    'type': 'geojson',
    'data': {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": borders,
                    "type": "LineString"
                }
            },
            ...values.map(el => Object({
                type: "Feature",
                properties: {
                    ...el
                },
                geometry: {
                    coordinates: [
                        el.longitude,
                        el.latitude
                    ],
                    type: "Point"
                }
            }))
        ]
    }
})

var colorMappings = {
    "color-primary-0": "#42A4F5",
    "color-primary-1": "#98CDF9",
    "color-primary-2": "#69B7F7",
    "color-primary-3": "#1A8FF0",
    "color-primary-4": "#0780E4",
    "color-secondary-1-0": "#5552F7",
    "color-secondary-1-1": "#A3A1FA",
    "color-secondary-1-2": "#7976F8",
    "color-secondary-1-3": "#302CF2",
    "color-secondary-1-4": "#140FE8",
    "color-secondary-2-0": "#FFCE37",
    "color-secondary-2-1": "#FFE594",
    "color-secondary-2-2": "#FFD962",
    "color-secondary-2-3": "#FFC30B",
    "color-secondary-2-4": "#FFC000",
    "color-complement-0": "#FFAB37",
    "color-complement-1": "#FFD294",
    "color-complement-2": "#FFBD62",
    "color-complement-3": "#FF980B",
    "color-complement-4": "#FF9400"
  };