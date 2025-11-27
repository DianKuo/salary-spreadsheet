// Initial data from the uploaded image
const initialData = [
    { month: 'Jan-24', yearEndPaid: 280000, quarterlyPaid: 20000, managementPaid: 200000, festivalPaid: 80000, yearEndEst: 3.50, quarterlyEst: 0.25, managementEst: 2.50, festivalEst: 1.00, totalMonths: 7.25, transportAllowance: 5000 },
    { month: 'Feb-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: null, totalMonths: 0.00, transportAllowance: 5000 },
    { month: 'Mar-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: null, totalMonths: 0.00, transportAllowance: 5000 },
    { month: 'Apr-24', yearEndPaid: null, quarterlyPaid: 20000, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: 0.25, managementEst: null, festivalEst: null, totalMonths: 0.25, transportAllowance: 5000 },
    { month: 'May-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: 40000, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: 0.50, totalMonths: 0.50, transportAllowance: 5000 },
    { month: 'Jun-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: null, totalMonths: 0.00, transportAllowance: 5000 },
    { month: 'Jul-24', yearEndPaid: null, quarterlyPaid: 20000, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: 0.25, managementEst: null, festivalEst: null, totalMonths: 0.25, transportAllowance: 5000 },
    { month: 'Aug-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: null, totalMonths: 0.00, transportAllowance: 5000 },
    { month: 'Sep-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: 40000, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: 0.50, totalMonths: 0.50, transportAllowance: 5000 },
    { month: 'Oct-24', yearEndPaid: null, quarterlyPaid: 20000, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: 0.25, managementEst: null, festivalEst: null, totalMonths: 0.25, transportAllowance: 5000 },
    { month: 'Nov-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: null, totalMonths: 0.00, transportAllowance: 5000 },
    { month: 'Dec-24', yearEndPaid: null, quarterlyPaid: null, managementPaid: null, festivalPaid: null, yearEndEst: null, quarterlyEst: null, managementEst: null, festivalEst: null, totalMonths: 0.00, transportAllowance: 5000 }
];

let spreadsheetData = [];
let globalBaseSalary = 80000;

// Format number with comma separator
function formatNumber(num) {
    if (num === null || num === undefined || num === '') return '-';
    if (typeof num === 'string') {
        num = parseFloat(num.replace(/,/g, ''));
    }
    if (isNaN(num)) return '-';
    return num.toLocaleString('en-US');
}

// Parse formatted number back to float
function parseFormattedNumber(str) {
    if (str === '-' || str === '' || str === null) return null;
    return parseFloat(str.replace(/,/g, ''));
}

// Calculate bonus paid based on estimated months
function calculateBonusPaid(row) {
    row.yearEndPaid = row.yearEndEst ? Math.round(globalBaseSalary * row.yearEndEst) : null;
    row.quarterlyPaid = row.quarterlyEst ? Math.round(globalBaseSalary * row.quarterlyEst) : null;
    row.managementPaid = row.managementEst ? Math.round(globalBaseSalary * row.managementEst) : null;
    row.festivalPaid = row.festivalEst ? Math.round(globalBaseSalary * row.festivalEst) : null;
}

// Recalculate monthly gross based on global base salary and bonuses
function recalculateMonthlyGross(row) {
    const yearEndPaid = row.yearEndPaid || 0;
    const quarterlyPaid = row.quarterlyPaid || 0;
    const managementPaid = row.managementPaid || 0;
    const festivalPaid = row.festivalPaid || 0;
    const transportAllowance = row.transportAllowance || 5000;

    row.monthlyGross = globalBaseSalary + yearEndPaid + quarterlyPaid + managementPaid + festivalPaid + transportAllowance;
}

// Recalculate all rows' monthly gross and bonuses
function recalculateAllRows() {
    spreadsheetData.forEach(row => {
        if (!row.transportAllowance) row.transportAllowance = 5000;
        calculateBonusPaid(row);
        recalculateMonthlyGross(row);
    });
}

// Calculate accumulated value
function calculateAccumulated(rowIndex) {
    let total = 0;
    for (let i = 0; i <= rowIndex; i++) {
        const monthlyGross = spreadsheetData[i].monthlyGross;
        if (monthlyGross !== null && monthlyGross !== undefined) {
            total += monthlyGross;
        }
    }
    return total;
}

// Update all accumulated values
function updateAccumulatedValues() {
    spreadsheetData.forEach((row, index) => {
        row.accumulated = calculateAccumulated(index);
    });
}

// Calculate summary values
function calculateSummary() {
    const totalAccumulated = spreadsheetData[spreadsheetData.length - 1]?.accumulated || 0;
    const avgMonthly = Math.round(totalAccumulated / 12);

    document.getElementById('estimatedAnnual').textContent = formatNumber(totalAccumulated);
    document.getElementById('averageMonthly').textContent = formatNumber(avgMonthly);
}

// Load data from localStorage or use initial data
function loadData() {
    const savedData = localStorage.getItem('spreadsheetData');
    const savedBaseSalary = localStorage.getItem('globalBaseSalary');

    if (savedBaseSalary) {
        globalBaseSalary = parseInt(savedBaseSalary);
    }

    if (savedData) {
        spreadsheetData = JSON.parse(savedData);
        // Migration: Ensure transportAllowance exists
        spreadsheetData.forEach(row => {
            if (row.transportAllowance === undefined) {
                row.transportAllowance = 5000;
            }
        });
    } else {
        spreadsheetData = JSON.parse(JSON.stringify(initialData));
    }

    // Always recalculate on load to ensure consistency
    recalculateAllRows();
    updateAccumulatedValues();

    // Update the input field
    const baseSalaryInput = document.getElementById('baseSalaryInput');
    if (baseSalaryInput) {
        baseSalaryInput.value = globalBaseSalary;
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('spreadsheetData', JSON.stringify(spreadsheetData));
    localStorage.setItem('globalBaseSalary', globalBaseSalary.toString());
    showNotification('✅ 資料已儲存');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Render table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    spreadsheetData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        const fields = [
            { key: 'month', editable: false, class: 'month-cell fixed-col' },
            { key: 'monthlyGross', editable: false, class: 'auto-calculated' },
            { key: 'accumulated', editable: false, class: 'auto-calculated' },
            { key: 'yearEndPaid', editable: false, class: 'auto-calculated' },
            { key: 'quarterlyPaid', editable: false, class: 'auto-calculated' },
            { key: 'managementPaid', editable: false, class: 'auto-calculated' },
            { key: 'festivalPaid', editable: false, class: 'auto-calculated' },
            { key: 'transportAllowance', editable: false, class: 'auto-calculated' },
            { key: 'yearEndEst', editable: true },
            { key: 'quarterlyEst', editable: true },
            { key: 'managementEst', editable: true },
            { key: 'festivalEst', editable: true },
            { key: 'totalMonths', editable: true, class: 'fixed-col-right' }
        ];

        fields.forEach(field => {
            const td = document.createElement('td');
            td.className = field.class || '';

            if (field.key === 'month') {
                td.textContent = row[field.key];
            } else {
                td.textContent = formatNumber(row[field.key]);
            }

            if (field.editable) {
                td.contentEditable = 'true';
                td.addEventListener('blur', (e) => {
                    const value = parseFormattedNumber(e.target.textContent.trim());
                    row[field.key] = value;

                    // If any bonus estimate changes, recalculate bonus paid, monthly gross, and accumulated
                    if (['yearEndEst', 'quarterlyEst', 'managementEst', 'festivalEst'].includes(field.key)) {
                        calculateBonusPaid(row);
                        recalculateMonthlyGross(row);
                        updateAccumulatedValues();
                        saveData();
                        renderTable();
                        return;
                    }

                    calculateSummary();
                    saveData();
                    e.target.textContent = formatNumber(value);
                });

                td.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                    }
                });
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    calculateSummary();
}

// Export to CSV
function exportToCSV() {
    const headers = ['月份', '本薪', '當月領收(稅前)', '累計', '年終(發放)', '季獎金(發放)', '經營獎金(發放)', '三節(發放)', '交通津貼', '年終(預估)', '季獎金(預估)', '經營獎金(預估)', '三節(預估)', '總計月份'];

    let csv = headers.join(',') + '\n';

    spreadsheetData.forEach(row => {
        const line = [
            row.month,
            globalBaseSalary,
            row.monthlyGross || '',
            row.accumulated || '',
            row.yearEndPaid || '',
            row.quarterlyPaid || '',
            row.managementPaid || '',
            row.festivalPaid || '',
            row.transportAllowance || 5000,
            row.yearEndEst || '',
            row.quarterlyEst || '',
            row.managementEst || '',
            row.festivalEst || '',
            row.totalMonths || ''
        ].join(',');
        csv += line + '\n';
    });

    // Add summary rows
    csv += '\n';
    csv += '調整影響幅度,1\n';
    csv += '推估年收,' + (spreadsheetData[spreadsheetData.length - 1]?.accumulated || 0) + '\n';
    csv += '平均月薪,' + Math.round((spreadsheetData[spreadsheetData.length - 1]?.accumulated || 0) / 12) + '\n';

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '薪資試算表_' + new Date().toISOString().split('T')[0] + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('📥 CSV 檔案已匯出');
}

// Clear all data
function clearAllData() {
    if (confirm('確定要清除所有資料嗎?此操作無法復原。')) {
        localStorage.removeItem('spreadsheetData');
        localStorage.removeItem('globalBaseSalary');
        globalBaseSalary = 80000;
        spreadsheetData = JSON.parse(JSON.stringify(initialData));
        recalculateAllRows();
        updateAccumulatedValues();
        document.getElementById('baseSalaryInput').value = globalBaseSalary;
        renderTable();
        showNotification('🗑️ 所有資料已清除');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderTable();

    // Set up event listeners
    document.getElementById('saveBtn').addEventListener('click', saveData);
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('clearBtn').addEventListener('click', clearAllData);

    // Base salary input change handler
    const baseSalaryInput = document.getElementById('baseSalaryInput');
    baseSalaryInput.addEventListener('input', (e) => {
        const newValue = parseInt(e.target.value) || 0;
        if (newValue !== globalBaseSalary) {
            globalBaseSalary = newValue;
            recalculateAllRows();
            updateAccumulatedValues();
            saveData();
            renderTable();
        }
    });
});
