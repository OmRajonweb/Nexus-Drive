"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { 
  Bot, 
  LineChart, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Truck, 
  Star,
  Zap
} from "lucide-react"

const agents = [
  { name: "Data Analysis", icon: LineChart, status: "active", color: "from-blue-500 to-cyan-500", description: "Real-time telematics processing" },
  { name: "Diagnosis", icon: Sparkles, status: "active", color: "from-purple-500 to-pink-500", description: "Predictive failure detection" },
  { name: "Engagement", icon: MessageSquare, status: "active", color: "from-green-500 to-emerald-500", description: "Voice-first customer interaction" },
  { name: "Scheduling", icon: Calendar, status: "idle", color: "from-yellow-500 to-orange-500", description: "Automated appointment booking" },
  { name: "Logistics", icon: Truck, status: "active", color: "from-red-500 to-rose-500", description: "Supply chain optimization" },
  { name: "Feedback", icon: Star, status: "idle", color: "from-indigo-500 to-violet-500", description: "Service quality monitoring" },
]

export function AgentOrchestration() {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null)

  return (
    <Card className="glass-card glass-card-hover p-8 rounded-2xl relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      <div className="relative z-10">
        <motion.h3 
          className="text-xl font-bold mb-8 text-gradient font-[family-name:var(--font-orbitron)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          AI AGENT NETWORK
        </motion.h3>

        {/* Network Visualization Container */}
        <div className="relative min-h-[400px] flex items-center justify-center">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {agents.map((_, idx) => {
              const angle = (idx * 360) / agents.length - 90
              const radius = 120
              const x1 = 50 // center (%)
              const y1 = 50 // center (%)
              const x2 = 50 + radius * Math.cos((angle * Math.PI) / 180) / 3.5
              const y2 = 50 + radius * Math.sin((angle * Math.PI) / 180) / 3.5

              return (
                <motion.line
                  key={idx}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: agents[idx].status === "active" ? 0.6 : 0.2 
                  }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
              )
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E0FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#007BFF" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Master Agent - Center */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center neon-glow-lg relative overflow-hidden group cursor-pointer">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <Bot className="w-10 h-10 text-background relative z-10" />
              </div>
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-accent"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />
            </motion.div>
            <p className="text-center text-sm font-bold mt-3 text-primary font-[family-name:var(--font-orbitron)]">
              MASTER
            </p>
          </motion.div>

          {/* Worker Agents - Circular Layout */}
          <div className="relative w-full h-full">
            {agents.map((agent, idx) => {
              const angle = (idx * 360) / agents.length - 90
              const radius = 140
              const x = 50 + (radius * Math.cos((angle * Math.PI) / 180)) / 3.5
              const y = 50 + (radius * Math.sin((angle * Math.PI) / 180)) / 3.5

              const Icon = agent.icon

              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.15, duration: 0.5, type: "spring" }}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="z-10"
                  onHoverStart={() => setHoveredAgent(idx)}
                  onHoverEnd={() => setHoveredAgent(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative cursor-pointer`}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center relative overflow-hidden ${
                        agent.status === "active" ? "neon-glow" : "opacity-60"
                      }`}
                    >
                      {agent.status === "active" && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{
                            y: ["100%", "-100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      )}
                      <Icon className="w-7 h-7 text-white relative z-10" />
                    </div>
                    
                    {/* Status indicator */}
                    <motion.div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background z-20 ${
                        agent.status === "active" ? "bg-green-400" : "bg-gray-500"
                      }`}
                      animate={
                        agent.status === "active"
                          ? {
                              scale: [1, 1.2, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(34, 197, 94, 0.7)",
                                "0 0 0 8px rgba(34, 197, 94, 0)",
                                "0 0 0 0 rgba(34, 197, 94, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    {/* Hover tooltip */}
                    {hoveredAgent === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-30"
                      >
                        <div className="glass-card rounded-lg p-2 px-3 neon-border">
                          <p className="text-xs font-bold text-primary">{agent.name}</p>
                          <p className="text-[10px] text-muted-foreground">{agent.description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Zap className="w-2.5 h-2.5 text-green-400" />
                            <span className="text-[10px] text-green-400 font-semibold uppercase">
                              {agent.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  <p className="text-center text-[10px] font-semibold mt-2 text-foreground/80 max-w-[80px] mx-auto leading-tight">
                    {agent.name}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div 
          className="mt-6 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gradient">{agents.filter(a => a.status === "active").length}</p>
            <p className="text-xs text-muted-foreground">Active Agents</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gradient">{agents.length}</p>
            <p className="text-xs text-muted-foreground">Total Agents</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gradient">99.8%</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
        </motion.div>
      </div>
    </Card>
  )
}
