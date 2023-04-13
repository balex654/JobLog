import mapboxgl from "mapbox-gl"; 
import { useEffect, useRef } from "react";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!;

interface MapProps {
    gpsPoints: number[][];
}

const Map = ({gpsPoints}: MapProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-104.9971, 39.7521],
            zoom: 10,
            attributionControl: false
        });

        map.current.on('style.load', () => {
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


            if (map.current!.getLayer('path')) {
                map.current!.removeLayer('path');
            }
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
        });

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
    }, [gpsPoints]);

    return (
        <div className="map" ref={mapContainer}/>
    );
}

export default Map;