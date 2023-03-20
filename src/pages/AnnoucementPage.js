import React, { Component, useState, useEffect } from 'react';
import {NavLink, useParams } from 'react-router-dom';
import Header from '../layouts/Header';
import '../styles/AnnoucementPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

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

    const [imageUrl, setImageUrl] = useState('');
    const [imageGet, setImageGet] = useState('');

    useEffect(() =>{
        fetch(`https://animalsmap.herokuapp.com/getAnnoucement/${id}`)
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
        })
    }, [id])
    
    useEffect(() =>{
        fetch(`https://animalsmap.herokuapp.com/image/${id}`)
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
            </section>
        </>
    )
}

export default AnnoucementPage;