import React from "react";
import Dashboard from "../dashboaord/dashboard";
import {
  Slider,
  InputNumber,
  Row,
  Col,
  DatePicker,
  Input,
  Button,
  Select,
  message,
  Menu,
  Dropdown,
  Space,
  Tooltip,
} from "antd";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import turf from "@turf/turf";
import { DownOutlined, UserOutlined, ClearOutlined } from "@ant-design/icons";
import Map from "../map/map";
import {
  fetchAssets,
  fetchAssetDetails,
  addgeofence,
} from "../../api/apli-client";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import { socket } from "../home/home";

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

export class Layout extends React.Component {
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

  constructor() {
    super();
    this.mapRef = React.createRef();
    this.state = {
      numberOfAssetsToDisplay: 100,
      translate: {
        x: 0,
        y: 0,
      },
      findAsset: null,
      dateFilter: null,
      geoJSONLine: null,
      assetTypeFilter: null,
      addGeoFence: null,
      expectedTravelRoute: null,
      geofence: null,
    };
  }

  /**
   *
   * @param {object} assetDetails
   * @description Takes all asset details in regualr object and formats it to geoJSON
   * @returns geoJSONLine
   */

  formatToGeoJSONLine = (assetDetails) => {
    let locations = assetDetails.map((location) => {
      return [location.long, location.lat];
    });
    const geoJSONLine = {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: locations,
        },
      },
    };

    return geoJSONLine;
  };

  /**
   *
   * @param {String} value
   * @description Store the search asset value to a state
   */

  searcAsset = (value) => {
    this.setState({ findAsset: value });
  };
  onDrawCreate = ({ features }) => {
    console.log(features);
  };

  onDrawUpdate = ({ features }) => {
    console.log(features);
  };

  sliderOnChangeHandler = (value) => {
    this.setState({ numberOfAssetsToDisplay: value });
  };

  viewTimelineView = async (findAsset) => {
    socket.emit(
      "timeline-view",
      JSON.stringify({ socketID: socket.id, assetID: findAsset })
    );

    let results = await fetchAssetDetails(findAsset);
    if (results.status === 200) {
      if (results.data.coordinates.length > 0) {
        let assetGeoJson = this.formatToGeoJson(results.data);
        let assetGeoJsonLine = this.formatToGeoJSONLine(
          results.data.coordinates
        );
        let expectedGeoRoute = this.formatToGeoJSONLine(
          results.data.defaultRoute
        );

        this.props.addAssetDetails(assetGeoJson);
        this.setState({
          geoJSONLine: assetGeoJsonLine,
          expectedTravelRoute: expectedGeoRoute,
          geofence: results.data.geofence,
        });
      } else {
        message.error("Asset location is not updated in 24 hours");
      }
    } else {
      message.error(
        "Asset not available, Please contact your support if this is not expected"
      );
    }
  };
  dateChangeHandler = (e) => {
    if (e && e.length == 2) {
      if (e[0] !== null && e[1] !== null) {
        let startDate = new Date(e[0]._d);
        let endDate = new Date(e[1]._d);
        this.setState({ dateFilter: [startDate, endDate] });
      } else {
        message.error("Error in date");
      }
    } else {
      this.setState({ dateFilter: false });
    }
  };
  handleDragMove = (e) => {
    if (e.target.innerHTML === "Move this component") {
      let { translate } = this.state;
      if (e.target.type !== "range") {
        this.setState({
          translate: {
            x: translate.x + e.movementX,
            y: translate.y + e.movementY,
          },
        });
      }
    }
  };

  async componentDidMount() {
    socket.on("broadcast", function (data) {
      console.log(data);
    });

    socket.on("updated-location-details", (res) => {
      console.log('updated message recvd.');
      let assetGeoJson = this.formatToGeoJson(res.data);
      let assetGeoJsonLine = this.formatToGeoJSONLine(res.data.coordinates);
      this.setState({ geoJSONLine: assetGeoJsonLine });
      this.props.addAssetDetails(assetGeoJson);
    });
    /**
     * Extra code added here
     */
    socket.on("OUT OF GEOFENCE", (res) => {
      console.log('out of geofence ' + res.data);
      let assetGeoJson = this.formatToGeoJson(res.data);
      let assetGeoJsonLine = this.formatToGeoJSONLine(res.data.coordinates);
      this.setState({ geoJSONLine: assetGeoJsonLine });
      this.props.addAssetDetails(assetGeoJson);
      // message.error(`${res.data} asset is out of geofence`);
      message.error(`Asset is out of geofence`);
    });
    socket.on("DEVIATING FROM ROUTE", (res) => {
      console.log('out of geofence ' + res.data);
      let assetGeoJson = this.formatToGeoJson(res.data);
      let assetGeoJsonLine = this.formatToGeoJSONLine(res.data.coordinates);
      this.setState({ geoJSONLine: assetGeoJsonLine });
      this.props.addAssetDetails(assetGeoJson);
      message.error(`Asset is off route`);
    });

    socket.on("DEVIATING FROM ROUTE; OUT OF GEOFENCE", (res) => {      
      let assetGeoJson = this.formatToGeoJson(res.data);
      let assetGeoJsonLine = this.formatToGeoJSONLine(res.data.coordinates);
      this.setState({ geoJSONLine: assetGeoJsonLine });
      this.props.addAssetDetails(assetGeoJson);
      message.error(`Asset is off route and out of geofence`);
    });
    let assetDetails = await fetchAssets();
    assetDetails = this.getAllAssetDetails(assetDetails);
    this.props.addAssetDetails(assetDetails);
    this.props.storeAllAssetBackup(assetDetails);
  }

  resetBtnHandler = async () => {
    this.setState({
      findAsset: null,
      geoJSONLine: null,
      geofence: null,
      assetTypeFilter: null,
    });
    let assetDetails = await fetchAssets();
    assetDetails = this.getAllAssetDetails(assetDetails);
    this.props.addAssetDetails(assetDetails);
  };

  async componentDidUpdate(prevProps, prevState) {
    let assetGeoJson = null;
    let results = null;
    const { assetDetails } = this.props;
    const {
      findAsset,
      dateFilter,
      numberOfAssetsToDisplay,
      assetTypeFilter,
    } = this.state;
    if (assetTypeFilter) {
      if (assetTypeFilter !== prevState.assetTypeFilter) {
        this.setState({ geoJSONLine: null });
        let assetDetails = await fetchAssets();
        assetDetails = this.getAllAssetDetails(assetDetails);

        let assetsToDisplay = assetDetails.features.filter(
          (asset) => asset.properties.assetType === assetTypeFilter
        );
        let assetGeoJson = {
          type: "FeatureCollection",
          features: assetsToDisplay,
        };
        this.props.addAssetDetails(assetGeoJson);
      }
    }
    if (findAsset && findAsset != "") {
      if (findAsset !== prevState.findAsset) {
        this.viewTimelineView(findAsset);
      }
    }

    if (prevState.dateFilter != dateFilter) {
      if (dateFilter) {
        this.setState({ geoJSONLine: null });
        let assetDetails = await fetchAssets();
        assetDetails = this.getAllAssetDetails(assetDetails);
        let assetsToDisplay = assetDetails.features.filter(
          (asset) =>
            new Date(asset.properties.timeStamp) >= dateFilter[0] &&
            new Date(asset.properties.timeStamp) <= dateFilter[1]
        );
        //
        let assetGeoJson = {
          type: "FeatureCollection",
          features: assetsToDisplay,
        };

        this.props.addAssetDetails(assetGeoJson);
      } else if (dateFilter === false) {
        this.setState({ geoJSONLine: null });
        let assetDetails = await fetchAssets();
        assetDetails = this.getAllAssetDetails(assetDetails);
        this.props.addAssetDetails(assetDetails);
      }
    }

    if (numberOfAssetsToDisplay !== prevState.numberOfAssetsToDisplay) {
      let currentDisplayAssets = { ...this.props.assetDetails };
      let assetsToDisplay = {
        ...currentDisplayAssets,
        features: currentDisplayAssets.features.slice(
          0,
          numberOfAssetsToDisplay
        ),
      };
      // console.log(assetsToDisplayDisplay);
      // this.props.addAssetDetails(assetsToDisplayDisplay);
      this.mapRef.current.setAssetToDisplay(assetsToDisplay);
    }
  }

  formatToGeoJsonV2 = (assetDetails) => {
    let assetgeoJsonLine = {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: assetDetails[0].location.coordinates.map(
            (coordinates, id) => [coordinates.long, coordinates.lat]
          ),
        },
      },
    };
    console.log(assetgeoJsonLine);
    return assetgeoJsonLine;
  };

  formatToGeoJson = (assetDetails) => {
    /** Updates Needed
     * remove .location
     * And assetDetails is nto an array it is an  object
     */
    let featureList = assetDetails.coordinates.map((coordinates, id) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coordinates.long, coordinates.lat],
        },
        properties: {
          id: `${assetDetails.id}`,
          name: `${assetDetails.name}`,
          assetType: `${assetDetails.type}`,
          description: `description for asset id ${assetDetails.id}`,
          timeStamp: `${coordinates.ts}`,
        },
      };
    });
    let assetGeoJson = {
      type: "FeatureCollection",
      features: featureList,
    };

    return assetGeoJson;
  };

  getAllAssetDetails = (assetDetails) => {
    let results = assetDetails;
    const { numberOfAssetsToDisplay } = this.state;
    results = results.data.slice(0, numberOfAssetsToDisplay);
    let featureList = results.map((asset, id) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [asset.coordinates.long, asset.coordinates.lat],
        },
        properties: {
          id: `${asset.id}`,
          name: `${asset.name}`,
          assetType: `${asset.type}`,
          description: `description for asset id ${asset.id}`,
          timeStamp: `${asset.coordinates.ts}`,
        },
      };
    });
    let assetGeoJson = {
      type: "FeatureCollection",
      features: featureList,
    };

    return assetGeoJson;
  };

  //   menu = ()=>{
  //     return(
  //       <Menu onClick={this.handleMenuClick}>{this.menuChildren}</Menu>
  //     )
  //   }

  //   menuChildren = ()=>{ this.state.assetTypes.map((_, index)=>(
  //         <Menu.Item key="index" icon={<UserOutlined />}>
  //           Delivery Boy
  //         </Menu.Item>

  //   ))

  // }

  addGeoFenceHandler = (data) => {
    this.setState({ addGeoFence: data });
  };

  handleDropDownMenuClick = (e) => {
    console.log("click", e);
  };

  handleMenuClick = (e) => {
    if (e.key !== "Reset") {
      this.setState({ assetTypeFilter: e.key });
    } else {
      this.setState({ assetTypeFilter: null });
    }
  };

  submitgeoFenceData = (id) => {
    addgeofence(id, this.state.addGeoFence);
    this.setState({ addGeoFence: null });
  };
  render() {
    const { handleDragMove, dateChangeHandler } = this;
    const {
      translate,
      numberOfAssetsToDisplay,
      findAsset,
      geoJSONLine,
      geofence,
      expectedTravelRoute,
    } = this.state;
    const { assetDetails, allAssetStore } = this.props;

    // const uniqueAssetTypes = assetDetails.features ? assetDetails.features.filter((value, index,self)=>{
    //   return self.indexOf(value) === index
    // }):null
    // console.log(uniqueAssetTypes);
    const allAssetTypes = allAssetStore
      ? allAssetStore.features.map((value, index) => {
          return value.properties.assetType;
        })
      : "";
    const uniqueAssetTypes = [...new Set(allAssetTypes)];
    const menus = uniqueAssetTypes
      ? uniqueAssetTypes.map((key, index) => {
          return (
            <Menu.Item name={key} key={key} icon={<UserOutlined />}>
              {key}
            </Menu.Item>
          );
        })
      : console.log("State is null");

    const menu = () => {
      return <Menu onClick={this.handleMenuClick}>{menus}</Menu>;
    };

    return (
      <div className="layout-container">
        <Dashboard
          onDragMove={handleDragMove}
          className={styles["dashboard"]}
          style={{
            transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
          }}
        >
          <div>
            <p className="apply-filters">Asset Filters</p>
            <div style={{ "margin-bottom": "10px" }}>
              <Row>
                <Col span={8}>
                  <Dropdown.Button
                    onClick={this.handleDropDownMenuClick}
                    overlay={menu}
                  >
                    {this.state.assetTypeFilter
                      ? this.state.assetTypeFilter
                      : "Asset Type"}
                  </Dropdown.Button>
                </Col>
                <Col span={12}>
                  <Input.Group compact>
                    <Search
                      placeholder="Search Asset ID"
                      onSearch={this.searcAsset}
                      allowClear={true}
                      enterButton
                    />
                  </Input.Group>
                </Col>
                <Col span={4}>
                  <Button onClick={this.resetBtnHandler} type="primary">
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
          <RangePicker onCalendarChange={dateChangeHandler} showTime />
          <Row>
            <Col span={18}>
              <Slider
                min={1}
                max={100}
                onChange={this.sliderOnChangeHandler}
                value={
                  typeof numberOfAssetsToDisplay === "number"
                    ? numberOfAssetsToDisplay
                    : 0
                }
              />
            </Col>

            <Col span={4}>
              <InputNumber
                min={1}
                max={100}
                style={{ margin: "0 16px" }}
                value={numberOfAssetsToDisplay}
                onChange={this.sliderOnChangeHandler}
              />
            </Col>
          </Row>

          {this.state.addGeoFence ? (
            <Row>
              <Col span={24}>
                <Input.Group compact>
                  <Search
                    placeholder="Submit GeoFence assetID"
                    allowClear
                    enterButton="Submit"
                    size="middle"
                    onSearch={this.submitgeoFenceData}
                  />
                </Input.Group>
              </Col>
            </Row>
          ) : (
            ""
          )}
        </Dashboard>
        <div style={{ width: "95%", float: "right" }}>
          <Map
            timelineviewData={{
              geoJSONLine: geoJSONLine,
              geofence: geofence,
              expectedTravelRoute: expectedTravelRoute,
            }}
            viewTimelineView={this.viewTimelineView}
            geoJSONLine={this.state.geoJSONLine}
            ref={this.mapRef}
            assetsToDisplay={assetDetails}
            assetToDisplay={findAsset}
            numberOfAssetsToDisplay={numberOfAssetsToDisplay}
            addGeoFence={this.addGeoFenceHandler}
          >
            <DrawControl
              onDrawCreate={this.onDrawCreate}
              onDrawUpdate={this.onDrawUpdate}
            />
          </Map>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assetDetails: state.assetDetails,
    allAssetStore: state.allAssetStore,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    addAssetDetails: (payload) => {
      dispatch({ type: "ADD_ASSET_DETAILS", payload });
    },
    storeAllAssetBackup: (payload) => {
      dispatch({ type: "ALL_ASSET_BACKUP", payload });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
