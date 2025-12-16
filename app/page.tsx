"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useRole } from "@/components/role-provider"
import dynamic from 'next/dynamic'

const OverviewDashboard = dynamic(() => import("@/components/pages/overview-dashboard").then(mod => mod.OverviewDashboard))
const DataAnalysisPage = dynamic(() => import("@/components/pages/data-analysis").then(mod => mod.DataAnalysisPage))
const PredictionPage = dynamic(() => import("@/components/pages/prediction").then(mod => mod.PredictionPage))
const EngagementPage = dynamic(() => import("@/components/pages/engagement").then(mod => mod.EngagementPage))
const ServiceLogisticsPage = dynamic(() => import("@/components/pages/service-logistics").then(mod => mod.ServiceLogisticsPage))
const FeedbackPage = dynamic(() => import("@/components/pages/feedback").then(mod => mod.FeedbackPage))
const ManufacturingPage = dynamic(() => import("@/components/pages/manufacturing").then(mod => mod.ManufacturingPage))
const SecurityPage = dynamic(() => import("@/components/pages/security").then(mod => mod.SecurityPage))
const FleetPage = dynamic(() => import("@/components/pages/fleet").then(mod => mod.FleetPage))
const AdminPage = dynamic(() => import("../components/pages/admin").then(mod => mod.AdminPage))
const ServiceCenterPage = dynamic(() => import("@/components/pages/service-center").then(mod => mod.ServiceCenterPage))
const LoginPage = dynamic(() => import("@/components/pages/login").then(mod => mod.LoginPage))
const TripPlanner = dynamic(() => import("@/components/pages/trip-planner").then(mod => mod.TripPlanner), { ssr: false }) // New
const FleetHeatmap = dynamic(() => import("@/components/pages/fleet-heatmap").then(mod => mod.FleetHeatmap), { ssr: false }) // New
const JobCards = dynamic(() => import("@/components/pages/job-cards").then(mod => mod.JobCards)) // New

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
}

export default function Home() {
  const { isAuthenticated, role } = useRole()
  const [currentPage, setCurrentPage] = useState("overview")

  // Redirect after login based on role
  // On first authentication, send admin to admin panel, user to overview
  // Keep user navigation otherwise
  React.useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage(role === "admin" ? "admin" : role === "center" ? "center" : "overview")
    }
  }, [isAuthenticated, role])

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewDashboard />
      case "admin":
        return <AdminPage />
      case "center":
        return <ServiceCenterPage />
      case "data-analysis":
        return <DataAnalysisPage />
      case "prediction":
        return <PredictionPage />
      case "engagement":
        return <EngagementPage />
      case "service-logistics":
        return <ServiceLogisticsPage />
      case "feedback":
        return <FeedbackPage />
      case "manufacturing":
        return <ManufacturingPage />
      case "security":
        return <SecurityPage />
      case "fleet":
        return <FleetPage />
      case "trip-planner": // New
        return <TripPlanner />
      case "fleet-heatmap": // New
        return <FleetHeatmap />
      case "job-cards": // New
        return <JobCards />
      default:
        return <OverviewDashboard />
    }
  }

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => { /* page will route via effect */ }} />
  }

  return (
    <div className="flex min-h-screen bg-background" suppressHydrationWarning>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={true} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => { }} sidebarOpen={true} />

        <main className="flex-1 overflow-auto p-6 pb-8" suppressHydrationWarning>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
              suppressHydrationWarning
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
