"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRole, type Role } from "@/components/role-provider"
import { useState } from "react"
import { toast } from "sonner"

export function LoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useRole()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("user")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const ok = await login({ email, password, role, remember })
    setLoading(false)
    if (ok) {
      toast.success(`${role === "admin" ? "Admin" : "User"} login successful`)
      onSuccess?.()
    } else {
      toast.error("Invalid credentials. Try the demo accounts in the prompt.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }} 
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-10 neon-border glass-card backdrop-blur-xl bg-black/40 shadow-2xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <div className="inline-block mb-4 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <h1 className="text-4xl font-bold text-gradient text-glow font-[family-name:var(--font-orbitron)] relative">
                NEXUS DRIVE
              </h1>
            </div>
            <p className="text-sm text-primary/80 tracking-[0.2em] font-light">INTELLIGENT MOBILITY PLATFORM</p>
            <div className="mt-4 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5" suppressHydrationWarning>
            {/* Role Selection */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="role" className="text-xs tracking-wider uppercase text-primary/90">Access Level</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="role" className="bg-black/50 border-primary/30 hover:border-primary/60 transition-colors h-11" suppressHydrationWarning>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-primary/30 backdrop-blur-xl">
                  <SelectItem value="user" className="hover:bg-primary/20">👤 User Portal</SelectItem>
                  <SelectItem value="admin" className="hover:bg-primary/20">⚙️ Admin Dashboard</SelectItem>
                  <SelectItem value="center" className="hover:bg-primary/20">🔧 Service Center</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Email Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-xs tracking-wider uppercase text-primary/90">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="user@nexus.ai"
                className="bg-black/50 border-primary/30 hover:border-primary/60 focus:border-primary h-11 transition-all"
                suppressHydrationWarning
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-xs tracking-wider uppercase text-primary/90">Password</Label>
              <Input 
                id="password" 
                type="password"
                suppressHydrationWarning 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="bg-black/50 border-primary/30 hover:border-primary/60 focus:border-primary h-11 transition-all"
              />
            </motion.div>

            {/* Remember Me */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 pt-2"
            >
              <Checkbox 
                id="remember" 
                checked={remember} 
                onCheckedChange={(v) => setRemember(!!v)}
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Keep me signed in</Label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-black font-semibold h-12 text-base shadow-lg shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 relative overflow-hidden group" 
                disabled={loading}
              >
                <span className="relative z-10">{loading ? "Authenticating..." : "Access System"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-4 space-y-2"
            >
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4"></div>
              <p className="text-[10px] text-center text-primary/50 tracking-wider uppercase mb-2">Demo Accounts</p>
              <div className="space-y-1 text-xs text-muted-foreground/70 text-center">
                <div>👤 <span className="text-primary/70">user@nexus.ai</span> • 1234</div>
                <div>⚙️ <span className="text-primary/70">admin@nexus.ai</span> • 1234</div>
                <div>🔧 <span className="text-primary/70">easthub@nexus.com</span> • service123</div>
              </div>
            </motion.div>
          </form>
        </Card>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-xs text-muted-foreground/50"
        >
          Secured by Nexus AI • 2025
        </motion.p>
      </motion.div>
    </div>
  )
}
