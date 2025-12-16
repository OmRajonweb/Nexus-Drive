"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Props definition
interface TripMapProps {
    center: [number, number]
    range: number
    chargingStations: Array<{
        id: number
        lat: number
        lng: number
        name: string
        power: string
        available: number
    }>
    selectedStation: number | null
    onStationSelect: (id: number) => void
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, map.getZoom())
    }, [center, map])
    return null
}

export default function TripMap({ center, range, chargingStations, selectedStation, onStationSelect }: TripMapProps) {
    const [Leaflet, setLeaflet] = useState<any>(null)

    useEffect(() => {
        // Dynamically import Leaflet on client only
        import("leaflet").then((L) => {
            setLeaflet(L.default || L)
        })
    }, [])

    if (!Leaflet) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground bg-[#0B0E12]">
                Loading Map...
            </div>
        )
    }

    // Define icons using the imported Leaflet instance (Client Side Only)
    const icon = Leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    })

    const stationIcon = Leaflet.divIcon({
        className: "custom-div-icon",
        html: `<div style='background-color: #00E0FF; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px #00E0FF; border: 2px solid #fff;'></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    })

    return (
        <MapContainer
            center={center}
            zoom={11}
            style={{ height: "100%", width: "100%", background: "#0B0E12" }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <MapController center={center} />

            <Circle
                center={center}
                radius={range * 1000}
                pathOptions={{ color: '#00E0FF', fillColor: '#00E0FF', fillOpacity: 0.1, weight: 1 }}
            />

            <Marker position={center} icon={icon}>
                <Popup>Your Location</Popup>
            </Marker>

            {chargingStations.map(st => (
                <Marker
                    key={st.id}
                    position={[st.lat, st.lng]}
                    icon={stationIcon}
                    eventHandlers={{
                        click: () => onStationSelect(st.id)
                    }}
                >
                    <Popup className="glass-popup">
                        <div className="p-1">
                            <strong className="text-sm">{st.name}</strong>
                            <br />
                            <span className="text-xs text-muted-foreground">{st.power} • {st.available} Open</span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
