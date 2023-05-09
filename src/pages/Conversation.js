import React, {Component, useState, useEffect} from 'react';
import Header from '../layouts/Header';
import LoginFirstInfoPage from './LoginFirstInfoPage';
import { NavLink, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import '../styles/Conversation.css'

const Conversation = () =>{

    const {to} = useParams();
    const [from, setFrom] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const [isLogged, setIsLogged] = useState(false);
    const [messagesList, setMessagesList] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [addToFriend, setAddToFriend] = useState(false);
    const [areFriends, setAreFriends] = useState(false);

    const [scroll, setScroll] = useState(false);
    const [checkMsg, setCheckMsg] = useState(true);

    const [av_from, setAv_from] = useState(null);
    const [av_to, setAv_to] = useState(null);

    useEffect(() =>{
        if(scroll===true){
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [scroll])

    useEffect(() => {
        checkSession();
        //Pobierz avatar użytkonika nr 1
        if(loaded){
        fetch(`/avatar/${from}`)
                .then(response => {
                    return response.blob();
                })
                .catch(err => console.log(err))
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setAv_from(url);
                })
                .catch(err => console.log(err));

        //Pobierz avatar użytkonika nr 2
        fetch(`/avatar/${to}`)
                .then(response => {
                    return response.blob();
                })
                .catch(err => console.log(err))
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setAv_to(url);
                })
                .catch(err => console.log(err));
        }

    }, [loaded]);

    useEffect(() =>{
        if(areFriends===false){
            addFriend();
        }
    }, [addToFriend])

    useEffect(() =>{
        readMessages();
        console.log("test");
    },[checkMsg])

    useEffect(() =>{
        checkIfAlreadyFriend();
    }, [])

    const scrollDown = () =>{
        window.scrollTo(0, document.body.scrollHeight);
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
            setFrom(data ? data.nickname : null);
            setEmail(data ? data.email : null);
            if(data){
                readMessages();
            }
            setLoaded(true);
        })
        .catch(error => {
            console.error(error);
            setFrom(null);
            setEmail(null);
        });
    };
    
    const readMessages = () =>{
        
        if(from !== '' && isLogged && checkMsg){
            fetch(`/check-messages/${from}/${to}`)
                .then(response => response.json())
                .then(data => {
                    const arr = [];
                        for(let key in data){
                            arr.push({
                                from: data[key].from,
                                message: data[key].message,
                                date: data[key].date,
                            });
                        }
                    setMessagesList(arr);
                    setScroll(true);
                })
                .catch(err => console.log(err))
                setScroll(false);
                setCheckMsg(false);
        }
    }

    const handleMessage = (e) =>{
        if(isLogged){
            setMessage(e.target.value);
        }
    }

    const sendMessage = (e) =>{
        if(isLogged){
            e.preventDefault();
            const date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            if(month<=9){
                month = "0"+month;
            }
            if(day<=9){
                day = "0"+day;
            }
            if(hours<=9){
                hours = "0"+hours;
            }
            if(minutes<=9){
                minutes = "0"+minutes;
            }
            const now = day+"."+month+"."+date.getFullYear()+" ("+hours+":"+minutes+")";
            console.log(now);
            if(message !== ''){

                const dane = {
                    from: from,
                    to: to,
                    message: message,
                    date: now
                };

                const request = new Request('/send-message', {
                    method: 'POST',
                    body: JSON.stringify(dane),
                    headers: new Headers({ 'Content-Type' : 'application/json'}),
                })

                fetch(request)
                    .catch(error => console.log("Error =>",error));

                setMessage('');
                setScroll(true);
                setAddToFriend(true);
                setCheckMsg(true);

            }
        }
    }

    const checkIfAlreadyFriend = () =>{
        if(isLogged){
        fetch(`/check-if-friends/${to}`)
            .then(response => response.json())
            .then(data => {
                setAreFriends(data);
            })
            .catch(err => console.error(err));
        }
    }

    const addFriend = () =>{
        if(isLogged){
            if(areFriends===false){
                const dane = {
                    to: to,
                }
                const request = new Request('/add-friend', {
                    method: 'POST',
                    body: JSON.stringify(dane),
                    headers: new Headers({ 'Content-Type' : 'application/json'}),
                })
                fetch(request)
                    .catch(err => console.log(err))
            }
        }
    }

    const Message = (props) =>{
        return(
            <>
            {props.checkif ? 
            <div className='clearfix'>
            <p className='date'>{props.date}</p>
            <div className='message-cont'>
                <div className='message-right'>
                <i className='from'>{props.from} :</i>
                    <p>{props.message}</p>
                </div>
                <img className='avatar-right' src={av_from} alt="avatar" />
            </div><br />
            </div>
            :
            <div className='clearfix'>
            <p className='date'>{props.date}</p>
            <div className='message-cont'>
                <img className='avatar-left' src={av_to} alt="avatar" />
                <div className='message-left'>
                <i className='from'>{props.from} :</i>
                    <p>{props.message}</p>
                </div>
            </div><br />
            </div>
            }
            </>
        )
    }

    function generateRandomString(n) {
        return Math.random().toString(36).substring(2, 2 + n);
    }

    const messages = messagesList.map(msg => (
        <Message
            key={generateRandomString(6)}
            from={msg.from}
            to={msg.to}
            message={msg.message}
            date={msg.date}
            seen={msg.seen}
            checkif={msg.from === from ? true : false}
        />
    ))

    return(
        <>
        {isLogged ? 
        <>
                <NavLink to="/map" className="exit-chat">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </NavLink>
                <div className='conversation-page'>
                    <p className='page-title-fixed'>Czat z <strong>{to}</strong>:</p>
                    <div className='conversation clearfix'>{messages}</div>
                    <div className='bottom'>
                    </div>
                    <div className='send-message-form'>
                        <form>
                            <textarea placeholder='Wiadomość...' value={message} onChange={handleMessage}/>
                            <button onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /></button>
                        </form>
                    </div>
                </div>
        </>
        : <LoginFirstInfoPage /> }
        </>
    )
}

export default Conversation;