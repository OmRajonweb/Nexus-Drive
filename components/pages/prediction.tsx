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
  AreaChart,
  Area,
} from "recharts"

const failureProbability = [
  { component: "Brake Pads", probability: 78 },
  { component: "Battery", probability: 45 },
  { component: "Transmission", probability: 12 },
  { component: "Engine", probability: 8 },
  { component: "Suspension", probability: 35 },
]

const diagnosisData = [
  { component: "Brake System", severity: "High", confidence: 94 },
  { component: "Cooling System", severity: "Medium", confidence: 87 },
  { component: "Electrical", severity: "Low", confidence: 92 },
]

const modelAccuracy = [
  { week: "W1", accuracy: 92, feedback: 85 },
  { week: "W2", accuracy: 93, feedback: 88 },
  { week: "W3", accuracy: 94, feedback: 91 },
  { week: "W4", accuracy: 95, feedback: 93 },
  { week: "W5", accuracy: 96, feedback: 95 },
]

export function PredictionPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Phase 2: Prediction & Diagnosis</h2>
        <p className="text-muted-foreground">AI-powered failure prediction and component diagnosis</p>
      </motion.div>

      {/* Failure Probability */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Predictive Failure Probability</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={failureProbability}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="component" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
            />
            <Bar dataKey="probability" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Diagnosis Details */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Diagnosis Details by Component</h3>
        <div className="space-y-3">
          {diagnosisData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{item.component}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.severity === "High"
                      ? "bg-red-500/20 text-red-400"
                      : item.severity === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{item.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Model Self-Correction */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">AI Model Self-Correction</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={modelAccuracy}>
            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="week" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorAccuracy)"
              name="Model Accuracy (%)"
            />
            <Area
              type="monotone"
              dataKey="feedback"
              stroke="#06b6d4"
              fillOpacity={0.3}
              fill="#06b6d4"
              name="Feedback Integration (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
