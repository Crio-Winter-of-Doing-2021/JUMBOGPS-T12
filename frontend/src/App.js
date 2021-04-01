
import './App.css';
import {useMemo, useCallback, useState} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Map from './components/map/map';
import Dashboard from './components/dashboaord/dashboard'
import RangeSlider from './components/rangeSlider/rangeSlider';
import 'antd/dist/antd.css'; 
import Layout from './components/layout/layout';
import Login from './components/login/login';
import Sidebar from './components/navigation/sidebar/sidebar';
import {Home} from './components/home/home';
import Register from './components/Register/register';
import Portal from './components/portal/portal.component';
import AddAsset from './components/createAsset/createAsset';
import Navbar from './components/navigation/navbar/navbar';
import AssetList from './components/assetList/assetList';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
function App() {
  return (
    <div className="App">

<Navbar />
<Sidebar /> 
      <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/portal" component={Portal} />
              <Route exact path="/add-asset" component={AddAsset} />
              <Route exact path="/map" component={Layout} />
              <Route exact path="/assetList" component={AssetList} />

      </Switch>
    </div>
  );
}

export default App;
