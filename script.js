// Данные основной таблицы
const mainTableData = [
    ["Склад", "1", "2", "3", "4", "5"],
    ["Цвет склада", "", "", "", "", ""],
    ["Специальность", "", "", "", "", ""],
    ["Еда", "", "", "", "", ""],
    ["Алкоголь", "", "", "", "", ""],
    ["Животное", "", "", "", "", ""],
];

// Данные второстепенной таблицы
const secondaryTableData = [
    ["Красный 14", "Жёлтый 3.5", "Зелёный 1", "Синий 5", "Белый 7"],
    ["каменщик 1", "программист 13", "электрик 4", "портной 2", "плотник 9.14"],
    ["хлеб 4", "пельмени 8", "пицца", "макароны 12", "котлета 3"],
    ["вино 7.11", "водка 10", "виски 12", "ром 13", "коньяк 6"],
    ["тигр 11", "медведь 10", "леопард 2", "крокодил", "пума 6"]
];

// Список условий задачи
const conditions = [
    "1. Каменщик работает в зеленом складе.",
    "2. У портного есть леопард.",
    "3. На желтом складе едят котлету.",
    "4. Электрик ест хлеб.",
    "5. Желтый склад стоит сразу справа от синего склада.",
    "6. Тот, кто пьет коньяк, разводит пуму.",
    "7. В белом складе пьют вино.",
    "8. В центральном складе едят пельмени.",
    "9. Плотник работает на первом складе.",
    "10. Сосед того, кто пьет водку, держит медведя.",
    "11. На складе по соседству с тем, в котором держат тигра, пьют вино.",
    "12. Тот, кто пьет виски, ест макароны.",
    "13. Программист пьет ром.",
    "14. Плотник работает рядом с красным складом.",
];

// Цветовая палитра
const colors = [
    "#FFAAAA", "#FF8888", "#FF6666", "#FF4444",    // Красные оттенки
    "#FFDD88", "#FFCC66", "#FFBB44", "#FFAA22",    // Жёлтые оттенки
    "#DDFFAA", "#BBFF88", "#99FF66", "#77FF44",    // Зелёные оттенки
    "#AADDDD", "#88BBBB", "#66AAAA", "#449999",    // Голубые оттенки
    "#AAAAFF", "#8888FF", "#6666FF", "#4444FF",    // Синие оттенки
    "#EEDDFF", "#CCBBFF", "#AA99FF", "#8877FF",    // Фиолетовые оттенки
    "#FFFFFF", "#DDDDDD", "#BBBBBB", "#999999",    // Оттенки серого
];

let selectedColor = null;  // Выбранный цвет по умолчанию
let selectedCell = null;        // Выбранная ячейка для перемещения
let warningPopupTimer;          // Таймер для окна предупреждения
let warningPopupStart;          // Время начала показа окна предупреждения

window.onload = () => {
    createMainTable();
    createSecondaryTable();
    createPalette();
    createWarningPopup();       // Создание кастомного окна предупреждения
    displayConditions();
    loadSavedState();           // Загрузка сохраненного состояния

    document.querySelectorAll(".movable").forEach(cell => {
        cell.addEventListener("click", onCellSingleClick);
    });
};

function createMainTable() {
    const mainTable = document.getElementById("mainTable");
    mainTableData.forEach((rowData, rowIndex) => {
        const row = mainTable.insertRow();
        rowData.forEach((cellData, colIndex) => {
            const cell = row.insertCell();
            cell.innerText = cellData;
            if (rowIndex === 0 || colIndex === 0) {
                cell.classList.add("fixed");
            } else {
                cell.classList.add("movable");
                cell.dataset.category = mainTableData[rowIndex][0];
                cell.dataset.rowIndex = rowIndex;
                cell.dataset.colIndex = colIndex;
                cell.addEventListener("click", onCellClick);
            }
        });
    });
}

function createSecondaryTable() {
    const secondaryTable = document.getElementById("secondaryTable");
    secondaryTableData.forEach((rowData, rowIndex) => {
        const row = secondaryTable.insertRow();
        rowData.forEach((cellData, colIndex) => {
            const cell = row.insertCell();
            cell.innerText = cellData;
            cell.classList.add("movable");
            cell.dataset.category = mainTableData[rowIndex + 1][0];
            cell.dataset.rowIndex = rowIndex;
            cell.dataset.colIndex = colIndex;
            cell.addEventListener("click", onCellClick);
        });
    });
}

function createPalette() {
    const palette = document.getElementById("palette");
    palette.style.display = "grid";
    palette.style.gridTemplateColumns = "repeat(14, 25px)";
    palette.style.gridGap = "5px";
    colors.forEach((color) => {
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        colorBox.style.backgroundColor = color;
        palette.appendChild(colorBox);

        colorBox.addEventListener("click", () => {
            if (selectedColor === color) {
                // Если цвет уже выбран, деактивируем его
                selectedColor = null; // Дефолтный цвет (нет выбора)
                colorBox.classList.remove("selected-color");
            } else {
                // Активируем новый цвет
                selectedColor = color;
                document.querySelectorAll(".color-box").forEach(box => box.classList.remove("selected-color"));
                colorBox.classList.add("selected-color");
            }
        });
    });
}

