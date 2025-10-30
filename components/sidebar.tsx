"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  LineChart, 
  Sparkles, 
  MessageSquare, 
  Truck, 
  Star, 
  Factory, 
  Shield, 
  Car,
  Zap
} from "lucide-react"
import { useRole } from "@/components/role-provider"

type MenuItem = { id: string; label: string; icon: any }

export function Sidebar({
  currentPage,
  setCurrentPage,
  isOpen,
}: { currentPage: string; setCurrentPage: (page: string) => void; isOpen: boolean }) {
  const { role } = useRole()

  let menuItems: MenuItem[] = []
  if (role === "admin") {
    // Admin: Admin panel, Manufacturing, Security, Fleet
    menuItems = [
      { id: "admin", label: "Admin Panel", icon: LayoutDashboard },
      { id: "manufacturing", label: "Manufacturing & Quality", icon: Factory },
      { id: "security", label: "Security / UEBA", icon: Shield },
      { id: "fleet", label: "Fleet Management", icon: Car },
    ]
  } else if (role === "center") {
    // Service Center: Dedicated portal (Phase 4)
    menuItems = [
      { id: "center", label: "Service Center Dashboard", icon: LayoutDashboard },
    ]
  } else {
    // User: Overview and Phases 1-4
    menuItems = [
      { id: "overview", label: "Overview Dashboard", icon: LayoutDashboard },
      { id: "data-analysis", label: "Phase 1: Vehicle Overview & Profile", icon: LineChart },
      { id: "prediction", label: "Phase 2: AI Recommendations & Diagnostics", icon: Sparkles },
      { id: "engagement", label: "Phase 3: Engagement & Scheduling", icon: MessageSquare },
      { id: "feedback", label: "Phase 4: Feedback & Monitoring", icon: Star },
    ]
  }
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 glass-card border-r neon-border flex flex-col m-4 rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b neon-border">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow relative">
            <Zap className="w-5 h-5 text-background" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-50 blur-xl" />
          </div>
          <div>
            <h2 className="font-bold text-primary font-[family-name:var(--font-orbitron)] text-lg">NEXUS</h2>
            <p className="text-xs text-primary/60 tracking-wider">AI PLATFORM</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-auto py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "active-state text-primary font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary/80"
                  }`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <motion.div
                    animate={isActive ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  </motion.div>
                  <span className="text-sm truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary neon-glow"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )
        })}
      </nav>

      <div className="p-4 border-t neon-border">
        <motion.div 
          className="glass-card rounded-xl p-3 text-center"
          animate={{
            boxShadow: [
              "0 0 10px rgba(0, 224, 255, 0.1)",
              "0 0 20px rgba(0, 224, 255, 0.2)",
              "0 0 10px rgba(0, 224, 255, 0.1)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-xs text-primary/80 font-semibold">v1.0 • AI Ecosystem</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs text-primary">Master Agent Active</span>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
