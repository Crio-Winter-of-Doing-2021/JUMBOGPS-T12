import React, { Component } from "react";

import { fetchUserDetails } from "../../api/apli-client";
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:3030", { Query: "something" });

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendSocketIO = this.sendSocketIO.bind(this);
  }

  componentDidMount() {
    fetchUserDetails()
      .then((res) => {
        console.log(res);
        this.setState({
          user: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  sendSocketIO() {
    console.log("emit");
    socket.emit("example_message", "demo");

    socket.on("broadcast", function (data) {
      console.log("came here");
      console.log(data);
    });
  }

  render() {
    if (this.state.user) {
      return (
        <div>
          <button onClick={this.sendSocketIO}>Send Socket.io</button>
          <h2>Jumbotail GPS Team 12 Homepage</h2>
          <h2>Members:</h2>
          <h2>Tejeswar Reddy</h2>
          <h2>Archisman Chakraborty</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>You are not logged in</h2>
          <button onClick={this.sendSocketIO}>Send Socket.io</button>
        </div>
      );
    }
  }
}

export { Home, socket };
