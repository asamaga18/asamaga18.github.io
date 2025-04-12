import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from 'reportWebVitals';

import Messaging from './Messaging/Messaging';
import Account from './Account/Account';
import Browse from './Browse/Browse';

// import BrowseGroupsIcon from './Browse Groups.png';
// import HomeIcon from './Home.png';
// import AccountIcon from './Account.png';

function Sidebar() {
  // const [open, setOpen] = useState(true);
  //If you have any unread messages, they show up in here? In that case, we'd append those chats here.
  const Menus = [
    { title: 'Account', path: '/account', src: Account, gap: true },
    { title: 'Messaging', path: '/messaging', src: Messaging},
    { title: 'Browse', path: '/browse', src: Browse },
  ];
  // <img src={"/the folder/${Menu.title}.file format of the image"} />
  // name image file accordingly
  return (
    <ul className="Sidebar">
      {Menus.map((Menu, index) => (
        <React.Fragment key={index}>
          <NavLink to={Menu.path} id="link">
            <li className="Sidebar">
              <img src={Menu.src} width="40px" className="sidebar-icons" />
              <span id="link-text">&nbsp;&nbsp;{Menu.title}</span>
            </li>
          </NavLink>
          {Menu.gap ? <p style={{ marginBottom: '30px' }} /> : null}
        </React.Fragment>
      ))}
    </ul>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="container">
        <div className="column" id="left-column"><Sidebar /></div>
        <div className="column" id="right-column">
          <Routes>
            <Route path="/" element={<Messaging />} />
            <Route path="/account" element={<Account />} />
            <Route path="/browse-groups" element={<Browse />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();