import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker, FlyToInterpolator } from "react-map-gl";
import React, { useState, useRef, useCallback } from "react";
import useSwr from "swr";
import useSupercluster from "use-supercluster";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
//app bar
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
//accodian
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const fetcher = (...args) => fetch(...args).then((Response) => Response.json());

//appbar
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function App() {
  //material styles:

  const classes = useStyles();
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 12,
  });
  const geocoderContainerRef = useRef();
  const mapRef = useRef();
  const url = "http://localhost:2001/api/logs";
  const { data, error } = useSwr(url, fetcher);
  const nycmeters = data && !error ? data.slice(0, 1000) : [];

  const points = nycmeters.map((nycmeter) => ({
    ...nycmeter,
    properties: {
      ...nycmeter.properties,
      cluster: false,
    },
  }));

  //bounds
  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;
  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });
  //geocoder
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  return (
    <div>
      <div
        className={classes.root}
        // ref={geocoderContainerRef}
        style={{
          position: "absolute",
          top: 50,
          left: 50,
          zIndex: 1,
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
              <div ref={geocoderContainerRef}></div>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>parking infor.</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <ReactMapGl
        {...viewport}
        maxZoom={20}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        containerStyle={{
          height: "90vh",
          width: "90vw",
        }}
        onViewportChange={setViewport}
        ref={mapRef}
      >
        {clusters.map((cluster) => {
          // every cluster point has coordinates
          const [longitude, latitude] = cluster.geometry.coordinates;
          // the point may be either a cluster or a crime point
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;

          // we have a cluster to render
          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={latitude}
                longitude={longitude}
              >
                <div>
                  <div
                    style={{
                      borderWidth: 1,
                      borderColor: "rgba(0,0,0,0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      borderRadius: 100,

                      width: 30 + (pointCount / points.length) * 100,
                      height: 30 + (pointCount / points.length) * 100,
                    }}
                    onClick={() => {
                      //supercluster for zoomin
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      );

                      setViewport({
                        ...viewport,
                        latitude,
                        longitude,
                        zoom: expansionZoom,
                        transitionInterpolator: new FlyToInterpolator({
                          speed: 2,
                        }),
                        transitionDuration: "auto",
                      });
                    }}
                  >
                    {pointCount}
                  </div>
                </div>
              </Marker>
            );
          }
          return (
            <Marker
              key={cluster._id} //point._id
              latitude={latitude}
              longitude={longitude}
            >
              <div style={{ width: 20, height: 20 }}>
                <img src="images/parkingStop.svg" alt="nycmeter" />
              </div>
            </Marker>
          );
        })}
        <Geocoder
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          position="top-left"
        />
      </ReactMapGl>
    </div>
  );
}
