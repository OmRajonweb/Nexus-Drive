"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Props definition
interface FleetMapProps {
    data: Array<{
        id: number
        lat: number
        lng: number
        status: string
        region: string
        issue: string | null
    }>
}

export default function FleetMap({ data }: FleetMapProps) {
    // Note: CircleMarker doesn't use L.icon, so we might get away with standard imports inside the component
    // But to be safe, if we needed specific L functions we'd do the same dynamic import pattern.
    // Since this file is only loaded dynamically by the parent, standard top-level imports of 'react-leaflet' here are fine
    // AS LONG AS this file is never imported on the server.

    return (
        <MapContainer
            center={[20.5937, 78.9629]} // India Center
            zoom={5}
            style={{ height: "100%", width: "100%", background: "#0B0E12" }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
            />

            {data.map(v => (
                <CircleMarker
                    key={v.id}
                    center={[v.lat, v.lng]}
                    radius={8}
                    pathOptions={{
                        color: v.status === 'healthy' ? '#4ade80' : v.status === 'warning' ? '#facc15' : '#ef4444',
                        fillColor: v.status === 'healthy' ? '#4ade80' : v.status === 'warning' ? '#facc15' : '#ef4444',
                        fillOpacity: 0.6
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong>Vehicle #{v.id}</strong>
                            <br />
                            Status: {v.status.toUpperCase()}
                            {v.issue && <><br /><span className="text-red-500">{v.issue}</span></>}
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}
