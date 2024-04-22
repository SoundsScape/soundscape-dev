import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import eventsData from "../musicEvents";
import FlyToMarker from "./FlyToMarker";
import Filter from "./Filter";

const defaultPosition: [number, number] = [51.505, -0.09];

export interface MusicEvent {
  id: number;
  title: string;
  description: string;
  position: [number, number];
  category: string;
  date: string;
}

const emptyStar = <i className="fa-regular fa-star"></i>;
const fullStar = (
  <i
    className="fa-solid fa-star"
    style={{
      color: "#fdc401",
    }}
  ></i>
);

function MapsApp() {
  const icon: Icon = new Icon({
    iconUrl: "marker.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<MusicEvent | null>(null);
  const [favourites, setFavourites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem("favourites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

  const handleFavouriteClick = (eventId: number) => {
    let updatedFavourites = favourites.filter((id) => id !== eventId);

    if (!favourites.includes(eventId)) {
      updatedFavourites = [eventId, ...updatedFavourites];
    }

    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  const handleListItemClick = (eventId: number) => {
    const event = eventsData.find((event) => event.id === eventId);

    if (event) {
      setActiveEvent(event);
    }
  };

  const handleDecadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDecade(parseInt(e.target.value));
  };

  return (
    <div className="content">
      <div className="map-content flex flex-col gap-6 h-full">
        <div className="filter">
          <Filter setSelectedCategory={setSelectedCategory} />
          {/* Input range para seleccionar la década */}
          <input
            type="range"
            min="1950"
            max="2020"
            step="10"
            onChange={handleDecadeChange}
            className="decade-slider"
          />
          {/* Etiqueta para mostrar la década seleccionada */}
          <p>Decade: {selectedDecade}s</p>
        </div>
        <MapContainer
          center={defaultPosition}
          zoom={2}
          className="map-container"
          maxBounds={[
            [-90, -180],
            [90, 180]
          ]}
          minZoom={2}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Filtrar y mostrar solo los eventos de la década seleccionada */}
          {eventsData
            .filter((event) => {
              if (selectedCategory && event.category !== selectedCategory) {
                return false;
              }
              if (selectedDecade) {
                const eventYear = parseInt(event.date);
                return eventYear >= selectedDecade && eventYear < selectedDecade + 10;
              }
              return true;
            })
            .map((event) => {
              return (
                <Marker
                  key={event.id}
                  position={event.position}
                  icon={icon}
                  eventHandlers={{
                    click: () => {
                      setActiveEvent(event);
                    },
                  }}
                />
              );
            })}
          {activeEvent && (
            <Popup position={activeEvent.position}>
              <div className="popup-inner">
                <h2 className="popup-inner__title">{activeEvent.title}</h2>
              </div>
              <p className="popup-inner__description">
                {activeEvent.description}
              </p>
              <button
                className="popup-inner__button"
                onClick={() => handleFavouriteClick(activeEvent.id)}
              >
                {favourites.includes(activeEvent.id) ? (
                  <span>{fullStar} Unfavourite</span>
                ) : (
                  <span>{emptyStar} Favourite</span>
                )}
              </button>
            </Popup>
          )}

          {activeEvent && (
            <FlyToMarker position={activeEvent.position} zoomLevel={10} />
          )}
        </MapContainer>
      </div>

      <div className="liked-events">
        <h2 className="liked-events__title">
          <i className="fa-solid fa-star"></i> Favourite Events
        </h2>
        <ul>
          {favourites
            .map((id) => {
              return eventsData.find((event) => event.id === id);
            })
            .map((event) => {
              return (
                <li
                  key={event?.id}
                  className="liked-events__event"
                  onClick={() => {
                    handleListItemClick(event?.id as number);
                  }}
                >
                  <h3>{event?.title}</h3>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default MapsApp;
