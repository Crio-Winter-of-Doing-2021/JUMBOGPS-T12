
import './App.css';
import {useMemo, useCallback, useState} from 'react'
import Map from './components/map/map';
import Dashboard from './components/dashboaord/dashboard'
import RangeSlider from './components/rangeSlider/rangeSlider';
import 'antd/dist/antd.css'; 



function App() {

  const [parentVal, setParentVal] = useState(100);
  const [assetToDisplay, setAssetToDisplay] = useState(null);
  const [findAsset, setfindAsset] = useState(null);

  // let assetToDisplay = null;

  // const setAssetToDisplay = (value)=>{
  //   assetToDisplay = value;
  //   console.log(assetToDisplay);
  // }

  const findAssetSubmitHandler = ()=>{
    
    setfindAsset(assetToDisplay)
  }

  const sliderValueChanged = useCallback(val => {
    console.log("NEW VALUE", val);
    setParentVal(val);
  });

  const sliderProps = useMemo(
    () => ({
      min: 0,
      max: 100,
      value: parentVal,
      step: 2,
      label: "This is a reusable slider",
      onChange: e => sliderValueChanged(e)
    }),
    [parentVal]
  );

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handleDragMove = (e) => {
    if(e.target.type!=="range"){
      setTranslate({
        x: translate.x + e.movementX,
        y: translate.y + e.movementY
      });
    }

  };

  return (
    <div className="App">
      <Dashboard  onDragMove={handleDragMove}   style={{
              transform: `translateX(${translate.x}px) translateY(${translate.y}px)`, position:'absolute', 'z-index':'1', 'background-color':'white', top:'10px', left:'10px'}}>
              <div>
              <p>"Move this component"</p>
              <input onChange={(e)=>setAssetToDisplay(e.target.value)} value={assetToDisplay} placeholder='Asset ID'></input>
              <button onClick={findAssetSubmitHandler}>"Find Asset"</button>
              </div>
             
      <RangeSlider {...sliderProps} classes="additional-css-classes" />
      </Dashboard>
      
      <Map assetToDisplay={findAsset} numberOfAssetsToDisplay={parentVal}/>
    </div>
  );
}

export default App;
