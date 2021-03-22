import React from 'react';
import Dashboard from '../dashboaord/dashboard';
import {Slider, InputNumber, Row, Col, DatePicker, Input, Button } from 'antd'
import Map from '../map/map';
import { fetchAssets, fetchAssetDetails } from '../../api/apli-client';
import { connect } from "react-redux";


const { RangePicker } = DatePicker;
const {Search} = Input;


class Layout extends React.Component{

  constructor(){
    super();
    this.mapRef = React.createRef();
    this.state = {
      numberOfAssetsToDisplay:100,
      translate:{
          x: 0,
          y: 0
        },
        findAsset:null,
        dateFilter:null

  }


  }




      searcAsset = (value)=>{
         this.setState({findAsset:value})

      }

      sliderOnChangeHandler = (value)=>{
        this.setState({numberOfAssetsToDisplay:value})
      }

     
      viewTimelineView = async (findAsset)=>{

        let results =  await fetchAssetDetails(findAsset);
        results = results.data.filter(
          (eachAsset) => eachAsset.id === findAsset
        );
        let assetGeoJson = this.formatToGeoJson(results);
        this.props.addAssetDetails(assetGeoJson);
        
       }
    dateChangeHandler = (e)=>{
        debugger;
      if(e && e.length ==2){
      let startDate = new Date (e[0]._d);
      let endDate = new Date (e[1]._d);
        this.setState({dateFilter:[startDate,endDate]});
       }
       else{
        this.setState({dateFilter:false});
       }
      }
     handleDragMove = (e) => {
        if(e.target.innerHTML==="Move this component"){
            let {translate} = this.state;
            if(e.target.type!=="range"){
                this.setState({
                    translate: {
                        x: translate.x + e.movementX,
                        y: translate.y + e.movementY
                      }
                })
            }
        }
 
 
      };

      async componentDidMount(){
        let assetDetails =  await fetchAssets();
        assetDetails = this.getAllAssetDetails(assetDetails);
        this.props.addAssetDetails(assetDetails);
      
     
      }


     async componentDidUpdate(prevProps, prevState){
        let assetGeoJson = null;
        let results = null;
        const {assetDetails} = this.props
        const {findAsset,dateFilter,numberOfAssetsToDisplay} = this.state;
        if(findAsset && findAsset!=""){
          if(findAsset !==prevState.findAsset){
            this.viewTimelineView(findAsset);
          }
        }

        if(prevState.dateFilter !=dateFilter){
        if(dateFilter){
      
            let assetDetails =  await fetchAssets();
            assetDetails = this.getAllAssetDetails(assetDetails);
            let assetsToDisplay = assetDetails.features.filter((asset)=> new Date (asset.properties.timeStamp) >= dateFilter[0] && new Date (asset.properties.timeStamp) <= dateFilter[1])
            // 
            let assetGeoJson = {
              type: "FeatureCollection",
              features: assetsToDisplay,
            };
        
            this.props.addAssetDetails(assetGeoJson);

          }
          else if(dateFilter ===false){
            let assetDetails =  await fetchAssets();
            assetDetails = this.getAllAssetDetails(assetDetails);
            this.props.addAssetDetails(assetDetails);
      
          }
            
        }

        if(numberOfAssetsToDisplay!==prevState.numberOfAssetsToDisplay){
          debugger;
          let currentDisplayAssets = {...this.props.assetDetails};
          let assetsToDisplay = {...currentDisplayAssets, features:currentDisplayAssets.features.slice(0,numberOfAssetsToDisplay)}
          // console.log(assetsToDisplayDisplay);
          // this.props.addAssetDetails(assetsToDisplayDisplay);
          this.mapRef.current.setAssetToDisplay(assetsToDisplay);
          

        }

      }

    formatToGeoJson = (assetDetails) => {
    
        let featureList = assetDetails[0].location.coordinates.map((coordinates, id) => {   
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
         
                  coordinates.long, coordinates.lat
              ],
            },
            properties: {
              id:`${assetDetails[0].id}`,
              name: `${assetDetails[0].name}`,
              assetType:`${assetDetails[0].type}`,
              description: `description for asset id ${assetDetails[0].id}`,
              timeStamp:`${coordinates.ts}`
            },
          };
        });
        let assetGeoJson = {
          type: "FeatureCollection",
          features: featureList,
        };
    
        return assetGeoJson;
      };


      getAllAssetDetails = (assetDetails)=>{
        let results = assetDetails;
        const {numberOfAssetsToDisplay} = this.state;
        results = results.data.slice(0, numberOfAssetsToDisplay);
        let featureList = results.map((asset, id) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                asset.coordinates.long,
                asset.coordinates.lat,
              ],
            },
            properties: {
              id:`${asset.id}`,
              name: `${asset.name}`,
              assetType:`${asset.type}`,
              description: `description for asset id ${asset.id}`,
              timeStamp:`${asset.coordinates.ts}`
            },
          };
        });
        let assetGeoJson = {
          type: "FeatureCollection",
          features: featureList,
        };
    
        return assetGeoJson;
      }
    render(){
        const {handleDragMove, dateChangeHandler} = this
        const {translate, numberOfAssetsToDisplay, findAsset    } = this.state
        const {assetDetails} = this.props;
        return(
            
            <div>
            <Dashboard  onDragMove={handleDragMove}   style={{
                    transform: `translateX(${translate.x}px) translateY(${translate.y}px)`, position:'absolute', 'z-index':'1', 'background-color':'white', top:'10px', left:'10px'}}>
                    <div>
                    <p>Move this component</p>
                    <Search placeholder="input search text" onSearch={this.searcAsset} enterButton />
                    <Button type="primary">Reset</Button>
                    {/* <input onChange={(e)=>setAssetToDisplay(e.target.value)} value={assetToDisplay} placeholder='Asset ID'></input> */}
                    {/* <button onClick={findAssetSubmitHandler}>"Find Asset"</button> */}
                    </div>
                    <RangePicker onCalendarChange={dateChangeHandler} showTime />          
            {/* <RangeSlider {...sliderProps} classes="additional-css-classes" /> */}

            <Slider
            min={1}
            max={100}
            onChange={this.sliderOnChangeHandler}
            value={typeof numberOfAssetsToDisplay === 'number' ? numberOfAssetsToDisplay : 0}
          />
               <InputNumber
            min={1}
            max={100}
            style={{ margin: '0 16px' }}
            value={numberOfAssetsToDisplay}
            onChange={this.sliderOnChangeHandler}
          />
            </Dashboard>

            <Map viewTimelineView ={this.viewTimelineView} ref={this.mapRef} assetsToDisplay={assetDetails} assetToDisplay={findAsset} numberOfAssetsToDisplay={numberOfAssetsToDisplay}/>
            </div>

        )
    }

}

function mapStateToProps(state) {
  return {
    assetDetails: state.assetDetails,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    addAssetDetails: (payload) => {
      dispatch({ type: "ADD_ASSET_DETAILS", payload });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout);