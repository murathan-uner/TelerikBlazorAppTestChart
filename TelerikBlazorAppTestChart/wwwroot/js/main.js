$(document).ready(function () {
});

window.initClusters = () => {
    //let splitter = initSplitter();
    new Splitter("splitter-container");
};

function initSplitter() {
    var el = document.getElementsByClassName("split");
    if (!el || el.length == 0) return;

    const gutterSize = 4;
    const clusterCount = 3;
    var container = el[0];
    var minSizes = [40, 40, 40];
    let panes = [document.getElementById('split-0'), document.getElementById('split-1'), document.getElementById('split-2')];

    let splitter = Split(['#split-0', '#split-1', '#split-2'], {
        minSize: minSizes,
        gutterSize: gutterSize,
        snapOffset: 0,
        onDrag: function () {
            let sizes = splitter.getSizes();
            //console.log("Adjusted Sizes:", JSON.stringify(sizes));

            // Calculate pixel sizes
            let totalSize = container.clientWidth - gutterSize * (clusterCount - 1);
            let actualSizes = sizes.map((size, index) => {
                let pane = panes[index];
                let actualSize = (totalSize * size) / 100;
                return actualSize;
            });

            if (actualSizes[0] <= minSizes[0] + 2) {
                actualSizes[1] = actualSizes[1] + actualSizes[0];
                actualSizes[0] = 0; // Hide pane1
            } else {
                //if (actualSizes[1] <= minSizes[1] + 4) {
                //    actualSizes[1] = minSizes[1] + 4;
                //}
            }

            if (actualSizes[0] == 0 && actualSizes[1] <= minSizes[1] + 4) {
                actualSizes[2] = actualSizes[2] + actualSizes[1];
                actualSizes[1] = 0; // Hide pane2
            } else {
            }

            // Convert pixel sizes back to percentages and update Split.js
            let newPercentages = actualSizes.map(size => (size / totalSize) * 100);
            splitter.setSizes(newPercentages);

        },
        onDragStart: function (sizes) {
        },
        onDragEnd: function (sizes) {
        },
    });
    return splitter;
}

window.focusElementById = (windowId) => {
    const element = document.getElementById(windowId);
    if (element) {
        console.log(element);
        element.focus({ preventScroll: true });
    }
};

function getScrollEventForAllTables(gridTableId) {
    let parent = document.getElementById(gridTableId);
    if (parent) {
        console.log(parent);
        parent.addEventListener("scroll", (e) => {
            if (e.target && e.target.classList.contains("k-grid-content")) {
                let targetElements = parent.querySelectorAll(".k-grid-content");
                let scrollTop = e.target.scrollTop;

                targetElements.forEach((otherElement) => {
                    if (otherElement !== e.target) {
                        console.log(otherElement);
                        otherElement.scrollTop = scrollTop;
                    }
                });
            }
        }, true);
    }
}

function getScrollEvent(gridTableId) {
    let parent = document.getElementById(gridTableId);
    if (parent) {
        let targetElement = parent.querySelector(".k-grid-content");
        if (targetElement) {
            targetElement.addEventListener('scroll', (event) => {
                if (parent) {
                    let visibleHeight = targetElement.clientHeight;

                    let headerHeight = 0;
                    let header = document.querySelector("#header");
                    if (header) {
                        headerHeight = header.offsetHeight + 20;
                    }

                    let rows = targetElement.querySelectorAll("tr");

                    let firstVisibleRowPrice = null;
                    let lastVisibleRowPrice = null;
                    let visibleRowCount = 0;

                    rows.forEach((row, index) => {
                        let rect = row.getBoundingClientRect();

                        if (rect.top - headerHeight < visibleHeight && rect.bottom - headerHeight > 0) {
                            let priceCell = row.querySelector(".price");

                            if (priceCell) {
                                let price = priceCell.textContent.trim();

                                if (firstVisibleRowPrice === null) {
                                    firstVisibleRowPrice = price;
                                }
                                lastVisibleRowPrice = price;

                                visibleRowCount++;
                            }
                        }
                    });

                    if (firstVisibleRowPrice !== null && lastVisibleRowPrice !== null)
                    {
                        DOTNET_JSINTEROPSERVICE_REFERENCE.invokeMethodAsync(
                            "OnScroll", gridTableId,
                            firstVisibleRowPrice,
                            lastVisibleRowPrice,
                            visibleRowCount
                        );
                    }
                } else {
                    console.log("Элемент с ID " + gridTableId + " не найден");
                }
            });
        }
    } else {
        console.log("Родительский элемент с ID " + gridTableId + " не найден");
    }
}


