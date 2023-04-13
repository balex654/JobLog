import mapboxgl from "mapbox-gl"; 
import { useEffect, useRef } from "react";
import "./Map.css";

interface MapProps {
    gpsPoints: number[][];
    accessToken: string;
}

const Map = ({gpsPoints, accessToken}: MapProps) => {
    mapboxgl.accessToken = accessToken;
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        const getBoundingCoordinates = (): mapboxgl.LngLatBounds => {
            let west = 180;
            let east = -180;
            let south = 90;
            let north = -90;
            gpsPoints.forEach(g => {
                if (g[0] < west) {
                    west = g[0];
                }
                if (g[0] > east) {
                    east = g[0];
                }
                if (g[1] < south) {
                    south = g[1];
                }
                if (g[1] > north) {
                    north = g[1];
                }
            });
    
            return new mapboxgl.LngLatBounds(
                new mapboxgl.LngLat(west, south),
                new mapboxgl.LngLat(east, north)
            );
        }

        const addPath = () => {
            if (map.current!.getLayer('path')) {
                map.current!.removeLayer('path');
            }
            if (map.current!.getSource('path')) {
                map.current!.removeSource('path');
            }
            
            map.current!.addSource('path', {
                type: 'geojson',
                data: {
                    properties: {},
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: gpsPoints
                    },
                },
            });
            
            map.current!.addLayer({
                id: 'path',
                type: 'line',
                source: 'path',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#00478a',
                    'line-width': 4,
                },
            });

            map.current!.fitBounds(getBoundingCoordinates())
        }

        if (map.current) {
            addPath();
            return;
        };

        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-104.9971, 39.7521],
            zoom: 10,
            attributionControl: false
        });

        map.current.on('style.load', () => {
            addPath();
        });
    }, [gpsPoints]);

    return (
        <div className="map" ref={mapContainer}/>
    );
}

export default Map;