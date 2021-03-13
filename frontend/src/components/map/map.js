import React from "react";
import mapboxgl from "mapbox-gl";
import fetchFakeData from "../../api/fetchFakeData";
import { fetchAssets } from "../../api/apli-client";
import { connect } from "react-redux";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGVqZXN3YXIiLCJhIjoiY2tscmhqeGl5MGNtYjJ5bXA1ZTh6NmhxbSJ9.MJs8AL6WXpBPZ-qvz-GBqw";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 78.486671,
      lat: 17.385044,
      zoom: 7,
      dispHistoryOfRoute:false
    };
  }

  fetchAssetLocations = async () => {
    const assetDetails = await fetchAssets();

    this.props.addAssetDetails(assetDetails.data);
    return assetDetails.data;
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.numberOfAssetsToDisplay != nextProps.numberOfAssetsToDisplay ||
      this.props.assetToDisplay != nextProps.assetToDisplay
    );
  }

  async componentDidUpdate() {
    if (this.shouldComponentUpdate) {
      // this.loadMap()
      let assetGeoJson = null;
      let results = null;
      console.log(this.props.assetToDisplay);
      if (this.props.assetToDisplay.length > 0) {
        // assetGeoJson   = await fetchFakeData({longitude:78.486671 , latitude:17.385044});
        results = await this.fetchAssetLocations();
        console.log(results);
        results = results.filter(
          (eachAsset) => eachAsset.id === this.props.assetToDisplay
        );
        this.map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [78.52185571453919, 17.4397333235504],
                [78.53185571453918, 17.4397333235505],
                [78.54185571453919, 17.4397333235506],
                [78.55185571453919, 17.4397333235507],
                [78.56185571453919, 17.4397333235508],
              ],
            },
          },
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

        assetGeoJson = this.formatToGeoJson(results);
      } else {
        //  results = await fetchFakeData({longitude:78.486671 , latitude:17.385044});
        results = await this.fetchAssetLocations();
        assetGeoJson = this.formatToGeoJson(results);
      }

      this.map.getSource("random-points-data").setData(assetGeoJson);
    }
  }
  formatToGeoJson = (assetDetails) => {
    assetDetails.slice(0, this.props.numberOfAssetsToDisplay);
    let featureList = assetDetails.map((asset, id) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            asset.location.coordinates[0][0],
            asset.location.coordinates[0][1],
          ],
        },
        properties: {
          id,
          name: `Random Point #${id}`,
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
  componentDidMount() {
    this.loadMap();
  }

  loadMap = () => {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom,
    });
    this.map.on("load", async () => {
      // add the data source for new a feature collection with no features

      /**Fetching asset locations, Change later */
      let results = await this.fetchAssetLocations();
      results = results.slice(0, this.props.numberOfAssetsToDisplay);
      let featureList = results.map((asset, id) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              asset.location.coordinates[0][0],
              asset.location.coordinates[0][1],
            ],
          },
          properties: {
            id,
            name: `Random Point #${id}`,
            description: `description for asset id ${asset.id}`,
          },
        };
      });
      let assetGeoJson = {
        type: "FeatureCollection",
        features: featureList,
      };
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
          "icon-image": "triangle-15", // this will put little croissants on our map
          "icon-padding": 0,
          "icon-allow-overlap": true,
          

          
        },
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
      const { lng, lat } = this.map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(4),
      });
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
          className="absolute top right left bottom"
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
export default connect(mapStateToProps, mapDispatchToProps)(Map);
