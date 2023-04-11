import mapboxgl from "mapbox-gl"; 
import { useEffect, useRef } from "react";
import "./Map.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiYmFsZXg2NTQiLCJhIjoiY2xnY2pxeHp0MDQ2NTNlcGp0YjdxbjB5cyJ9.P_eghI28kqte636JfngFlQ';

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
                    'line-color': '#888',
                    'line-width': 8,
                },
            });
        });
    }, []);

    useEffect(() => {
        console.log(map.current!.isStyleLoaded());
        if (map.current && map.current!.isStyleLoaded()) {
            
        }
        
    }, [map]);

    return (
        <div className="map" ref={mapContainer}/>
    );
}

export default Map;