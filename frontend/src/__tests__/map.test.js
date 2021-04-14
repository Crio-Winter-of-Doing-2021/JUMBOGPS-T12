import React, { Component } from 'react'
import { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import enzyme from 'enzyme'

enzyme.configure({ adapter: new Adapter() })

import Map from '../components/map/map';


describe('<Map />', ()=>{

    let mapWrapper
    let mapInstance

    const map = (disableLifecycleMethods = true)=>shallow(<Map />,{disableLifecycleMethods})

    beforeEach(()=>{
        mapWrapper = map()
        mapInstance = mapWrapper.instance()
    })

    afterEach(() => {
        mapWrapper = undefined;
        mapInstance = undefined;
    })

    it('renders without crashing', () => {
        expect(map().exists()).toBe(true);
    })
})