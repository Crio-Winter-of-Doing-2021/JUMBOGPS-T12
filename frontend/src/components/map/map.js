import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import fetchFakeData from "../../api/fetchFakeData";
import { fetchAssets, fetchAssetDetails } from "../../api/apli-client";
import { connect } from "react-redux";
import Popup from "../popup/popup";
import DrawControl from "react-mapbox-gl-draw";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import { message } from "antd";

var draw;
mapboxgl.accessToken =
  "pk.eyJ1IjoidGVqZXN3YXIiLCJhIjoiY2tscmhqeGl5MGNtYjJ5bXA1ZTh6NmhxbSJ9.MJs8AL6WXpBPZ-qvz-GBqw";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 78.333019,
      lat: 17.49593,
      zoom: 18,
      dispHistoryOfRoute: false,
    };
  }

  // fetchAssetLocations =  () => {
  //   const assetDetails =  fetchAssets();

  //   this.props.addAssetDetails(assetDetails);
  //   return assetDetails;
  // };

  fetchAssetDetails = async (id) => {
    let assetDetails = await fetchAssetDetails(id);
    // this.setState({selectedAssetDetails:assetDetails});
    return assetDetails;
  };

  shouldComponentUpdate(nextProps, nextState) {
    // return (
    //   this.props.numberOfAssetsToDisplay != nextProps.numberOfAssetsToDisplay ||
    //   this.props.assetToDisplay != nextProps.assetToDisplay || this.state!=nextState
    // );

    return this.props != nextProps || this.state.nextState;
  }

  viewTimelineView = async (findAsset) => {
    this.props.viewTimelineView(findAsset);
  };

  drawPolygon = (points) => {
    this.map.addLayer({
      id: "maine",
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: points,
          },
        },
      },
      layout: {},
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.3,
      },
    });
  };
  async componentDidUpdate() {
    const map = this.map;
    if (this.shouldComponentUpdate) {

      const { assetsToDisplay, geoJSONLine, timelineviewData } = this.props;
      if (assetsToDisplay) {
        if (this.map.getSource("random-points-data")) {
          this.map.getSource("random-points-data").setData(assetsToDisplay);
        }
        if (assetsToDisplay.features && assetsToDisplay.features.length > 0) {
          this.map.flyTo({
            center: [
              assetsToDisplay.features[0].geometry.coordinates[0],
              assetsToDisplay.features[0].geometry.coordinates[1],
            ],
            essential: true,
          });
        }
        if (geoJSONLine && geoJSONLine.data.geometry.coordinates.length > 0) {
          debugger;
          if (!this.map.getSource("route")) {
            this.map.addSource("route", {
              ...geoJSONLine,
            });
            this.map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#888",
                "line-width": 8,
              },
            });
          } else {
            debugger;
            this.map.getSource("route").setData(geoJSONLine.data);
            this.map.panTo(
              geoJSONLine.data.geometry.coordinates[
                geoJSONLine.data.geometry.coordinates.length - 1
              ]
            );
          }
        } else {
          if (this.map.getSource("route")) {
            this.map.removeLayer("route");
            this.map.removeSource("route");
          }
        }

      }

      if(timelineviewData.expectedTravelRoute){
        if (!this.map.getSource("expectedTravelRoute")) {
          this.map.addSource("expectedTravelRoute", {
            ...timelineviewData.expectedTravelRoute,
          });
          this.map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 10,
            },
          });
        } else {

          this.map.getSource("expectedTravelRoute").setData(timelineviewData.expectedTravelRoute.data);
          this.map.panTo(
            timelineviewData.expectedTravelRoute.data.geometry.coordinates[
              timelineviewData.expectedTravelRoute.data.geometry.coordinates.length - 1
            ]
          );
        }
        debugger;
        if(timelineviewData.geofence){

          if(!this.map.getSource('maine')){
            this.drawPolygon(timelineviewData.geofence);
          }

        } else{
          if(this.map.getSource('maine')){
            this.map.removeLayer("maine").removeSource("maine");
          }
      
        }

      }
    }
  }
  onDrawCreate = ({ features }) => {
    console.log(features);
  };

  onDrawUpdate = ({ features }) => {
    console.log(features);
  };
  setAssetToDisplay = (assetsToDisplay) => {
    this.map.getSource("random-points-data").setData(assetsToDisplay);
    if (this.map.getSource("route")) {
      this.map.removeLayer("route");
    }
  };
  formatToGeoJson = (assetDetails) => {
    debugger;

    let featureList = assetDetails[0].location.coordinates.map(
      (coordinates, id) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [coordinates.long, coordinates.lat],
          },
          properties: {
            id: `${assetDetails[0].id}`,
            name: `${assetDetails[0].name}`,
            assetType: `${assetDetails[0].type}`,
            description: `description for asset id ${assetDetails[0].id}`,
            timeStamp: `${coordinates.ts}`,
          },
        };
      }
    );
    let assetGeoJson = {
      type: "FeatureCollection",
      features: featureList,
    };

    return assetGeoJson;
  };
  componentDidMount() {
    this.loadMap();
  }

  getAllAssetDetails = async () => {
    debugger;
    // let results = await this.fetchAssetLocations();
    let results = this.props.assetDetails;
    debugger;
    results = results.data.slice(0, this.props.numberOfAssetsToDisplay);
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
        },
      };
    });
    let assetGeoJson = {
      type: "FeatureCollection",
      features: featureList,
    };

    return assetGeoJson;
  };

  loadMap = () => {
    const { lng, lat, zoom } = this.state;

    // debugger;
    console.log(this.props.assetsToDisplay);

    // const currentPosition = this.fetchCurrentPosition();
    const { map } = this;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom,
    });

    this.map.on("load", () => {
      console.log("Did not go to load");
      const { map } = this;
      const { assetsToDisplay } = this.props;
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
        }
      );
      console.log(assetsToDisplay);
      if (assetsToDisplay.features && assetsToDisplay.features.length) {
        map.flyTo({
          center: [
            assetsToDisplay.features[0].geometry.coordinates[0],
            assetsToDisplay.features[0].geometry.coordinates[1],
          ],
          essential: true,
        });
      }
      let assetGeoJson = assetsToDisplay;
      this.map.addSource("random-points-data", {
        type: "geojson",
        data: assetGeoJson,
      });
      // now add the layer, and reference the data source above by name
      this.map.addLayer({
        id: "random-points-layer",
        source: "random-points-data",
        type: "symbol",
        layout: {
          // full list of icons here: https://labs.mapbox.com/maki-icons
          "icon-image": "custom-marker", // this will put little croissants on our map
          "icon-allow-overlap": true,
        },
      });

      this.map.on("click", "random-points-layer", (e) => {
        // this.fetchAssetDetails(e.features[0].properties.id);
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            viewTimelineView={this.viewTimelineView}
            features={e.features[0].properties}
          />,
          popupNode
        );

        let coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        var popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(popupNode)
          // .setHTML(description)
          .addTo(this.map);

        this.map.on("mouseenter", "random-points-layer", (e) => {
          if (e.features.length) {
            this.map.getCanvas().style.cursor = "pointer";
          }
        });

        this.map.on("mouseleave", "random-points-layer", () => {
          this.map.getCanvas().style.cursor = "";
          popup.remove();
        });
      });

      this.map.on("mouseenter", "random-points-layer", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popupNode = document.createElement("div");
        ReactDOM.render(
          <Popup
            viewTimelineView={this.viewTimelineView}
            features={e.features[0].properties}
          />,
          popupNode
        );

        var popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(popupNode)
          // .setHTML(description)
          .addTo(this.map);

        this.map.on("mouseleave", "random-points-layer", () => {
          this.map.getCanvas().style.cursor = "";
          popup.remove();
        });
      });

      this.map.on("moveend", async () => {
        // get new center coordinates
        // fetch new data
        /**Uncommnet to fetch fake data */
        // const results = await fetchFakeData({longitude:lng, latitude:lat});
        // let results = await this.fetchAssetLocations();
        // let assetGeoJson = this.formatToGeoJson(results);
        /**
         * update "random-points-data" source with new data
         * all layers that consume the "random-points-data" data source will be updated automatically
         * */
        // this.map.getSource("random-points-data").setData(assetGeoJson);
      });
    });

    this.map.on("move", () => {
      //   const { lng, lat } = this.map.getCenter();
      //   console.log(`lng:${lng}`)
      //   console.log(`lat:${lat}`)
      //   this.setState({
      //     lng: lng.toFixed(4),
      //     lat: lat.toFixed(4),
      //     zoom: this.map.getZoom().toFixed(4),
      //   });
    });
    draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    this.map.addControl(draw);
    this.map.on("draw.create", this.createArea);
    this.map.on("draw.delete", this.deleteArea);
    this.map.on("draw.update", this.updateArea);
  };

  componentWillUnmount() {
    const map = this.map;
    console.log("This is map log" + this.map);
    console.log(map);
    if (map) {
      map.remove();
      mapboxgl.clearStorage();
    }
  }

  createArea = (e) => {
    debugger;
    const {addGeoFence} = this.props
    let data = draw.getAll();
    const polygonData = data.features[0].geometry.coordinates;
    debugger;
    addGeoFence(polygonData);
    message.info("Please submit the geojson asset ID from dashboard filter")
    this.drawPolygon(polygonData);
    this.polygonDataCalc(data);
  };

  polygonDataCalc = (data) => {
    debugger;
    console.log(turf);
    let area = turf.area(data);
    let centroid = turf.centroid(data);
    let rounded_area = Math.round(area * 100) / 100;
    this.polygonDiv.innerHTML =
      "<p><strong>Area: " +
      rounded_area +
      " square meter</strong></p><h4>Centroid: <br />" +
      centroid.geometry.coordinates +
      "</h4>";
  };

  deleteArea =  ()=>{
    this.map.removeLayer("maine").removeSource("maine");
    this.map.removeLayer("maine").removeSource("maine");
  }
  updateArea = (e) => {
    console.log(e);
    let data = draw.getAll();
    debugger;
    this.map.removeLayer("maine").removeSource("maine");
    const polygonData = data.features[0].geometry.coordinates;
    this.drawPolygon(polygonData);
    this.polygonDataCalc(data);
  };
  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        {/* <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
              <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
            </div> */}
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{ width: "100%", height: "100vh" }}
          className="absolute top right left bottom map-component"
        >
          <div id="calculated-area" ref={(el) => (this.polygonDiv = el)}></div>
        </div>
      </div>
    );
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
export default Map;
