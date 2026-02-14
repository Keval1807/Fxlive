// ===== Configuration =====
const CONFIG = {
    REFRESH_INTERVAL: 30000, // 30 seconds
    TICKER_SYMBOLS: [
        // Major Forex Pairs
        { symbol: 'EUR/USD', type: 'forex' },
        { symbol: 'GBP/USD', type: 'forex' },
        { symbol: 'USD/JPY', type: 'forex' },
        { symbol: 'AUD/USD', type: 'forex' },
        { symbol: 'USD/CAD', type: 'forex' },
        { symbol: 'NZD/USD', type: 'forex' },
        { symbol: 'USD/CHF', type: 'forex' },
        // Commodities
        { symbol: 'GOLD', type: 'commodity' },
        { symbol: 'SILVER', type: 'commodity' },
        { symbol: 'OIL', type: 'commodity' },
        // Crypto
        { symbol: 'BTC/USD', type: 'crypto' },
        { symbol: 'ETH/USD', type: 'crypto' },
        // Indices
        { symbol: 'DXY', type: 'index' },
        { symbol: 'VIX', type: 'index' }
    ]
};

// ===== Trading Psychology Quotes =====
const PSYCHOLOGY_QUOTES = [
    {
        quote: "The goal of a successful trader is to make the best trades. Money is secondary.",
        author: "Alexander Elder",
        category: "Risk Management"
    },
    {
        quote: "The market is a device for transferring money from the impatient to the patient.",
        author: "Warren Buffett",
        category: "Patience"
    },
    {
        quote: "Risk comes from not knowing what you're doing.",
        author: "Warren Buffett",
        category: "Risk Management"
    },
    {
        quote: "The elements of good trading are: (1) cutting losses, (2) cutting losses, and (3) cutting losses. If you can follow these three rules, you may have a chance.",
        author: "Ed Seykota",
        category: "Loss Management"
    },
    {
        quote: "In trading, the impossible happens about twice a year.",
        author: "Henri M. Simoes",
        category: "Market Behavior"
    },
    {
        quote: "The trend is your friend until the end when it bends.",
        author: "Ed Seykota",
        category: "Trend Following"
    },
    {
        quote: "Markets can remain irrational longer than you can remain solvent.",
        author: "John Maynard Keynes",
        category: "Market Psychology"
    },
    {
        quote: "The four most dangerous words in investing are: 'This time it's different.'",
        author: "Sir John Templeton",
        category: "Market Cycles"
    },
    {
        quote: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.",
        author: "George Soros",
        category: "Risk/Reward"
    },
    {
        quote: "Lose your opinion – not your money.",
        author: "Larry Hite",
        category: "Flexibility"
    },
    {
        quote: "The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading.",
        author: "Victor Sperandeo",
        category: "Discipline"
    },
    {
        quote: "Never risk more than 1% of total equity on any one trade. By only risking 1%, I am indifferent to any individual trade.",
        author: "Larry Hite",
        category: "Position Sizing"
    },
    {
        quote: "I always define my risk, and I don't have to worry about it.",
        author: "Tony Saliba",
        category: "Risk Management"
    },
    {
        quote: "The best trades are the ones in which you have all three things going for you: fundamentals, technicals, and market tone.",
        author: "Michael Marcus",
        category: "Trade Setup"
    },
    {
        quote: "Trading is not about being right. It's about making money.",
        author: "Mark Douglas",
        category: "Mindset"
    },
    {
        quote: "You can't control the market. You can only control your reaction to it.",
        author: "Mark Douglas",
        category: "Control"
    },
    {
        quote: "The hard part is discipline, patience and judgment.",
        author: "Seth Klarman",
        category: "Discipline"
    },
    {
        quote: "Good traders manage risk. Great traders manage emotions.",
        author: "Anonymous",
        category: "Emotions"
    },
    {
        quote: "Risk management is the most important thing to be well understood.",
        author: "Ray Dalio",
        category: "Risk Management"
    },
    {
        quote: "The market does not know you exist. You can do nothing to influence it. You can only control your behavior.",
        author: "Alexander Elder",
        category: "Market Nature"
    }
];

// ===== State Management =====
const state = {
    currentPage: 'dashboard',
    lastUpdate: null,
    dxyBias: null,
    yields: {},
    marketData: {}
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ForexLive Intelligence Loading...');
    initializeApp();
});

