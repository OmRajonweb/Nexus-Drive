"use client"

import { motion } from "framer-motion"
import { Activity, Wifi } from "lucide-react"
import { useRole } from "@/components/role-provider"
import { Button } from "@/components/ui/button"

export function Header({ onToggleSidebar, sidebarOpen }: { onToggleSidebar: () => void; sidebarOpen: boolean }) {
  const { role, isAuthenticated, logout } = useRole()
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-4 z-50 mx-4"
    >
      <div className="glass-card rounded-2xl px-6 py-3 shadow-lg neon-glow">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gradient text-glow font-[family-name:var(--font-orbitron)]">
              NEXUS DRIVE
            </h1>
            <p className="text-xs text-primary/70 tracking-wider">
              Connecting Vehicles, Drivers & Intelligence
            </p>
          </motion.div>
          
          {/* Right side indicators */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card neon-border">
                <span className="text-xs text-primary/70">Role:</span>
                <span className="text-xs font-medium text-primary capitalize">{role}</span>
                <Button variant="outline" size="sm" className="h-7 leading-none bg-transparent" onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
            {/* Network Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card neon-border">
              <Wifi className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Connected</span>
            </div>
            
            {/* Master Agent Active Indicator */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-card neon-border-bright relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 224, 255, 0.3)",
                  "0 0 30px rgba(0, 224, 255, 0.5)",
                  "0 0 20px rgba(0, 224, 255, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent shimmer" />
              <Activity className="w-4 h-4 text-primary relative z-10" />
              <div className="flex flex-col relative z-10">
                <span className="text-xs font-semibold text-primary">Master Agent</span>
                <span className="text-[10px] text-primary/60">Active</span>
              </div>
              <motion.div 
                className="w-2 h-2 rounded-full bg-primary relative z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
