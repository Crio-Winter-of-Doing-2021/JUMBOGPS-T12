import React, { Component } from "react";

import { fetchUserDetails } from '../../api/apli-client';
import './portal.component.css';

class Portal extends Component {

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

    handleSubmit = (event) => {
        event.preventDefault();
        const action = event.target.innerText;
        if (action === 'Add New Asset') {
            window.location.replace('http://localhost:3000/add-asset');
        }
    };

    render() {        
        if (this.state.user) {
            return (
                <form>
                    <button type="submit" className="btn btn-block btn-custom" onClick={this.handleSubmit}>Add New Asset</button>
                    <button type="submit" className="btn btn-block btn-success" onClick={this.handleSubmit}>Track Assets</button>
                </form>
            );
        } else {
            return (
                <h2>You are not logged in</h2>
            );
        }        
    }
}

export default Portal;