import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import {
  UnorderedListOutlined, LogoutOutlined
} from '@ant-design/icons';



import {config} from './config';

import styles from './styles.module.css';
var socket;
function Sidebar(props) {

  const handleLogout = () => {

     
    props.history.push('/login')
    localStorage.removeItem('token');
    
}



  return (
    <nav className={styles['nav']}>
      <ul className={styles['nav-list']}>
        {config
          .map(navItem => (
            <li key={`${navItem.name} ${navItem.route}`}>
              <NavLink
                to={navItem.route}
                img={navItem.img}
                activeImg={navItem.activeImg}             
              ><UnorderedListOutlined style={{color:`white`, fontSize:'32px'}}/> </NavLink>
        
            </li>
          ))}
      </ul>
          <LogoutOutlined onClick={handleLogout} style={{color:`white`, fontSize:'20px'}} className={styles['logout-icon']} />  
    </nav>
  );
}

function NavLink({to, img, activeImg, content, ...props}) {
  // const match = useRouteMatch({path: to});
  const match = '';
  return (
    <Link
      to={to}
      className={`${styles['nav-link']} ${
        match ? styles['nav-link-active'] : ''
      }`}
      {...props}
    >
      {props.children}
      <img src={match ? activeImg : img} alt="" />
      { <div className={styles['nav-link-content']}>{content}</div>}
    </Link>
  );
}



export default withRouter(Sidebar)