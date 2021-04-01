import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import fetchFakeData from "../../api/fetchFakeData";
import { fetchAssets, fetchAssetDetails } from "../../api/apli-client";
import { connect } from "react-redux";
import Popup from "../popup/popup";

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
  async componentDidUpdate() {
    if (this.shouldComponentUpdate) {
      // let assetGeoJson = null;
      // let results = null;
      // if (this.props.assetToDisplay.length > 0) {
      //   // assetGeoJson   = await fetchFakeData({longitude:78.486671 , latitude:17.385044});
      //   results = await this.fetchAssetDetails(this.props.assetToDisplay);
      //   debugger;
      //   results = results.data.filter(
      //     (eachAsset) => eachAsset.id === this.props.assetToDisplay
      //   );
      //   debugger;

      //     assetGeoJson = this.formatToGeoJson(results);

      const { assetsToDisplay, geoJSONLine } = this.props;
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
        debugger;
        if (geoJSONLine && geoJSONLine.data.geometry.coordinates.length > 0) {
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
            this.map.getSource("route").setData("route", {
              ...geoJSONLine,
            });
          }
        } else {
          if (this.map.getSource("route")) {
            this.map.removeLayer("route");
            this.map.removeSource("route");
          }
        }
      }
    }
  }

  setAssetToDisplay = (assetsToDisplay) => {
    this.map.getSource("random-points-data").setData(assetsToDisplay);
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

  // fetchCurrentPosition = ()=>{

  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(function(position) {

  //       const currentPosition = {lat:position.coords.latitude,long:position.coords.longitude}
  //       return currentPosition;
  //     });
  //   } else {
  //     console.log("Not Available");
  //   }

  // }

  loadMap = () => {
    const { lng, lat, zoom } = this.state;

    // debugger;
    console.log(this.props.assetsToDisplay);

    // const currentPosition = this.fetchCurrentPosition();

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom,
    });
    this.map.on("load", () => {
      const { map } = this;
      const { assetsToDisplay } = this.props;

      // add the data source for new a feature collection with no features

      /**Fetching asset locations, Change later */
      // let results = await this.fetchAssetLocations();
      // results = results.data.slice(0, this.props.numberOfAssetsToDisplay);
      // let featureList = results.map((asset, id) => {
      //   return {
      //     type: "Feature",
      //     geometry: {
      //       type: "Point",
      //       coordinates: [
      //         asset.coordinates.long,
      //         asset.coordinates.lat,
      //       ],
      //     },
      //     properties: {
      //       id:`${asset.id}`,
      //       name: `${asset.name}`,
      //       assetType:`${asset.type}`,
      //       description: `description for asset id ${asset.id}`,
      //     },
      //   };
      // });
      // let assetGeoJson = {
      //   type: "FeatureCollection",
      //   features: featureList,
      // };

      // let assetGeoJson = await this.getAllAssetDetails();
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
        }
      );
      debugger;
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

      debugger;

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
  };

  componentWillUnmount() {
    if (this.map) {
      this.map.remove();
      mapboxgl.clearStorage();
    }
  }

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
        />
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
