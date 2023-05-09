import React, {useState, useRef, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/MapPage.css';
import Header from '../layouts/Header';
import Markers from '../components/Markers';
import UserPanel from '../components/UserPanel';
import PinsPanel from '../components/PinsPanel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Map from 'react-map-gl';
import maplibregl from 'mapbox-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import lost_pet from '../images/lost_pet.png';
import found_pet from '../images/found_pet.png';



const MapPage = () => {

    const [showUserPrompt, setShowUserPrompt] = useState(false);

    const mapRef = useRef();

    const [email, setEmail] = useState(null);
    const [pass, setPass] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [nickname, setNickname] = useState(null);

    const [err, setErr] = useState('');

    const handleEmail = (e) =>{
        setEmail(e.target.value);
    }
    const handlePass = (e) =>{
        setPass(e.target.value);
    }

    useEffect(() => {
        checkSession();      
    }, []);

    const handleLogin = (e) =>{
        e.preventDefault();
        fetch('/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: pass,
        })
        })
        .then(response => {
            if (response.ok) {
                return checkSession();
            } else {
                setErr('Wprowadzono błędny adres e-mail lub hasło');
                throw new Error('Błąd logowania');
            }
        })
        .catch(error => {
            console.error(error);
        });

    }

    const handleLogout = () => {
        fetch('/logout', {
          method: 'POST',
          credentials: 'include', // Przekazywanie ciasteczek
        })
        .then(response => {
          if (response.ok) {
            setIsLogged(false); // Ustawienie stanu na wylogowany
            setUserName(null); // Wyczyszczenie nazwy użytkownika
          } else {
            console.error(response.statusText);
          }
        })
        .catch(error => {
          console.error(error);
        });
      };

    const checkSession = () => {
        fetch('/checkSession', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // window.location.href = '/map';
                setIsLogged(true)
                return response.json();
            } else {
                setIsLogged(false);
                setUserName(null);
                setUserEmail(null);
                console.log("Użytkownik nie zalogowany");
            }
        })
        .then(data => {
            setUserName(data ? data.name : null);
            setUserEmail(data ? data.email : null);
            setNickname(data ? data.nickname : null);
        })
        .catch(error => {
            console.error(error);
            setIsLogged(false);
            setUserName(null);
            setUserEmail(null);
        });
    };

    const handleUserPrompt = () =>{
        setShowUserPrompt(prevValue => !prevValue);
    }

    const [markers, setMarkers] = useState([]);
    useEffect(() =>{
        fetch("/markers")
            .then(response => response.json())
            .then(data => {
                const arr = [];
                for(let key in data){
                    arr.push({
                            id: data[key].id,
                            long: data[key].long,
                            lat: data[key].lat,
                            street: data[key].street,
                            city: data[key].city,
                            name: data[key].name,
                            race: data[key].race,
                            info: data[key].info,
                            status: data[key].status,
                            character: data[key].character,
                            icon: data[key].icon ? found_pet : lost_pet,
                            contactPerson: data[key].contactPerson,
                            contactPhone: data[key].contactPhone,
                            style:{
                                zIndex: 1,
                            }
                        });
                }
                setMarkers(arr);
            })
    }, [])

    const allMarkers = markers.map(marker => (
        <Markers
            key={marker.id}
            id={marker.id}
            long={marker.long}
            lat={marker.lat}
            city={marker.city}
            street={marker.street}
            icon={marker.icon}
            name={marker.name}
            race={marker.race}
            info={marker.info}
            status={marker.status}
            character={marker.character}
            photo={marker.photo}
            contactPerson={marker.contactPerson}
            contactPhone={marker.contactPhone}
            handlerZoom={() => handleMarkerClick(marker)}
            style={marker.style}
        />
    ))
    
    const handleMarkerClick = (marker) =>{
        mapRef.current.zoomTo(18, {
            center: [marker.long, marker.lat],
            duration: 2000,
            offset: [0,100]
        });

    }

    return(
        <div className='mapPage'>
            <Header />
            <div className='map'>
            <Map mapLib={maplibregl}
                ref={mapRef}
                initialViewState={{
                longitude: 18.5,
                latitude: 52.0,
                zoom: 5.5,
                interactive: true
                }}
                style={{width: "100%", height: " calc(100vh - 100px)"}}
                mapStyle="https://api.maptiler.com/maps/streets-v2-light/style.json?key=Nca18T6TgcgiseL0UrQ9"
            >
                {/* <NavigationControl position="top-left" /> */}
                {allMarkers}
            </Map>
        </div>
            {isLogged ? 
                <PinsPanel 
                    userEmail={userEmail}
                    nickname={nickname}
                /> 
                : null}
            <NavLink className="mainMenuButton" to="/search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </NavLink>
            <div className='userMenu' onClick={handleUserPrompt}>
                <FontAwesomeIcon icon={faUser} />
            </div>
            {showUserPrompt ? 
                <UserPanel
                    isLogged={isLogged}
                    closeFunction={handleUserPrompt}
                    userName={userName}
                    logOutFunction={handleLogout}
                    logInFunction={handleLogin}
                    handleEmail={handleEmail}
                    handlePass={handlePass}
                    error={err}
                /> : null}
        </div>
    )
}

export default MapPage;