// public/js/app.js
// This is the main JavaScript file for the frontend.
// It handles all the interactivity: talking to the server,
// rendering data, and updating the page.

// ============================================================
// ACTIVITY DATA
// ============================================================
// This is our list of predefined activities with their CO2 values.
// CO2 values are in kilograms.

const ACTIVITIES = [
  { id: 'a1',  name: 'Car trip (petrol, 10km)',  category: 'transport', co2: 2.31, emoji: '🚗' },
  { id: 'a2',  name: 'Car trip (diesel, 10km)',  category: 'transport', co2: 2.08, emoji: '🚙' },
  { id: 'a3',  name: 'Bus ride (10km)',           category: 'transport', co2: 0.82, emoji: '🚌' },
  { id: 'a4',  name: 'Train ride (10km)',          category: 'transport', co2: 0.41, emoji: '🚆' },
  { id: 'a5',  name: 'Domestic flight (1 hour)',  category: 'transport', co2: 90,   emoji: '✈️' },
  { id: 'a6',  name: 'Motorcycle (10km)',         category: 'transport', co2: 1.55, emoji: '🏍️' },
  { id: 'a7',  name: 'Beef meal',                 category: 'food',      co2: 6.1,  emoji: '🥩' },
  { id: 'a8',  name: 'Chicken meal',              category: 'food',      co2: 1.5,  emoji: '🍗' },
  { id: 'a9',  name: 'Vegan meal',                category: 'food',      co2: 0.3,  emoji: '🥗' },
  { id: 'a10', name: 'Milk (1 litre)',            category: 'food',      co2: 3.2,  emoji: '🥛' },
  { id: 'a11', name: 'Coffee (1 cup)',            category: 'food',      co2: 0.28, emoji: '☕' },
  { id: 'a12', name: 'Fast food meal',            category: 'food',      co2: 2.5,  emoji: '🍔' },
  { id: 'a13', name: 'Electricity (1 kWh)',       category: 'energy',    co2: 0.92, emoji: '⚡' },
  { id: 'a14', name: 'Gas heating (1 hour)',      category: 'energy',    co2: 2.0,  emoji: '🔥' },
  { id: 'a15', name: 'Air conditioning (1 hour)', category: 'energy',    co2: 1.3,  emoji: '❄️' },
  { id: 'a16', name: 'Laptop use (full day)',     category: 'energy',    co2: 0.3,  emoji: '💻' },
  { id: 'a17', name: 'New clothing item',         category: 'goods',     co2: 10.0, emoji: '👕' },
  { id: 'a18', name: 'Online delivery package',   category: 'goods',     co2: 0.5,  emoji: '📦' },
  { id: 'a19', name: 'Plastic bottle (1)',        category: 'goods',     co2: 0.08, emoji: '🍶' },
  { id: 'a20', name: 'New smartphone (daily share)', category: 'goods',  co2: 1.67, emoji: '📱' },
];

const COMMUNITY_AVERAGE = 8.5; // global daily average in kg CO2

// Tips to show based on which category is highest
const TIPS = {
  transport: [
    { title: 'Use Public Transport', text: 'Switching from a petrol car to a bus can cut your transport emissions by up to 65%.' },
    { title: 'Try Carpooling', text: 'Sharing a car ride with even one other person halves the per-person emissions for that trip.' },
  ],
  food: [
    { title: 'Eat Less Red Meat', text: 'Swapping one beef meal per week for a vegan option can save about 5.8 kg CO2.' },
    { title: 'Buy Local Produce', text: 'Local food travels shorter distances, which means lower transport emissions.' },
  ],
  energy: [
    { title: 'Use Less Air Conditioning', text: 'Each hour of AC use creates about 1.3 kg CO2. Try fans or open windows instead.' },
    { title: 'Unplug Devices', text: 'Devices on standby can use up to 10% of your home energy. Unplug when not in use.' },
  ],
  goods: [
    { title: 'Buy Secondhand', text: 'A secondhand clothing item avoids around 6-10 kg CO2 compared to buying new.' },
    { title: 'Reduce Single-Use Plastic', text: 'Use a reusable bag and water bottle to avoid repeated single-use plastic waste.' },
  ],
};

// ============================================================
// STATE
// ============================================================
// These variables hold the current state of the app.

let currentUser = null;   // stores the logged-in user's info
let allLogs = [];         // stores all log entries from the server
let activeFilter = 'all'; // the currently selected category filter
let pieChart = null;      // Chart.js pie chart instance
let barChart = null;      // Chart.js bar chart instance

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Returns today's date as a string like "2024-01-15"
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// Returns log entries from the last 7 days
function getWeekLogs() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return allLogs.filter(l => dates.includes(l.date));
}