function createWarningPopup() {
    const warningPopup = document.createElement("div");
    warningPopup.id = "warningPopup";
    warningPopup.style.position = "fixed";
    warningPopup.style.top = "50%";
    warningPopup.style.left = "50%";
    warningPopup.style.transform = "translate(-50%, -50%)";
    warningPopup.style.padding = "20px";
    warningPopup.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    warningPopup.style.color = "white";
    warningPopup.style.fontSize = "16px";
    warningPopup.style.border = "2px solid black";
    warningPopup.style.borderRadius = "10px";
    warningPopup.style.zIndex = "1000";
    warningPopup.style.display = "none";
    warningPopup.innerText = "Нельзя перемещать элементы в чужую категорию.";
    document.body.appendChild(warningPopup);

    document.addEventListener("dblclick", () => {
        if (warningPopup.style.display === "block") {
            clearTimeout(warningPopupTimer);
            warningPopup.style.display = "none";
        }
    });

    document.addEventListener("click", () => {
        if (warningPopup.style.display === "block" && Date.now() - warningPopupStart >= 3000) {
            clearTimeout(warningPopupTimer);
            warningPopup.style.display = "none";
        }
    });
}

function displayConditions() {
    const conditionsList = document.getElementById("conditionsList");
    conditions.forEach((condition) => {
        const listItem = document.createElement("li");
        listItem.innerText = condition;
        conditionsList.appendChild(listItem);
    });
}

function onCellSingleClick(event) {
    const cell = event.target;
    if (selectedColor) {
        cell.style.backgroundColor = selectedColor;
        saveState(); // Сохранение состояния после изменения цвета ячейки
    }
}

function onCellClick(event) {
    const cell = event.target;
    if (!selectedCell) {
        selectedCell = cell;
        cell.style.border = "2px solid blue";
    } else {
        if (cell === selectedCell) {
            selectedCell.style.border = "1px solid black";
            selectedCell = null;
            return;
        }

        // Проверка категории
        const selectedCategory = selectedCell.dataset.category;
        const targetCategory = cell.dataset.category;

        if (selectedCategory === targetCategory) {
            // Перемещение разрешено, так как категории совпадают
            swapCells(cell, selectedCell);
        } else {
            // Перемещение запрещено, так как категории не совпадают
            showWarningPopup();
        }
        selectedCell.style.border = "1px solid black";
        selectedCell = null;
    }
}

function swapCells(cell1, cell2) {
    const tempText = cell1.innerText;
    const tempBg = cell1.style.backgroundColor;

    cell1.innerText = cell2.innerText;
    cell1.style.backgroundColor = cell2.style.backgroundColor;

    cell2.innerText = tempText;
    cell2.style.backgroundColor = tempBg;

    saveState(); // Сохранение состояния после перемещения ячеек
}

function showWarningPopup() {
    const warningPopup = document.getElementById("warningPopup");
    warningPopup.style.display = "block";
    warningPopupStart = Date.now();
    warningPopupTimer = setTimeout(() => {
        document.addEventListener("click", hideWarningPopup);
    }, 3000);
}

function hideWarningPopup() {
    const warningPopup = document.getElementById("warningPopup");
    warningPopup.style.display = "none";
    document.removeEventListener("click", hideWarningPopup);
}

function saveState() {
    const mainTable = document.getElementById("mainTable");
    const secondaryTable = document.getElementById("secondaryTable");
    const mainTableData = [];
    const secondaryTableData = [];

    for (let row of mainTable.rows) {
        const rowData = [];
        for (let cell of row.cells) {
            rowData.push({
                text: cell.innerText,
                backgroundColor: cell.style.backgroundColor,
                isFixed: cell.classList.contains("fixed"),
                category: cell.dataset.category,
            });
        }
        mainTableData.push(rowData);
    }

    for (let row of secondaryTable.rows) {
        const rowData = [];
        for (let cell of row.cells) {
            rowData.push({
                text: cell.innerText,
                backgroundColor: cell.style.backgroundColor,
                category: cell.dataset.category,
            });
        }
        secondaryTableData.push(rowData);
    }

    localStorage.setItem("mainTableData", JSON.stringify(mainTableData));
    localStorage.setItem("secondaryTableData", JSON.stringify(secondaryTableData));
}

function loadSavedState() {
    const mainTableData = JSON.parse(localStorage.getItem("mainTableData"));
    const secondaryTableData = JSON.parse(localStorage.getItem("secondaryTableData"));

    if (mainTableData && secondaryTableData) {
        const mainTable = document.getElementById("mainTable");
        const secondaryTable = document.getElementById("secondaryTable");

        mainTable.innerHTML = "";
        secondaryTable.innerHTML = "";

        mainTableData.forEach((rowData, rowIndex) => {
            const row = mainTable.insertRow();
            rowData.forEach((cellData, colIndex) => {
                const cell = row.insertCell();
                cell.innerText = cellData.text;
                cell.style.backgroundColor = cellData.backgroundColor;
                cell.dataset.category = cellData.category;
                if (cellData.isFixed) {
                    cell.classList.add("fixed");
                } else {
                    cell.classList.add("movable");
                    cell.dataset.rowIndex = rowIndex;
                    cell.dataset.colIndex = colIndex;
                    cell.addEventListener("click", onCellClick);
                    cell.addEventListener("dblclick", onCellSingleClick);
                }
            });
        });

        secondaryTableData.forEach((rowData, rowIndex) => {
            const row = secondaryTable.insertRow();
            rowData.forEach((cellData, colIndex) => {
                const cell = row.insertCell();
                cell.innerText = cellData.text;
                cell.style.backgroundColor = cellData.backgroundColor;
                cell.classList.add("movable");
                cell.dataset.category = cellData.category;
                cell.dataset.rowIndex = rowIndex;
                cell.dataset.colIndex = colIndex;
                cell.addEventListener("click", onCellClick);
                cell.addEventListener("dblclick", onCellSingleClick);
            });
        });
    }
}

function resetTables() {
    localStorage.removeItem("mainTableData");
    localStorage.removeItem("secondaryTableData");
    location.reload();
}
