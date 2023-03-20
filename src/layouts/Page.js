import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import WelcomePage from '../pages/WelcomePage';
import MapPage from '../pages/MapPage';
import ErrorPage from '../pages/ErrorPage';
import AnnoucementPage from '../pages/AnnoucementPage';
import SearchPage from '../pages/SearchPage';
import AboutPage from '../pages/AboutPage';

const Page = () =>{
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/annoucement/:id" element={<AnnoucementPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
    )
}

export default Page;