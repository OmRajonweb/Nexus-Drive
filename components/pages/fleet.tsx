"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const fleetStats = [
  { label: "Total Vehicles", value: "1,247", icon: "🚗" },
  { label: "Active Routes", value: "89", icon: "🗺️" },
  { label: "Avg Efficiency", value: "94.2%", icon: "⚡" },
  { label: "Maintenance Due", value: "23", icon: "🔧" },
]

const vehicles = [
  { id: "VH-001", model: "Tesla Model 3", status: "active", location: "Route A", battery: 87 },
  { id: "VH-002", model: "BMW X5", status: "active", location: "Route B", battery: 72 },
  { id: "VH-003", model: "Audi A4", status: "maintenance", location: "Service Center", battery: 45 },
  { id: "VH-004", model: "Mercedes C-Class", status: "active", location: "Route C", battery: 91 },
]

export function FleetPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof vehicles)[0] | null>(null)
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false)
  const [showInventoryDialog, setShowInventoryDialog] = useState(false)

  const handleViewDetails = (vehicle: (typeof vehicles)[0]) => {
    setSelectedVehicle(vehicle)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Fleet Management</h2>
        <p className="text-muted-foreground">Monitor and manage your entire vehicle fleet</p>
      </motion.div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleetStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 neon-border text-center cursor-pointer hover:neon-glow transition-all">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fleet Vehicles */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-4">Fleet Vehicles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((vehicle, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{vehicle.model}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.id}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    vehicle.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-xs text-muted-foreground">📍 {vehicle.location}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs">🔋</span>
                  <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-green-500"
                      style={{ width: `${vehicle.battery}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono">{vehicle.battery}%</span>
                </div>
              </div>
              <Dialog open={!!selectedVehicle} onOpenChange={(v) => { if (!v) setSelectedVehicle(null) }}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleViewDetails(vehicle)}
                  >
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Vehicle Details</DialogTitle>
                    <DialogDescription>Complete information for {selectedVehicle?.model}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-semibold">{selectedVehicle?.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID</p>
                        <p className="font-semibold">{selectedVehicle?.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-semibold">{selectedVehicle?.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Battery</p>
                        <p className="font-semibold">{selectedVehicle?.battery}%</p>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => { setSelectedVehicle(null); toast.success("Maintenance scheduled!") }}>Schedule Maintenance</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Insurance Integration Preview */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-2">Insurance Integration Preview</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Connect with insurance providers to automatically report maintenance records and optimize coverage.
        </p>
        <Dialog open={showInsuranceDialog} onOpenChange={(v) => setShowInsuranceDialog(v)}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">Configure Insurance Integration</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insurance Integration Setup</DialogTitle>
              <DialogDescription>Connect your insurance provider account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Insurance Provider</label>
                <input
                  type="text"
                  placeholder="Select provider..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Policy Number</label>
                <input
                  type="text"
                  placeholder="Enter policy number..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => { setShowInsuranceDialog(false); toast.success("Insurance account connected!") }}>Connect Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Predictive Parts Inventory */}
      <Card className="p-6 neon-border">
        <h3 className="text-lg font-semibold mb-2">Predictive Parts Inventory</h3>
        <p className="text-muted-foreground text-sm mb-4">
          AI-powered inventory management that predicts parts needs based on fleet maintenance patterns.
        </p>
        <Dialog open={showInventoryDialog} onOpenChange={(v) => setShowInventoryDialog(v)}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">View Inventory Forecast</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inventory Forecast</DialogTitle>
              <DialogDescription>Predicted parts requirements for the next 30 days</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                <p className="font-semibold text-sm">Brake Pads</p>
                <p className="text-xs text-muted-foreground">Predicted need: 45 units</p>
              </div>
              <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                <p className="font-semibold text-sm">Oil Filters</p>
                <p className="text-xs text-muted-foreground">Predicted need: 32 units</p>
              </div>
              <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                <p className="font-semibold text-sm">Batteries</p>
                <p className="text-xs text-muted-foreground">Predicted need: 8 units</p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => { setShowInventoryDialog(false); toast.success("Parts order placed!") }}>Order Predicted Parts</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