function getWheelEvent(historyTableId) {
    let parent = document.getElementById(historyTableId);
    if (parent) {
        let targetElement = parent.querySelector(".k-grid-content");
        if (targetElement) {
            targetElement.addEventListener('wheel', (event) => {

                if (parent) {
                    DOTNET_JSINTEROPSERVICE_REFERENCE.invokeMethodAsync("OnWheel", historyTableId);

                    const isZoomIn = event.deltaY < 0; // Скролл вверх (+) — увеличение
                    const isZoomOut = event.deltaY > 0; // Скролл вниз (-) — уменьшение

                    // Задаем шаг изменения ширины
                    const zoomStep = 30; // Шаг изменения ширины в пикселях

                    const columns = targetElement.querySelectorAll('th, td');

                    columns.forEach((column, index) => {
                        const currentWidth = parseInt(window.getComputedStyle(column).width, 10);

                        // Если скроллим вверх (увеличение), увеличиваем ширину
                        if (isZoomIn && currentWidth < 300) {
                            column.style.width = `${currentWidth + zoomStep}px`;
                        }

                        // Если скроллим вниз (уменьшение), уменьшаем ширину
                        if (isZoomOut && currentWidth > 50) {
                            column.style.width = `${currentWidth - zoomStep}px`;
                        }

                    });
                }
                else {
                    console.log("Элемент с ID " + gridTableId + " не найден");
                }
            });
        }
    } else {
        console.log("Родительский элемент с ID " + gridTableId + " не найден");
    };
}

//function scrollToRow(gridItemId, rowIndex) {
//    let parent = document.getElementById(gridItemId);
//    if (parent) {
//        let scrollableElement = parent.querySelector(".k-grid-content");
//        if (scrollableElement) {
//            let row = scrollableElement.querySelectorAll(".k-table-tbody tr")[rowIndex];
//            if (row) {
//                row.classList.add("row");
//                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
//            }
//        }
//    }
//}

//Chart Panel
window.getElementSize = (className) => {
    var el = document.getElementsByClassName(className);
    if (!el || el.length == 0) return null;

    return {
        width: el[0].clientWidth,
        height: el[0].clientHeight
    };
};

window.setElementStyle = (className, style) => {
    var el = document.getElementsByClassName(className);
    if (!el || el.length == 0) return;

    el[0].style = style;
};

window.setElementWidth = (className, width) => {
    var el = document.getElementsByClassName(className);
    if (!el || el.length == 0) return;

    el[0].style.width = width + "px";
};

window.setElementMarginLeft = (className, marginLeft) => {
    var el = document.getElementsByClassName(className);
    if (!el || el.length == 0) return;

    el[0].style.marginLeft = marginLeft + "px";
};

window.registerViewportChangeCallback = (dotnetHelper) => {
    let _dotnetHelper = dotnetHelper;
    window.addEventListener('resize', () => {
        _dotnetHelper.invokeMethodAsync('OnResize', window.innerWidth, window.innerHeight);
    });
}

window.registerElementSizeChangeCallback = (dotnetHelper, className) => {
    let _dotnetHelper = dotnetHelper;
    var elements = document.getElementsByClassName(className);
    if (!elements || elements.length === 0) return;

    var el = elements[0];

    var resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            let width = entry.contentRect.width;
            let height = entry.contentRect.height;
            _dotnetHelper.invokeMethodAsync('OnElementResize', className, width, height);
        }
    });

    resizeObserver.observe(el);
}

window.registerElementsSizeChangeCallback = (dotnetHelper, classNames) => {
    let _dotnetHelper = dotnetHelper;
    for (let clazz of classNames) {
        var elements = document.getElementsByClassName(clazz);
        if (elements && elements.length > 0) {

            var el = elements[0];

            var resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    let width = entry.contentRect.width;
                    let height = entry.contentRect.height;
                    _dotnetHelper.invokeMethodAsync('OnElementResize', clazz, width, height);
                }
            });

            resizeObserver.observe(el);
        }

    }
}

window.registerSplitterSizeChangeCallback = (dotnetHelper, splitterClassName, panelClassNames) => {
    let _dotnetHelper = dotnetHelper;
    var elements = document.getElementsByClassName(splitterClassName);
    if (!elements || elements.length === 0) return;
    if (!panelClassNames || panelClassNames.length === 0) return;

    var el = elements[0];

    let panels = [];
    for (let clazz of panelClassNames) {
        var elems = document.getElementsByClassName(clazz);
        if (elems && elems.length > 0) {
            panels.push(elems[0]);
        }
    }

    var resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            let width = entry.contentRect.width;
            let height = entry.contentRect.height;

            let updatedBounds = [];
            for (let panel of panels) {
                var bound = panel.getBoundingClientRect();
                updatedBounds.push({
                    left: bound.left,
                    top: bound.top,
                    right: bound.right,
                    bottom: bound.bottom,
                    width: bound.width,
                    height: bound.height,
                    x: bound.x,
                    y: bound.y
                });
            }

            _dotnetHelper.invokeMethodAsync('OnSplitterResize', width, height, updatedBounds);
        }
    });

    resizeObserver.observe(el);
}