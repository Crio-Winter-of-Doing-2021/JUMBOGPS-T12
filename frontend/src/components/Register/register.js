import React, { Component } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { registerUser } from "../../api/apli-client";
import { Button, Input } from "antd";

class Register extends Component {
  /**
   * @class Register component handles Register UI functionality
   *
   * Contains the following fields
   * @property {loading} state.loading
   *    Set boolean value based on component loading
   */

  state = {
    loading: false,
  };

  /**
   *
   * @param {*} event
   * @description Submit data to backend /api/register
   */
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
    } else if (this.type !== "Tracker" && this.type !== "Admin") {
      alert("Invalid User type!");
    } else {
      const userData = {
        id: this.id,
        name: this.name,
        type: this.type,
        password: this.password,
      };

      registerUser(userData)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
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
              onChange={(event) => (this.id = event.target.value)}
            />

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
              onChange={(event) => (this.name = event.target.value)}
            />

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Asset Type"
              onChange={(event) => (this.type = event.target.value)}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(event) => (this.password = event.target.value)}
            />

            <Input.Password
              className="input-field"
              placeholder="Confirm Password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              onChange={(event) => (this.confirmPassword = event.target.value)}
            />

            <Button
              onClick={this.handleSubmit}
              loading={this.state.loading}
              type="primary"
            >
              Register
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default Register;
