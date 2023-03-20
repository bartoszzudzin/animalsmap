import React, { useEffect, useState, useRef } from 'react';
import {Marker} from 'react-map-gl';
import '../styles/Markers.css';
import icon_active from '../images/icon_active.png';
import { NavLink } from 'react-router-dom';

const Markers = (props) =>{
    const ref = useRef(null);

    const lostShadow = "rgba(255, 99, 83, 1)";
    const foundShadow = "rgba(147, 164, 255, 1)";
    const activeShadow = "rgba(255, 147, 0, 1)";

    let shadow = "white";

    if(props.status==="lost"){
        shadow = lostShadow;
    }else if(props.status==="found"){
        shadow = foundShadow;
    }

    const [showMore, setShowMore] = useState(false);
    const [markerIndex, setMarkerIndex] = useState(props.style);
    const [imageUrl, setImageUrl] = useState('');
    const [imageVisible, setImageVisible] = useState(false);

    const handleShowMore = () =>{
        setShowMore(prevValue => !prevValue);
        if(showMore===false){
            setMarkerIndex({
                zIndex: 999,
            })
            setImageVisible(false);
        }else if(showMore===true){
            setMarkerIndex({
                zIndex: 1,
            })
        }
        
    }

    const handleClickOutside = (event) =>{
        if(event.target.className === "markerInfo" || event.target.className === "petInfo"){
            setShowMore(prevValue => prevValue);
        }
        else if(ref.current && !ref.current.contains(event.target)){
            if(showMore)
                setShowMore(prevValue => !prevValue);
        }
    }


    useEffect(()=>{
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    })

    useEffect(() =>{
        fetch(`image/${props.id}`)
                .then(response => {
                    return response.blob();
                })
                .catch(err => console.log(err))
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                    setImageVisible(true);
                })
                .catch(err => console.log(err));
    }, [showMore])
    return(
        <>
            <Marker onClick={showMore ? null : props.handlerZoom} longitude={props.long} latitude={props.lat} style={markerIndex} className="marker">
                <section ref={ref}>
                    <img onClick={handleShowMore} className="myMarker" style={{boxShadow: `0px 0px 22px 0px ${showMore ? activeShadow : shadow}`, zIndex: 0}} src={showMore ? icon_active : props.icon} alt="lost_dog"/>
                    {showMore ?
                    <div className="markerInfo" onClick={handleClickOutside}>
                        <div className='triangle'></div>
                        {props.status==="lost" ? <p className='petInfo'>{props.name}</p> : <p>{props.race}</p> }
                        <img className='petInfo' onLoad={() => URL.revokeObjectURL(imageUrl)} src={imageUrl} alt="pet"/>
                        <p className='petInfo locTags'><strong>{props.city}</strong><strong>{props.street}</strong></p>
                        <p className='petDesc'>{props.info}</p>
                        <NavLink to={{
                            pathname: `/annoucement/${props.id}`,
                            state: {
                                id: props.id
                            }
                        }} 
                        className='petInfo'>Więcej</NavLink>
                    </div>
                    : null }
                </section>
            </Marker>
        </>
    )
}

export default Markers;