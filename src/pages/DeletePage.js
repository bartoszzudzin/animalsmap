import React, {useState, useEffect} from 'react';
import Header from '../layouts/Header';
import { NavLink, useParams } from 'react-router-dom';
import LoginFirstInfoPage from './LoginFirstInfoPage';
import Loading from '../components/Loading';

import '../styles/DeletePage.css';

const DeletePage = () =>{

    const {id} = useParams();
    const [isLogged, setIsLogged] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        checkSession();
    }, []);

    setTimeout(function() {
        setLoaded(true);
    }, 500);

    const handleDelete = () =>{
        fetch(`/delete-marker/${id}`, {
            method: 'DELETE'
        })
        .catch(err => console.log(err));
        window.location.href = '/my-announcements';
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
            <div className='delete-page'>
                <p>Czy na pewno chcesz usunąć tę pinezkę ?</p>
                <div>
                    <button onClick={handleDelete}>Tak</button>
                    <NavLink to="/my-announcements">Nie</NavLink>
                </div>
            </div>
            </>
            : <LoginFirstInfoPage /> }
        </>
    )
}

export default DeletePage;