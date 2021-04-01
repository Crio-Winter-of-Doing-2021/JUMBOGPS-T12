import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import {
  UnorderedListOutlined, LogoutOutlined
} from '@ant-design/icons';
import { message } from "antd";
import {connect} from 'react-redux'
import {compose} from 'redux'

import {config} from './config';

import styles from './styles.module.css';
function Sidebar(props) {

  const handleLogout = () => {

     
    props.history.push('/login')
    localStorage.removeItem('token');
    debugger;
    props.storeLoginUser(null);
    message.success('User logged out', 5);
    
}

  debugger;

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
              > <UnorderedListOutlined  style={{color:`white`, fontSize:'32px', 'margin-top':'50px'}}/> </NavLink> 
        
            </li>
          ))}
      </ul>
      {      props.username ?
          <LogoutOutlined onClick={handleLogout} style={{color:`white`, fontSize:'20px'}} className={styles['logout-icon']} />  :''}
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

function mapStateToProps(state) {
  return {
    username: state.username,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeLoginUser: (payload) => {
      dispatch({ type: "Store_USER_NAME", payload });
    },
  };
};



export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Sidebar);

// export default withRouter(Sidebar)