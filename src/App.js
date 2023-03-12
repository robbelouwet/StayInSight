import './style/App.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import {useEffect, useRef, useState} from "react"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVzZGVqb25nZSIsImEiOiJjbGY1ZG9iZGMwOXJmM3NubnZjemdnZWlyIn0.KiF-CdFiCCjeDw49HCDGZg';

function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(4.891512042723889);
    const [lat, setLat] = useState(52.37919398117239);
    const [zoom, setZoom] = useState(11);

    const waypoints = [
        {lat: 4.90569, lng: 52.41772},
        {lat: 4.90005, lng: 52.374320000000004},
        {lat: 4.9751199999999995, lng: 52.36103},
        {lat: 4.89417, lng: 52.37663}
    ]

    const geoJson = {
        'type': 'geojson',
        'data': {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                4.844259181502792,
                                52.396215836734484
                            ],
                            [
                                4.844798143032307,
                                52.38020005963966
                            ],
                            [
                                4.842099332035701,
                                52.373186400584785
                            ],
                            [
                                4.842621603439255,
                                52.352079890604784
                            ],
                            [
                                4.841164839053988,
                                52.34849128619345
                            ],
                            [
                                4.84147613215157,
                                52.33926440057991
                            ],
                            [
                                4.843444739383045,
                                52.33718815548855
                            ],
                            [
                                4.883091335610004,
                                52.338623221048294
                            ],
                            [
                                4.907090371666413,
                                52.328904462918445
                            ],
                            [
                                4.91594261187214,
                                52.32837136882296
                            ],
                            [
                                4.950971370198658,
                                52.33955638457948
                            ],
                            [
                                4.963537356938474,
                                52.35206611605739
                            ],
                            [
                                4.973375548933149,
                                52.37018875439932
                            ],
                            [
                                4.97425198882371,
                                52.376344041770835
                            ],
                            [
                                4.97093311538535,
                                52.38574020480522
                            ],
                            [
                                4.954865401826112,
                                52.40128544971722
                            ],
                            [
                                4.942471144419443,
                                52.40676097788676
                            ],
                            [
                                4.930022167040477,
                                52.41080173647498
                            ],
                            [
                                4.925935921741512,
                                52.412923895066626
                            ],
                            [
                                4.920294251596374,
                                52.415627661046784
                            ],
                            [
                                4.914094220645069,
                                52.417723015760856
                            ],
                            [
                                4.909653320106997,
                                52.419543213384856
                            ],
                            [
                                4.904252125778754,
                                52.422042922438976
                            ],
                            [
                                4.894760826596439,
                                52.424754538408024
                            ],
                            [
                                4.891599684830055,
                                52.424823122561776
                            ],
                            [
                                4.888269766626962,
                                52.42516256798703
                            ],
                            [
                                4.885672174445261,
                                52.425069176009
                            ],
                            [
                                4.883846040662576,
                                52.42466346142146
                            ],
                            [
                                4.880351288144169,
                                52.42402086835568
                            ],
                            [
                                4.8783079552148365,
                                52.42357874763405
                            ],
                            [
                                4.873531545073945,
                                52.422151536111414
                            ],
                            [
                                4.871068031835023,
                                52.42025710109985
                            ],
                            [
                                4.869183199483956,
                                52.419670546055556
                            ],
                            [
                                4.867884932262058,
                                52.417885809254244
                            ],
                            [
                                4.849288347796261,
                                52.40108858521151
                            ],
                            [
                                4.844718933148897,
                                52.39665934227551
                            ],
                            [
                                4.844270870126678,
                                52.39610624868962
                            ]
                        ],
                        "type": "LineString"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            4.917492216875701,
                            52.3857992797156
                        ],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            4.903923420611079,
                            52.36335483247805
                        ],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            4.88452203544756,
                            52.39431947011698
                        ],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            4.872753878505165,
                            52.358918558411744
                        ],
                        "type": "Point"
                    }
                }
            ]
        }
    }


    useEffect(() => {
        // TODO change AUB die current!
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        })
        map.current.on('load', () => {
            // TODO: for each waypoint add to geoJson
            map.current.addSource('amsterdam', geoJson)
            map.current.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'amsterdam',
                'layout': {},
                'paint': {
                    'line-color': '#000',
                    'line-width': 3
                }
            });
            map.current.addLayer({
                'id': 'waypoints',
                'type': 'circle',
                'source': 'amsterdam',
                'paint': {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                },
                'filter': ['==', '$type', 'Point']
            });
        })
    });

    return (
        <div>
            <div ref={mapContainer} className="map-container"/>
        </div>
    );
}

export default App;