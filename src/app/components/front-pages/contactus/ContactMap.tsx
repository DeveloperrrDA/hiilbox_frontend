"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Defined locations with their exact country names
const locations = [
  { country: "Somaliland", coordinates: [44.0627, 9.5599] as [number, number] },
  { country: "Somalia", coordinates: [45.3182, 2.0469] as [number, number] },
  { country: "Ethiopia", coordinates: [38.7469, 9.0222] as [number, number] },
];

// Automatically create the highlight list from your locations
const highlightedCountries = locations.map((loc) => loc.country);

const ContactMap = () => {
  return (
    <div className="container-1218 mx-auto">
      <div className="relative h-[500px] w-full overflow-hidden rounded-[24px] border border-gray-100 bg-[#Eefaf2] dark:border-gray-800 dark:bg-dark">
        
        {/* Map Header Overlay */}
        <div className="absolute left-6 top-6 z-10 rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-md dark:bg-darkgray/80">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Our Region</h3>
          <p className="text-sm font-medium text-gray-500">
            Somaliland, Somalia & Ethiopia
          </p>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1800 }}
          className="h-full w-full outline-none"
        >
          <ZoomableGroup center={[45.0, 7.0]} zoom={1} minZoom={1} maxZoom={4}>
            
            {/* Base Map */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Now dynamically checks against the countries in your locations array
                  const isHighlighted = highlightedCountries.includes(geo.properties?.name);
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      stroke="#ffffff"
                      strokeWidth={isHighlighted ? 1 : 0.5}
                      className={`outline-none transition-colors duration-300 ${
                        isHighlighted 
                          ? "fill-primary hover:fill-lightprimary cursor-pointer" 
                          : "fill-[#D1D5DB]"
                      }`}
                      style={{ outline: "none" }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Custom Markers */}
            {locations.map(({ country, coordinates }) => (
              <Marker key={country} coordinates={coordinates}>
                
                {/* Map Dot */}
                <g className="cursor-pointer">
                  <circle r={10} fill="#111c2d" className="animate-ping opacity-30 dark:fill-white" />
                  <circle r={4} fill="#111c2d" stroke="#ffffff" strokeWidth={1.5} className="dark:fill-white dark:stroke-gray-900" />
                </g>

                {/* Styled Label */}
                <foreignObject 
                  x={-60} 
                  y={-45} 
                  width={120} 
                  height={40} 
                  className="pointer-events-none overflow-visible"
                >
                  <div className="flex h-full w-full flex-col items-center justify-end pb-1.5">
                    {/* Neutral Badge Background */}
                    <div className="flex flex-col items-center rounded-lg bg-white px-3 py-1.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-700 dark:bg-darkgray">
                      <span className="text-[11px] font-bold leading-tight text-gray-900 dark:text-white">
                        {country}
                      </span>
                    </div>
                    {/* Tooltip Pointer Triangle */}
                    <div className="-mt-[5px] h-2.5 w-2.5 rotate-45 border-b border-r border-gray-100 bg-white dark:border-gray-700 dark:bg-darkgray" />
                  </div>
                </foreignObject>

              </Marker>
            ))}
            
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};

export default ContactMap;