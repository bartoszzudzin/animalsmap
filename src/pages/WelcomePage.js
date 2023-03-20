import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/WelcomePage.css';
import cat1 from '../images/cat1.png';
import dog1 from '../images/dog1.png';

const WelcomePage = () =>{
    return(
            <div className='welcomePage'>
                <p>Witaj na <br /><strong>Animals</strong>MAP</p>

                <div className='welcomeMsg1'>
                    <img src={cat1} alt="kot"/>
                    <p>Miło Cię widzieć!</p>
                </div>

                <div className='welcomeMsg2'>
                    <p>Cieszymy się,<br />że jesteś z nami!</p>
                    <img src={dog1} alt="pies"/>
                </div>
                <div className='navigation'>
                    <NavLink to="/map">Przejdź do mapy</NavLink>
                </div>
            </div>
    );
}

export default WelcomePage;