import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";


class Login extends React.Component {

    constructor() {
        super();
        this.state = {
          loading: false,
          username: "",
          password: "",
        };
      }

      

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
                  onChange={(e) => {
                    this.setState({
                      username: e.target.value,
                    });
                  }}
                />
    
                <Input.Password
                  className="input-field"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  onChange={(e) => {
                    this.setState({
                      password: e.target.value,
                    });
                  }}
                />
    
                <Button
                  loading={this.state.loading}
                  type="primary"
                  onClick={this.login}
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