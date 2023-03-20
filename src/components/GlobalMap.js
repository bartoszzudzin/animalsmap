import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
// import '../styles/GlobalMap.css';

import Map, {NavigationControl, Marker} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const GlobalMap = (props) => {
    const mapRef = useRef();

    const markers = props.markers;

    const markersArr = markers.map(marker => {
        console.log(marker.lat + marker.long)
    })

    const handleClickMarker = (x,y) =>{
        console.log(x,y);
        mapRef.current.getMap().setView([x, y], 18);
    }

    return (
        <div className='map'>
            <Map mapLib={maplibregl}
                ref={mapRef}
                initialViewState={{
                longitude: 18.5,
                latitude: 52.0,
                zoom: 5.5
                }}
                style={{width: "100%", height: " calc(100vh - 100px)"}}
                mapStyle="https://api.maptiler.com/maps/streets-v2-light/style.json?key=Nca18T6TgcgiseL0UrQ9"
            >
                {/* <NavigationControl position="top-left" /> */}
                {markers}
            </Map>
        </div>
    )
}

export default GlobalMap;