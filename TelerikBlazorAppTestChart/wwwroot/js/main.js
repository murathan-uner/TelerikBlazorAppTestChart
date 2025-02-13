window.registerViewportChangeCallbackForChart = (dotnetHelper) => {
    let _dotnetHelper = dotnetHelper;
    window.addEventListener('resize', () => {
        _dotnetHelper.invokeMethodAsync('OnResize', window.innerWidth, window.innerHeight);
    });
}

window.initGoldenLayout = () => {

    //myLayout.registerComponent('blazor-component', function (container, state) {
    //    let componentId = "blazor-component-" + Math.random().toString(36).substr(2, 9);
    //    container.getElement().html(`<div id="${componentId}"></div>`);

    //    // Observe and add the Blazor component when available
    //    let observer = new MutationObserver(() => {
    //        let targetElement = document.getElementById(componentId);
    //        if (targetElement) {
    //            setTimeout(() => {
    //                Blazor.rootComponents.add(targetElement, state.componentName, {});
    //            }, 1000);
    //            observer.disconnect();
    //        }
    //    });

    //    observer.observe(document.body, { childList: true, subtree: true });
    //});

    var config = {
        settings: {
            showPopoutIcon: false
        },
        content: [{
            type: 'row',
            content: [
                {
                    type: 'component',
                    componentName: 'windows-component',
                    title: 'Windows 1',
                    id: 'windows1'
                },
                {
                    type: 'component',
                    componentName: 'windows-component',
                    title: 'Windows 2',
                    id: 'windows2'
                },
                {
                    type: 'component',
                    componentName: 'windows-component',
                    title: 'Windows 3',
                    id: 'windows3'
                }
            ]
        }]
    };

    var myLayout = new GoldenLayout(config);

    myLayout.registerComponent('windows-component', function (container, state) {
        //container.getElement().html('<h2>' + state.text + '</h2>');

        // Observe and add the Blazor component when available
        let observer = new MutationObserver(() => {
            let els = document.getElementsByClassName('lm_content');
            let sourceElement1 = document.getElementById('windows-1');
            let sourceElement2 = document.getElementById('windows-2');
            let sourceElement3 = document.getElementById('windows-3');
            if (sourceElement1 && sourceElement2 && sourceElement3 && els.length == 3) {
                let targetElement1 = els[0];
                let targetElement2 = els[1];
                let targetElement3 = els[2];
                $(sourceElement1).appendTo($(targetElement1));
                $(sourceElement2).appendTo($(targetElement2));
                $(sourceElement3).appendTo($(targetElement3));
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    /// Callback for every created stack
    myLayout.on('stackCreated', function (stack) {

        //HTML for the colorDropdown is stored in a template tag
        var colorDropdown = $($('template').html()),
            colorDropdownBtn = colorDropdown.find('.selectedColor');

        //var setColor = function (color) {
        //    var container = stack.getActiveContentItem().container;

        //    // Set the color on both the dropDown and the background
        //    colorDropdownBtn.css('background-color', color);
        //    container.getElement().css('background-color', color);

        //    // Update the state
        //    container.extendState({ color: color });
        //};

        // Add the colorDropdown to the header
        stack.header.controlsContainer.prepend(colorDropdown);

        // Update the color initially and whenever the tab changes
        stack.on('activeContentItemChanged', function (contentItem) {
            //setColor(contentItem.container.getState().color);
        });

        // Update the color when the user selects a different color
        // from the dropdown
        colorDropdown.find('li').click(function () {
            //setColor($(this).css('background-color'));
        });
    });

    myLayout.init();

    for (var i = 0; i < 3; i++) {
        new MainSplitter("main-splitter-container-" + i);
        new Splitter("clusters-container-" + i);
    }
};

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
window.getElementSizeById = (id) => {
    var el = document.getElementById(id);
    if (!el) return null;

    return {
        width: el.clientWidth,
        height: el.clientHeight
    };
};

window.getElementSizeByClass = (className) => {
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
