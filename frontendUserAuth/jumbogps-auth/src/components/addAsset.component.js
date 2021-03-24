import React, { Component } from "react";

import { fetchUserDetails } from '../api/users.api';
import './portal.component.css';

class AddAsset extends Component {

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
    };

    render() {
        if (this.state.user) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <h3>Add New Asset</h3>

                    <div className="form-group">
                        <label>Asset ID:</label>
                        <input type="text" className="form-control" placeholder="Asset ID..." 
                        onChange={event => this.id = event.target.value}/>                    
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" className="form-control" placeholder="Asset Name..." 
                        onChange={event => this.name = event.target.value}/>                    
                    </div>
                    <div className="form-group">
                        <label>Asset Type:</label>
                        <input type="text" className="form-control" placeholder="Asset Type..."
                        onChange={event => this.type = event.target.value}/>                    
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className="form-control" placeholder="User password..."
                        onChange={event => this.password = event.target.value}/>                    
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input type="password" className="form-control" placeholder="Confirm password..."
                        onChange={event => this.confirmPassword = event.target.value}/>                    
                    </div>

                    <button className="btn btn-primary btn-block">Add Asset</button>
                </form>
            );
        } else {
            return (
                <h2>You are not logged in</h2>
            );
        }        
    }
}

export default AddAsset;