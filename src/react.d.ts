import * as React from "react"
import { TarmeezData } from "./index"

export interface TarmeezViewerProps {
    data?: TarmeezData
    renderDelay?: number
    updateUrlParams?: boolean
    onPageChange?: (page: string) => void
    showPageCounter?: boolean
    showToc?: boolean
    className?: string
    style?: React.CSSProperties
    viewerContainerId?: string
    pageCounterId?: string
    tocId?: string
}

export interface TocProps {
    id?: string
    className?: string
    style?: React.CSSProperties
}

export interface PageCounterProps {
    id?: string
    className?: string
    style?: React.CSSProperties
}

export const TarmeezViewer: React.ComponentType<TarmeezViewerProps>
export const Toc: React.ComponentType<TocProps>
export const PageCounter: React.ComponentType<PageCounterProps>
