import React, {useState, useRef, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/MapPage.css';
import Header from '../layouts/Header';
import Markers from '../components/Markers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import Map from 'react-map-gl';
import maplibregl from 'mapbox-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import lost_pet from '../images/lost_pet.png';
import found_pet from '../images/found_pet.png';




const MapPage = () => {

    const handleShowMenuLost = () =>{
        setShowMenuLost(prevValue => !prevValue);
        setShowMenu(prevValue => !prevValue);
    }
    const handleShowMenuFound = () =>{
        setShowMenuFound(prevValue => !prevValue);
        setShowMenu(prevValue => !prevValue);
    }

    const [petName, setPetName] = useState('');
    const [petRace, setPetRace] = useState('');
    const [petInfo, setPetInfo] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [character, setCharacter] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [error, setError] = useState('');
    const [img, setImg] = useState('');

    const [showMenuLost, setShowMenuLost] = useState(false);
    const [showMenuFound, setShowMenuFound] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const mapRef = useRef();
    const fileRefLost = useRef();
    const fileRefFound = useRef();

    const addLostPin = (e) =>{
        e.preventDefault();

        fetch(`https://nominatim.openstreetmap.org/search?q=${street},${city}&format=json`)
            .then(response => response.json())
            .catch(error => console.log(error))
            .then(data => {
                const [firstResult] = data;
                const id = Math.floor(Math.random() * 999999);
                if(firstResult){
                const {lat, lon} = firstResult;

                const file = fileRefLost.current.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onloadend = () =>{
                    const postImage = fileReader.result;
                    const dane = {
                        id: id,
                        long: lon,
                        lat: lat,
                        street: street,
                        city: city,
                        icon: false,
                        name: petName,
                        race: petRace,
                        info: petInfo,
                        status: "lost",
                        character: character,
                        contactPerson,
                        contactPhone,
                        image: postImage,
                    }

                    console.log(dane);
    
                    const request = new Request('https://animalsmap.herokuapp.com/addmarker', {
                        method: 'POST',
                        body: JSON.stringify(dane),
                        headers: new Headers({ 'Content-Type' : 'application/json'}),
                    });
    
                    
                    fetch(request)
                        .then(response => console.log(response))
                        .catch(error => console.log(error));

                }
                resetValues();
                setShowMenuLost(prevValue => !prevValue);
                window.location.reload()
                }else{
                    setError('Wprowadzono złą nazwę miejscowości lub ulicy');
                }
            })
    }
    const addFoundPin = (e) =>{
        e.preventDefault();
        fetch(`https://nominatim.openstreetmap.org/search?q=${street},${city}&format=json`)
            .then(response => response.json())
            .catch(error => console.log(error))
            .then(data => {
                const [firstResult] = data;
                if(firstResult){
                const {lat, lon} = firstResult;
                const id = Math.floor(Math.random() * 999999);

                const file = fileRefFound.current.files[0];
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onloadend = () =>{
                    const postImage = fileReader.result;
                    const dane = {
                        id: id,
                        long: lon,
                        lat: lat,
                        street: street,
                        city: city,
                        icon: true,
                        name: petName,
                        race: petRace,
                        info: petInfo,
                        status: "found",
                        character: character,
                        contactPerson,
                        contactPhone,
                        image: postImage,
                    }
                    const request = new Request('https://animalsmap.herokuapp.com/addmarker', {
                        method: 'POST',
                        body: JSON.stringify(dane),
                        headers: new Headers({ 'Content-Type' : 'application/json'}),
                    });

                    
                    fetch(request)
                        .then(response => console.log(response))
                        .catch(error => console.log(error));
                }

                resetValues();
                setShowMenuFound(prevValue => !prevValue);
                window.location.reload()
                }else{
                    setError('Wprowadzono złą nazwę miejscowości lub ulicy');
                }
            })
    };


    const handleSetName = (e) =>{
        setPetName(e.target.value);
    }
    const handleSetInfo = (e) =>{
        setPetInfo(e.target.value);
    }
    const handleSetCharacter = (e) =>{
        setCharacter(e.target.value);
    }
    const handleChangeRace = (e) =>{
        setPetRace(e.target.value);
    }
    const handleSetCity = (e) =>{
        setCity(e.target.value);
    }
    const handleSetStreet = (e) =>{
        setStreet(e.target.value);
    }
    const handleContactPerson = (e) =>{
        setContactPerson(e.target.value);
    }
    const handleContactPhone = (e) =>{
        setContactPhone(e.target.value);
    }

    const resetValues = () =>{
        setPetName('');
        setPetInfo('');
        setCity('');
        setStreet('');
        setCharacter('');
        setContactPerson('');
        setContactPhone('');
        setError('');
        setImg(null);
    }

    const [markers, setMarkers] = useState([]);
    useEffect(() =>{
        fetch("https://animalsmap.herokuapp.com/markers")
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

            <div className='buttons'>
                {showMenu ? null : 
                    <>
                        <button onClick={handleShowMenuLost}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        <button onClick={handleShowMenuFound}><FontAwesomeIcon icon={faMapPin} /></button>
                    </> 
                }

                {showMenuLost ? 
                    <div className='menuAdd Lost'>
                        <i className='errorInfo'>{error}</i>
                        <p>Dodaj pinezkę, zagubionego zwierzęcia:</p>
                        <button className='closeWindow' onClick={handleShowMenuLost}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <form action="/upload" method='POST' onSubmit={addLostPin} encType="multipart/form-data">
                            <label>Imię zwierzęcia:
                                <input type="text" value={petName} onChange={handleSetName}/>
                            </label><br />
                            <label>Krótka informacja:
                                <input type="text" placeholder='' value={petInfo} onChange={handleSetInfo}/>
                            </label><br />
                            <label>Rasa zwierzęcia:
                                <input type="text" placeholder='np. Jamnik' value={petRace} onChange={handleChangeRace}/>
                            </label><br />
                            <label>Ostatnio widziane:
                                <input type="text" placeholder='Miasto' value={city} onChange={handleSetCity}/><br />
                                <input type="text" placeholder='Ulica' value={street} onChange={handleSetStreet}/>
                            </label><br /><br />
                            <label>
                                Dodaj zdjęcie:
                                <input className='fileBtn' type="file" name="image" ref={fileRefLost} accept=".jpeg, .png, .jpg"/>
                            </label><br />
                            <label>Osoba do kontaktu:<br />
                                <input type="text" placeholder='Imię' value={contactPerson} onChange={handleContactPerson}/><br />
                                <input type="text" placeholder='(+48) Numer telefonu' value={contactPhone} onChange={handleContactPhone}/>
                            </label>
                            <input type="submit" value="Dodaj" />
                        </form>
                    </div>
                : ''}

                {showMenuFound ? 
                    <div className='menuAdd Found'>
                        <i className='errorInfo'>{error}</i>
                        <p>Dodaj pinezkę, znalezionego zwierzęcia:</p>
                        <button className='closeWindow' onClick={handleShowMenuFound}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <form action="/upload" method='POST' onSubmit={addFoundPin} encType="multipart/form-data">
                            <label>Krótka informacja:
                                <input type="text" placeholder='' value={petInfo} onChange={handleSetInfo}/>
                            </label><br />
                            <label>Cechy szczególne:
                                <input type="text" placeholder='Czarna sierść, białe łapki' value={character} onChange={handleSetCharacter}/>
                            </label><br />
                            <label>Rasa zwierzęcia:
                                <input type="text" placeholder='np. Jamnik' value={petRace} onChange={handleChangeRace}/>
                            </label><br />
                            <label>Lokalizacja:
                                <input type="text" placeholder='Miasto' value={city} onChange={handleSetCity}/><br />
                                <input type="text" placeholder='ulica' value={street} onChange={handleSetStreet}/>
                            </label><br /><br /><br />
                            <label>
                                Dodaj zdjęcie:
                                <input className='fileBtn' type="file" name="image" ref={fileRefFound} accept="image/jpeg"/>
                            </label><br />
                            <label>Osoba do kontaktu:<br />
                                <input type="text" placeholder='Imię' value={contactPerson} onChange={handleContactPerson}/><br />
                                <input type="text" placeholder='(+48) Numer telefonu' value={contactPhone} onChange={handleContactPhone}/>
                            </label>
                            <input type="submit" value="Dodaj" />
                        </form>
                    </div>
                : ''}
            </div>
            <NavLink className="mainMenuButton" to="/search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </NavLink>
        </div>
    )
}


export default MapPage;