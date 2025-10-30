"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const workOrders = [
  { id: "WO-001", vehicle: "Tesla Model 3", service: "Brake Inspection", status: "in-progress", priority: "high" },
  { id: "WO-002", vehicle: "BMW X5", service: "Oil Change", status: "completed", priority: "medium" },
  { id: "WO-003", vehicle: "Audi A4", service: "Tire Rotation", status: "pending", priority: "low" },
  { id: "WO-004", vehicle: "Mercedes C-Class", service: "Battery Check", status: "in-progress", priority: "high" },
]

const partAvailability = [
  { part: "Brake Pads", available: 45, needed: 12, status: "in-stock" },
  { part: "Oil Filter", available: 78, needed: 8, status: "in-stock" },
  { part: "Battery", available: 5, needed: 3, status: "low-stock" },
  { part: "Spark Plugs", available: 120, needed: 20, status: "in-stock" },
]

const supplyChain = [
  { stage: "Warehouse", status: "ready", items: 156 },
  { stage: "In Transit", status: "active", items: 42 },
  { stage: "Service Center", status: "received", items: 89 },
  { stage: "Installed", status: "completed", items: 34 },
]

export function ServiceLogisticsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Phase 4: Service & Logistics</h2>
        <p className="text-muted-foreground">Work order tracking and supply chain management</p>
      </motion.div>

      {/* Work Orders */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Work Order Tracker</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold">Vehicle</th>
                <th className="text-left py-3 px-4 font-semibold">Service</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((order, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-border/50 hover:bg-card/50"
                >
                  <td className="py-3 px-4 font-mono text-primary">{order.id}</td>
                  <td className="py-3 px-4">{order.vehicle}</td>
                  <td className="py-3 px-4">{order.service}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "in-progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : order.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : order.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {order.priority}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Part Availability */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Part Availability</h3>
          <div className="space-y-3">
            {partAvailability.map((part, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{part.part}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      part.status === "in-stock" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {part.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Available: {part.available} | Needed: {part.needed}
                  </span>
                  <div className="w-24 h-2 bg-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(part.available / (part.available + part.needed)) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Supply Chain */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Supply Chain Status</h3>
          <div className="space-y-4">
            {supplyChain.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    stage.status === "ready"
                      ? "bg-green-500"
                      : stage.status === "active"
                        ? "bg-blue-500"
                        : stage.status === "received"
                          ? "bg-cyan-500"
                          : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-semibold">{stage.stage}</p>
                  <p className="text-sm text-muted-foreground">{stage.items} items</p>
                </div>
                <span className="text-sm font-mono text-primary">{stage.status}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
