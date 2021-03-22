import React from 'react';

const Popup = ({features,viewTimelineView})=>{
 


return(
    features !="loading" || undefined ? ( <div>
         <h3>{features.id}</h3>
        <h4>{features.name}</h4>
        <h4>{features.type}</h4>
        <description>{features.description}</description>
        <div onClick={()=>viewTimelineView(features.id)}>Click Here for timeline view</div>
    </div>):<div>'Loading'</div>
)
}

export default Popup;