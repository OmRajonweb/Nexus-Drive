"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const telemetryData = [
  { time: "00:00", temp: 85, battery: 92, pressure: 32 },
  { time: "04:00", temp: 78, battery: 88, pressure: 31 },
  { time: "08:00", temp: 92, battery: 85, pressure: 32 },
  { time: "12:00", temp: 98, battery: 78, pressure: 33 },
  { time: "16:00", temp: 95, battery: 72, pressure: 32 },
  { time: "20:00", temp: 88, battery: 68, pressure: 31 },
]

const maintenanceTimeline = [
  { date: "2024-01-15", event: "Oil Change", status: "completed" },
  { date: "2024-02-20", event: "Tire Rotation", status: "completed" },
  { date: "2024-03-10", event: "Filter Replacement", status: "completed" },
  { date: "2024-04-05", event: "Brake Inspection", status: "scheduled" },
]

const driverDNA = [
  { category: "Braking", value: 85 },
  { category: "Acceleration", value: 78 },
  { category: "Highway", value: 92 },
  { category: "City", value: 88 },
  { category: "Cornering", value: 81 },
  { category: "Efficiency", value: 89 },
]

export function DataAnalysisPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Phase 1: Data Analysis</h2>
        <p className="text-muted-foreground">Vehicle telematics and driver profiling</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telematics Chart */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Vehicle Telematics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis stroke="rgba(255, 255, 255, 0.5)" />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#8b5cf6" name="Engine Temp (°C)" />
              <Line type="monotone" dataKey="battery" stroke="#06b6d4" name="Battery (%)" />
              <Line type="monotone" dataKey="pressure" stroke="#10b981" name="Tire Pressure (PSI)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Driver DNA */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Driver DNA Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={driverDNA}>
              <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
              <PolarAngleAxis dataKey="category" stroke="rgba(255, 255, 255, 0.5)" />
              <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.3)" />
              <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Maintenance Timeline */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Historical Maintenance Timeline</h3>
        <div className="space-y-3">
          {maintenanceTimeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-card/50 border border-border/50"
            >
              <div
                className={`w-3 h-3 rounded-full ${item.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}
              />
              <div className="flex-1">
                <p className="font-medium">{item.event}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${item.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
              >
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