// Returns only today's log entries
function getTodayLogs() {
  return allLogs.filter(l => l.date === todayStr());
}

// Shows a small popup notification at the bottom of the screen
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2700);
}

// ============================================================
// API CALLS
// ============================================================
// These functions talk to our Node.js server.

// Registers a new user
async function apiRegister(name, email, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

// Logs in an existing user
async function apiLogin(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// Logs out the current user
async function apiLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

// Checks if a user is already logged in (called when page loads)
async function apiGetMe() {
  const res = await fetch('/api/auth/me');
  return res.json();
}

// Fetches all logs for the current user from the server
async function apiFetchLogs() {
  const res = await fetch('/api/logs');
  return res.json();
}

// Saves a new log entry to the server
async function apiSaveLog(entry) {
  const res = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  return res.json();
}

// Deletes a log entry from the server
async function apiDeleteLog(id) {
  await fetch(`/api/logs/${id}`, { method: 'DELETE' });
}

// ============================================================
// AUTH HANDLERS
// ============================================================

function switchTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
  document.querySelectorAll('.auth-tab').forEach((btn, i) => {
    btn.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  const data = await apiLogin(email, password);

  if (data.message && !data.user) {
    errorEl.textContent = data.message;
    return;
  }

  errorEl.textContent = '';
  startApp(data.user);
}

async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('reg-error');

  const data = await apiRegister(name, email, password);

  if (data.message && !data.user) {
    errorEl.textContent = data.message;
    return;
  }

  errorEl.textContent = '';
  startApp(data.user);
}

async function handleLogout() {
  await apiLogout();
  currentUser = null;
  allLogs = [];
  if (pieChart) { pieChart.destroy(); pieChart = null; }
  if (barChart) { barChart.destroy(); barChart = null; }
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
}

// ============================================================
// APP STARTUP
// ============================================================

// Called after a successful login or on page load if session exists
async function startApp(user) {
  currentUser = user;
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('sidebar-username').textContent = user.name;

  // Load logs from the server
  allLogs = await apiFetchLogs();

  showPage('dashboard');
  renderActivityList();
}

// Called when the page first loads to check if user is already logged in
async function init() {
  const data = await apiGetMe();
  document.getElementById('loading').style.display = 'none';

  if (data.user) {
    startApp(data.user);
  } else {
    document.getElementById('auth-screen').style.display = 'flex';
  }
}

// ============================================================
// NAVIGATION
// ============================================================

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show the selected page
  document.getElementById('page-' + pageName).classList.add('active');
  document.getElementById('nav-' + pageName).classList.add('active');

  // Render the content for that page
  if (pageName === 'dashboard') renderDashboard();
  if (pageName === 'log')       renderLogPage();
  if (pageName === 'insights')  renderInsights();
}

// ============================================================
// ACTIVITY LIST (Log Page)
// ============================================================

function filterActs(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderActivityList();
}

function renderActivityList() {
  const list = document.getElementById('activity-list');
  if (!list) return;

  const filtered = activeFilter === 'all'
    ? ACTIVITIES
    : ACTIVITIES.filter(a => a.category === activeFilter);

  list.innerHTML = filtered.map(a => `
    <div class="activity-item" onclick="logActivity('${a.id}')">
      <span>${a.emoji}</span>
      <span>${a.name}</span>
      <span class="activity-co2">${a.co2} kg</span>
    </div>
  `).join('');
}

// ============================================================
// LOGGING ACTIVITIES
// ============================================================

async function logActivity(id) {
  const act = ACTIVITIES.find(a => a.id === id);
  if (!act) return;

  const entry = {
    name: act.name,
    category: act.category,
    co2: act.co2,
    emoji: act.emoji,
    date: todayStr()
  };

  const saved = await apiSaveLog(entry);
  allLogs.unshift(saved); // add to front of the list
  renderLogPage();
  showToast('Logged: ' + act.name);
}

async function addCustom() {
  const name = document.getElementById('custom-name').value.trim();
  const co2 = parseFloat(document.getElementById('custom-co2').value);
  const category = document.getElementById('custom-cat').value;

  if (!name || isNaN(co2) || co2 < 0) {
    showToast('Please fill in all custom activity fields.');
    return;
  }

  const emojis = { transport: '🚗', food: '🍽️', energy: '⚡', goods: '🛍️' };

  const entry = {
    name,
    category,
    co2,
    emoji: emojis[category],
    date: todayStr()
  };

  const saved = await apiSaveLog(entry);
  allLogs.unshift(saved);

  // Clear the input fields
  document.getElementById('custom-name').value = '';
  document.getElementById('custom-co2').value = '';

  renderLogPage();
  showToast('Custom activity logged!');
}

async function deleteLog(id) {
  await apiDeleteLog(id);
  allLogs = allLogs.filter(l => l._id !== id); // remove from local list
  renderLogPage();
  showToast('Entry deleted');
}

// ============================================================
// RENDER LOG PAGE
// ============================================================

function renderLogPage() {
  const todayLogs = getTodayLogs();
  const total = todayLogs.reduce((sum, l) => sum + l.co2, 0);

  document.getElementById('running-total').textContent = total.toFixed(2) + ' kg CO2';

  const listEl = document.getElementById('log-list');

  if (todayLogs.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No activities logged today. Click an activity on the left!</div>';
    return;
  }

  listEl.innerHTML = todayLogs.map(l => `
    <div class="log-entry">
      <div class="log-entry-emoji">${l.emoji}</div>
      <div class="log-entry-info">
        <div class="log-entry-name">${l.name}</div>
        <div class="log-entry-meta">${l.category} &middot; ${new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div class="log-entry-co2">${l.co2.toFixed(2)} kg</div>
      <button class="btn-delete" onclick="deleteLog('${l._id}')" title="Delete">✕</button>
    </div>
  `).join('');
}

// ============================================================
// RENDER DASHBOARD
// ============================================================

function renderDashboard() {
  const todayLogs = getTodayLogs();
  const weekLogs = getWeekLogs();

  const todayTotal = todayLogs.reduce((s, l) => s + l.co2, 0);
  const weekTotal = weekLogs.reduce((s, l) => s + l.co2, 0);

  document.getElementById('stat-today').innerHTML = todayTotal.toFixed(1) + ' <span class="stat-unit">kg</span>';
  document.getElementById('stat-week').innerHTML = weekTotal.toFixed(1) + ' <span class="stat-unit">kg</span>';
  document.getElementById('stat-count').textContent = allLogs.length;

  // Find highest emitting category this week
  const catTotals = getCategoryTotals(weekLogs);
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 0) {
    const catEmojis = { transport: '🚗', food: '🍔', energy: '⚡', goods: '🛍️' };
    document.getElementById('stat-top').textContent = catEmojis[sorted[0][0]] + ' ' + sorted[0][0];
    document.getElementById('stat-top-val').textContent = sorted[0][1].toFixed(1) + ' kg this week';
  }

  renderPieChart(catTotals);
  renderBarChart();
  renderStreak();
  renderCommunity(todayTotal);
}

