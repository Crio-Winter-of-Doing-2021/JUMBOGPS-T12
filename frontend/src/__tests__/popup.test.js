import { mount, configure} from "enzyme";
import React from "react";
import Popup from '../components/popup/popup';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

window.scrollTo = jest.fn();

let popupComponent = {};
configure({adapter: new Adapter()});
let features = {
    timestamp:"2021-03-28T06:50:50.000Z",
    id:123,
    name:"testName",
    type:"testTruck"
}

var d = new Date(features.timeStamp),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

beforeAll(() => {
    popupComponent = mount(<Popup features={features}/>);
});

describe("Check UI for pop up component (UI)", () => {
    test("pop up card contains asset ID, Name, Type and Timeline view link", () => {
        expect(popupComponent.text()).toContain(features.id);
        expect(popupComponent.text()).toContain(features.name);
        expect(popupComponent.text()).toContain(features.type);
        expect(popupComponent.text()).toContain(features.type);
        expect(popupComponent.text()).toContain(days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm);
    });
});
