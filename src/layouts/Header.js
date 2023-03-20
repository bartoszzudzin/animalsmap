import React from 'react';
import dog3 from '../images/dog3.png';
import { NavLink } from 'react-router-dom';

const Header = () =>{
    return(
        <header className='mapHeader'>
            <NavLink to="/map"><strong>Animals</strong>Map</NavLink>
            <img src={dog3} alt="dog3" />
        </header>
    )
}

export default Header;