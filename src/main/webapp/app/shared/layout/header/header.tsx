import './header.scss';

import React, {useState} from 'react';

import LoadingBar from 'react-redux-loading-bar';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div id="app-header">
      <LoadingBar className="loading-bar"/>
      {/* <Navbar dark expand="sm" fixed="top" className="jh-navbar">
        <NavbarToggler aria-label="Menu" onClick={toggleMenu}/>
        <Brand/>
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ml-auto" navbar>
            {props.isAuthenticated && <EntitiesMenu/>}
          </Nav>
        </Collapse>
      </Navbar> */}
    </div>
  );
};

export default Header;
