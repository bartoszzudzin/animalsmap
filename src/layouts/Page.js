import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import WelcomePage from '../pages/WelcomePage';
import MapPage from '../pages/MapPage';
import ErrorPage from '../pages/ErrorPage';
import AnnoucementPage from '../pages/AnnoucementPage';
import SearchPage from '../pages/SearchPage';
import AboutPage from '../pages/AboutPage';
import SignupPage from '../pages/SignupPage';
import UserAnn from '../pages/UserAnn';
import DeletePage from '../pages/DeletePage';
import EditAnn from '../pages/EditAnn';
import AccountSettings from '../pages/AccountSettings';
import MessagesPage from '../pages/MessagesPage';
import Conversation from '../pages/Conversation';

const Page = () =>{
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/annoucement/:id" element={<AnnoucementPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/my-announcements" element={<UserAnn />} />
            <Route path="/delete-announcement/:id" element={<DeletePage />} />
            <Route path="/edit-announcement/:id" element={<EditAnn />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/MyMessages" element={<MessagesPage />} />
            <Route path="/conversation/:to" element={<Conversation />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
    )
}

export default Page;