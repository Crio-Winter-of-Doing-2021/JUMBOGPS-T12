import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './components/home.component';
import Login from './components/login.component';
import Register from './components/register.component';
import Navigation from './components/nav.component';
import Portal from './components/portal.component';
import AddAsset from './components/addAsset.component';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/portal" component={Portal} />
              <Route exact path="/add-asset" component={AddAsset} />
            </Switch>
          </div>
        </div>      
      </div>
    </BrowserRouter>
    
  );
}

export default App;
