import React, { useMemo } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Autocomplete
} from "@react-google-maps/api";
import { boundary, boundaryPin, country } from "../modules/utils/constant";
import { TextField } from "@mui/material";
import mapbordericon  from "../assets/images/mapbordericon.svg"

const placesLibrary: any = ['places']

interface IMapProps {
  markers: any;
  setMarkers: any;
  handleMapClick: any
  drag: any
  setDrag: any
}

const Map: React.FC<IMapProps> = ({
  markers,
  setMarkers,
  handleMapClick,
  drag,
  setDrag
}) => {

  const [searchResult, setSearchResult] = React.useState<any>()

  const onLoad = (autocomplete: any) => {
    setSearchResult(autocomplete);
}

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: placesLibrary
  });
  const center = useMemo(() => ({ lat: markers.lat, lng: markers.lng }), [markers]);

  const handleMapDragEnd = (map: any) => {
    const newPosition = {
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng()
    };
    setMarkers(newPosition);
  };

  React.useEffect(() => {
    // Fetch location details based on latitude and longitude
    if (markers && markers.lng !== undefined && markers.lat !== null) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${markers.lat},${markers.lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setDrag(data?.results[0])
        })
        .catch(error => {
          console.error('Error fetching location details:', error);
        });
    }
  }, [markers]);

  const locationSelected = () =>{
    if (searchResult) {
        const place = searchResult.getPlace();
        const newPosition = {
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng()
        };
        setMarkers(newPosition);
    }
}

  return (
    <div className="map-div">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          center={center}
          zoom={markers.lat ? 14 : 1}
          mapContainerClassName={'map-container'}
          onClick={handleMapClick}
          onLoad={(map: any) => {
            map.addListener('dragend', () => handleMapDragEnd(map));
          }}
          options={{
            restriction: {
              latLngBounds: boundary,
            },
          }}
        >
          <MarkerF position={center} title="Drag me" />
          <MarkerF
              position={boundaryPin.east}
              title="Boundary restricted"
              icon={{
                url: mapbordericon,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <MarkerF
              position={boundaryPin.west}
              title="Boundary restricted"
              icon={{
                url: mapbordericon,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <MarkerF
              position={boundaryPin.north}
              title="Boundary restricted"
              icon={{
                url: mapbordericon,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <MarkerF
              position={boundaryPin.south}
              title="Boundary restricted"
              icon={{
                url: mapbordericon,
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
            <Autocomplete onLoad={onLoad} onPlaceChanged={locationSelected} className='search-input-map'
              restrictions={{
                country: country,
              }}
              options={{
                strictBounds: true,
              }}
            >
                <TextField
                    variant="outlined"
                    type='search'
                    size="small"
                    sx={{ ml: { xs: 0, sm: 2, lg: 2 }, mt: { xs: 2, sm: 0, lg: 8 }, mr: { xs: 0, sm: 2, lg: 2 }, backgroundColor: '#FFFFFF' }}
                    fullWidth
                    placeholder="Search for Area, Street Name..." />
            </Autocomplete>
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
