class MainSplitter {

    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.panes = Array.from(this.container.getElementsByClassName("main-split-pane"));
        this.gutters = [];
        this.containerBound = new DOMRect();
        this.minSizes = [40, 40, 40];
        this.originalRatios = [];
        this.init();
    }

    init() {
        this.containerBound = this.container.getBoundingClientRect();
        var paneWidth = this.containerBound.width / this.panes.length;
        for (let i = 0; i < this.panes.length; i++) {
            this.panes[i].style.width = paneWidth + "px";
            // Store initial size ratios
            this.originalRatios[i] = paneWidth / this.containerBound.width;
        }

        // Create gutters dynamically
        for (let i = 0; i < this.panes.length - 1; i++) {
            let gutter = document.createElement("div");
            gutter.className = "split-gutter";
            this.container.appendChild(gutter);
            this.gutters.push(gutter);
            this.positionGutter(i);

            gutter.addEventListener("mousedown", (event) => this.startDragging(event, i));
        }

        document.addEventListener("mouseup", () => this.stopDragging());
        document.addEventListener("mousemove", (event) => this.drag(event));

        // Detect window/container resize
        window.addEventListener("resize", () => this.resizeHandler());

        // Detect container resize using ResizeObserver
        this.observeContainerResize();
    }

    positionGutter(index) {
        let rect = this.panes[index].getBoundingClientRect();
        this.gutters[index].style.left = rect.right - this.containerBound.left + "px"; // Place it at pane's right
    }

    startDragging(event, index) {
        this.dragging = true;
        this.currentGutterIndex = index;
        this.startX = event.clientX;
        this.startWidths = [
            this.panes[index].offsetWidth,
            this.panes[index + 1].offsetWidth,
        ];
    }

    drag(event) {
        if (!this.dragging) return;

        let dx = event.clientX - this.startX;
        let newWidth1 = this.startWidths[0] + dx;
        let newWidth2 = this.startWidths[1] - dx;

        if (this.currentGutterIndex == 0) {
            if (newWidth1 <= this.minSizes[0]) {
                this.panes[0].style.width = "1px";
                this.panes[1].style.width = (this.containerBound.width - this.panes[2].offsetWidth - 1) + "px";
                this.positionGutter(0);
                return;
            }
        } else {
            if (this.currentGutterIndex == 1) {
                if (this.panes[0].offsetWidth == 1 && newWidth1 <= this.minSizes[1]) {
                    this.panes[1].style.width = "1px";
                    this.panes[2].style.width = (this.containerBound.width - 1) + "px";
                    this.positionGutter(1);
                    return;
                }
            }
        }

        let minSize1 = 0, minSize2 = 0;
        if (this.currentGutterIndex == 0) {
            minSize1 = this.minSizes[0];
            minSize2 = this.minSizes[1];
        } else {
            minSize1 = this.minSizes[1];
            minSize2 = this.minSizes[2];
        }
        if (newWidth1 > minSize1 && newWidth2 > minSize2) {
            this.panes[this.currentGutterIndex].style.width = newWidth1 + "px";
            this.panes[this.currentGutterIndex + 1].style.width = newWidth2 + "px";
            this.positionGutter(this.currentGutterIndex); // Update gutter position
        }

    }

    stopDragging() {
        this.dragging = false;
    }

    resizeHandler() {
        this.containerBound = this.container.getBoundingClientRect();
        let totalWidth = this.containerBound.width;

        // Adjust pane widths based on original ratios
        this.panes.forEach((pane, i) => {
            let newWidth = totalWidth * this.originalRatios[i];
            pane.style.width = Math.max(newWidth, this.minSizes[i]) + "px";
        });

        // Reposition gutters
        this.gutters.forEach((_, i) => this.positionGutter(i));
    }

    observeContainerResize() {
        const resizeObserver = new ResizeObserver(() => {
            this.resizeHandler();
        });

        resizeObserver.observe(this.container);
    }
}

// Initialize Splitter
//document.addEventListener("DOMContentLoaded", () => {
//    new Splitter("splitter-container");
//});