function getCategoryTotals(logs) {
  const totals = {};
  logs.forEach(l => {
    totals[l.category] = (totals[l.category] || 0) + l.co2;
  });
  return totals;
}

function renderPieChart(catTotals) {
  const ctx = document.getElementById('pie-chart').getContext('2d');
  if (pieChart) pieChart.destroy();

  const labels = Object.keys(catTotals);
  const data = Object.values(catTotals);
  const colors = { transport: '#1565c0', food: '#c62828', energy: '#e65100', goods: '#6a1b9a' };
  const bgColors = labels.map(l => colors[l] || '#999');

  if (data.length === 0) {
    pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['No data yet'], datasets: [{ data: [1], backgroundColor: ['#e0e0e0'] }] },
      options: { plugins: { legend: { display: false } }, cutout: '60%' }
    });
    return;
  }

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: bgColors, borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      cutout: '60%',
      plugins: {
        legend: { position: 'right', labels: { font: { size: 12 } } }
      }
    }
  });
}

function renderBarChart() {
  const ctx = document.getElementById('bar-chart').getContext('2d');
  if (barChart) barChart.destroy();

  // Build last 7 days labels and totals
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en', { weekday: 'short' })
    });
  }

  const data = days.map(d => {
    return allLogs
      .filter(l => l.date === d.key)
      .reduce((s, l) => s + l.co2, 0);
  });

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days.map(d => d.label),
      datasets: [{
        label: 'kg CO2',
        data,
        backgroundColor: '#2e7d32',
        borderRadius: 4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { font: { size: 11 } } },
        x: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

function renderStreak() {
  const el = document.getElementById('streak-row');
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en', { weekday: 'short' }).charAt(0)
    });
  }

  el.innerHTML = days.map(d => {
    const logged = allLogs.some(l => l.date === d.key);
    return `
      <div class="streak-day">
        <div class="streak-day-label">${d.label}</div>
        <div class="streak-dot ${logged ? 'logged' : ''}">✓</div>
      </div>
    `;
  }).join('');
}

