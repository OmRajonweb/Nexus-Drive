"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useEffect, useRef, type ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface KPICardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon | ReactNode
  trend?: number // 0-100 progress value
  delay?: number
}



export function KPICard({ title, value, change, icon, trend = 75, delay = 0 }: KPICardProps) {
  const isPositive = change.startsWith("+")
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''))
  const hasNumericValue = !isNaN(numericValue)
  const Icon = icon as LucideIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm mb-2 font-medium uppercase tracking-wider">
                {title}
              </p>
              <p
                className="text-3xl font-bold text-foreground font-[family-name:var(--font-orbitron)]"
              >
                {value}
              </p>
            </div>

            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 neon-glow"
              whileHover={{
                rotate: [0, -10, 10, -10, 0],
                scale: 1.1
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            className="mb-3 origin-left"
          >
            <Progress
              value={trend}
              className="h-1.5 bg-muted/30"
            />
          </motion.div>

          {/* Change indicator */}
          <motion.div
            className={`text-sm font-semibold flex items-center gap-2 ${isPositive ? "text-green-400" : "text-red-400"
              }`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.4 }}
          >
            <motion.span
              animate={{
                y: isPositive ? [-2, 0, -2] : [2, 0, 2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {isPositive ? "↗" : "↘"}
            </motion.span>
            <span>{change} from last period</span>
          </motion.div>
        </div>

        {/* Corner accent */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      </Card>
    </motion.div>
  )
}
