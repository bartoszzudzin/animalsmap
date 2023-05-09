import React, {useEffect, useState} from 'react';
import Header from '../layouts/Header';
import LoginFirstInfoPage from './LoginFirstInfoPage';
import Loading from '../components/Loading';
import Result from './Result';

import '../styles/UserAnn.css';

import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

const UserAnn = () =>{

    const [isLogged, setIsLogged] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const [anns, setAnns] = useState([]);

    useEffect(() => {
        checkSession();    
    }, []);

    useEffect(() =>{
        handleSearch();
    }, [loaded])

    setTimeout(function() {
        setLoaded(true);
    }, 1000);

    const handleSearch = () =>{
        fetch(`/userAnnouncement/${userEmail}`)
            .then(response => response.json())
            .then(data =>{
                    setAnns(data.map(ann => (
                        <>
                            <Result 
                                key={ann.id}
                                id={ann.id}
                                city={ann.city}
                                street={ann.street}
                                status={ann.status}
                                name={ann.name}
                                race={ann.race}
                                info={ann.info}
                                character={ann.character}
                            />
                            <NavLink to={`/edit-announcement/${ann.id}`} className='ctrl-btn'>Edytuj</NavLink>
                            <NavLink to={`/delete-announcement/${ann.id}`} className='ctrl-btn'>Usuń</NavLink>
                        </>
                    )))
                }
            )
        
    }

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
        .then(data => {
            setUserEmail(data ? data.email : null);
        })
        .catch(error => {
            console.error(error);
            setUserEmail(null);
        });
    };

    return(
        <>
        {loaded ? null : <Loading />}
        {isLogged ? 
            <>
                <Header />
                <NavLink to="/map" className="exit">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </NavLink>
                <div className='userAnnPage'>
                    <p className='page-title'>Twoje <strong>pinezki</strong>:</p>
                </div>
                {anns}
            </>
        : <LoginFirstInfoPage />}
        </>
    )
}

export default UserAnn;