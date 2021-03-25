import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from '../../api/apli-client';


class Login extends React.Component {

    constructor() {
        super();
        this.state = {
          loading: false,
          username: "",
          password: "",
        };
      }

      handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = {
            id: this.id,            
            password: this.password,
        };
        console.log(loginData);

        const login = await loginUser(loginData)
        debugger;
        if(login.status ===200){
          console.log(login);
          localStorage.setItem('token', login.data.token);
          this.props.history.push('/map');
        } else{
          console.log("Login Error")
        }
       
    };

      

      render() {
        return (
          <>
            {/* Display Header */}
    
            {/* Display Login fields */}
            <div className="flex-container">
              <div className="login-container container">
                <h1>Login to GPS Tracking Portal</h1>
    
                <Input
                  className="input-field"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  onChange={event => this.id = event.target.value}
                />
    
                <Input.Password
                  className="input-field"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  onChange={event => this.password = event.target.value}
                />
    
                <Button
                  loading={this.state.loading}
                  type="primary"
                  onClick={this.handleSubmit}
                >
                  Login
                </Button>
              </div>
            </div>
          </>
        );
      }


}

export default Login