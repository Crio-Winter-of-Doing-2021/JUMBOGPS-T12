import React, { Component } from "react";
import { loginUser } from '../api/users.api';

class Login extends Component {

    handleSubmit = (event) => {
        event.preventDefault();

        const loginData = {
            id: this.id,            
            password: this.password,
        };
        console.log(loginData);

        loginUser(loginData)
        .then(res => {
            console.log(res);
            localStorage.setItem('token', res.data.token);
            window.location.replace('http://localhost:3000/portal');
        })
        .catch(error => {
            console.log(error);
        });        
    };

    render() {        
        return (            
            <form onSubmit={this.handleSubmit}>
                <h3>Login</h3>

                <div className="form-group">
                    <label>User ID:</label>
                    <input type="text" className="form-control" placeholder="User ID..." 
                    onChange={event => this.id = event.target.value}/>                    
                </div>
                
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" className="form-control" placeholder="User password..."
                    onChange={event => this.password = event.target.value}/>                    
                </div>
                
                <button className="btn btn-primary btn-block">Login</button>
            </form>
        );
    }
}

export default Login;