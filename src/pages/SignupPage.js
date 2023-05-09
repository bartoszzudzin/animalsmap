import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../layouts/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import def_av from '../images/avatar.png';

import cat from '../images/cat1.png';

import '../styles/SignupPage.css';

const SignupPage = () =>{
    const [email_st, set_email_st] = useState(null);
    const [email_nd, set_email_nd] = useState(null);
    const [name, set_name] = useState(null);
    const [pass, set_pass] = useState(null);
    const [pass_nd, set_pass_nd] = useState(null);
    const [error, setError] = useState(null);

    const handleEmailSt = (e) =>{
        set_email_st(e.target.value);
    }
    const handleEmailNd = (e) =>{
        set_email_nd(e.target.value);
    }
    const handleName= (e) =>{
        set_name(e.target.value);
    }
    const handlePass= (e) =>{
        set_pass(e.target.value);
    }
    const handlePassNd= (e) =>{
        set_pass_nd(e.target.value);
    }
    const signUp = (e) =>{
        e.preventDefault();
        const id = Math.floor(Math.random() * 999999);
        if(email_st !== email_nd){
            setError('Podane adresy e-mail różnią się od siebie.')
            return;
        }
        else if(pass !== pass_nd){
            setError('Podane hasła różnią się od siebie')
            return;
        }else{

            const fileReader = new FileReader();
            
            fetch(def_av)
            .then(res => res.blob())
            .then(blob => {
                fileReader.readAsDataURL(blob);
            });
            
            fileReader.onloadend = () =>{
                const userAvatar = fileReader.result;
                const user = {
                    id,
                    email: email_st,
                    nickname: name,
                    password: pass,
                    avatar: userAvatar

                }
                const request = new Request('/adduser', {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: new Headers({ 'Content-Type' : 'application/json'}),
                });

                fetch(request)
                    .then(response => {
                        if(response.ok){
                            window.location.href = '/map';
                        }else if(response.status === 400){
                            response.json().then(data => {
                                setError(data.message);
                            })
                        }})
                    .catch(error => console.log("Error =>",error));

            }
        }
    }
    
    return(
        <>
        <Header />
        <div className='signup-page'>
            <NavLink to="/map" className="exit">
                <FontAwesomeIcon icon={faArrowLeftLong} />
            </NavLink>
            <p className='page-title'>Rejestracja</p>
            {error ? <p className='error'>{error}</p> : null}
            <form className='sign-up-form' onSubmit={signUp}>
                <label>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input type="email" placeholder='e-mail' onChange={handleEmailSt} required></input>
                </label>
                <label>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input type="email" placeholder='powtórz e-mail' onChange={handleEmailNd} required></input>
                </label>
                <label>
                    <FontAwesomeIcon icon={faUser} />
                    <input type="text" placeholder='Nazwa użytkownika' onChange={handleName} required></input>
                </label>
                <label>
                    <FontAwesomeIcon icon={faLock} />
                    <input type="password" placeholder='hasło' onChange={handlePass} required/>
                </label>
                <label>
                    <FontAwesomeIcon icon={faLock} />
                    <input type="password" placeholder='powtórz hasło' onChange={handlePassNd} required/>
                </label>
                <button>Zarejestruj</button>
            </form>
            <img className="cat-bg" src={cat} />
        </div>
        </>
    )
}

export default SignupPage;