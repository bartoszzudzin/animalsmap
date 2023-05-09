import React, {useEffect, useState} from 'react';
import '../styles/SearchPage.css';
import { NavLink } from 'react-router-dom';


const Result = (props) =>{

    const [imageUrl, setImageUrl] = useState('');

    useEffect(() =>{
        fetch(`https://animalsmap.herokuapp.com/image/${props.id}`)
            .then(response => {
                return response.blob();
            })
            .catch(err => console.log(err))
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setImageUrl(url)
            })
            .catch(err => console.log(err))
    })

    return (
        <div key={props.id} className='annContent'>
            <div className='annSmall'>
                <img src={imageUrl} alt='thumbnail'/>
                    <div>
                        <div className='ann-hashtags'>
                            <p>{props.city}</p>
                            <p>{props.street}</p>
                        </div>
                        <div className='ann-hashtags'>
                            {props.status === "lost" ? <p>{props.name}</p> : null}
                            <p>{props.race}</p>
                        </div>
                            {props.status === "found" ? 
                                <p className='statusFound'>Znaleziony</p> 
                                : 
                                <p className='statusLost'>Zagubiony</p>}
                    </div>
            </div>
            <div className='annInfo'>
                <p>{props.info}</p>
                    <i>{props.character}</i>
            </div>
            <NavLink to={{
                            pathname: `/annoucement/${props.id}`,
                                state: {
                                id: props.id
                            }
                        }} 
                        className='annHyperlink'>Więcej</NavLink>
        </div>
    )
}

export default Result;