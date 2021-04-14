import { mount, configure, shallow} from "enzyme";
import React from "react";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Provider } from "react-redux";
import Dashboard from '../components/dashboaord/dashboard';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);


window.scrollTo = jest.fn();
configure({adapter: new Adapter()});
var dashboardComponent = null;

beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
          matches: false,
          addListener: function() {},
          removeListener: function() {}
      };
  };
      var store = mockStore({
        assetDetails:[],
        username:null,
        allAssetStore:null
      });
      let assetDetails = []
      window.URL.createObjectURL = function() {};
  
      dashboardComponent = shallow(<Dashboard>Children</Dashboard>);
    });
  

describe('<Dashboard />', ()=>{


    it('renders without crashing', () => {
        expect(dashboardComponent.text()).toContain("Children");
    })
})
