import React, {useState, useEffect} from 'react';
import Header from '../layouts/Header';
import ErrorPage from './ErrorPage';

import { NavLink, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const EditAnn = () =>{

    const {id} = useParams();
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [name, setName] = useState('');
    const [info, setInfo] = useState('');
    const [status, setStatus] = useState('');
    const [character, setCharacter] = useState('');
    const [petRace, setPetRace] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const [isAllowed, setIsAllowed] = useState(false);

    const [imageUrl, setImageUrl] = useState('');
    const [imageGet, setImageGet] = useState('');

    // UPDATED DATA
    const [upInfo, setUpInfo] = useState('');
    const [upChar, setUpChar] = useState('');
    const [upName, setUpName] = useState('');
    const [upPhone, setUpPhone] = useState('');

    const [isLogged, setIsLogged] = useState(null);

    useEffect(() => {
        checkSession();    
    }, []);

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
                setIsLogged(true)
                return response.json();
            } else {
                setIsLogged(false);
                console.log("Użytkownik nie zalogowany");
            }
        })
        .catch(error => {
            console.error(error);
        });
    };

    useEffect(() =>{
        if(isLogged){
            fetch(`/getAnnoucement/${id}`)
            .then(response => response.json())
            .then(data => {
                setCity(data.city);
                setStreet(data.street);
                setName(data.name);
                setInfo(data.info);
                setStatus(data.status);
                setCharacter(data.character);
                setPetRace(data.race);
                setContactPerson(data.contactPerson);
                setContactPhone(data.contactPhone);

                setUpInfo(data.info);
                setUpChar(data.character);
                setUpName(data.contactPerson);
                setUpPhone(data.contactPhone);

            })
        }

    }, [id])
    
    useEffect(() =>{
        if(isLogged){
            fetch(`/image/${id}`)
                    .then(response => {
                        setImageGet(true);
                        return response.blob();
                    })
                    .catch(err => console.log(err))
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        setImageUrl(url);
                    })
                    .catch(err => console.log(err));
        }
    }, [imageGet, id])

    useEffect(() =>{
        if(isLogged){
        fetch(`/checkPermission/${id}`)
            .then(response => {
                if(response.ok){
                    setIsAllowed(true);
                }else{
                    setIsAllowed(false);
                }
            })
            .catch(err => console.log(err));
        }
    }, [isAllowed])
    
    const handleUpInfo = (e) =>{
        setUpInfo(e.target.value);
    }
    const handleUpChar = (e) =>{
        setUpChar(e.target.value);
    }
    const handleUpName = (e) =>{
        setUpName(e.target.value);
    }
    const handleUpPhone = (e) =>{
        setUpPhone(e.target.value);
    }

    const updateMarker = () =>{
        if(isLogged){
            const dane = {
                upInfo,
                upChar,
                upName,
                upPhone,
            };
            
            const request = new Request(`/update-marker/${id}`, {
                method: 'POST',
                body: JSON.stringify(dane),
                headers: new Headers({ 'Content-Type' : 'application/json'}),
            });

            
            fetch(request)
                .then(response => console.log(response))
                .catch(error => console.log("Error =>",error));

            window.location.href = '/my-announcements';
        }
    }

    return(
        <>
        {isLogged ? 
        <>
        {isAllowed ? 
            <>
            <Header />
                <NavLink to="/my-announcements" className="exit">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </NavLink>
                <p className='page-title'>Edycja <strong>pinezki</strong></p>
                <section className='annoucementPage'>
                {status === 'found' ? 
                <div className='status'>
                    <p className='found'>Znaleziony</p>
                </div>
                :
                <div className='status'>
                    <p className='lost'>Zagubiony</p>
                </div>
                }
                <div className='ann'>
                    <img src={imageUrl} alt="photo" />
                    <div className='hashtags'>
                        <p>{city}</p>
                        <p>{street}</p>
                        <p>{petRace}</p>
                    </div>
                </div>
                {status === 'found' ?
                <p className='petName found'>{petRace}</p>
                :
                <p className='petName lost'>{name}</p>
                }
                <div className='about'>
                    <div className='triangle second'></div>
                    Opis:
                    <textarea className='text' onChange={handleUpInfo} value={upInfo}></textarea><br />
                    Cechy szczególne:
                    <textarea className='text' onChange={handleUpChar} value={upChar}></textarea>
                </div>
                <div className='contact'>
                    <p>Osoba do kontaktu:</p>
                    <div>
                        <input className='inputs' onChange={handleUpName} type="text" value={upName}/>
                        <FontAwesomeIcon icon={faPhone} />
                        <input className='inputs' onChange={handleUpPhone} type="text" value={upPhone} />
                    </div>
                </div>
                <button className='save' onClick={updateMarker}>Zapisz</button>
            </section>
            </>
            : <ErrorPage /> }
            </> : <ErrorPage />}
        </>
    )
}

export default EditAnn;