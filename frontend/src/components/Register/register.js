import React, { Component } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { registerUser } from '../../api/apli-client';
import { Button, Input, message } from "antd";

class Register extends Component {

    state={
        loading:false
    }
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
            
            <>
     
               <div className="flex-container">
               <div className="register-container container">
               <h1>Create an Account</h1>

               <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="user-id"
              onChange={event => this.id = event.target.value}
            />

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
              onChange={event => this.name = event.target.value}
            />

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Asset Type"
              onChange={event => this.type = event.target.value}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={event => this.password = event.target.value}
            />

            <Input.Password
              className="input-field"
              placeholder="Confirm Password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              onChange={event => this.confirmPassword = event.target.value}
            />

            <Button
            onClick={this.handleSubmit}
              loading={this.state.loading}
              type="primary">
              Register
            </Button>
                </div>
               </div>
            </>
            // <form onSubmit={this.handleSubmit}>
            //     <h3>Register</h3>

            //     <div className="form-group">
            //         <label>User ID:</label>
            //         <input type="text" className="form-control" placeholder="User ID..." 
            //         onChange={event => this.id = event.target.value}/>                    
            //     </div>
            //     <div className="form-group">
            //         <label>Name:</label>
            //         <input type="text" className="form-control" placeholder="User Name..." 
            //         onChange={event => this.name = event.target.value}/>                    
            //     </div>
            //     <div className="form-group">
            //         <label>User Type:</label>
            //         <input type="text" className="form-control" placeholder="User Type..."
            //         onChange={event => this.type = event.target.value}/>                    
            //     </div>
            //     <div className="form-group">
            //         <label>Password:</label>
            //         <input type="password" className="form-control" placeholder="User password..."
            //         onChange={event => this.password = event.target.value}/>                    
            //     </div>
            //     <div className="form-group">
            //         <label>Confirm Password:</label>
            //         <input type="password" className="form-control" placeholder="Confirm password..."
            //         onChange={event => this.confirmPassword = event.target.value}/>                    
            //     </div>

            //     <button className="btn btn-primary btn-block">Regsiter</button>
            // </form>
        );
    }
}

export default Register;