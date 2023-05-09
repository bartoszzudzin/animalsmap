import React, {useState, useRef} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const PinsPanel = (props) =>{

    const handleShowMenuFound = () =>{
        setShowMenuFound(prevValue => !prevValue);
        setShowMenu(prevValue => !prevValue);
    }

    const [showMenuFound, setShowMenuFound] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const [petName, setPetName] = useState('');
    const [petRace, setPetRace] = useState('');
    const [petInfo, setPetInfo] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [character, setCharacter] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);


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
    const handleStatus = (e) =>{
        setStatus(e.target.value);
        console.log(e.target.value);
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
        setStatus(null);
    }

    const fileRefFound = useRef();

    const addPin = (e) =>{
        e.preventDefault();
        if(status === "Znalazłem"){
            setStatus("found");
        }
        if(status === "Szukam"){
            setStatus("lost");
        }
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
                        icon: status === "found" ? true : false,
                        name: petName,
                        race: petRace,
                        info: petInfo,
                        status: status,
                        character: character,
                        contactPerson,
                        contactPhone,
                        image: postImage,
                        addedBy: props.userEmail,
                        nickname: props.nickname,
                    }
                    const request = new Request('/addmarker', {
                        method: 'POST',
                        body: JSON.stringify(dane),
                        headers: new Headers({ 'Content-Type' : 'application/json'}),
                    });

                    
                    fetch(request)
                        .then(response => {
                            if(response.ok){
                                resetValues();
                                setShowMenuFound(prevValue => !prevValue);
                                window.location.reload();
                            }
                        })
                        .catch(error => console.log("Error =>",error));
                }
                
                resetValues();
                setShowMenuFound(prevValue => !prevValue);

                }else{
                    setError('Wprowadzono złą nazwę miejscowości lub ulicy');
                }
            })
    };

    const Page1 = () =>{
        return(
            <div className='radioButtons'>
                <input type="radio" name="status" id="lost" value="lost" onChange={handleStatus} checked={status === 'lost'}/>
                <label htmlFor="lost">Szukam</label><br />
                <input type="radio" name="status" id="found" value="found" onChange={handleStatus} checked={status === 'found'}/>
                <label htmlFor="found">Znalazłem</label>
            </div>
        )
    }

    function increasePage () {
        if(currentPage === 1 && status === null){
            setError ('Zaznacz najpierw odopwiedni status ogłoszenia')
            return alert(error);
        }else{
            setCurrentPage(currentPage + 1);
        }
    }

    function decreasePage () {
        setCurrentPage(currentPage - 1);
    }
    
    return(
        <div className='buttons'>
                {showMenu ? null : 
                    <>
                        <button onClick={handleShowMenuFound}><FontAwesomeIcon icon={faMapPin} /></button>
                    </> 
                }
                {showMenuFound ? 
                    <div className='menuAdd Found'>
                        <i className='errorInfo'>{error}</i>
                        <p>Dodaj pinezkę na mapie:</p>
                        <button className='closeWindow' onClick={handleShowMenuFound}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <form method='POST' onSubmit={addPin} encType="multipart/form-data">
                            {currentPage === 1 ? <Page1 /> : null }
                            {currentPage === 2 && status === 'lost' ? 
                                <div>
                                    <label className="addLabel">Imię zwierzęcia:
                                        <input type="text" value={petName} onChange={handleSetName}/>
                                    </label>
                                </div>
                                :
                                currentPage === 2 && status === 'found' ? 
                                <div>
                                    <label className="addLabel">Cechy szczególne:
                                        <input type="text" placeholder='Czarna sierść, białe łapki' value={character} onChange={handleSetCharacter}/>
                                    </label> 
                                </div>
                                : null
                            }
                            {currentPage === 3 ?
                                <label className="addLabel">Krótka informacja:
                                    <input  type="text" placeholder='' value={petInfo} onChange={handleSetInfo}/>
                                </label>
                            : null}
                            {currentPage === 4 ?
                                <label className="addLabel">Rasa zwierzęcia:
                                    <input type="text" placeholder='np. Jamnik' value={petRace} onChange={handleChangeRace}/>
                                </label>
                            : null}
                            {currentPage === 5 ?
                                <label className="addLabel">Lokalizacja:
                                    <input type="text" placeholder='Miasto' value={city} onChange={handleSetCity}/>
                                    <input type="text" placeholder='ulica' value={street} onChange={handleSetStreet}/>
                                </label>
                            : null}
                            {currentPage === 6 ?
                                <label className="addLabel">Osoba do kontaktu:<br />
                                    <input type="text" placeholder='Imię' value={contactPerson} onChange={handleContactPerson}/>
                                    <input type="text" placeholder='(+48) Numer telefonu' value={contactPhone} onChange={handleContactPhone}/>
                                </label>
                            : null}
                            {currentPage === 7 ?
                                <label className="addLabel">
                                Dodaj zdjęcie:
                                    <input className='fileBtn' type="file" name="image" ref={fileRefFound} accept="image/jpeg" size="50048576"/>
                                </label>
                            : null}
                            <div className='arrows'>
                                {currentPage > 1 ? <FontAwesomeIcon style={{transform: "scale(-100%)"}} icon={faArrowRight} onClick={decreasePage}/> : <FontAwesomeIcon style={{opacity: 0}} icon={faArrowRight} />}
                                {currentPage !==7 ? <p>{currentPage}/7</p> : null }
                                {currentPage !==7 ? <FontAwesomeIcon icon={faArrowRight} onClick={increasePage}/> : <input type="submit" value="Dodaj" />}
                            </div>
                        </form>
                    </div>
                : ''}
        </div>
    )
}

export default PinsPanel;