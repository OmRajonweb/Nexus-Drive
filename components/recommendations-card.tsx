"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Battery, Disc, Sparkles, ChevronRight } from "lucide-react"
import { toast } from "sonner"

const recommendations = [
  {
    id: 1,
    title: "Brake Pads Replacement",
    priority: "high",
    description: "Brake pads showing 78% wear. Recommend replacement within 500 miles.",
    action: "Schedule Service",
    icon: AlertCircle,
    impact: "Critical",
    estimatedTime: "2-3 hours",
  },
  {
    id: 2,
    title: "Battery Health Check",
    priority: "medium",
    description: "Battery capacity declining. Consider diagnostic test.",
    action: "Learn More",
    icon: Battery,
    impact: "Moderate",
    estimatedTime: "30 min",
  },
  {
    id: 3,
    title: "Tire Rotation Due",
    priority: "medium",
    description: "Last rotation was 6 months ago. Time for maintenance.",
    action: "Schedule",
    icon: Disc,
    impact: "Low",
    estimatedTime: "1 hour",
  },
]

type Props = {
  onSchedule?: (serviceType?: string) => void
  recentBooking?: { centerName: string; date: Date; slot: string }
}

export function RecommendationsCard({ onSchedule, recentBooking }: Props) {
  const [selectedRec, setSelectedRec] = useState<(typeof recommendations)[0] | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const determineServiceType = (title: string): string => {
    const t = title.toLowerCase()
    if (t.includes("brake")) return "Brake System Check"
    if (t.includes("battery")) return "Battery Service"
    if (t.includes("tire") || t.includes("tyre")) return "Full Inspection"
    return "Full Inspection"
  }

  return (
    <Card className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 neon-glow"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gradient font-[family-name:var(--font-orbitron)]">
              AI RECOMMENDATIONS
            </h3>
            <p className="text-xs text-muted-foreground">Predictive maintenance insights</p>
          </div>
        </div>

        {recentBooking && (
          <div className="mb-4 glass-card rounded-xl p-3 border border-green-500/30 bg-green-500/10">
            <p className="text-xs">✅ Your service at <span className="font-semibold">{recentBooking.centerName}</span> is scheduled for {recentBooking.date.toLocaleDateString()}, {recentBooking.slot}.</p>
          </div>
        )}

        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon
            const isHigh = rec.priority === "high"

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                whileHover={{ x: 4, scale: 1.01 }}
                className={`glass-card-static p-4 rounded-xl relative overflow-hidden group cursor-pointer ${isHigh ? "neon-border-bright" : "neon-border"
                  }`}
              >



                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <motion.div
                      className={`p-2.5 rounded-xl ${isHigh
                        ? "bg-red-500/20"
                        : "bg-yellow-500/20"
                        }`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-5 h-5 ${isHigh ? "text-red-400" : "text-yellow-400"
                        }`} />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-foreground">{rec.title}</h4>
                        <motion.span
                          animate={isHigh ? {
                            scale: [1, 1.05, 1],
                          } : {}}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${isHigh
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}
                        >
                          {rec.priority}
                        </motion.span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {rec.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Impact: </span>
                          <span className={`font-semibold ${isHigh ? "text-red-400" : "text-yellow-400"
                            }`}>{rec.impact}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Est. Time: </span>
                          <span className="font-semibold text-primary">{rec.estimatedTime}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className={`bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity neon-glow group/btn ${loadingId === rec.id ? "opacity-70" : ""}`}
                        onClick={() => {
                          setSelectedRec(rec)
                          // If this is a schedule action, route to shared booking flow
                          if (rec.action.toLowerCase().startsWith("schedule")) {
                            setLoadingId(rec.id)
                            setTimeout(() => {
                              setLoadingId(null)
                              onSchedule?.(determineServiceType(rec.title))
                            }, 500)
                          } else {
                            // Keep existing lightweight feedback for non-scheduling actions
                            toast.info("Opening details...", { description: rec.title })
                          }
                        }}
                        disabled={loadingId === rec.id}
                      >
                        <span>{loadingId === rec.id ? "Preparing..." : rec.action}</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary footer */}
        <motion.div
          className="mt-4 glass-card rounded-xl p-3 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-xs text-muted-foreground">
            Powered by AI Predictive Engine
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-semibold">Live Analysis</span>
          </div>
        </motion.div>
      </div>
    </Card>
  )
}
