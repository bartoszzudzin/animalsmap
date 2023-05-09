import React, {useState, useEffect, useRef} from 'react';
import Header from '../layouts/Header';
import LoginFirstInfoPage from './LoginFirstInfoPage';

import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

const AccountSettings = () =>{

    const [isLogged, setIsLogged] = useState(false);
    const [nickname, setNickname] = useState(null);
    const [newName, setNewName] = useState('');
    const [newPass, setNewPass] = useState('');
    const [rep_newPass, setRep_newPass] = useState('');
    const [err, setErr] = useState('');
    const [succes, setSucces] = useState('');

    const [imageGet, setImageGet] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const fileRefAvatar = useRef();

    useEffect(() => {
        checkSession();    
    }, []);

    setTimeout(function() {
        setErr('');
        setSucces('')
    }, 5000);

    useEffect(() =>{
        if(isLogged){
        fetch(`/avatar/${nickname}`)
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
    }, [nickname])

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
            setNickname(data ? data.nickname : null);
        })
        .catch(error => {
            console.error(error);
            setNickname(null);
        });
    };

    const handleChangeName = (e) =>{
        setNewName(e.target.value);
    }

    const handlePass = (e) =>{
        setNewPass(e.target.value);
    }

    const handleRepPass = (e) =>{
        setRep_newPass(e.target.value);
    }
    
    const updatePass = () =>{
        if(newPass === '' || rep_newPass === ''){
            setErr('Hasło nie może być puste')
        }else if(newPass !== rep_newPass){
            setErr('Wprowadzone hasła różnią się')
        }else{

            const dane = {
                password: newPass,
            }

            const request = new Request('/update-password',{
                method: 'POST',
                body: JSON.stringify(dane),
                headers: new Headers({'Content-Type' : 'application/json'})
            });

            fetch(request)
                .then(response => {
                    if(response.ok){
                        console.log("Zaktualizowano hasło");
                    }
                })
                .catch(err => console.log(err));

            setNewPass('');
            setRep_newPass('');
            setSucces('Pomyślnie zmieniono hasło.');
        }
    }

    const updateAvatar = () =>{
        if(isLogged){
            const file = fileRefAvatar.current.files[0];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onloadend = () =>{
                const avatar = fileReader.result;
                const dane = {
                    avatar: avatar,
                }

                const request = new Request('/update-avatar', {
                    method: 'POST',
                    body: JSON.stringify(dane),
                    headers: new Headers({'Content-Type' : 'application/json'}),
                })

                fetch(request)
                    .then(response =>{
                        if(response.ok){
                            window.location.reload();
                        }
                    })
                    .catch(err => console.log(err));
            }
        }

    }

    return(
        <>
            {isLogged ? 
            <>
            <Header />
                <NavLink to="/map" className="exit">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                </NavLink>
                <div className='userAnnPage'>
                    <p className='page-title'>Ustawienia <strong>konta</strong>:</p>
                    <p className='resultMsgNegative'>{err}</p>
                    <p className='resultMsgPositive'>{succes}</p>

                    <img src={imageUrl} className='avatar' alt="avatar"/>

                    <label className='editAvatar'>Edytuj zdjęcie:<br />
                    <input className='editAvatar' type="file" name="image" ref={fileRefAvatar} accept="image/jpeg" size="50048576"/>
                    </label>
                    <button className='save-btn' onClick={updateAvatar}>Zapisz</button>

                    <p className='user-email'>{nickname}</p>

                    <p className='center'>Zmiana hasła:</p>
                    <input className='user-input' type="password" placeholder='nowe hasło' value={newPass} onChange={handlePass}/><br />
                    <input className='user-input' type="password" placeholder='powtórz nowe hasło' value={rep_newPass} onChange={handleRepPass}/><br />
                    <button className='save-btn' onClick={updatePass}>Zapisz</button>
                </div>
            </>
            :
            <LoginFirstInfoPage />}
        </>
    )
}

export default AccountSettings;