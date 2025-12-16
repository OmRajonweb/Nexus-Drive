"use client"

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// This wrapper ensures the component is ONLY rendered on client
export function ClientOnly<P extends object>({
    component: Component,
    ...props
}: { component: ComponentType<P> } & P) {
    if (typeof window === 'undefined') {
        return <div className="h-full w-full flex items-center justify-center bg-[#0B0E12] text-muted-foreground">Loading...</div>
    }

    return <Component {...(props as P)} />
}

// Create a client-only dynamic import helper
export function createClientComponent<P extends object>(
    importFn: () => Promise<{ default: ComponentType<P> }>
) {
    return dynamic(importFn, {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-[#0B0E12] text-muted-foreground">
                Loading...
            </div>
        ),
    })
}
