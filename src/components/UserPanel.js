import React from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const UserPanel = (props) =>{
    return(
        <>
            <div className='dark-window'>
            </div>
            <div className='center'>
                <div className='userPrompt'>
                    {props.isLogged ? <p>Witaj {props.userName}!</p> : <p>Panel logowania</p>}
                    <button className='closeWindow' onClick={props.closeFunction}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    {props.isLogged ? 
                        <div className='userPanel'>
                            <NavLink to="/my-announcements">
                                <FontAwesomeIcon icon={faBullhorn} /><br />
                                Twoje ogłoszenia
                            </NavLink>
                            <NavLink to="/account-settings">
                                <FontAwesomeIcon icon={faGear} /><br />
                                Ustawienia konta
                            </NavLink>
                            <NavLink to="/MyMessages">
                                <FontAwesomeIcon icon={faComments} /><br />
                                Wiadomości
                            </NavLink>
                            <button onClick={props.logOutFunction}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} /><br />
                                Wyloguj
                            </button>
                        </div>
                        :
                    <form onSubmit={props.logInFunction}>
                        <p className='err'>{props.error}</p>
                        <label><FontAwesomeIcon icon={faEnvelope} />
                        <input type="email" placeholder='e-mail' onChange={props.handleEmail}></input>
                        </label>
                        <label><FontAwesomeIcon icon={faLock} />
                        <input type="password" placeholder='hasło' onChange={props.handlePass}/>
                        </label>
                        <button>Zaloguj</button>
                        <NavLink to="/signup">Nie mam jeszcze konta</NavLink>
                    </form>
                    }
                </div>
            </div>
        </>
    )
}

export default UserPanel;