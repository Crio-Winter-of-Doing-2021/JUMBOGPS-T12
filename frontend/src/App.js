
import './App.css';
import {Route, Switch} from 'react-router-dom';
import 'antd/dist/antd.css'; 
import Layout from './components/layout/layout';
import Login from './components/login/login';
import Sidebar from './components/navigation/sidebar/sidebar';
import Register from './components/Register/register';
import Portal from './components/portal/portal.component';
import AddAsset from './components/createAsset/createAsset';
import Navbar from './components/navigation/navbar/navbar';
import AssetList from './components/assetList/assetList';
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
