"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Clock, AlertTriangle, Cpu, Wrench, FileText } from "lucide-react"

const jobCards = [
    {
        id: "JC-1024",
        vehicle: "Nexus Model X (KA-01-EQ-9999)",
        status: "pending",
        aiDiagnosis: {
            suspected: "Brake Pad Wear (Critical)",
            confidence: 94,
            parts: ["BPV-2024 (Front Set)", "B-Fluid DOT5"],
            estTime: "1.5 hrs"
        }
    },
    {
        id: "JC-1025",
        vehicle: "Nexus Cyber (MH-12-AB-1234)",
        status: "in-progress",
        aiDiagnosis: {
            suspected: "Battery Thermal Sensor Calibration",
            confidence: 88,
            parts: ["Software Update v4.2"],
            estTime: "45 mins"
        }
    },
    {
        id: "JC-1026",
        vehicle: "Nexus City (DL-03-XY-5678)",
        status: "completed",
        aiDiagnosis: {
            suspected: "AC Filter Clog",
            confidence: 99,
            parts: ["Cabin Filter HEPA"],
            estTime: "20 mins"
        }
    }
]

export function JobCards() {
    const [activeJob, setActiveJob] = useState(jobCards[0])

    return (
        <div className="h-full flex flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold text-gradient font-[family-name:var(--font-orbitron)]">AI TECHNICIAN DASHBOARD</h2>
                    <p className="text-muted-foreground text-sm">Automated Diagnostics & Job Queue</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Job Queue */}
                <Card className="glass-card-static p-4 flex flex-col gap-4">
                    <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Incoming Jobs
                    </h3>
                    <div className="space-y-3 overflow-y-auto">
                        {jobCards.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setActiveJob(job)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${activeJob.id === job.id
                                        ? "bg-primary/10 border-primary"
                                        : "glass-card-static border-transparent hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm">{job.id}</span>
                                    <Badge variant={job.status === 'completed' ? 'default' : job.status === 'pending' ? 'destructive' : 'secondary'}>
                                        {job.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{job.vehicle}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* AI Diagnostic Report */}
                <Card className="lg:col-span-2 glass-card-static p-6 flex flex-col">
                    <div className="flex justify-between items-start border-b border-primary/20 pb-4 mb-4">
                        <div>
                            <h3 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">{activeJob.vehicle}</h3>
                            <p className="text-sm text-muted-foreground">JobID: {activeJob.id}</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2">
                                <Cpu className="w-4 h-4" /> AI Confidence: {activeJob.aiDiagnosis.confidence}%
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="glass-card-static p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                            <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Suspected Issue
                            </h4>
                            <p className="text-lg font-bold">{activeJob.aiDiagnosis.suspected}</p>
                        </div>

                        <div className="glass-card-static p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                            <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Labor Estimate
                            </h4>
                            <p className="text-lg font-bold">{activeJob.aiDiagnosis.estTime}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-primary" /> Recommended Parts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {activeJob.aiDiagnosis.parts.map((part, i) => (
                                <Badge key={i} variant="outline" className="px-3 py-1 text-sm border-primary/40">
                                    {part}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex justify-end gap-3">
                        <Button variant="ghost">Reject Diagnosis</Button>
                        <Button className="bg-primary text-background hover:bg-primary/90">
                            <Check className="w-4 h-4 mr-2" /> Approve & Start Job
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
