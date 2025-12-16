"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Zap, Navigation, Battery } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import of the map component to disable SSR for it entirely
const TripMap = dynamic(() => import("@/components/maps/TripMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-[#0B0E12] text-muted-foreground">Loading Map...</div>
})

const chargingStations = [
    { id: 1, lat: 12.9716, lng: 77.5946, name: "Nexus Supercharge - MG Road", power: "150kW", available: 4 },
    { id: 2, lat: 12.9352, lng: 77.6245, name: "GreenDrive Hub - Koramangala", power: "60kW", available: 2 },
    { id: 3, lat: 13.0285, lng: 77.5458, name: "EcoVolt Station - Yeshwantpur", power: "150kW", available: 6 },
    { id: 4, lat: 12.8452, lng: 77.6602, name: "E-City Fast Charge", power: "350kW", available: 1 },
]

export function TripPlanner() {
    const [range, setRange] = useState(250) // km
    const [center] = useState<[number, number]>([12.9716, 77.5946]) // Bengaluru
    const [selectedStation, setSelectedStation] = useState<number | null>(null)

    return (
        <div className="h-full flex flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold text-gradient font-[family-name:var(--font-orbitron)]">SMART TRIP PLANNER</h2>
                    <p className="text-muted-foreground text-sm">AI-Calculated Range & Charging Stops</p>
                </div>
                <div className="flex items-center gap-3 glass-card-static px-4 py-2 rounded-xl">
                    <Battery className="w-5 h-5 text-green-400" />
                    <span className="font-bold">87%</span>
                    <span className="text-sm text-muted-foreground">~340 km range</span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Controls */}
                <Card className="glass-card-static p-6 flex flex-col gap-6">
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Projected Range (km)</label>
                        <div className="flex items-center gap-4">
                            <Slider
                                value={[range]}
                                onValueChange={(v) => setRange(v[0])}
                                max={400}
                                step={10}
                                className="flex-1"
                            />
                            <span className="font-mono font-bold w-12">{range}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Adjust based on load and AC usage.</p>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                        <h3 className="font-semibold text-primary flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Nearby Superchargers
                        </h3>
                        {chargingStations.map(station => (
                            <div
                                key={station.id}
                                onClick={() => setSelectedStation(station.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedStation === station.id
                                        ? "bg-primary/10 border-primary"
                                        : "glass-card-static border-transparent hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm">{station.name}</span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{station.power}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> 2.4 km</span>
                                    <span className={station.available > 0 ? "text-green-400" : "text-red-400"}>
                                        {station.available} ports open
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full bg-primary text-background font-bold hover:bg-primary/90">
                        <Navigation className="w-4 h-4 mr-2" /> Start Navigation
                    </Button>
                </Card>

                {/* Map */}
                <Card className="lg:col-span-2 rounded-2xl overflow-hidden border border-primary/20 relative">
                    <TripMap
                        center={center}
                        range={range}
                        chargingStations={chargingStations}
                        selectedStation={selectedStation}
                        onStationSelect={setSelectedStation}
                    />

                    {/* Overlay Stats */}
                    <div className="absolute top-4 right-4 glass-card-static px-3 py-1.5 rounded-lg z-[1000] text-xs font-mono">
                        LIVE TRAFFIC: MODERATE
                    </div>
                </Card>
            </div>
        </div>
    )
}