function initializeApp() {
    // Initialize ticker
    initializeTicker();
    
    // Load psychology quotes
    loadPsychologyQuotes();
    
    // Load dashboard data
    loadYields();
    loadGoldNews();
    loadDXYNews();
    loadMarketStats();
    
    // Initialize DXY Engine
    initializeDXYEngine();
    
    // Set up auto-refresh
    setInterval(() => {
        refreshAllData();
    }, CONFIG.REFRESH_INTERVAL);
    
    console.log('✅ Application initialized');
}

// ===== Page Navigation =====
function switchPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        state.currentPage = pageName;
    }
}

// ===== Live Ticker =====
function initializeTicker() {
    const tickerContent = document.getElementById('tickerContent');
    if (!tickerContent) return;
    
    // Generate simulated ticker data
    const tickerHTML = generateTickerHTML();
    
    // Duplicate content for seamless loop
    tickerContent.innerHTML = tickerHTML + tickerHTML;
    
    // Update ticker periodically
    setInterval(updateTicker, 5000);
}

function generateTickerHTML() {
    const prices = {
        'EUR/USD': { price: 1.0842, change: 0.15 },
        'GBP/USD': { price: 1.2634, change: -0.08 },
        'USD/JPY': { price: 149.82, change: 0.32 },
        'AUD/USD': { price: 0.6512, change: 0.21 },
        'USD/CAD': { price: 1.3856, change: -0.12 },
        'NZD/USD': { price: 0.5978, change: 0.18 },
        'USD/CHF': { price: 0.8892, change: 0.09 },
        'GOLD': { price: 2634.80, change: 0.45 },
        'SILVER': { price: 29.84, change: 0.67 },
        'OIL': { price: 73.25, change: -0.34 },
        'BTC/USD': { price: 95234.50, change: 2.15 },
        'ETH/USD': { price: 3421.80, change: 1.89 },
        'DXY': { price: 106.42, change: -0.11 },
        'VIX': { price: 16.82, change: -2.45 }
    };
    
    return Object.entries(prices).map(([symbol, data]) => {
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        const changeSign = data.change >= 0 ? '+' : '';
        return `
            <div class="ticker-item">
                <span class="ticker-symbol">${symbol}</span>
                <span class="ticker-price">${data.price.toFixed(symbol.includes('JPY') ? 2 : 4)}</span>
                <span class="ticker-change ${changeClass}">${changeSign}${data.change.toFixed(2)}%</span>
            </div>
        `;
    }).join('');
}

function updateTicker() {
    const tickerContent = document.getElementById('tickerContent');
    if (!tickerContent) return;
    
    // Re-generate with slight variations
    const tickerHTML = generateTickerHTML();
    tickerContent.innerHTML = tickerHTML + tickerHTML;
}

// ===== US Yields =====
function loadYields() {
    const yieldsGrid = document.getElementById('yieldsGrid');
    if (!yieldsGrid) return;
    
    // Simulated yield data (in production, fetch from CNBC API)
    const yields = [
        { label: '1 Month', value: 5.34, change: 0.02 },
        { label: '3 Month', value: 4.85, change: -0.01 },
        { label: '6 Month', value: 4.62, change: 0.03 },
        { label: '1 Year', value: 4.38, change: 0.01 },
        { label: '2 Year', value: 4.25, change: 0.05 },
        { label: '5 Year', value: 4.32, change: 0.04 },
        { label: '10 Year', value: 4.48, change: 0.06 },
        { label: '30 Year', value: 4.65, change: 0.03 }
    ];
    
    yieldsGrid.innerHTML = yields.map(y => {
        const changeClass = y.change >= 0 ? 'positive' : 'negative';
        const changeSign = y.change >= 0 ? '+' : '';
        return `
            <div class="yield-item">
                <div class="yield-label">${y.label}</div>
                <div class="yield-value">${y.value.toFixed(2)}%</div>
                <div class="yield-change ${changeClass}">${changeSign}${y.change.toFixed(2)}%</div>
            </div>
        `;
    }).join('');
    
    state.yields = yields;
}

