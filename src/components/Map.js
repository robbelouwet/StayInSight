import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from "react";
import env from "react-dotenv";

export default ({ borders, city, removeWaypoint, data, setData }) => {
    //console.log("passed city: ", city)
    mapboxgl.accessToken = env.MAPBOX_API_KEY;
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(city.lng);
    const [lat, setLat] = useState(city.lat);
    const [zoom, setZoom] = useState(city.zoom);
    const [loaded, setLoaded] = useState(false)

    const EnsureInitialized = (_map) => {
        if (_map.current) return
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        })
    }

    // load map source once when rendering for the first time
    useEffect(() => {
        EnsureInitialized(map);
        map.current.on("load", () => initializeSources(map, city, parseWaypoints(data, borders), setLoaded))
    }, []);

    // reload map source when 'data' hook changes
    useEffect(() => {
        EnsureInitialized(map);
        loaded && map.current.getSource(city.key).setData(parseWaypoints(data, borders).data)
    }, [data, loaded])

    return <div ref={mapContainer} className="map-container" />;
}

// add initial standard data that only needs to be added once
const initializeSources = (map, city, geoJson, setLoaded) => {
    map.current.addSource(city.key, geoJson)

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

    map.current.addLayer({
        'id': 'waypoints',
        'type': 'circle',
        'source': city.key,
        'paint': {
            'circle-radius': 6,
            'circle-color': '#B42222'
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
                        el.lng,
                        el.lat
                    ],
                    type: "Point"
                }
            }))
        ]
    }
})