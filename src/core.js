// Tarmeez library JS core module

export class TarmeezLibrary {
    constructor(elementId, options = {}) {
        this.containerId = elementId
        this.container = document.getElementById(elementId)
        if (!this.container) {
            console.error(`TarmeezLibrary: "#${elementId}" not found.`)
            return
        }

        this.options = Object.assign({
            renderDelay: 2000,
            pageCounterId: "pageCounter",
            tableLinksId: "tableLinks",
            updateUrlParams: true,
            onPageChange: null
        }, options)

        this.data = null
        this.loading = true
        this.currentPage = "1"
        this.numOfPages = "0"

        this.maxWidth = 0
        this.pagesArray = []
        this.linesContainer = []

        this._renderSkeleton()
        this._setupRefs()
        this._bindEvents()
    }

    _renderSkeleton() {
        this.container.innerHTML = `
            <div class="el-book-viewer" id="elBookViewer">
                <div id="pagesContainer" class="el-pages-container">
                    <div class="el-loader" id="elLoader">يتم تحميل محتوى الكتاب...</div>
                    <div id="elPagesBody" style="display: none;"></div>
                </div>
            </div>
        `
        if (this.options.pageCounterId) {
            const pc = document.getElementById(this.options.pageCounterId)
            if (pc) pc.innerHTML = `<input type="number" id="elPageInput" value="1" disabled><span id="elPageDivider">/</span><span id="elTotalPages">0</span>`
        }
    }

    _setupRefs() {
        const q = (s) => this.container.querySelector(s)
        const g = (id) => document.getElementById(id)

        const pageCounterEl = this.options.pageCounterId ? g(this.options.pageCounterId) : null
        const tableLinksEl = this.options.tableLinksId ? g(this.options.tableLinksId) : null

        this.refs = {
            bookViewer: q("#elBookViewer") || this.container,
            pagesContainer: q("#pagesContainer"),
            pagesBody: q("#elPagesBody"),
            loader: q("#elLoader"),
            pageInput: pageCounterEl ? pageCounterEl.querySelector("#elPageInput") : null,
            totalPages: pageCounterEl ? pageCounterEl.querySelector("#elTotalPages") : null,
            tableLinks: tableLinksEl
        }
    }

    _bindEvents() {
        this.refs.pagesContainer?.addEventListener("scroll", this._throttle(() => this._checkCurrentPage(), 200))

        if (this.refs.pageInput) {
            this.refs.pageInput.addEventListener("change", (e) => this._scrollToPage(e.target.value))
            this.refs.pageInput.addEventListener("click", () => this.refs.pageInput.select())
            this.refs.pageInput.addEventListener("focus", () => this.refs.pageInput.select())
        }
    }

    // ===== PUBLIC API =====

    setData(data) {
        if (!data || !data.body) return
        this.data = data
        this.refs.pagesBody.innerHTML = data.body
        this.refs.loader.style.display = "none"
        this.refs.pagesBody.style.display = "block"
        if (this.refs.pageInput) this.refs.pageInput.disabled = false

        setTimeout(() => {
            this.pagesArray = this.refs.pagesBody.querySelectorAll(".page")
            this._displayPageNumbers()
            this._addIdsToTitles()
            this._createTableOfContents()

            const last = this.pagesArray[this.pagesArray.length - 1]?.dataset.page ?? 0
            this.numOfPages = last
            if (this.refs.totalPages) this.refs.totalPages.textContent = last
            this.currentPage = this.pagesArray[0]?.dataset.page ?? 1
            if (this.refs.pageInput) this.refs.pageInput.value = this.currentPage

            this.linesContainer = this.refs.pagesBody.querySelectorAll(".poem .line")
            this.maxWidth = 0
            this.linesContainer.forEach(l => {
                const fc = l.firstElementChild
                if (fc && fc.offsetWidth > this.maxWidth) this.maxWidth = fc.offsetWidth
            })
            this.linesContainer.forEach(l => {
                const fc = l.firstElementChild
                if (fc) fc.style.width = `${this.maxWidth}px`
            })

            const p = new URL(window.location.href).searchParams.get("p")
            if (p) this._scrollToPage(p)
            this.loading = false
        }, this.options.renderDelay)
    }

