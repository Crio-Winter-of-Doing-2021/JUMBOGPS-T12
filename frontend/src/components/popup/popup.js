import React from 'react';

const Popup = ({features,viewTimelineView})=>{

    debugger;
    var d = new Date(features.timeStamp),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 

return(
    features !="loading" || undefined ? ( <div className="popup-container">
         <h3><b>Asset ID</b>: {features.id}</h3>
        <h4><b>Asset Name</b>: {features.name}</h4>
        <h4>{features.type}</h4>
        <h4>{days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm}</h4>
        <div onClick={()=>viewTimelineView(features.id)}>Click Here for timeline view</div>
    </div>):<div>'Loading'</div>
)
}

export default Popup;