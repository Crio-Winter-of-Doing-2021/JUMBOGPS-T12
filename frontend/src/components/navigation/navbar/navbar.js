import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { withRouter } from "react-router-dom";

import PropTypes from 'prop-types';
import styles from './styles.module.css';

import {
    LogoutOutlined
  } from '@ant-design/icons';
  

import { fetchUserDetails } from '../../../api/apli-client';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }    

    componentDidMount() {               
        fetchUserDetails()
        .then(res => {             
                this.setState({
                    user: res.data
                });
            }
        )
        .catch(error => {
                console.log(error);
            }
        );
    }

    handleLogout = () => {

     
        this.props.history.push('/login')
        localStorage.removeItem('token');
        
    }

    render() {
        return (

            <header className={styles['header']}>
            <div className={styles['left-container']}>
        
              <div className={styles['text-big']}>Dashboard</div>
              {this.props.heading && (
                <h1 className={`${styles['text-big']} ${styles['heading']}`}>
                  {this.props.heading}
                </h1>
              )}
            </div>

            <div className={styles['right-container']}>
            <LogoutOutlined onClick={this.handleLogout} style={{color:`white`, fontSize:'20px'}} />
        
        {this.props.heading && (
          <h1 className={`${styles['text-big']} ${styles['heading']}`}>
            
          </h1>
          
        )}
      </div>
      
          </header>
            // <nav className="navbar navbar-expand navbar-light fixed-top">
            //     <div className="container">
            //     <Link className="navbar-brand" to={"/"}>Home</Link>
            //     <div className="collapse navbar-collapse">
            //         <ul className="navbar-nav ml-auto">
            //         {
            //             !this.state.user &&
            //             <li className="nav-item">
            //             <Link className="nav-link" to={"/login"}>Login</Link>
            //             </li>
            //         }
            //         <li className="nav-item">
            //             <Link className="nav-link" to={"/register"}>Signup</Link>
            //         </li>
            //         <li className="nav-item">
            //             <Link className="nav-link" to={"/portal"}>Asset Tracking Portal</Link>
            //         </li>
            //         {
            //             this.state.user && 
            //             <li className="nav-item">
            //             <Link className="nav-link" to={"/"}>{this.state.user.name}</Link>
            //             </li>                         
            //         }
            //         {
            //             this.state.user && 
            //             <li className="nav-item">
            //             <Link className="nav-link" onClick={this.handleLogout}>Logout</Link>
            //             </li>                         
            //         }
            //         </ul>
            //     </div>
            //     </div>
            // </nav>
        );
    }
}
Navigation.propTypes = {
    heading: PropTypes.string,
  };
export default withRouter(Navigation);