function renderCommunity(todayTotal) {
  const el = document.getElementById('community-compare');
  const max = Math.max(todayTotal, COMMUNITY_AVERAGE, 0.1);
  const userH = Math.round((todayTotal / max) * 100);
  const avgH = Math.round((COMMUNITY_AVERAGE / max) * 100);
  const isOver = todayTotal > COMMUNITY_AVERAGE;

  el.innerHTML = `
    <div class="compare-group">
      <div class="compare-label">You (Today)</div>
      <div class="compare-bar-outer">
        <div class="compare-bar-fill ${isOver ? 'over-avg' : ''}" style="height:${userH}%"></div>
      </div>
      <div class="compare-value">${todayTotal.toFixed(1)} kg</div>
    </div>
    <div class="compare-group">
      <div class="compare-label">Community Average</div>
      <div class="compare-bar-outer">
        <div class="compare-bar-fill" style="height:${avgH}%; background:#999;"></div>
      </div>
      <div class="compare-value">${COMMUNITY_AVERAGE} kg</div>
    </div>
  `;
}

// ============================================================
// RENDER INSIGHTS
// ============================================================

function renderInsights() {
  const weekLogs = getWeekLogs();
  const catTotals = getCategoryTotals(weekLogs);
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  // Render tips based on top categories
  const tipsEl = document.getElementById('tips-grid');
  const shownTips = [];

  sorted.forEach(([cat]) => {
    if (TIPS[cat]) shownTips.push(...TIPS[cat].map(t => ({ ...t, cat })));
  });

  // If no data, show default transport and food tips
  if (shownTips.length === 0) {
    shownTips.push(...TIPS.transport.map(t => ({ ...t, cat: 'transport' })));
    shownTips.push(TIPS.food[0]);
  }

  tipsEl.innerHTML = shownTips.slice(0, 3).map(t => `
    <div class="tip-card">
      <h4>${t.title}</h4>
      <p>${t.text}</p>
    </div>
  `).join('');

  // Render category breakdown bars
  const breakdownEl = document.getElementById('category-breakdown');
  const totalEmissions = Object.values(catTotals).reduce((s, v) => s + v, 0) || 1;
  const allCats = ['transport', 'food', 'energy', 'goods'];
  const catEmojis = { transport: '🚗', food: '🍽️', energy: '⚡', goods: '🛍️' };

  breakdownEl.innerHTML = allCats.map(cat => {
    const val = catTotals[cat] || 0;
    const pct = Math.round((val / totalEmissions) * 100);
    return `
      <div style="margin-bottom: 14px;">
        <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;">
          <span>${catEmojis[cat]} ${cat}</span>
          <span><strong>${val.toFixed(1)} kg</strong> (${pct}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // Render weekly goal progress
  const WEEKLY_GOAL = 40; // kg CO2 per week target
  const weekTotal = weekLogs.reduce((s, l) => s + l.co2, 0);
  const goalPct = Math.min(100, Math.round((weekTotal / WEEKLY_GOAL) * 100));
  const fillClass = goalPct < 60 ? '' : goalPct < 90 ? 'warning' : 'danger';
  const statusMsg = goalPct < 60
    ? '✅ Great! You are well within your weekly goal.'
    : goalPct < 90
      ? '⚠️ Getting close to your weekly limit.'
      : '🔴 You have exceeded your weekly goal. Try to reduce tomorrow.';

  document.getElementById('goal-progress').innerHTML = `
    <p style="font-size:13px; color:#666; margin-bottom:14px;">
      Weekly target: <strong>${WEEKLY_GOAL} kg CO2</strong>
    </p>
    <div class="progress-wrap">
      <div class="progress-labels">
        <span>Progress</span>
        <span>${weekTotal.toFixed(1)} / ${WEEKLY_GOAL} kg</span>
      </div>
      <div class="progress-bar" style="height:14px;">
        <div class="progress-fill ${fillClass}" style="width:${goalPct}%"></div>
      </div>
    </div>
    <p style="margin-top:12px; font-size:13px; color:#333;">${statusMsg}</p>
  `;
}

// ============================================================
// START THE APP
// ============================================================
// This runs when the page first loads.
init();
