import React, { useState } from "react";
// @ts-ignore
import GoogleMapReact from "google-map-react";
import moment from "moment";

function Mapp(props: any) {
  const [stores] = useState(props.mapCheckInData);

  const AnyReactComponent = (props: any) => {
    return <div>{props.text}</div>;
  };
  return (
    <div className="dashboard_map_card">
      <GoogleMapReact
        defaultCenter={{
          lat: stores[0]?.extraDetails?.coords?.latitude,
          lng: stores[0]?.extraDetails?.coords?.longitude,
        }}
        center={{
          lat: stores[0]?.extraDetails?.coords?.latitude,
          lng: stores[0]?.extraDetails?.coords?.longitude,
        }}
        defaultZoom={12}
      >
        {stores.map((item: any, i: number) => {
          let label = `CheckIn Date :- ${moment(item.performedAt).format(
            "YYYY-MM-DD"
          )} \nCheckIn Time :- ${moment(item.performedAt).format(
            "hh:mm:ss A"
          )} \nLead :- ${item.lead}`;
          return (
            <AnyReactComponent
              key={i}
              lat={item.extraDetails.coords.latitude}
              lng={item.extraDetails.coords.longitude}
              text={
                <i
                  className="fa fa-map-marker"
                  aria-hidden="true"
                  title={label}
                  style={{ color: "red", fontSize: "20px" }}
                ></i>
              }
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
export default Mapp;
