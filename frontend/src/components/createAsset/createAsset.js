import React, { Component } from "react";
import { Form, Input, Button, Radio } from 'antd';

import { fetchUserDetails } from "../../api/apli-client";

const AddAsset = ()=>{

    //   componentDidMount() {
    //     fetchUserDetails()
    //       .then((res) => {
    //         console.log(res);
    //         this.setState({
    //           user: res.data,
    //         });
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   }
    
    //   handleSubmit = (event) => {
    //     event.preventDefault();
    //   };
    
    const [form] = Form.useForm();
    
        return (
          // <form onSubmit={this.handleSubmit}>
          //     <h3>Add New Asset</h3>
    
          //     <div className="form-group">
          //         <label>Asset ID:</label>
          //         <input type="text" className="form-control" placeholder="Asset ID..."
          //         onChange={event => this.id = event.target.value}/>
          //     </div>
          //     <div className="form-group">
          //         <label>Name:</label>
          //         <input type="text" className="form-control" placeholder="Asset Name..."
          //         onChange={event => this.name = event.target.value}/>
          //     </div>
          //     <div className="form-group">
          //         <label>Asset Type:</label>
          //         <input type="text" className="form-control" placeholder="Asset Type..."
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
    
          //     <button className="btn btn-primary btn-block">Add Asset</button>
          // </form>
          <Form
            layout="vertical"
            form={form}
          >
            <Form.Item label="Asset ID">
              <Input placeholder="Asset ID..." />
            </Form.Item>
            <Form.Item label="Asset Name">
              <Input placeholder="Asset Name..." />
            </Form.Item>
            <Form.Item label="Asset Type">
              <Input placeholder="Asset Name..." />
            </Form.Item>
            <Form.Item label="Source Coordinates">
              <Input placeholder="Soruce Coordinates..." />
            </Form.Item>
            <Form.Item label="Destination Coordinates">
              <Input placeholder="Destination Coordinates..." />
            </Form.Item>
            <Form.Item label="Start longitude">
              <Input placeholder="Destination Coordinates..." />
            </Form.Item>
            {/* <Form.Item label="Start Latitidue">
              <Input placeholder="Start Latitidue..." />
            </Form.Item>
            <Form.Item label="Start Latitidue">
              <Input placeholder="Start Latitidue..." />
            </Form.Item> */}
            {/* <Form.Item >
              <Button type="primary">Submit</Button>
            </Form.Item> */}
          </Form>
        );

    
    

}

export default AddAsset;
