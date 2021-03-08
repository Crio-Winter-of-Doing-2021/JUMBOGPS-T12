import React from 'react';
import mapboxgl from 'mapbox-gl';
import fetchFakeData from '../../api/fetchFakeData';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVqZXN3YXIiLCJhIjoiY2tscmhqeGl5MGNtYjJ5bXA1ZTh6NmhxbSJ9.MJs8AL6WXpBPZ-qvz-GBqw'

class Map extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          lng: 78.486671 ,
          lat: 17.385044,
          zoom: 7
        };
      }

      fetchAssetLocations = async ()=>{

        const assetDetails = await fetch('http://localhost:8081/assets')
        .then(response => response.json())
        .then(data =>  data);
         return assetDetails;
      }
 

    // componentDidMount(){

    //      const map = new mapboxgl.Map(
    //         {
    //             container:this.mapContainer,
    //             style: 'mapbox://styles/mapbox/streets-v11',
    //             center: [this.state.lng, this.state.lat],
    //             zoom: 12.5,
    //         }
          
    //     )
    //     map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');


    // }


    componentDidMount() {
        const { lng, lat, zoom } = this.state;
    
        const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [lng, lat],
          zoom
        });
        map.on('load', () => {
          // add the data source for new a feature collection with no features
          map.addSource('random-points-data', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });
          // now add the layer, and reference the data source above by name
          map.addLayer({
            id: 'random-points-layer',
            source: 'random-points-data',
            type: 'symbol',
            layout: {
              // full list of icons here: https://labs.mapbox.com/maki-icons
              'icon-image': 'bakery-15', // this will put little croissants on our map
              'icon-padding': 0,
              'icon-allow-overlap': true,
            },
          });

          map.on('moveend', async () => {
            console.log("Moveend event occured")
            // get new center coordinates
            const { lng, lat } = map.getCenter();
         
            // fetch new data
            /**Uncommnet to fetch fake data */
            // const results = await fetchFakeData({longitude:lng, latitude:lat});
     
 
            const results = await this.fetchAssetLocations();
            let featureList = results.map((asset,id)=>{
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [asset.location.coordinates[0][0], asset.location.coordinates[0][1]],
                },
                properties: {
                  id,
                  name: `Random Point #${id}`,
                  description: `description for asset id ${asset.id}`,
                },
              } 
            })
            let assetGeoJson = {
              type: 'FeatureCollection',
              features: featureList,
            }


            // update "random-points-data" source with new data
            // all layers that consume the "random-points-data" data source will be updated automatically
            map.getSource('random-points-data').setData(assetGeoJson);
          });
        });
        
            
         map.on('move', () => {
          const { lng, lat } = map.getCenter();
    
          this.setState({
            lng: lng.toFixed(4),
            lat: lat.toFixed(4),
            zoom: map.getZoom().toFixed(4)
          });
        });
      }
    // render(){
    //     return(
    //             <div className="map-container" ref={el => this.mapContainer = el}/>
    //     )
        
    // }

    componentWillUnmount(){
      if(this.map){
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
            <div ref={el => this.mapContainer = el} style={{width:'100%', height:'100vh'}} className="absolute top right left bottom" />
          </div>
        );
      }
    
}

export default Map;