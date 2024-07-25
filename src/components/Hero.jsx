import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Spinner = () => {
  return <div className="loader-06"></div>;
};

const spinnerStyles = `
  .loader-06 {
    border: 0.2em solid #3498db;
    border-radius: 50%;
    animation: loader-06 1s ease-out infinite;
    width: 50px; /* Adjust size as needed */
    height: 50px; /* Adjust size as needed */
    border-top: 0.2em solid transparent;
  }

  @keyframes loader-06 {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

const svgIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="60">
   <path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/>
 </svg>
`;

const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgIcon)}`;
const defaultIcon = new L.Icon({
  iconUrl: svgDataUrl,
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function MapWithNoZoomControl() {
  const map = useMap();

  useEffect(() => {
    map.zoomControl.remove();
  }, [map]);

  return null;
}

// Debounce function to delay search
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function Hero() {
  const [userLocation, setUserLocation] = useState(null);
  const [getinput, userGetInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ipInfo, setIpInfo] = useState({
    ip: "",
    city: "",
    region: "",
    country: "",
    loc: "",
    timezone: "",
    org: "",
  });

  // Debounce function to delay search
  const debounceFetchIpInfo = useCallback(
    debounce((input) => {
      if (input) {
        setLoading(true);
        fetch(`https://ipinfo.io/${input}/json?token=0ce15ff2786069`)
          .then((response) => response.json())
          .then((json) => {
            setIpInfo({
              ip: json.ip,
              city: json.city,
              region: json.region,
              country: json.country,
              loc: json.loc,
              timezone: json.timezone,
              org: json.org,
            });

            if (json.loc) {
              const [latitude, longitude] = json.loc.split(",").map(Number);
              setUserLocation({ latitude, longitude });
            }
          })
          .catch((error) => console.error("Error:", error))
          .finally(() => setLoading(false)); // Ensure loading is set to false
      }
    }, 1000), // Debounce for 1 second
    []
  );

  function handleUserInput(e) {
    e.preventDefault();
    debounceFetchIpInfo(getinput); // Call debounced function
  }

  function handleInputChange(e) {
    userGetInput(e.target.value);
  }

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  return (
    <>
      <style>{spinnerStyles}</style>
      <section className="bg-mobile-bg md:bg-desktop-bg bg-cover h-screen flex flex-col">
        <div className="flex flex-col h-full">
          {/* First Section: Content */}
          <div className="text-white p-6 flex flex-col h-1/3 md:h-2/5">
            <div className="w-full flex flex-col items-center">
              <h1 className="text-xl md:text-4xl mb-6 font-bold">
                IP Address Tracker
              </h1>
              <div className="flex items-center justify-center w-[300px] md:w-[600px] h-14 rounded-lg mb-8 relative">
                <input
                  type="search"
                  className="bg-white outline-none text-black w-full h-full px-4 rounded-l-lg"
                  placeholder="Search for any IP address or domain"
                  aria-label="Search"
                  id="exampleFormControlInput"
                  aria-describedby="basic-addon1"
                  value={getinput}
                  onChange={handleInputChange} // Handle input change
                />
                {/* SVG icon */}
                <div
                  className="flex items-center justify-center bg-black h-full px-4 rounded-r-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-700"
                  onClick={handleUserInput}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <path
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="3"
                      d="M2 1l6 6-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-40 mt-1 md:mt-8 z-index left-100 w-[300px] md:w-[750px] lg:w-[1000px] rounded-xl h-60 md:h-40 bg-white shadow-md grid grid-cols-1 md:grid-cols-4 p-0 md:p-4 items-center">
                <div className="border-r text-center md:text-left border-gray-300 p-2">
                  <h3 className="text-gray-500 text-sm">IP ADDRESS</h3>
                  <h1 className="text-black text-sm md:text-2xl font-bold">
                    {ipInfo.ip || "N/A"}
                  </h1>
                </div>
                <div className=" border-r text-center md:text-left border-gray-300 p-2">
                  <h3 className="text-gray-500 text-sm">LOCATION</h3>
                  <h1 className="text-black text-sm md:text-2xl font-bold">
                    {ipInfo.loc || "N/A"}
                  </h1>
                </div>
                <div className="border-r text-center md:text-left border-gray-300 p-2">
                  <h3 className="text-gray-500 text-sm">TIMEZONE</h3>
                  <h1 className="text-black text-sm md:text-2xl font-bold">
                    {ipInfo.timezone || "N/A"}
                  </h1>
                </div>
                <div className="p-2 text-center md:text-left border-none">
                  <h3 className="text-gray-500 text-sm">ISP</h3>
                  <h1 className="text-black text-sm md:text-xl font-bold">
                    {ipInfo.org || "N/A"}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Second Section: Map */}
          <div className="relative flex-1">
            {loading ? (
              <div className="flex items-center justify-center text-white h-full">
                <Spinner /> {/* Display spinner while loading */}
              </div>
            ) : userLocation ? (
              <MapContainer
                center={[userLocation.latitude, userLocation.longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <Marker
                  position={[userLocation.latitude, userLocation.longitude]}
                  icon={defaultIcon}
                >
                  <Popup>
                    You are here: <br /> Latitude: {userLocation.latitude}{" "}
                    <br /> Longitude: {userLocation.longitude}
                  </Popup>
                </Marker>
                <MapWithNoZoomControl />
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center text-white h-full">
                <p className="text-lg">Fetching your location...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
