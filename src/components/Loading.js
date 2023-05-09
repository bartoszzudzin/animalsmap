import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import '../styles/index.css';

const Loading = () =>{
    return(
        <div className='Loader'>
            <FontAwesomeIcon icon={faSpinner} />
        </div>
    )
}

export default Loading;