import { mount, configure, shallow} from "enzyme";
import React from "react";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Provider } from "react-redux";
import {Layout} from '../components/layout/layout';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

window.scrollTo = jest.fn();

configure({adapter: new Adapter()});
var layoutComponent = null;
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

    layoutComponent = shallow(<Layout assetDetails={assetDetails} />);
  });


describe('<Layout />', ()=>{


    it('renders without crashing', () => {
      console.log("layout component")
      console.log(layoutComponent.instance());
        expect(layoutComponent.text()).toContain("<Dashboard /><Map />");
    })
})
