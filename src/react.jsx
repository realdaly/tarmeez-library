import React, { useEffect, useRef } from "react"
import { TarmeezLibrary } from "./core.js"

export function PageCounter({ id = "tarmeez-counter", className = "", style = {} }) {
    return <div id={id} className={`tarmeez-page-counter ${className}`} style={style} />
}

export function Toc({ id = "tarmeez-toc", className = "", style = {} }) {
    return <div id={id} className={`tarmeez-toc ${className}`} style={style} />
}

export function TarmeezViewer({
    data,
    renderDelay = 2000,
    updateUrlParams = true,
    onPageChange,
    showPageCounter = true,
    showToc = true,
    className = "",
    style = {},
    viewerContainerId = "tarmeez-viewer",
    pageCounterId = "tarmeez-counter",
    tocId = "tarmeez-toc"
}) {
    const viewerRef = useRef(null)
    const isInitialized = useRef(false)

    useEffect(() => {
        // Instantiate TarmeezLibrary wrapper pointing to the separate container component IDs
        const pcIdVal = showPageCounter ? pageCounterId : null
        const tocIdVal = showToc ? tocId : null

        const viewer = new TarmeezLibrary(viewerContainerId, {
            renderDelay,
            pageCounterId: pcIdVal,
            tableLinksId: tocIdVal,
            updateUrlParams,
            onPageChange
        })

        viewerRef.current = viewer
        isInitialized.current = true

        if (data) {
            viewer.setData(data)
        }

        return () => {
            isInitialized.current = false
            viewerRef.current = null

            // Cleanup DOM contents safely
            const containerEl = document.getElementById(viewerContainerId)
            if (containerEl) {
                containerEl.innerHTML = ""
            }
            if (pcIdVal) {
                const pcEl = document.getElementById(pcIdVal)
                if (pcEl) {
                    pcEl.innerHTML = ""
                }
            }
            if (tocIdVal) {
                const tocEl = document.getElementById(tocIdVal)
                if (tocEl) {
                    tocEl.innerHTML = ""
                }
            }
        }
    }, [viewerContainerId, pageCounterId, tocId, showPageCounter, showToc, renderDelay, updateUrlParams, onPageChange])

    // Watch for dynamic data changes after initial render
    useEffect(() => {
        if (isInitialized.current && viewerRef.current && data) {
            viewerRef.current.setData(data)
        }
    }, [data])

    return (
        <div
            id={viewerContainerId}
            className={`tarmeez-viewer ${className}`}
            style={{ direction: "rtl", ...style }}
        />
    )
}
