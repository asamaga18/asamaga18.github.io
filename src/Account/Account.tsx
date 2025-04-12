
// import React from "react";
import { useState, useEffect } from "react";
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import './Account.css';
import './Account';

const Account = () => {
    const [location, setLocation] = useState(() => {
        const storedLocation = localStorage.getItem('location');
        return storedLocation ? JSON.parse(storedLocation) : [];
    });
    const [produce, setProduce] = useState(() => {
        const storedLocation = localStorage.getItem('produce');
        return storedLocation ? JSON.parse(storedLocation) : [];
    });
    const [season, setSeason] = useState(() => {
        const storedLocation = localStorage.getItem('season');
        return storedLocation ? JSON.parse(storedLocation) : [];
    });
    const [negotiate, setNegotiation] = useState(() => {
        const storedLocation = localStorage.getItem('negotiate');
        return storedLocation ? JSON.parse(storedLocation) : [];
    });
    const [travel, setTravel] = useState(() => {
        const storedLocation = localStorage.getItem('travel');
        return storedLocation ? JSON.parse(storedLocation) : [];
    });
    const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications') || 'all');
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'english');
    const [privacy, setPrivacy] = useState(() => localStorage.getItem('privacy') || 'public');

    const locations = [
        { value: 'Washington, DC', label: 'Washington, DC' },
        { value: 'Fairfax, VA', label: 'Fairfax, VA' },
        { value: 'Frederick, MD', label: 'Frederick, MD' },
        { value: 'Rockville, MD', label: 'Rockville, MD' },
        { value: 'Columbia, MD', label: 'Columbia, MD' },
        { value: 'College Park, MD', label: 'College Park, MD' }
    ];

    const produces = [
        { value: 'Tomatoes', label: 'Tomatoes' },
        { value: 'Peppers', label: 'Peppers' },
        { value: 'Lettuce', label: 'Lettuce' },
        { value: 'Celery', label: 'Celery' },
        { value: 'Spinach', label: 'Spinach' },
        { value: 'Broccoli', label: 'Broccoli' },
        { value: 'Cauliflower', label: 'Cauliflower' },
        { value: 'Strawberries', label: 'Strawberries' },
        { value: 'Blueberries', label: 'Blueberries' },
        { value: 'Parsley', label: 'Parsley' },
        { value: 'Squash', label: 'Squash' },
        { value: 'Pumpkin', label: 'Pumpkin' }
    ];

    const seasons = [
        { value: 'fall', label: 'fall' },
        { value: 'summer', label: 'summer' },
        { value: 'winter', label: 'winter' },
        { value: 'spring', label: 'spring' }
    ];

    const negotiates = [
        { value: 'yes', label: 'yes' },
        { value: 'no', label: 'no' },
        { value: 'sometimes', label: 'sometimes' }
    ];

    const travels = [
        { value: 'yes', label: 'yes' },
        { value: 'no', label: 'no' },
        { value: 'sometimes', label: 'sometimes' }
    ];

    useEffect(() => {
        localStorage.setItem('location', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('produce', JSON.stringify(produce));
    }, [produce]);

    useEffect(() => {
        localStorage.setItem('season', JSON.stringify(season));
    }, [season]);

    useEffect(() => {
        localStorage.setItem('negotiate', JSON.stringify(negotiate));
    }, [negotiate]);

    useEffect(() => {
        localStorage.setItem('travel', JSON.stringify(travel));
    }, [travel]);

    useEffect(() => {
        localStorage.setItem('notifications', notifications);
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('privacy', privacy);
    }, [privacy]);

    return (
        <div className="account-page">
            <Sidebar />
            <div className="merged-container">
                <div className="header-container">Account Settings</div>
                <div className="section1">
                    <form>
                        <div className="form-group">
                            <label id ="labelName" htmlFor="location">Location:</label>
                            <Select
                                id="location"
                                isMulti
                                options={locations}
                                value={location}
                                onChange={setLocation}
                            />
                        </div>
                        <div className="form-group">
                            <label id ="labelName" htmlFor="produce">Produce:</label>
                            <Select
                                id="produce"
                                isMulti
                                options={produces}
                                value={produce}
                                onChange={setProduce}
                            />
                        </div>
                        <div className="form-group">
                            <label id ="labelName" htmlFor="season">Harvesting Season:</label>
                            <Select
                                id="season"
                                isMulti
                                options={seasons}
                                value={season}
                                onChange={setSeason}
                            />
                        </div>
                        <div className="form-group">
                            <label id ="labelName" htmlFor="negotiate">Willing to Negotiate Pricing:</label>
                            <Select
                                id="negotiate"
                                isMulti
                                options={negotiates}
                                value={negotiate}
                                onChange={setNegotiation}
                            />
                        </div>
                        <div className="form-group">
                            <label id ="labelName" htmlFor="travel">Willing to Travel for Delivery:</label>
                            <Select
                                id="travel"
                                isMulti
                                options={travels}
                                value={travel}
                                onChange={setTravel}
                            />
                        </div>
                    </form>
                </div>
                <div className="dotted-line"></div>
                <div className="section2">
                    <div className="display-container">
                        <h3>Display:</h3>
                    </div>
                    <form>
                        <div className="form-group">
                            <label id="labelName" htmlFor="notifications">Notifications:</label>
                            <select
                                id="notifications"
                                value={notifications}
                                onChange={(e) => setNotifications(e.target.value)}
                            >
                                <option value="all">All Notifications</option>
                                <option value="email">Email Only</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label id="labelName" htmlFor="language">Language:</label>
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="german">German</option>
                                <option value="mandarin">Mandarin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label id="labelName" htmlFor="privacy">Privacy Settings:</label>
                            <select
                                id="privacy"
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button id="logOutButton">Log Out</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;
