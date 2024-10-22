import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Context } from "../store/appContext.jsx";
import { useLocation } from "react-router-dom";

const LIBRARIES = ["places"];

const Map = (props) => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const [center, setCenter] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [visualLocation, setVisualLocation] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [isAdding, setIsAdding] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, [location.pathname]);

  const addMarkers = useCallback(
    (newLocation) => {
      actions.setLatLng(newLocation);
      setVisualLocation(newLocation);
    },
    [actions]
  );

  const getCountryFromCoordinates = async (latitude, longitude) => {
    if (location.pathname === "/dashboard") {
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (data.address && data.address.country) {
          return data.address;
        } else {
          throw new Error("Country not found in response.");
        }
      } catch (error) {
        console.error("Error fetching country:", error);
        return null;
      }
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            description: "Ubicación Actual",
          };
          setCenter(location); // Centrar el mapa en la ubicación actual
          setMyPosition(location); // Guardar la ubicación actual en myPosition
          const address = await getCountryFromCoordinates(
            location.lat,
            location.lng
          );
          //actions.getAdress(address);  // Llamamos a la acción con la dirección
        },
        (error) => {
          console.error("Error getting location: ", error);
          setCenter({ lat: 40.7128, lng: -74.006 }); // Ubicación fallback
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [actions]);

  const onMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const onMapClick = useCallback(
    (event) => {
      if (isAdding) {
        const location = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setNewMarkerPosition(location);
      }
    },
    [isAdding]
  );

  return (
    <div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_MAP_KEY} libraries={LIBRARIES}>
        {center && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={center}
            zoom={12}
            onClick={onMapClick}
          >
            {myPosition && (
              <Marker
                position={{ lat: myPosition.lat, lng: myPosition.lng }}
                onClick={() => onMarkerClick("")}
              />
            )}

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div>
                  <h4>
                    {selectedMarker.description
                      ? selectedMarker.description
                      : selectedMarker.name}
                  </h4>
                  <hr />
                  <p>
                    {selectedMarker.address
                      ? selectedMarker.address
                      : "Sin dirección disponible"}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default Map;
