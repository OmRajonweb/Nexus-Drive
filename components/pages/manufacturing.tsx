"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
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

const reportCard = [
  { metric: "Efficiency", score: 92 },
  { metric: "Quality", score: 96 },
  { metric: "Turnaround", score: 88 },
  { metric: "Safety", score: 99 },
  { metric: "Customer Satisfaction", score: 94 },
]

const batchQuality = [
  { batch: "Batch A", defectRate: 0.8, yield: 99.2 },
  { batch: "Batch B", defectRate: 1.2, yield: 98.8 },
  { batch: "Batch C", defectRate: 0.5, yield: 99.5 },
  { batch: "Batch D", defectRate: 1.5, yield: 98.5 },
]

const rcaData = [
  { defect: "Brake Pad Wear", occurrences: 45, trend: "down" },
  { defect: "Battery Degradation", occurrences: 32, trend: "stable" },
  { defect: "Electrical Issues", occurrences: 18, trend: "up" },
  { defect: "Suspension Noise", occurrences: 25, trend: "down" },
]

export function ManufacturingPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Phase 6: Manufacturing Insights</h2>
        <p className="text-muted-foreground">Quality analytics and RCA/CAPA dashboard</p>
      </motion.div>

      {/* Service Center Report Card */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Service Center Performance Report Card</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={reportCard}>
            <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
            <PolarAngleAxis dataKey="metric" stroke="rgba(255, 255, 255, 0.5)" />
            <PolarRadiusAxis stroke="rgba(255, 255, 255, 0.3)" />
            <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Quality */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Spare Parts Batch Quality</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={batchQuality}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis dataKey="batch" stroke="rgba(255, 255, 255, 0.5)" />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
              />
              <Legend />
              <Bar dataKey="defectRate" fill="#ef4444" name="Defect Rate (%)" />
              <Bar dataKey="yield" fill="#10b981" name="Yield (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* RCA/CAPA */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Recurring Defect Trends (RCA/CAPA)</h3>
          <div className="space-y-3">
            {rcaData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{item.defect}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.trend === "down"
                        ? "bg-green-500/20 text-green-400"
                        : item.trend === "up"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.trend === "down" ? "↓" : item.trend === "up" ? "↑" : "→"} {item.trend}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(item.occurrences / 50) * 100}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.occurrences}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
