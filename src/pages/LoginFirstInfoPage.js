import React from 'react';
import '../styles/ErrorPage.css';
import dog2 from '../images/dog2.png';
import { NavLink } from 'react-router-dom';

const ErrorPage = () =>{
    return(
        <div className='errorPage'>
            <p>Musisz być najpierw zalogowany, aby odwiedzić tę stronę</p>
            <img src={dog2} alt="dog-sleep"/>
            <NavLink to="/map">Powrót do mapy</NavLink>
        </div>
    )
}

export default ErrorPage;