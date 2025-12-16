"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Thermometer, Battery, Disc, Droplet, AlertTriangle, Snowflake, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const telemetryItems = [
  { label: "Engine Temp", value: "92°C", icon: Thermometer, status: "normal", percent: 75 },
  { label: "Battery", value: "87%", icon: Battery, status: "normal", percent: 87 },
  { label: "Tire Pressure", value: "32 PSI", icon: Disc, status: "normal", percent: 90 },
  { label: "Oil Level", value: "Good", icon: Droplet, status: "normal", percent: 85 },
  { label: "Brake Fluid", value: "Low", icon: AlertTriangle, status: "warning", percent: 45 },
  { label: "Coolant", value: "Normal", icon: Snowflake, status: "normal", percent: 80 },
]

export function TelemetryCard() {
  return (
    <Card className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gradient font-[family-name:var(--font-orbitron)]">
              LIVE TELEMETRY
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Real-time vehicle diagnostics</p>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Activity className="w-5 h-5 text-primary" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {telemetryItems.map((item, idx) => {
            const Icon = item.icon
            const isWarning = item.status === "warning"

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass-card p-4 rounded-xl relative overflow-hidden group cursor-pointer ${isWarning ? "neon-border-bright" : "neon-border"
                  }`}
              >
                {/* Background hover effect */}
                <div
                  className={`absolute inset-0 ${isWarning
                      ? "bg-yellow-500/10"
                      : "bg-primary/5"
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className={`p-2 rounded-lg ${isWarning
                          ? "bg-yellow-500/20"
                          : "bg-primary/20"
                        }`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-5 h-5 ${isWarning ? "text-yellow-400" : "text-primary"
                        }`} />
                    </motion.div>

                    {isWarning && (
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold font-[family-name:var(--font-orbitron)] ${isWarning ? "text-yellow-400" : "text-foreground"
                    }`}>
                    {item.value}
                  </p>

                  <motion.div
                    className="mt-3"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1 + 0.3 }}
                  >
                    <Progress
                      value={item.percent}
                      className={`h-1 ${isWarning ? "bg-yellow-900/30" : "bg-muted/30"
                        }`}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Status summary */}
        <motion.div
          className="mt-6 flex items-center justify-between glass-card rounded-xl p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">System Status: Operational</span>
          </div>
          <span className="text-xs text-primary font-semibold">
            {telemetryItems.filter(i => i.status === "warning").length} Warning(s)
          </span>
        </motion.div>
      </div>
    </Card>
  )
}
