import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../api/apli-client";
import { connect } from "react-redux";

class Login extends React.Component {
  /**
   * @class Login component handles login UI functionality
   *
   * Contains the following fields
   * @property {loading} state.loading
   *    Set boolean value based on component loading
   * @property {username} state.username
   *    Store Username on entering
   * @property {password} state.password
   *    Store password on entering
   */

  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
    };
  }

  /**
   *
   * @param {*} event
   * @description Submit data to backend /api/login
   */

  handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      id: this.id,
      password: this.password,
    };
    /**
     * @param {object} loginData
     * @description Make API call to backend with login data to authenticate user
     */
    const login = await loginUser(loginData);
    if (login.status === 200) {
      console.log(login);
      localStorage.setItem("token", login.data.token);
      console.log(login.data.token);
      message.success("Successfully logged ", 5);
      this.props.storeLoginUser(this.id);
      this.props.history.push("/map");
    } else {
      console.log("Login Error");
      message.error("Login failed during API call", 5);
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
              onChange={(event) => (this.id = event.target.value)}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(event) => (this.password = event.target.value)}
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

const mapDispatchToProps = (dispatch) => {
  return {
    storeLoginUser: (payload) => {
      dispatch({ type: "Store_USER_NAME", payload });
    },
  };
};

export default connect(null, mapDispatchToProps)(Login);