// ===== News Loading =====
function loadGoldNews() {
    const goldNews = document.getElementById('goldNews');
    if (!goldNews) return;
    
    // Simulated gold news (in production, fetch from RSS feeds)
    const news = [
        {
            time: '2 min ago',
            title: 'Gold prices rise as dollar weakens ahead of Fed decision',
            source: 'Reuters'
        },
        {
            time: '15 min ago',
            title: 'XAU/USD technical analysis: Key support at $2,620 holds firm',
            source: 'FXStreet'
        },
        {
            time: '32 min ago',
            title: 'Central bank gold buying continues to support prices - WGC',
            source: 'Kitco Gold'
        },
        {
            time: '1 hour ago',
            title: 'Gold forecast: Bullish momentum builds above 50-day MA',
            source: 'DailyFX'
        },
        {
            time: '2 hours ago',
            title: 'Geopolitical tensions boost safe-haven demand for gold',
            source: 'ForexLive'
        }
    ];
    
    goldNews.innerHTML = news.map(item => `
        <div class="news-item">
            <div class="news-time">${item.time}</div>
            <div class="news-title">${item.title}</div>
            <div class="news-source">${item.source}</div>
        </div>
    `).join('');
}

function loadDXYNews() {
    const dxyNews = document.getElementById('dxyNews');
    if (!dxyNews) return;
    
    // Simulated DXY news
    const news = [
        {
            time: '5 min ago',
            title: 'Dollar index falls to 106.40 as Treasury yields decline',
            source: 'Bloomberg'
        },
        {
            time: '18 min ago',
            title: 'DXY outlook: Critical support zone at 106.00-106.20',
            source: 'FXStreet'
        },
        {
            time: '45 min ago',
            title: 'Fed rate cut expectations weigh on dollar strength',
            source: 'Reuters'
        },
        {
            time: '1 hour ago',
            title: 'US Dollar Index technical: Break below 106.50 opens downside',
            source: 'DailyFX'
        },
        {
            time: '2 hours ago',
            title: 'Dollar struggles as US data shows mixed economic signals',
            source: 'Investing.com'
        }
    ];
    
    dxyNews.innerHTML = news.map(item => `
        <div class="news-item">
            <div class="news-time">${item.time}</div>
            <div class="news-title">${item.title}</div>
            <div class="news-source">${item.source}</div>
        </div>
    `).join('');
}

// ===== Market Stats =====
function loadMarketStats() {
    const marketStats = document.getElementById('marketStats');
    if (!marketStats) return;
    
    const stats = [
        { label: 'DXY', value: '106.42' },
        { label: 'Gold Spot', value: '$2,634.80' },
        { label: 'Oil (WTI)', value: '$73.25' },
        { label: 'Bitcoin', value: '$95,234' },
        { label: 'VIX', value: '16.82' },
        { label: 'US 10Y Yield', value: '4.48%' }
    ];
    
    marketStats.innerHTML = stats.map(s => `
        <div class="stat-item">
            <div class="stat-label">${s.label}</div>
            <div class="stat-value">${s.value}</div>
        </div>
    `).join('');
}

// ===== Psychology Quotes =====
function loadPsychologyQuotes() {
    const psychologyGrid = document.getElementById('psychologyGrid');
    if (!psychologyGrid) return;
    
    psychologyGrid.innerHTML = PSYCHOLOGY_QUOTES.map(q => `
        <div class="quote-card">
            <div class="quote-text">"${q.quote}"</div>
            <div class="quote-author">— ${q.author}</div>
            <div class="quote-category">${q.category}</div>
        </div>
    `).join('');
}

