import React, { Component } from "react";

import { registerUser } from '../api/users.api';

class Register extends Component {
    handleSubmit = (event) => {
        event.preventDefault();

        if (this.password !== this.confirmPassword) {
            alert("Passwords do not match!");
        } else if (this.type !== 'Tracker' && this.type !== 'Admin'){
            alert("Invalid User type!");
        } else {
            const userData = {
                id: this.id,
                name: this.name,
                type: this.type,
                password: this.password,
            };
            console.log(userData);

            registerUser(userData)
            .then(res => {
                    console.log(res);
                }
            )
            .catch(error => {
                    console.log(error);
                }
            );
        }        
    };

    render() {
        return (            
            <form onSubmit={this.handleSubmit}>
                <h3>Register</h3>

                <div className="form-group">
                    <label>User ID:</label>
                    <input type="text" className="form-control" placeholder="User ID..." 
                    onChange={event => this.id = event.target.value}/>                    
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" className="form-control" placeholder="User Name..." 
                    onChange={event => this.name = event.target.value}/>                    
                </div>
                <div className="form-group">
                    <label>User Type:</label>
                    <input type="text" className="form-control" placeholder="User Type..."
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

                <button className="btn btn-primary btn-block">Regsiter</button>
            </form>
        );
    }
}

export default Register;