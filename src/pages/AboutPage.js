import React from 'react';
import { NavLink } from 'react-router-dom';
import found_ico from '../images/found_pet.png';
import '../styles/AboutPage.css';

const AboutPage = () =>{
    return(
        <div className='welcomePage'>
                <p>Czym jest<br /><strong>Animals</strong>MAP ?</p>

                <div className='aboutMsg'>
                    <p>Inicjatywa <strong>AnimalsMap</strong> jest prosta.
                    Aplikacja ma na celu ułatwić znalezienie zwierzakom swoich właścicieli. Poprzez dodawanie odpowiednich pinezek do mapy, możesz dodawać ogłoszenie o zwierzakach które się błąkają w twojej okolicy lub pinezkę "zagubiony", jeżeli twój pupil zagubił się gdzieś w okolicy.</p>
                    <img src={found_ico} alt="background" className='backgroundImage' />
                </div>
                <div className='navigation'>
                    <NavLink to="/map">Przejdź do mapy</NavLink>
                </div>
            </div>
    )
}

export default AboutPage;