// ===== DXY Bias Detection Engine =====
function initializeDXYEngine() {
    // Level 1: DXY Bias Display
    const dxyBiasDisplay = document.getElementById('dxyBiasDisplay');
    if (dxyBiasDisplay) {
        const bias = {
            bias: 'Bullish',
            confidence: 78,
            momentum: 'Expanding',
            session: 'NY Active'
        };
        
        state.dxyBias = bias;
        
        dxyBiasDisplay.innerHTML = `
            <div class="bias-output">
                <div class="bias-item">
                    <span class="bias-label">DXY Bias:</span>
                    <span class="bias-value bullish">${bias.bias}</span>
                </div>
                <div class="bias-item">
                    <span class="bias-label">Confidence:</span>
                    <span class="bias-value">${bias.confidence}%</span>
                </div>
                <div class="bias-item">
                    <span class="bias-label">Momentum:</span>
                    <span class="bias-value">${bias.momentum}</span>
                </div>
                <div class="bias-item">
                    <span class="bias-label">Session:</span>
                    <span class="bias-value">${bias.session}</span>
                </div>
            </div>
        `;
    }
    
    // Level 2: Asset Projection
    const assetProjection = document.getElementById('assetProjection');
    if (assetProjection) {
        const dxyBullish = state.dxyBias?.bias === 'Bullish';
        
        assetProjection.innerHTML = `
            <thead>
                <tr>
                    <th>DXY</th>
                    <th>Gold</th>
                    <th>EUR/USD</th>
                    <th>GBP/USD</th>
                    <th>USD/JPY</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="projection-${dxyBullish ? 'bullish' : 'bearish'}">${dxyBullish ? 'Bullish' : 'Bearish'}</td>
                    <td class="projection-${dxyBullish ? 'bearish' : 'bullish'}">${dxyBullish ? 'Bearish' : 'Bullish'}</td>
                    <td class="projection-${dxyBullish ? 'bearish' : 'bullish'}">${dxyBullish ? 'Bearish' : 'Bullish'}</td>
                    <td class="projection-${dxyBullish ? 'bearish' : 'bullish'}">${dxyBullish ? 'Bearish' : 'Bullish'}</td>
                    <td class="projection-${dxyBullish ? 'bullish' : 'bearish'}">${dxyBullish ? 'Bullish' : 'Bearish'}</td>
                </tr>
            </tbody>
        `;
    }
    
    // Level 3: Macro Drivers
    const macroDrivers = document.getElementById('macroDrivers');
    if (macroDrivers) {
        const drivers = [
            { name: 'DXY', weight: '40%', status: 'Bullish', type: 'bullish' },
            { name: 'US 10Y Yields', weight: '30%', status: 'Rising', type: 'bullish' },
            { name: 'Risk Sentiment', weight: '20%', status: 'Neutral', type: 'neutral' },
            { name: 'Oil', weight: '10%', status: 'Flat', type: 'neutral' }
        ];
        
        macroDrivers.innerHTML = drivers.map(d => `
            <div class="driver-card">
                <div class="driver-header">
                    <span class="driver-title">${d.name}</span>
                    <span class="driver-weight">Weight: ${d.weight}</span>
                </div>
                <div class="driver-status ${d.type}">${d.status}</div>
            </div>
        `).join('');
    }
    
    // Final Engine Output
    const finalEngineOutput = document.getElementById('finalEngineOutput');
    if (finalEngineOutput) {
        const projections = [
            { asset: 'Gold', bias: 'Strong Bearish', confidence: 85, type: 'bearish' },
            { asset: 'EUR/USD', bias: 'Bearish', confidence: 78, type: 'bearish' },
            { asset: 'GBP/USD', bias: 'Bearish', confidence: 74, type: 'bearish' },
            { asset: 'USD/JPY', bias: 'Strong Bullish', confidence: 88, type: 'bullish' },
            { asset: 'USD/CAD', bias: 'Moderate Bullish', confidence: 65, type: 'bullish' }
        ];
        
        finalEngineOutput.innerHTML = `
            <div class="output-header">Macro Engine Status</div>
            <div class="projection-grid">
                ${projections.map(p => `
                    <div class="projection-item">
                        <div class="projection-asset">${p.asset}</div>
                        <div class="projection-bias ${p.type}">${p.bias}</div>
                        <div class="projection-confidence">${p.confidence}% Probability</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// ===== Refresh All Data =====
function refreshAllData() {
    console.log('🔄 Refreshing all data...');
    
    // Update ticker
    updateTicker();
    
    // Reload dashboard data
    if (state.currentPage === 'dashboard') {
        loadYields();
        loadGoldNews();
        loadDXYNews();
        loadMarketStats();
    }
    
    // Update DXY engine
    if (state.currentPage === 'dxy-engine') {
        initializeDXYEngine();
    }
    
    state.lastUpdate = new Date();
    console.log('✅ Data refreshed at', state.lastUpdate.toLocaleTimeString());
}

// ===== Utility Functions =====
function formatTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}

function getRandomChange(min = -2, max = 2) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

// ===== Console Art =====
console.log(`
%c
╔═══════════════════════════════════════════════╗
║   ForexLive Intelligence Terminal v2.0        ║
║   Professional Trading Dashboard              ║
║   Built with ❤️ for Traders                   ║
╚═══════════════════════════════════════════════╝
`, 'color: #00ff88; font-family: monospace; font-size: 12px;');
