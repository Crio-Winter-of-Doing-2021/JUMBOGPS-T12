import React, { Component } from "react";

import { fetchUserDetails } from '../api/users.api';

class Home extends Component {

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

    render() {                
        if (this.state.user) {
            return (
                <div>
                    <h2>Jumbotail GPS Team 12 Homepage</h2>
                    <h2>Members:</h2>
                    <h2>Tejeswar Reddy</h2>
                    <h2>Archisman Chakraborty</h2>
                </div>
            );
        } else {
            return (
                <h2>You are not logged in</h2>
            );
        }        
    }
}

export default Home;