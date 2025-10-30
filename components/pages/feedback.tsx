"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const ratings = [
  { service: "Brake Service", rating: 4.8, count: 245 },
  { service: "Oil Change", rating: 4.6, count: 189 },
  { service: "Tire Rotation", rating: 4.7, count: 156 },
  { service: "Battery Check", rating: 4.5, count: 98 },
]

const partPerformance = [
  { month: "Jan", reliability: 94, durability: 91, satisfaction: 89 },
  { month: "Feb", reliability: 95, durability: 92, satisfaction: 90 },
  { month: "Mar", reliability: 96, durability: 94, satisfaction: 92 },
  { month: "Apr", reliability: 97, durability: 95, satisfaction: 94 },
]

const sentimentData = [
  { date: "Mon", positive: 85, neutral: 10, negative: 5 },
  { date: "Tue", positive: 88, neutral: 8, negative: 4 },
  { date: "Wed", positive: 90, neutral: 7, negative: 3 },
  { date: "Thu", positive: 87, neutral: 9, negative: 4 },
  { date: "Fri", positive: 92, neutral: 6, negative: 2 },
]

export function FeedbackPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2 text-gradient font-[family-name:var(--font-orbitron)]">Phase 4: Feedback & Monitoring</h2>
        <p className="text-muted-foreground">Post-service ratings and customer sentiment analysis</p>
      </motion.div>

      {/* Service Ratings */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Post-Service Rating Dashboard</h3>
        <div className="space-y-4">
          {ratings.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{item.service}</p>
                <span className="text-sm text-muted-foreground">{item.count} reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                    style={{ width: `${(item.rating / 5) * 100}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-primary">{item.rating}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Part Performance */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Part Performance Trendline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={partPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="reliability" stroke="#8b5cf6" name="Reliability (%)" />
              <Line type="monotone" dataKey="durability" stroke="#06b6d4" name="Durability (%)" />
              <Line type="monotone" dataKey="satisfaction" stroke="#10b981" name="Satisfaction (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Customer Sentiment */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Customer Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.5)" />
              <YAxis stroke="rgba(255, 255, 255, 0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
              />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill="#10b981" name="😊 Positive" />
              <Bar dataKey="neutral" stackId="a" fill="#f59e0b" name="😐 Neutral" />
              <Bar dataKey="negative" stackId="a" fill="#ef4444" name="😞 Negative" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
