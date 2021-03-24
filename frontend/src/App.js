
import './App.css';
import {useMemo, useCallback, useState} from 'react'
import Map from './components/map/map';
import Dashboard from './components/dashboaord/dashboard'
import RangeSlider from './components/rangeSlider/rangeSlider';
import 'antd/dist/antd.css'; 
import Layout from './components/layout/layout';
import Login from './components/login/login';
import {Sidebar} from './components/navigation/sidebar/sidebar';


import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;



function App() {

//   const [parentVal, setParentVal] = useState(100);
//   const [assetToDisplay, setAssetToDisplay] = useState(null);
//   const [findAsset, setfindAsset] = useState(0);

//   const findAssetSubmitHandler = ()=>{
    
//     setfindAsset(assetToDisplay)
//   }

//   const sliderValueChanged = useCallback(val => {
//     setParentVal(val);
//   });

//   const filterRange = (e)=>{
// console.log(e);
//     // let startDate = new Date (e[0]._d);
//     // startDate = [startDate.getFullYear(), ("0"+(startDate.getMonth()+1)).slice(-2), ("0" + startDate.getDate()).slice(-2)].join('-')
//     // console.log(startDate);
//   }

 

  

//   const sliderProps = useMemo(
//     () => ({
//       min: 0,
//       max: 100,
//       value: parentVal,
//       step: 1,
//       label: "This is a reusable slider",
//       onChange: e => sliderValueChanged(e)
//     }),
//     [parentVal]
//   );

//   const [translate, setTranslate] = useState({
//     x: 0,
//     y: 0
//   });

//   const handleDragMove = (e) => {
//     if(e.target.type!=="range"){
//       setTranslate({
//         x: translate.x + e.movementX,
//         y: translate.y + e.movementY
//       });
//     }

//   };

  return (
    <div className="App">
      {/* <Dashboard  onDragMove={handleDragMove}   style={{
              transform: `translateX(${translate.x}px) translateY(${translate.y}px)`, position:'absolute', 'z-index':'1', 'background-color':'white', top:'10px', left:'10px'}}>
              <div>
              <p>"Move this component"</p>
              <Search placeholder="input search text" onSearch={onSearch} enterButton />
              <input onChange={(e)=>setAssetToDisplay(e.target.value)} value={assetToDisplay} placeholder='Asset ID'></input>
              <button onClick={findAssetSubmitHandler}>"Find Asset"</button>
              </div>
              <RangePicker onCalendarChange={filterRange} showTime />          
      <RangeSlider {...sliderProps} classes="additional-css-classes" />

      </Dashboard>
      
      <Map assetToDisplay={findAsset} numberOfAssetsToDisplay={parentVal}/> */}
      <Sidebar /> 
      <Layout />
    </div>
  );
}

export default App;
