import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import { fetchUserDetails } from '../api/users.api';

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }    

    componentDidMount() {               
        fetchUserDetails()
        .then(res => {
                console.log(res);                
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
        localStorage.removeItem('token');
        window.location.replace('http://localhost:3000/');
    }

    render() {
        return (
            <nav className="navbar navbar-expand navbar-light fixed-top">
                <div className="container">
                <Link className="navbar-brand" to={"/"}>Home</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                    {
                        !this.state.user &&
                        <li className="nav-item">
                        <Link className="nav-link" to={"/login"}>Login</Link>
                        </li>
                    }
                    <li className="nav-item">
                        <Link className="nav-link" to={"/register"}>Signup</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/portal"}>Asset Tracking Portal</Link>
                    </li>
                    {
                        this.state.user && 
                        <li className="nav-item">
                        <Link className="nav-link" to={"/"}>{this.state.user.name}</Link>
                        </li>                         
                    }
                    {
                        this.state.user && 
                        <li className="nav-item">
                        <Link className="nav-link" onClick={this.handleLogout}>Logout</Link>
                        </li>                         
                    }
                    </ul>
                </div>
                </div>
            </nav>
        );
    }
}

export default Navigation;