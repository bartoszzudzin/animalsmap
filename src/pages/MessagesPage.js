import React, {useState, useEffect} from 'react';
import Header from '../layouts/Header';
import LoginFirstInfoPage from './LoginFirstInfoPage';

import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const MessagesPage = () =>{

    const [isLogged, setIsLogged] = useState(false);
    const [userName, setUserName] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        checkSession();
        checkFriends();
    }, [loaded]);
    

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
            setUserName(data ? data.nickname : null);
            setLoaded(true);
        })
        .catch(error => {
            console.error(error);
            setUserName(null);
        });
    };

    const checkFriends = () =>{
        if(userName !== ''){
        fetch(`/show-friends/${userName}`)
            .then(response => response.json())
            .then(data => {
                setFriendsList(data);
            })
            .catch(err => console.log(err));
        }
    }

    const Friend = (props) =>{

    const [avatar, setAvatar] = useState(null);

    fetch(`/avatar/${props.name}`)
                .then(response => {
                    return response.blob();
                })
                .catch(err => console.log(err))
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setAvatar(url);
                })
                .catch(err => console.log(err));

        return(
            <NavLink className='clear-hyperlink' to={`/conversation/${props.name}`}>
                <div className='friend'>
                    <img className='friend-avatar' src={avatar} alt="avatar" />
                    <p>{props.name}</p>
                </div>
            </NavLink>
        )
    }

    const allFriends = friendsList.map(key =>(
        <Friend
            key={key}
            name={key}
        />
    ))

    return(
        <>
            <Header />
                <NavLink to="/map" className="exit">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </NavLink>
                <div className='userAnnPage'>
                    <p className='page-title'>Twoje <strong>konwersacje</strong>:</p>
                    {allFriends}
                </div>
        </>
    )
}

export default MessagesPage;