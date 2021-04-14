# JUMBOGPS-T12
Team ID: JUMBOGPS-T12 | Team Members: Tejeswar &amp; Archisman Chakraborty


# GPS Based asset tracking application

## 1. Overview
* * *
**1.1 Purpose of  this document**

The purpose of this document is describe detail functions and processes involved in the Asset tracking portal

**Objective**
Implementing a GPS based asset tracking dashboard to track all the company’s assets.

This project shall implement a dashboard showing the assets (can be delivery trucks or salespersons) on a map so the assets can be easily tracked, with the option to drill down further into the details of a specific asset.

**Use cases**
- Tracking delivery routes and studying them to choose the most optimal route for the best delivery time.
- Tracking salesperson movements to ensure efficient coverage over geographical areas.
- Reduce costs of delivery by allotting multiple deliverables based on routes.
- Ensuring good customer experience by allowing them to track their orders in real time (this last point may not be a use case for this project, this is meant for a Jumbotail admin to track all assets)


**Technology Stack**
  **Frontend**
- **Language**: Javascript
- **Framework**: ReactJS
- **State Management**: Redux 
- **UI library**: Ant Design
- **Map Library**: Mapbox
- **Web Socket library**: Socket.io
- **Unit Testing**: Jest

**Backend**

- **Language**: Javascript
- **Framework**: Express.js
- **Data base**: MongoDB
- **Unit Testing**: Mocha



* * *
### React Directory layout

**├── /node_modules/ # 3rd-party libraries and utilities                                                                                                           
├── /public/ # Static files which are copied into the /build/public folder                                                                                         
├── /src/ # The source code of the application                                                                                                                     
│ ├── /api/ # Contains API client and axios instance for API calls                                                                                                 
│ ├── /components/ # React components                                                                                                                             
│ ├── /containers/ # Contains component containers                                                                                                                 
│ ├── /hoc/ # Higher Order Components                                                                                                                             
│ ├── /store/ # Contains all Redux related functions                                                                                                               
│ ├── /utils/ # Contains reusable utilities                                                                                                                       
│ ├── /App.js # Wraps all container and components startup script                                                                                                 
│ ├── /App.css # CSS style sheet for App                                                                                                                           
│ ├── /app.test.js # Unit test for App.js                                                                                                                         
│ ├── /Index.js # Startup script                                                                                                                                   
├── package.json # The list of dependencies and utilities**

* * *


# Mapbox Proof Of Concept

## Introduction

This project is implementation of dashboard showing the assets (can be delivery trucks or salespersons) on a map so the assets can be easily tracked, with the option to drill down further into the details of a specific asset	

### Oppurtunity Statement

To determine the location of assets on a map, Client needs to be integrated with any 3rd 	party map services to display assets


### Solution components

Created a Proof of Concept by integrating frontend React with Mapbox to display assets on the Map

#### Steps to Integrate 

1. Install mapbox-gl as dependancy
2. Create a Mapbox token at https://account.mapbox.com to access mapbox services
3. In Map component on mounting intialize mapboxgl
4. Using mapbox events ‘load’ add pass asset data points/locations to the mapbox as 	    geoJson
5. start application to view map component on browser

![58b55c6fca46ab7705f65642a8386aeb.png](:/908aaf871f23475b8f2e0a4009644aed)



