export interface TarmeezOptions {
    renderDelay?: number
    pageCounterId?: string | null
    tableLinksId?: string | null
    updateUrlParams?: boolean
    onPageChange?: ((page: string) => void) | null
}

export interface TarmeezData {
    body: string
    [key: string]: any
}

export class TarmeezLibrary {
    constructor(elementId: string, options?: TarmeezOptions)
    containerId: string
    container: HTMLElement | null
    options: TarmeezOptions & { renderDelay: number; pageCounterId: string; tableLinksId: string; updateUrlParams: boolean }
    data: TarmeezData | null
    loading: boolean
    currentPage: string
    numOfPages: string
    maxWidth: number
    pagesArray: HTMLElement[]
    linesContainer: HTMLElement[]
    setData(data: TarmeezData): void
}
