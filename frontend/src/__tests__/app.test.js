import { mount, configure , shallow} from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import React from "react";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import configureStore from 'redux-mock-store';
import Layout from '../components/layout/layout';

const mockStore = configureStore([]);

import App from '../App'
import { Provider } from "react-redux";

let container = null;
let appComponent = {};



configure({adapter: new Adapter()});
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  
  afterEach(() => {
    // cleanup on exiting    
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  
  beforeAll(() => {
    var store = mockStore({
      assetDetails:[],
      username:null,
      allAssetStore:null
    });
    window.URL.createObjectURL = function() {};
    // initialize the App component instance
    appComponent = mount(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>);
  });

  describe('Check routes in the App component', ()=>{


    it('should display Login component on visiting / path', () => {
        act(() => {
          appComponent.find('Router').props().history.push('/')
          render(appComponent, container)
        });
        expect(container.querySelector('.login-container')).not.toBe(null);
      })


    it('should display Login component on visiting /login path', () => {
      act(() => {
        appComponent.find('Router').props().history.push('/login')
        render(appComponent, container)
      });
      expect(container.querySelector('.login-container')).not.toBe(null);
    })

    it('should display Register component on visiting /Register path', () => {
      act(() => {
        appComponent.find('Router').props().history.push('/Register')
        render(appComponent, container)
      });
      expect(container.querySelector('.register-container')).not.toBe(null);
    })


    it('should not display login component on visiting /register path', () => {
      act(() => {
        appComponent.find('Router').props().history.push('/Register')
        render(appComponent, container)
      });
      expect(container.querySelector('.login-container')).toBe(null);
    })

    it('renders without crashing', () => {
 
    });



    it('should route to assetList component on /assetList', () => {
      act(() => {
        appComponent.find('Router').props().history.push('/AssetList')
        render(appComponent, container)
      });
      expect(container.querySelector('.assetListContainer')).not.toBe(null);
    })

    it('should  display map and dashboard  component on visiting /map path', () => {
      let pathMap = {};
      var store = mockStore({
        assetDetails:[],
        username:null,
        allAssetStore:null,
      
          lng: 78.333019,
          lat: 17.49593,
          zoom: 18,
          dispHistoryOfRoute: false,

      });

        appComponent = shallow(<App />, true);

        pathMap = appComponent.find(Route).reduce((pathMap, route) => {
          const routeProps = route.props();
          pathMap[routeProps.path] = routeProps.component;
          return pathMap;
        }, {});
        expect(pathMap['/map']).toBe(Layout);
   
    })


    
  })

