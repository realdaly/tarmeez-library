# Tarmeez library - Headless Book Viewer

`Tarmeez library` is a lightweight, and completely headless JavaScript library designed to render encoded book text. It manages pages view on the screen, compiles a dynamic Table of Contents (TOC) for the book, tracks active pages on viewport scroll, and hooks up a interactive Page Counter element.

This library is "skinless": it provides zero cosmetic CSS layouts for all of its components. The styling is entirely controlled by the host application's stylesheet, allowing seamless integration with any website design or UI framework.

---

## Features

- **Decoupled Architecture**: Provide your own containers, style them however you like, layout elements wherever you wish.
- **Scroll Tracking page navigation**: Listens to viewport scroll position to automatically update current page in active indicators.
- **HTML Table of Contents parsing**: Walks book chapters / headers inside content pages, indexing titles and their pages, outputting them as a structural list.

---

## Installation

Link the core JavaScript and styling assets into your webpage:

```html
<!-- Core CSS styles -->
<link rel="stylesheet" href="path to css file/tarmeez-library.css">

<!-- Core JS script -->
<script src="path to js file/tarmeez-library.js"></script>
```

---

## HTML Layout

Provide the necessary DOM elements for your book viewer. The library targets elements using specific IDs:

```html
<!-- 1. The Page Counter (optional, must be the same ID as the one passed to the Tarmeez library constructor)  -->
<div id="pageCounter"></div>

<!-- 2. The Main Viewport Wrapper (required, must be the same ID as the one passed to the Tarmeez library constructor) -->
<div id="bookViewer"></div>

<!-- 3. The Table of Contents list box container (optional, must be the same ID as the one passed to the Tarmeez library constructor) -->
<div id="tableLinks"></div>
```
Note: To make scroll to view in table of contents work, you must set a height to "#pagesContainer", example:
```css
#pagesContainer {
    height: calc(100vh - 9vh);
}
```

---

## Initialization

Initialize the viewer globally after the DOM resources load, passing the target containers and configurations:

```javascript
// Initialize the library controller
const bookViewer = new Tarmeez library("bookViewer", {
    // Optional delay in milliseconds before calculating sizes and bindings (default: 2000)
    renderDelay: 1500,

    // Optional page counter container element ID (default: "pageCounter")
    pageCounterId: "pageCounter"
});
```

### Passing Data

Render content dynamically by sending encoded book text to `setData()` method:

```javascript
bookViewer.setData({
    body: `
        <div class="page" data-page="1">
            <h1 class="chapter">الفصل الأول</h1>
            <p>محتوى الصفحة الأولى...</p>
        </div>
        <div class="page" data-page="2">
            <h2 class="header1">المبحث الأول</h2>
            <p>محتوى الصفحة الثانية...</p>
            <div class="footnote">هامش توضيحي الأول</div>
        </div>
    `
});
```

---

## Customizing Themes & Styles

You can style the book viewer and its components by targeting the class names and IDs in your global CSS files as detailed below.

---

## Class Names & DOM Structure

The library generates elements using standardized class names. You can target these directly in your global CSS files:

| Element | Class Name | Description |
|---|---|---|
| Viewer viewport | `.el-pages-container` | Main scrollable area holding rendered pages. |
| Page structure | `.page` | Dynamic parent container holding text layouts. |
| Page index label | `.page-number` | Dynamic indicator inside each page boundaries. |
| TOC Chapter Link | `.el-toc-chapter` | Represents a `.chapter` element parsed into `#tableLinks`. |
| TOC Header level 1 | `.el-toc-header1` | Represents a `.header1` element parsed into `#tableLinks`. |
| TOC Header level 2 | `.el-toc-header2` | Represents a `.header2` element parsed into `#tableLinks`. |
| TOC Dotted separator | `.el-toc-dotted` | Separates headers from page index numbers visually. |
| TOC Target page number | `.el-toc-page` | Target page selector link. |
| Footnotes wrapper | `.footnote` | Displays footnotes text under a page lines separator block. |