    // ===== PRIVATE =====

    _displayPageNumbers() {
        this.pagesArray.forEach(page => {
            if (!page) return
            const id = Number(page.dataset.page) + 1
            page.id = `page-${id}`
            const d = document.createElement("div")
            d.className = "page-number"
            d.textContent = page.dataset.page
            page.appendChild(d)
        })
    }

    _getCleanText(el) {
        return el.innerHTML
            .replace(/<br\s*\/?>/gi, " ")
            .replace(/<[^>]*>/g, "")
            .trim()
    }

    _addIdsToTitles() {
        [".chapter", ".header1", ".header2"].forEach(selector => {
            this.refs.pagesBody.querySelectorAll(selector).forEach(el => {
                el.id = this._getCleanText(el)
            })
        })
    }

    _createTableOfContents() {
        if (!this.refs.tableLinks) return

        this.refs.tableLinks.innerHTML = ""

        const traverse = (node, container) => {
            node.childNodes.forEach(child => {
                if (child?.nodeType !== Node.ELEMENT_NODE) return

                if (child.classList.contains("chapter")) {
                    const text = this._getCleanText(child)

                    const div = document.createElement("div")
                    div.className = "el-toc-chapter"
                    div.dataset.target = text
                    div.innerHTML = `<p class="line-clamp-3">${text}</p>`

                    container.appendChild(div)
                    this._makeScrollable(div)
                } else if (child.classList.contains("header1")) {
                    this._tocEntry(child, container, "el-toc-header1")
                } else if (child.classList.contains("header2")) {
                    this._tocEntry(child, container, "el-toc-header2")
                } else {
                    traverse(child, container)
                }
            })
        }

        traverse(this.refs.pagesBody, this.refs.tableLinks)
    }

    _tocEntry(child, container, cls) {
        const pg = child.closest(".page")?.dataset.page ?? ""
        const text = this._getCleanText(child)

        const div = document.createElement("div")
        div.className = cls
        div.dataset.target = text

        div.innerHTML = `
            <span class="el-toc-text">${text}</span>
            <span class="el-toc-dotted">.....</span>
            <span class="el-toc-page">${pg}</span>
        `

        container.appendChild(div)
        this._makeScrollable(div)
    }

    _makeScrollable(el) {
        el.addEventListener("click", () => this._scrollDivToPosition(el.dataset.target))
    }

    _scrollToPage(num) {
        if (num) this._scrollDivToPosition(`page-${Number(num) + 1}`)
    }

    _scrollDivToPosition(targetId) {
        const t = document.getElementById(targetId)
        const pc = this.refs.pagesContainer
        if (t && pc) {
            const cr = pc.getBoundingClientRect()
            const er = t.getBoundingClientRect()
            pc.scrollTo({ top: er.top - cr.top + pc.scrollTop - 15, behavior: "smooth" })
        }
    }

    _checkCurrentPage() {
        const pc = this.refs.pagesContainer
        if (!pc) return
        const cr = pc.getBoundingClientRect()
        const mid = cr.top + cr.height / 2
        let closest = null
        let dist = Infinity
        pc.querySelectorAll(".page").forEach(p => {
            const r = p.getBoundingClientRect()
            const d = Math.abs(mid - (r.top + r.height / 2))
            if (d < dist) {
                dist = d
                closest = p
            }
        })
        if (closest) {
            const parsed = Number(closest.id?.replace("page-", "")) - 1
            if (this.currentPage !== String(parsed) && parsed > 0) {
                this.currentPage = String(parsed)
                if (this.refs.pageInput) this.refs.pageInput.value = this.currentPage
                if (this.options.updateUrlParams) {
                    const u = new URL(window.location.href)
                    u.searchParams.set("p", this.currentPage)
                    history.replaceState(null, "", u.toString())
                }
                if (typeof this.options.onPageChange === "function") {
                    this.options.onPageChange(this.currentPage)
                }
            }
        }
    }

    _throttle(fn, wait) {
        let last = 0
        return (...a) => {
            const now = Date.now()
            if (now - last >= wait) {
                last = now
                return fn.apply(this, a)
            }
        }
    }
}
