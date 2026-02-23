// --- State Management ---
let transactions = JSON.parse(localStorage.getItem('chau_money_transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('chau_money_budgets')) || [];
let isDarkMode = localStorage.getItem('chau_money_theme') === 'dark';
let categoryChart;

// --- AI Prediction Logic (Improved) ---
function getAIInsights() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });

    const totalExpense = monthlyTransactions.filter(t => t.type === 'chi').reduce((s, t) => s + t.amount, 0);
    const dailyAvg = dayOfMonth > 0 ? totalExpense / dayOfMonth : 0;
    const predictedExpense = dailyAvg * daysInMonth;

    return {
        predictedExpense,
        status: predictedExpense > 5000000 ? 'warning' : 'good',
        tip: predictedExpense > 5000000 ? "Cảnh báo: Chi tiêu dự kiến vượt ngân sách!" : "Tài chính ổn định."
    };
}

// --- UI Actions ---
function renderAll() {
    const insights = getAIInsights();
    document.getElementById('balance-val').innerText = formatCurrency(calculateBalance());
    // ... (Các hàm render khác)
}

function formatCurrency(num) {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}

function calculateBalance() {
    return transactions.reduce((s, t) => t.type === 'thu' ? s + t.amount : s - t.amount, 0);
}

// Khởi tạo ứng dụng
window.onload = () => {
    lucide.createIcons();
    renderAll();
};