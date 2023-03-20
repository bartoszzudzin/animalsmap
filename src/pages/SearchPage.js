import React, { useState } from 'react';
import Header from '../layouts/Header';
import '../styles/SearchPage.css';
import cat from '../images/cat1.png';
import Result from './Result';

import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
const SearchPage = () =>{

    const [phrase, setPhrase] = useState('');
    const [isNegative, setIsNegative] = useState(false);
    const [showCat, setShowCat] = useState(true);
    const [message, setMessage] = useState('');
    const [anns, setAnns] = useState([]);

    const handlePhrase = (e) =>{
        setPhrase(e.target.value);
    }
    
    const handleSearch = () =>{
        fetch(`https://animalsmap.herokuapp.com/search/${phrase}`)
            .then(response => response.json())
            .then(data =>{
                if(data.length<1){
                    setMessage('Brak wyników wyszukiwania');
                    setIsNegative(true);
                }else{
                    setMessage(`Liczba pasujących ogłoszeń: ${data.length}`);
                    setIsNegative(false);
                    setShowCat(false);
                    setAnns(data.map(ann => (
                        <Result 
                            key={ann.id}
                            id={ann.id}
                            city={ann.city}
                            street={ann.street}
                            status={ann.status}
                            name={ann.name}
                            race={ann.race}
                            info={ann.info}
                            character={ann.character}
                        />
                    )))
                }
            })
    }

    // console.log(images);
    return(
        <>
            <Header />
            <NavLink to="/map" className="exit">
                <FontAwesomeIcon icon={faArrowLeftLong} />
            </NavLink>
            <section className="searchPage">
                <p className='title'>Szukaj ogłoszenia po frazie:<br />
                <i>(np. Czarny kundelek, Bydgoszcz)</i></p>
                {isNegative ? <p className='resultMsgNegative'>{message}</p> : <p className='resultMsgPositive'>{message}</p> }
                <input type="text" value={phrase} onChange={handlePhrase} placeholder='szukana fraza...' /><br />
                <button onClick={handleSearch}>Szukaj</button><br />
                {showCat ? 
                    <img src={cat} alt="cat" /> 
                    : 
                    <div className='anns'>
                        {anns}   
                    </div>}
            </section>
        </>
    )
}

export default SearchPage;