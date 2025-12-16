"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import of the map component
const FleetMap = dynamic(() => import("@/components/maps/FleetMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-[#0B0E12] text-muted-foreground">Loading Heatmap...</div>
})

const fleetData = [
    { id: 1, lat: 28.6139, lng: 77.2090, status: "critical", region: "North", issue: "Battery Overheat" },
    { id: 2, lat: 19.0760, lng: 72.8777, status: "healthy", region: "West", issue: null },
    { id: 3, lat: 13.0827, lng: 80.2707, status: "warning", region: "South", issue: "Tire Pressure Low" },
    { id: 4, lat: 22.5726, lng: 88.3639, status: "healthy", region: "East", issue: null },
    { id: 5, lat: 12.9716, lng: 77.5946, status: "healthy", region: "South", issue: null },
    { id: 6, lat: 23.0225, lng: 72.5714, status: "critical", region: "West", issue: "Brake Failure" },
]

export function FleetHeatmap() {
    const [filter, setFilter] = useState("all")

    const filteredFleet = fleetData.filter(v => filter === "all" || v.status === filter)

    return (
        <div className="h-full flex flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold text-gradient font-[family-name:var(--font-orbitron)]">GLOBAL FLEET VIEW</h2>
                    <p className="text-muted-foreground text-sm">Real-time Vehicle Health & Density</p>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px] glass-card-static border-primary/20">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        <SelectItem value="healthy">Healthy Only</SelectItem>
                        <SelectItem value="warning">Warnings</SelectItem>
                        <SelectItem value="critical">Critical Alerts</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                {/* Stats Side Panel */}
                <Card className="glass-card-static p-6 flex flex-col gap-4">
                    <h3 className="font-semibold mb-2">Fleet Pulse</h3>

                    <div className="glass-card-static p-4 rounded-xl border-l-4 border-l-green-400">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">Healthy</span>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold">94.2%</p>
                    </div>

                    <div className="glass-card-static p-4 rounded-xl border-l-4 border-l-yellow-400">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">Warnings</span>
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-2xl font-bold">4.1%</p>
                    </div>

                    <div className="glass-card-static p-4 rounded-xl border-l-4 border-l-red-500">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-muted-foreground">Critical</span>
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold">1.7%</p>
                    </div>

                    <div className="mt-auto">
                        <p className="text-xs text-muted-foreground text-center">Last synced: Just now</p>
                    </div>
                </Card>

                {/* Global Map */}
                <Card className="lg:col-span-3 rounded-2xl overflow-hidden border border-primary/20 relative">
                    <FleetMap data={filteredFleet} />
                </Card>
            </div>
        </div>
    )
}
