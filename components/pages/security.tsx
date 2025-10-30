"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const securityMetrics = [
  { time: "00:00", threats: 2, blocked: 2, severity: "low" },
  { time: "04:00", threats: 5, blocked: 5, severity: "low" },
  { time: "08:00", threats: 12, blocked: 11, severity: "medium" },
  { time: "12:00", threats: 8, blocked: 8, severity: "low" },
  { time: "16:00", threats: 15, blocked: 14, severity: "medium" },
  { time: "20:00", threats: 3, blocked: 3, severity: "low" },
]

const anomalies = [
  {
    id: "ANM-001",
    type: "Unusual Access Pattern",
    severity: "high",
    timestamp: "2 hours ago",
    status: "investigating",
  },
  {
    id: "ANM-002",
    type: "Data Exfiltration Attempt",
    severity: "critical",
    timestamp: "1 hour ago",
    status: "blocked",
  },
  {
    id: "ANM-003",
    type: "Privilege Escalation",
    severity: "high",
    timestamp: "30 minutes ago",
    status: "investigating",
  },
]

const agentActivity = [
  { agent: "Master Agent", action: "Orchestrated Phase 1-6", timestamp: "5 minutes ago", status: "success" },
  {
    agent: "Data Analysis Agent",
    action: "Processed 1.2M telemetry points",
    timestamp: "4 minutes ago",
    status: "success",
  },
  {
    agent: "Diagnosis Agent",
    action: "Identified 3 potential failures",
    timestamp: "3 minutes ago",
    status: "success",
  },
  { agent: "Engagement Agent", action: "Scheduled 5 appointments", timestamp: "2 minutes ago", status: "success" },
]

export function SecurityPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Security & UEBA</h2>
        <p className="text-muted-foreground">Real-time threat monitoring and agent activity tracking</p>
      </motion.div>

      {/* Security Metrics */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Real-Time Security Monitoring</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={securityMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139, 92, 246, 0.5)" }}
            />
            <Legend />
            <Line type="monotone" dataKey="threats" stroke="#ef4444" name="Threats Detected" />
            <Line type="monotone" dataKey="blocked" stroke="#10b981" name="Threats Blocked" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Behavior Anomalies */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Behavior Anomaly Alerts</h3>
          <div className="space-y-3">
            {anomalies.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.id}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.severity === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : item.severity === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.timestamp}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "blocked" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Agent Activity Log */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Agent Activity Log</h3>
          <div className="space-y-3">
            {agentActivity.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-sm">{item.agent}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">{item.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.action}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
