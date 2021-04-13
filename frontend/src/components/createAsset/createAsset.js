import React, { Component, useState } from "react";
import { Form, Input, Button, Radio, Modal, DatePicker } from "antd";


import { fetchUserDetails } from "../../api/apli-client";

const AddAsset = (props) => {
const [assetId, updateAssetId] = useState(null);
const [assetName, updateAssetName] = useState(null);
const [assetType, updateAssetType] = useState(null);
const [sourceCoordinates, updatesourceCoordinates] = useState(null);
const [destinationCoordinates, updatedestinationCoordinates] = useState(null);
const [endDate, updateendDate] = useState(null);
    const handleSubmit = (event) => {
      debugger;
      event.preventDefault();
    };
    const handleOnChange = (event) => {
      debugger;
      event.preventDefault();
    };
  const [form] = Form.useForm();
  const currentDate  = ()=>{
    var date = new Date();
    let dateString = `${date.getUTCFullYear}-${date.getMonth}-${date.getDate}`
    return dateString;
  }
  const data = {
    id:assetId,
    name:assetName,
    type:assetType,
    src:sourceCoordinates,
    dest:destinationCoordinates,
    start:new Date().getUTCFullYear()+'-'+ new Date().getMonth()+'-'+new Date().getDate(),
    end:endDate,
    ts:new Date()
  }


  const submit = ()=>{
    updateAssetId(null);
    updateAssetName(null)
    updateAssetType(null);
    updatesourceCoordinates(null);
    updatedestinationCoordinates(null);

    props.onOk(data);
  }

  const onDateChange = (date)=>{
    debugger;
    updateendDate(`${date._d.getUTCFullYear()}-${date._d.getMonth()}-${date._d.getDate()}`);
  }
  return (

    <Modal
    title="Add Asset"
    visible={props.visible}
    onOk={submit}
    // confirmLoading={confirmLoading}
    onCancel={props.onCancel}
  >
    {/* <CreateAsset ref={this.addAssetRef} ></CreateAsset> */}

    <Form layout="vertical" form={form}>
      <Form.Item label="Asset ID">
        <Input onChange={(e)=>updateAssetId(e.target.value)} value={assetId} placeholder="Asset ID..." />
      </Form.Item>
      <Form.Item label="Asset Name">
        <Input onChange={(e)=>updateAssetName(e.target.value)} value={assetName} placeholder="Asset Name..." />
      </Form.Item>
      <Form.Item label="Asset Type">
        <Input onChange={(e)=>updateAssetType(e.target.value)} value={assetType} placeholder="Asset Name..." />
      </Form.Item>
      <Form.Item label="Source Coordinates">
        <Input  onChange={(e)=>updatesourceCoordinates(e.target.value)} value={sourceCoordinates}    placeholder="Soruce Coordinates..." />
      </Form.Item>
      <Form.Item label="Destination Coordinates">
        <Input  onChange={(e)=>updatedestinationCoordinates(e.target.value)} value={destinationCoordinates} placeholder="Destination Coordinates..." />
      </Form.Item>

      <Form.Item label="End Date">
      <DatePicker onChange={onDateChange} />
      </Form.Item>

    </Form>
  </Modal>

    
  );
};

export default AddAsset;
