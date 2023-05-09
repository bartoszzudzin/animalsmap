import React, { Component, useState, useEffect } from 'react';
import {NavLink, useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import '../styles/AnnoucementPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import found_icon from '../images/found_pet.png';
import lost_icon from '../images/lost_pet.png';

const AnnoucementPage = () =>{

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
    const [msgNick, setMsgNick] = useState('');

    const [imageUrl, setImageUrl] = useState('');
    const [imageGet, setImageGet] = useState('');

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
        fetch(`http://localhost:3000/getAnnoucement/${id}`)
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
            setMsgNick(data.nickname);
        })
    }, [id])
    
    useEffect(() =>{
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
    }, [imageGet, id])
    
    return(
        <>
            <Header />
            <section className='annoucementPage'>
                <NavLink to="/map" className="exit">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </NavLink>
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
                    <p className='info'>{info}</p>
                    <i>{character}</i>
                </div>
                <div className='contact'>
                    <p>Osoba do kontaktu:</p>
                    <div>
                        <p className='person'>{contactPerson}</p>
                        <p className='phone'><FontAwesomeIcon icon={faPhone} /> {contactPhone}</p>
                    </div>
                </div>
                {isLogged ? 
                    <NavLink className='sendMsg' to={`/conversation/${msgNick}`}>
                        Napisz wiadomość
                    </NavLink> : null}
            </section>
            {status === 'found' ? 
            <img className='background' src={found_icon} alt='background' /> :
            <img className='background' src={lost_icon} alt='background' />}
            {/* <img className='background' src={icon} alt="background" /> */}
        </>
    )
}

export default AnnoucementPage;