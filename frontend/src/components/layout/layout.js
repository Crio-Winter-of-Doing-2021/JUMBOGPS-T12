import React from 'react';
import Dashboard from '../dashboaord/dashboard';
import {Slider, InputNumber, Row, Col, DatePicker, Input, Button, Select, message } from 'antd'
import Map from '../map/map';
import { fetchAssets, fetchAssetDetails } from '../../api/apli-client';
import { connect } from "react-redux";
import styles from './styles.module.css';
import {socket} from '../home/home';

const { RangePicker } = DatePicker;
const {Search} = Input;
const {Option} = Select;


class Layout extends React.Component{


    /**
   * @class Layout component is a higher order component handling map and dashboard
   *
   * Contains the following fields
   *  @property {React.RefObject} mapRef
   *  Reference to Map component (to trigger certain methods within the Map component)
   * @property {numberOfAssetsToDisplay} state.numberOfAssetsToDisplay
   *    Configurable value based on number of assets to display to user at once
   * @property {findAsset} state.findAsset
   *    Find one asset from the map
   * @property {dateFilter} state.dateFilter
   *    Find asset between specific dates
   * @property {geoJSONLine} state.geoJSONLine
   *    geoJSON to display line on history of assets
   */

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
        dateFilter:null, 
        assetTypes:['Delivery Truck'],
        geoJSONLine:null

  }


  }

  /**
   *
   * @param {object} assetDetails
   * @description Takes all asset details in regualr object and formats it to geoJSON 
   * @returns geoJSONLine
   */

    formatToGeoJSONLine = (assetDetails)=>{

      debugger;
      
      let locations = assetDetails[0].location.coordinates.map((location)=>{
        return [location.long, location.lat]
      })
    const geoJSONLine =   {
        'type': 'geojson',
        'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
        'type': 'LineString',
        'coordinates': locations
        }
        }
        }

return geoJSONLine;
    }

      /**
   *
   * @param {String} value
   * @description Store the search asset value to a state
   */


    searcAsset = (value)=>{
         this.setState({findAsset:value})
      }

      sliderOnChangeHandler = (value)=>{
        this.setState({numberOfAssetsToDisplay:value})
      }

     
      viewTimelineView = async (findAsset)=>{

        socket.emit('timeline-view', JSON.stringify({socketID:socket.id, assetID:findAsset}));

        let results =  await fetchAssetDetails(findAsset);
      debugger;
        if(results.status ===200){
          if(results.data.length >0){

            results = results.data.filter(
              (eachAsset) => eachAsset.id === findAsset
            );
            // let assetGeoJson = this.formatToGeoJsonV2(results);
            //Uncomment below file for legacy geoJson  function
            let assetGeoJson = this.formatToGeoJson(results);
            let assetGeoJsonLine = this.formatToGeoJSONLine(results);
            
    
            this.props.addAssetDetails(assetGeoJson);
            this.setState({geoJSONLine:assetGeoJsonLine});

          } else{
            message.error("Asset not available, Please contact your support if this is not expected")
          }


        } else{
          message.error("Asset not available, Please contact your support if this is not expected")
        }
 
        
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
       
      socket.on('broadcast',function(data) {
          console.log(data);
       });

       socket.on('updated-location-details', (res)=>{
        let assetGeoJson = this.formatToGeoJson(res.data);
        console.log("assetGEOJSON ddebug");
        console.log(assetGeoJson);
        this.props.addAssetDetails(assetGeoJson);
       })
        let assetDetails =  await fetchAssets();
        assetDetails = this.getAllAssetDetails(assetDetails);
        this.props.addAssetDetails(assetDetails);
        this.props.storeAllAssetBackup(assetDetails);
      
     
      }

      resetBtnHandler = async ()=>{
        this.setState({findAsset:null})
        this.setState({geoJSONLine:null})
        let assetDetails =  await fetchAssets();
        assetDetails = this.getAllAssetDetails(assetDetails);
        this.props.addAssetDetails(assetDetails);
      }


     async componentDidUpdate(prevProps, prevState){
        let assetGeoJson = null;
        let results = null;
        const {assetDetails} = this.props
        const {findAsset,dateFilter,numberOfAssetsToDisplay} = this.state;
        debugger;
        if(findAsset && findAsset!=""){
          if(findAsset !==prevState.findAsset){
            this.viewTimelineView(findAsset);
          }
        }

        if(prevState.dateFilter !=dateFilter){
        if(dateFilter){
            this.setState({geoJSONLine:null})
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
            this.setState({geoJSONLine:null})
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

      formatToGeoJsonV2 = (assetDetails)=>{

        let assetgeoJsonLine =     {
          'type': 'geojson',
          'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': assetDetails[0].location.coordinates.map((coordinates, id)=>(
            [coordinates.long, coordinates.lat]
          ))
          }
          }
          }
          console.log(assetgeoJsonLine)
        return assetgeoJsonLine;
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
         
                    <Dashboard  onDragMove={handleDragMove} className={styles['dashboard']}   style={{
                    transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
                    <div>
                    <p className="apply-filters">Asset Filters</p>
                    <div  style={{'margin-bottom':'10px'}}>
                    <Row>
                      <Col span={20}>
                    {/* <Search placeholder="input search text" onSearch={this.searcAsset} allowClear={true} enterButton /> */}

                    <Input.Group compact>
                 
                    <Search placeholder="input search text" onSearch={this.searcAsset} allowClear={true} enterButton /> 
                    {/* <Search placeholder="input search text" onSearch={this.searcAsset} style={{ width: 200 }} /> */}

                  </Input.Group>
                    </Col>
                    <Col span={4}>
                    <Button onClick={this.resetBtnHandler} type="primary">Reset</Button>
                    </Col>
                    </Row> 
                    </div>
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
            <div style={{width:'95%', float:'right'}}>
            <Map viewTimelineView ={this.viewTimelineView} geoJSONLine={this.state.geoJSONLine} ref={this.mapRef} assetsToDisplay={assetDetails} assetToDisplay={findAsset} numberOfAssetsToDisplay={numberOfAssetsToDisplay}/>
              </div>
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
    storeAllAssetBackup: (payload)=>{
      dispatch({ type: "ALL_ASSET_BACKUP", payload });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);