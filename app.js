// ===== Configuration =====
const CONFIG = {
    // Financial Modeling Prep API Key
    FMP_API_KEY: 'puaB19VsPlFrReOd97ErUq1e2qhdiW9t',
    
    // Backend API endpoints (for production use)
    BACKEND_URL: 'http://localhost:3000',
    USE_BACKEND: false, // Set to true when backend is running
    
    RSS_FEEDS: [
        // Major Forex News Sources - Real-time (Updated every minute)
        { name: 'ForexLive', url: 'https://www.forexlive.com/feed/news', category: 'forex', type: 'forex' },
        { name: 'ForexLive Technical', url: 'https://www.forexlive.com/feed/technicalanalysis', category: 'forex', type: 'forex' },
        { name: 'FXStreet News', url: 'https://www.fxstreet.com/rss/news', category: 'forex', type: 'forex' },
        { name: 'FXStreet Analysis', url: 'https://www.fxstreet.com/rss/analysis', category: 'forex', type: 'forex' },
        { name: 'FXStreet Forecasts', url: 'https://www.fxstreet.com/rss/forecasts', category: 'forex', type: 'forex' },
        { name: 'DailyFX News', url: 'https://www.dailyfx.com/feeds/market-news', category: 'forex', type: 'forex' },
        { name: 'DailyFX Analysis', url: 'https://www.dailyfx.com/feeds/analyst-picks', category: 'forex', type: 'forex' },
        { name: 'DailyFX Forecasts', url: 'https://www.dailyfx.com/feeds/forecasts', category: 'forex', type: 'forex' },
        
        // Investing.com - Multiple feeds
        { name: 'Investing Forex', url: 'https://www.investing.com/rss/news_25.rss', category: 'forex', type: 'forex' },
        { name: 'Investing Commodities', url: 'https://www.investing.com/rss/commodities.rss', category: 'forex', type: 'forex' },
        { name: 'Investing Economic Indicators', url: 'https://www.investing.com/rss/news_95.rss', category: 'forex', type: 'forex' },
        { name: 'Investing World News', url: 'https://www.investing.com/rss/news_1.rss', category: 'forex', type: 'forex' },
        
        // Major Financial News
        { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/', category: 'forex', type: 'forex' },
        { name: 'Bloomberg Markets', url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'forex', type: 'forex' },
        { name: 'Reuters Business', url: 'https://www.reuters.com/rssfeed/businessNews', category: 'forex', type: 'forex' },
        { name: 'Reuters Markets', url: 'https://www.reuters.com/rssfeed/marketsNews', category: 'forex', type: 'forex' },
        
        // Specialized Forex Sites
        { name: 'FXEmpire', url: 'https://www.fxempire.com/api/v1/en/markets/news/rss', category: 'forex', type: 'forex' },
        { name: 'Action Forex', url: 'https://www.actionforex.com/feed/', category: 'forex', type: 'forex' },
        { name: 'FXStreet EUR/USD', url: 'https://www.fxstreet.com/rss/eur-usd/news', category: 'forex', type: 'forex' },
        { name: 'FXStreet GBP/USD', url: 'https://www.fxstreet.com/rss/gbp-usd/news', category: 'forex', type: 'forex' },
        
        // Economic Data & Analysis
        { name: 'Trading Economics', url: 'https://tradingeconomics.com/rss/news.aspx', category: 'forex', type: 'forex' },
        { name: 'Econoday', url: 'http://www.econoday.com/rss.xml', category: 'forex', type: 'forex' },
        { name: 'Myfxbook', url: 'https://www.myfxbook.com/rss/forex-market-news', category: 'forex', type: 'forex' },
        
        // Gold/Precious Metals - Multiple sources
        { name: 'Kitco Gold News', url: 'https://www.kitco.com/rss/KitcoNews.xml', category: 'gold', type: 'gold' },
        { name: 'Kitco Market Updates', url: 'https://www.kitco.com/rss/KitcoMarketUpdates.xml', category: 'gold', type: 'gold' },
        { name: 'Gold.org News', url: 'https://www.gold.org/feed', category: 'gold', type: 'gold' },
        { name: 'BullionVault', url: 'https://www.bullionvault.com/rss/gold-news.xml', category: 'gold', type: 'gold' },
        { name: 'Investing Gold', url: 'https://www.investing.com/rss/commodities_59.rss', category: 'gold', type: 'gold' },
        { name: 'Kitco Analysis', url: 'https://www.kitco.com/rss/analysis.xml', category: 'gold', type: 'gold' },
        { name: 'Gold Eagle', url: 'https://www.gold-eagle.com/rss.xml', category: 'gold', type: 'gold' },
        
        // Dollar Index (DXY) Specific
        { name: 'Investing Dollar Index', url: 'https://www.investing.com/rss/news_301.rss', category: 'DXY', type: 'dxy' },
        { name: 'DailyFX Dollar', url: 'https://www.dailyfx.com/feeds/dollar', category: 'DXY', type: 'dxy' },
        
        // Central Bank Feeds
        { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml', category: 'USD', type: 'centralbank', bank: 'FED' },
        { name: 'Fed Speeches', url: 'https://www.federalreserve.gov/feeds/speeches.xml', category: 'USD', type: 'centralbank', bank: 'FED' },
        { name: 'Bank of England', url: 'https://www.bankofengland.co.uk/news.rss', category: 'GBP', type: 'centralbank', bank: 'BoE' },
        { name: 'ECB Press', url: 'https://www.ecb.europa.eu/rss/press.xml', category: 'EUR', type: 'centralbank', bank: 'ECB' },
        { name: 'ECB Speeches', url: 'https://www.ecb.europa.eu/rss/speeches.xml', category: 'EUR', type: 'centralbank', bank: 'ECB' },
        { name: 'Bank of Japan', url: 'https://www.boj.or.jp/en/rss/pressrelease.xml', category: 'JPY', type: 'centralbank', bank: 'BoJ' },
        { name: 'Bank of Canada', url: 'https://www.bankofcanada.ca/feed/', category: 'CAD', type: 'centralbank', bank: 'BoC' },
        { name: 'RBA News', url: 'https://www.rba.gov.au/rss/rss-cb-lspeech.xml', category: 'AUD', type: 'centralbank', bank: 'RBA' },
        
        // Trump & Politics News
        { name: 'Reuters Politics', url: 'https://www.reuters.com/rssfeed/politicsNews', category: 'trump', type: 'trump' },
        { name: 'AP Politics', url: 'https://feeds.apnews.com/rss/apf-politics', category: 'trump', type: 'trump' },
        { name: 'CNN Politics', url: 'http://rss.cnn.com/rss/cnn_allpolitics.rss', category: 'trump', type: 'trump' },
        { name: 'Politico', url: 'https://www.politico.com/rss/politics08.xml', category: 'trump', type: 'trump' },
        { name: 'The Hill', url: 'https://thehill.com/rss/syndicator/19109', category: 'trump', type: 'trump' },
        
        // Major Financial Publications
        { name: 'Financial Times', url: 'https://www.ft.com/?format=rss', category: 'forex', type: 'forex' },
        { name: 'WSJ Markets', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', category: 'forex', type: 'forex' },
        { name: 'WSJ Economy', url: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml', category: 'forex', type: 'forex' },
        { name: 'CNBC Forex', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', category: 'forex', type: 'forex' },
        { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', category: 'forex', type: 'forex' },
        
        // International News Agencies
        { name: 'AFP Business', url: 'https://www.afp.com/en/rss/business', category: 'forex', type: 'forex' },
        { name: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'forex', type: 'forex' }
    ],
    PROXY_URL: 'https://api.rss2json.com/v1/api.json?rss_url=',
    BACKUP_PROXIES: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest='
    ],
    AUTO_REFRESH_INTERVAL: 3000, // 3 seconds for real-time updates
    NOTIFICATION_CHECK_INTERVAL: 3000, // Check every 3 seconds
    
    // Live Ticker Symbols
    TICKER_SYMBOLS: [
        // Major Forex Pairs
        { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
        { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
        { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
        { symbol: 'AUDUSD', name: 'AUD/USD', type: 'forex' },
        { symbol: 'USDCAD', name: 'USD/CAD', type: 'forex' },
        { symbol: 'USDCHF', name: 'USD/CHF', type: 'forex' },
        // Commodities
        { symbol: 'XAUUSD', name: 'Gold', type: 'commodity' },
        { symbol: 'XAGUSD', name: 'Silver', type: 'commodity' },
        { symbol: 'USOIL', name: 'Oil', type: 'commodity' },
        // Crypto
        { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto' },
        // Index
        { symbol: 'DXY', name: 'Dollar Index', type: 'index' }
    ],
    
    // US Treasury Yields
    US_YIELDS: [
        { symbol: '^TNX', name: '10-Year', period: '10Y' },
        { symbol: '^FVX', name: '5-Year', period: '5Y' },
        { symbol: '^IRX', name: '13-Week', period: '3M' }
    ],
    
    CURRENCIES: ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'MXN'],
    CURRENCY_FLAGS: {
        'EUR': '🇪🇺',
        'USD': '🇺🇸',
        'GBP': '🇬🇧',
        'JPY': '🇯🇵',
        'AUD': '🇦🇺',
        'CAD': '🇨🇦',
        'CHF': '🇨🇭',
        'NZD': '🇳🇿',
        'MXN': '🇲🇽'
    },
    CURRENCY_NAMES: {
        'EUR': 'Euro',
        'USD': 'US Dollar',
        'GBP': 'British Pound',
        'JPY': 'Japanese Yen',
        'AUD': 'Australian Dollar',
        'CAD': 'Canadian Dollar',
        'CHF': 'Swiss Franc',
        'NZD': 'New Zealand Dollar',
        'MXN': 'Mexican Peso'
    }
};

// ===== Google Gemini API Helper =====
// ===== State Management =====
let state = {
    newsCache: [],
    trumpCache: [],
    calendarCache: [],
    marketSummary: {},
    currentFilter: 'all',
    currentCurrency: 'all',
    currentSentiment: 'all',
    lastUpdateTime: null,
    isLoading: false,
    notificationsEnabled: false,
    mrktAlertsEnabled: false,
    lastArticleCount: 0,
    currentChart: null,
    currentChartSymbol: 'EURUSD',
    pushSubscription: null,
    conversationHistory: [], // Store AI conversation context
    currentArticleAnalysis: null, // Store current article being analyzed
    websocket: null, // WebSocket connection
    wsConnected: false // WebSocket status
};

// ===== WebSocket Real-Time Updates =====
function initWebSocket() {
    if (!CONFIG.USE_BACKEND) {
        console.log('⚠️ WebSocket disabled (USE_BACKEND is false)');
        return;
    }

    const wsUrl = CONFIG.BACKEND_URL.replace('http', 'ws');
    console.log(`🔌 Connecting WebSocket: ${wsUrl}`);

    try {
        state.websocket = new WebSocket(wsUrl);

        state.websocket.onopen = () => {
            console.log('✅ WebSocket CONNECTED!');
            state.wsConnected = true;
            showToast('✅ Live Updates', 'Real-time connection established');
        };

        state.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(`📨 WebSocket: ${data.type}`);

                if (data.type === 'news_update') {
                    console.log(`📰 ${data.count} new articles available`);
                    // Auto-reload news
                    loadAllNews();
                }

                if (data.type === 'calendar_update') {
                    // Reload calendar if modal is open
                    const modal = document.getElementById('calendarModal');
                    if (modal && modal.classList.contains('active')) {
                        loadEconomicCalendar();
                    }
                }
            } catch (error) {
                console.error('WebSocket parse error:', error);
            }
        };

        state.websocket.onclose = () => {
            console.log('❌ WebSocket DISCONNECTED');
            state.wsConnected = false;
            
            // Auto-reconnect after 5 seconds
            setTimeout(() => {
                console.log('🔄 Reconnecting WebSocket...');
                initWebSocket();
            }, 5000);
        };

        state.websocket.onerror = (error) => {
            console.error('❌ WebSocket ERROR:', error);
        };

    } catch (error) {
        console.error('WebSocket init failed:', error);
    }
}

// ===== Advanced Sentiment Analysis Engine =====
class SentimentAnalyzer {
    static CENTRAL_BANKS = {
        'FED': 'USD',
        'ECB': 'EUR',
        'BoE': 'GBP',
        'BoJ': 'JPY',
        'BoC': 'CAD',
        'SNB': 'CHF',
        'RBA': 'AUD'
    };
    
    static CURRENCY_PAIRS = {
        'EUR/USD': ['EUR', 'USD'],
        'GBP/USD': ['GBP', 'USD'],
        'USD/JPY': ['USD', 'JPY'],
        'AUD/USD': ['AUD', 'USD'],
        'USD/CAD': ['USD', 'CAD'],
        'USD/CHF': ['USD', 'CHF']
    };
    
    static analyzeArticle(title, description, detectedCurrencies, centralBanks) {
        const fullText = (title + ' ' + description).toLowerCase();
        const sentiment = {};
        
        // Auto-detect ALL currencies in the text, not just pre-detected ones
        const allMentionedCurrencies = new Set(detectedCurrencies);
        
        // Check for all possible currencies
        CONFIG.CURRENCIES.forEach(curr => {
            const currLower = curr.toLowerCase();
            const currName = CONFIG.CURRENCY_NAMES[curr]?.toLowerCase();
            
            if (fullText.includes(currLower) || 
                fullText.includes(`${currLower}/`) ||
                fullText.includes(`/${currLower}`) ||
                (currName && fullText.includes(currName))) {
                allMentionedCurrencies.add(curr);
            }
        });
        
        // Check for MXN/peso
        if (fullText.includes('peso') || fullText.includes('mexico') || fullText.includes('mxn')) {
            allMentionedCurrencies.add('MXN');
        }
        
        // Check for NZD/kiwi
        if (fullText.includes('kiwi') || fullText.includes('new zealand') || fullText.includes('nzd')) {
            allMentionedCurrencies.add('NZD');
        }
        
        // Initialize sentiment for all detected currencies
        Array.from(allMentionedCurrencies).forEach(currency => {
            sentiment[currency] = null;
        });
        
        // Analyze each currency
        Array.from(allMentionedCurrencies).forEach(currency => {
            const analysis = this.analyzeSingleCurrency(fullText, title, currency, centralBanks);
            if (analysis) {
                sentiment[currency] = analysis;
            }
        });
        
        // Apply pair correlations
        this.applyPairCorrelations(fullText, sentiment, Array.from(allMentionedCurrencies));
        
        // Apply central bank impact
        this.applyCentralBankImpact(fullText, sentiment, centralBanks);
        
        // Remove null sentiments
        Object.keys(sentiment).forEach(key => {
            if (sentiment[key] === null) {
                delete sentiment[key];
            }
        });
        
        return sentiment;
    }
    
    // NEW: Apply central bank impact to currencies
    static applyCentralBankImpact(fullText, sentiment, centralBanks) {
        centralBanks.forEach(bank => {
            const currency = this.CENTRAL_BANKS[bank];
            if (!currency) return;
            
            // If central bank is mentioned and currency sentiment is null, determine it
            if (sentiment.hasOwnProperty(currency) && !sentiment[currency]) {
                let score = 0;
                
                // Hawkish patterns = bullish for currency
                const hawkish = ['hawkish', 'rate hike', 'tightening', 'raising rates', 'inflation fight'];
                hawkish.forEach(pattern => {
                    if (fullText.includes(pattern)) score += 2;
                });
                
                // Dovish patterns = bearish for currency
                const dovish = ['dovish', 'rate cut', 'easing', 'lowering rates', 'stimulus'];
                dovish.forEach(pattern => {
                    if (fullText.includes(pattern)) score -= 2;
                });
                
                if (score > 1) sentiment[currency] = 'Bullish';
                if (score < -1) sentiment[currency] = 'Bearish';
            }
        });
    }
    
    static analyzeSingleCurrency(fullText, title, currency, centralBanks) {
        const currencyLower = currency.toLowerCase();
        let bullishScore = 0;
        let bearishScore = 0;
        
        const relevantBank = Object.keys(this.CENTRAL_BANKS).find(bank => 
            this.CENTRAL_BANKS[bank] === currency && centralBanks.includes(bank)
        );
        
        const pricePatterns = {
            bullish: [
                `${currencyLower} strengthens`, `${currencyLower} gains`, `${currencyLower} rallies`,
                `${currencyLower} surges`, `${currencyLower} jumps`, `${currencyLower} soars`,
                `${currencyLower} climbs`, `bullish ${currencyLower}`, `${currencyLower} up`,
                `${currencyLower} higher`, `${currencyLower} advances`, `${currencyLower} rises`,
                `${currencyLower} recovery`, `${currencyLower} rebound`, `${currencyLower} bounce`,
                `strong ${currencyLower}`, `stronger ${currencyLower}`, `${currencyLower} strength`,
                `${currencyLower} outperforms`, `${currencyLower} extends gains`, 
                `renewed ${currencyLower}`, `${currencyLower} support`
            ],
            bearish: [
                `${currencyLower} weakens`, `${currencyLower} falls`, `${currencyLower} declines`,
                `${currencyLower} drops`, `${currencyLower} slides`, `${currencyLower} tumbles`,
                `${currencyLower} plunges`, `bearish ${currencyLower}`, `${currencyLower} down`,
                `${currencyLower} lower`, `${currencyLower} retreats`, `${currencyLower} slumps`,
                `${currencyLower} pressure`, `${currencyLower} weakness`, `weak ${currencyLower}`,
                `weaker ${currencyLower}`, `${currencyLower} underperforms`, `${currencyLower} selloff`,
                `${currencyLower} loses`, `${currencyLower} extends losses`
            ]
        };
        
        if (relevantBank) {
            const policyPatterns = {
                bullish: [
                    'rate hike', 'raising rates', 'hawkish', 'tightening', 'inflation concerns',
                    'strong economy', 'economic growth', 'beats forecast', 'better than expected',
                    'positive outlook', 'optimistic', 'rate increase', 'tightening policy',
                    'hawkish signals', 'hawkish stance', 'monetary tightening', 'policy tightening'
                ],
                bearish: [
                    'rate cut', 'lowering rates', 'dovish', 'easing', 'stimulus',
                    'quantitative easing', 'qe', 'recession fears', 'misses forecast',
                    'worse than expected', 'economic slowdown', 'negative outlook',
                    'accommodative policy', 'rate decrease', 'dovish signals', 'dovish stance'
                ]
            };
            
            policyPatterns.bullish.forEach(pattern => {
                if (fullText.includes(pattern)) bullishScore += 2;
            });
            
            policyPatterns.bearish.forEach(pattern => {
                if (fullText.includes(pattern)) bearishScore += 2;
            });
        }
        
        pricePatterns.bullish.forEach(pattern => {
            if (fullText.includes(pattern)) bullishScore++;
        });
        
        pricePatterns.bearish.forEach(pattern => {
            if (fullText.includes(pattern)) bearishScore++;
        });
        
        const economicPatterns = {
            bullish: [
                'strong data', 'gdp growth', 'employment gains', 'retail sales up',
                'inflation cooling', 'trade surplus', 'strong manufacturing',
                'positive data', 'upbeat data', 'exceeds expectations', 'beats estimates',
                'economic expansion', 'strong jobs', 'robust growth'
            ],
            bearish: [
                'weak data', 'gdp contraction', 'unemployment rises', 'retail sales decline',
                'inflation rising', 'trade deficit', 'manufacturing slowdown',
                'disappointing data', 'misses expectations', 'below estimates',
                'economic contraction', 'job losses', 'weak growth'
            ]
        };
        
        economicPatterns.bullish.forEach(pattern => {
            if (fullText.includes(pattern)) bullishScore++;
        });
        
        economicPatterns.bearish.forEach(pattern => {
            if (fullText.includes(pattern)) bearishScore++;
        });
        
        const minScore = 0.1; // Lower threshold = more currencies detected
        if (bullishScore >= minScore && bullishScore > bearishScore) return 'Bullish';
        if (bearishScore >= minScore && bearishScore > bullishScore) return 'Bearish';
        
        // If any score exists, show neutral
        if (bullishScore > 0 || bearishScore > 0) return 'Neutral';
        
        return null;
    }
    
    static applyPairCorrelations(fullText, sentiment, detectedCurrencies) {
        for (const [pair, [base, quote]] of Object.entries(this.CURRENCY_PAIRS)) {
            const pairLower = pair.toLowerCase();
            const pairNoSlash = pair.replace('/', '').toLowerCase();
            
            if (fullText.includes(pairLower) || fullText.includes(pairNoSlash)) {
                const baseSentiment = sentiment[base];
                const quoteSentiment = sentiment[quote];
                
                const pairBullishPatterns = [
                    `${pairLower} rises`, `${pairLower} gains`, `${pairLower} rallies`,
                    `${pairLower} jumps`, `${pairLower} climbs`, `${pairLower} surges`,
                    `${pairLower} advances`, `${pairLower} rebounds`, `${pairLower} up`,
                    `${pairLower} higher`, `${pairLower} strengthens`,
                    `${pairNoSlash} rises`, `${pairNoSlash} gains`, `${pairNoSlash} rallies`,
                    `${pairNoSlash} jumps`, `${pairNoSlash} climbs`, `${pairNoSlash} surges`,
                    `${pairNoSlash} advances`, `${pairNoSlash} rebounds`, `${pairNoSlash} up`,
                    `${pairNoSlash} higher`, `${pairNoSlash} strengthens`
                ];
                
                const pairBearishPatterns = [
                    `${pairLower} falls`, `${pairLower} declines`, `${pairLower} drops`,
                    `${pairLower} slides`, `${pairLower} tumbles`, `${pairLower} plunges`,
                    `${pairLower} retreats`, `${pairLower} down`, `${pairLower} lower`,
                    `${pairLower} weakens`,
                    `${pairNoSlash} falls`, `${pairNoSlash} declines`, `${pairNoSlash} drops`,
                    `${pairNoSlash} slides`, `${pairNoSlash} tumbles`, `${pairNoSlash} plunges`,
                    `${pairNoSlash} retreats`, `${pairNoSlash} down`, `${pairNoSlash} lower`,
                    `${pairNoSlash} weakens`
                ];
                
                let pairIsBullish = pairBullishPatterns.some(pattern => fullText.includes(pattern));
                let pairIsBearish = pairBearishPatterns.some(pattern => fullText.includes(pattern));
                
                if (pairIsBullish) {
                    if (detectedCurrencies.includes(base)) sentiment[base] = 'Bullish';
                    if (detectedCurrencies.includes(quote)) sentiment[quote] = 'Bearish';
                } else if (pairIsBearish) {
                    if (detectedCurrencies.includes(base)) sentiment[base] = 'Bearish';
                    if (detectedCurrencies.includes(quote)) sentiment[quote] = 'Bullish';
                } else {
                    if (baseSentiment && !quoteSentiment && detectedCurrencies.includes(quote)) {
                        sentiment[quote] = baseSentiment === 'Bullish' ? 'Bearish' : 
                                          baseSentiment === 'Bearish' ? 'Bullish' : null;
                    } else if (quoteSentiment && !baseSentiment && detectedCurrencies.includes(base)) {
                        sentiment[base] = quoteSentiment === 'Bullish' ? 'Bearish' : 
                                         quoteSentiment === 'Bearish' ? 'Bullish' : null;
                    }
                }
            }
        }
    }
    
    static analyzeGoldSentiment(title, description) {
        const fullText = (title + ' ' + description).toLowerCase();
        let bullishScore = 0;
        let bearishScore = 0;
        
        const bullishPatterns = [
            'gold rises', 'gold rallies', 'gold gains', 'gold climbs', 'gold surges',
            'gold jumps', 'xau/usd higher', 'xau rises', 'gold up', 'gold higher',
            'safe haven demand', 'safe-haven', 'risk-off', 'risk aversion',
            'geopolitical tensions', 'inflation concerns', 'inflation fears',
            'dollar weakness', 'weak dollar', 'usd weakness', 'central bank buying',
            'gold demand', 'gold prices rise', 'gold outlook positive',
            'gold strengthens', 'gold advances', 'gold rebound', 'gold recovery',
            'gold support', 'gold buying', 'bullish gold', 'gold momentum',
            'xau gains', 'xau up', 'xau climbs', 'xau rallies'
        ];
        
        const bearishPatterns = [
            'gold falls', 'gold declines', 'gold drops', 'gold weakens', 'gold tumbles',
            'gold plunges', 'xau/usd lower', 'xau falls', 'gold down', 'gold lower',
            'risk-on', 'risk appetite', 'dollar strength', 'strong dollar',
            'usd strengthens', 'rising yields', 'rate hikes', 'gold selling',
            'profit taking in gold', 'gold prices fall', 'gold outlook negative',
            'gold pressure', 'gold losses', 'bearish gold', 'gold retreat',
            'xau declines', 'xau down', 'xau drops', 'xau slides'
        ];
        
        bullishPatterns.forEach(pattern => {
            if (fullText.includes(pattern)) bullishScore++;
        });
        
        bearishPatterns.forEach(pattern => {
            if (fullText.includes(pattern)) bearishScore++;
        });
        
        const negations = ['not', 'no longer', 'fails to', 'unable to'];
        negations.forEach(neg => {
            if (fullText.includes(`${neg} rise`) || fullText.includes(`${neg} rally`)) {
                bearishScore++;
            }
            if (fullText.includes(`${neg} fall`) || fullText.includes(`${neg} decline`)) {
                bullishScore++;
            }
        });
        
        const minScore = 0.1; // Lower threshold
        if (bullishScore >= minScore && bullishScore > bearishScore) return 'Bullish';
        if (bearishScore >= minScore && bearishScore > bullishScore) return 'Bearish';
        
        // Show neutral if any mention
        if (bullishScore > 0 || bearishScore > 0) return 'Neutral';
        
        return null;
    }
    
    static analyzeTrumpImpact(title, description) {
        const fullText = (title + ' ' + description).toLowerCase();
        let marketImpact = 'low';
        
        // High impact keywords related to Trump
        const highImpactKeywords = [
            'tariff', 'trade war', 'china', 'mexico', 'canada', 'fed chair',
            'interest rate', 'tax cut', 'economic policy', 'trade agreement', 'trade deal',
            'sanctions', 'immigration', 'executive order', 'military action',
            'stock market crash', 'economy', 'unemployment', 'gdp', 'nafta', 'usmca',
            'wall', 'border', 'deportation', 'european union'
        ];
        
        const mediumImpactKeywords = [
            'tweet', 'statement', 'press conference', 'rally', 'speech',
            'white house', 'policy', 'announcement', 'meeting', 'republicans',
            'democrats', 'congress', 'senate'
        ];
        
        const hasHighImpact = highImpactKeywords.some(keyword => fullText.includes(keyword));
        const hasMediumImpact = mediumImpactKeywords.some(keyword => fullText.includes(keyword));
        
        if (hasHighImpact) marketImpact = 'high';
        else if (hasMediumImpact) marketImpact = 'medium';
        
        return marketImpact;
    }
    
    // NEW: Analyze Trump news for currency impact
    static analyzeTrumpCurrencyImpact(title, description) {
        const fullText = (title + ' ' + description).toLowerCase();
        const currencyImpact = {};
        
        // Tariff impact
        if (fullText.includes('tariff') || fullText.includes('trade war')) {
            currencyImpact.USD = 'Neutral'; // USD mixed on trade wars
            
            if (fullText.includes('china')) {
                currencyImpact.CNY = 'Bearish';
                currencyImpact.AUD = 'Bearish'; // Australia exports to China
            }
            if (fullText.includes('mexico')) {
                currencyImpact.MXN = 'Bearish';
            }
            if (fullText.includes('canada')) {
                currencyImpact.CAD = 'Bearish';
            }
            if (fullText.includes('europe') || fullText.includes('eu')) {
                currencyImpact.EUR = 'Bearish';
            }
        }
        
        // Fed/interest rate mentions
        if (fullText.includes('fed') || fullText.includes('federal reserve') || fullText.includes('interest rate')) {
            if (fullText.includes('dovish') || fullText.includes('lower') || fullText.includes('cut')) {
                currencyImpact.USD = 'Bearish';
            } else if (fullText.includes('hawkish') || fullText.includes('raise') || fullText.includes('hike')) {
                currencyImpact.USD = 'Bullish';
            }
        }
        
        // Tax policy
        if (fullText.includes('tax cut') || fullText.includes('tax reform')) {
            currencyImpact.USD = 'Bullish'; // Tax cuts typically support USD
        }
        
        // Government shutdown/crisis
        if (fullText.includes('shutdown') || fullText.includes('crisis') || fullText.includes('impeachment')) {
            currencyImpact.USD = 'Bearish';
        }
        
        // Immigration/border
        if (fullText.includes('border') || fullText.includes('immigration') || fullText.includes('wall')) {
            currencyImpact.MXN = 'Bearish';
        }
        
        return currencyImpact;
    }
}

// ===== AI Market Intelligence Engine =====
class MarketIntelligence {
    static analyzeImpact(article) {
        const fullText = (article.title + ' ' + article.description).toLowerCase();
        
        // High impact keywords
        const highImpact = [
            'rate decision', 'rate hike', 'rate cut', 'central bank',
            'nfp', 'non-farm payroll', 'employment', 'cpi', 'inflation',
            'gdp', 'fomc', 'ecb meeting', 'boe decision', 'crisis',
            'emergency', 'war', 'geopolitical', 'trade war', 'trump tariff'
        ];
        
        const mediumImpact = [
            'data release', 'forecast', 'outlook', 'policy', 'economic',
            'retail sales', 'manufacturing', 'pmi', 'confidence'
        ];
        
        const hasHighImpact = highImpact.some(keyword => fullText.includes(keyword));
        const hasMediumImpact = mediumImpact.some(keyword => fullText.includes(keyword));
        
        if (hasHighImpact) return 'high';
        if (hasMediumImpact) return 'medium';
        return 'low';
    }
    
    static async generateAIAnalysis(article) {
        // Show loading state
        const container = document.getElementById('aiAnalysisContainer');
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner-advanced">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p class="loading-message">🧠 Gemini AI is analyzing market data...</p>
                <p class="loading-submessage">Generating professional trading insights</p>
            </div>
        `;
        
        try {
            // Prepare context for AI
            const currencies = Object.keys(article.currencySentiment || {});
            const sentiments = Object.entries(article.currencySentiment || {});
            const bullishCurrencies = sentiments.filter(([_, s]) => s === 'Bullish').map(([c]) => c);
            const bearishCurrencies = sentiments.filter(([_, s]) => s === 'Bearish').map(([c]) => c);
            
            // Create a comprehensive prompt for detailed analysis
            const prompt = `You are an expert forex market analyst with 20+ years of experience. Analyze this breaking news article and provide detailed, actionable trading insights.

ARTICLE INFORMATION:
Title: ${article.title}
Description: ${article.description}
Source: ${article.source}
Published: ${new Date(article.publishedAt).toLocaleString()}
Impact Level: ${article.impact}
Central Banks Mentioned: ${article.centralBanks?.join(', ') || 'None'}
${article.goldSentiment ? `Gold/XAU Sentiment: ${article.goldSentiment}` : ''}

DETECTED MARKET SENTIMENT:
Bullish Currencies: ${bullishCurrencies.join(', ') || 'None'}
Bearish Currencies: ${bearishCurrencies.join(', ') || 'None'}

TASK: Provide a comprehensive professional analysis in valid JSON format. Be specific with currency names, actual price levels where possible, and actionable advice.

YOUR RESPONSE MUST BE VALID JSON with this exact structure:
{
    "summary": "2-3 sentence executive summary of immediate market impact and what traders need to know right now",
    
    "fundamentalAnalysis": "4-5 sentences explaining the underlying economic drivers, why this news matters, how it affects monetary policy expectations, and the broader economic implications for the currencies involved",
    
    "technicalOutlook": "3-4 sentences describing likely price action, key technical levels to watch, momentum indicators, and chart patterns that traders should monitor",
    
    "affectedCurrencies": [
        {
            "currency": "USD",
            "impact": "Bullish or Bearish or Neutral",
            "pros": ["Specific positive factor 1", "Specific positive factor 2", "Specific positive factor 3"],
            "cons": ["Specific negative factor 1", "Specific negative factor 2", "Specific negative factor 3"],
            "outlook": "Short detailed outlook for this specific currency"
        }
    ],
    
    "tradingRecommendations": [
        {
            "setup": "EUR/USD Long",
            "entry": "Specific entry strategy or level",
            "stopLoss": "Specific stop loss level or strategy", 
            "takeProfit": "Specific take profit targets",
            "reasoning": "Why this trade makes sense based on the news"
        }
    ],
    
    "keyLevels": {
        "support": ["Specific level 1 with context", "Specific level 2 with context"],
        "resistance": ["Specific level 1 with context", "Specific level 2 with context"]
    },
    
    "riskFactors": [
        "Specific risk factor 1 that could invalidate the analysis",
        "Specific risk factor 2 that could change the outlook",
        "Specific risk factor 3 traders should monitor"
    ],
    
    "timeHorizon": "Intraday (hours) OR Short-term (1-3 days) OR Medium-term (1-2 weeks) OR Long-term (1+ months)",
    
    "confidenceLevel": "High OR Medium OR Low",
    
    "marketContext": "2-3 sentences about broader market conditions, correlations with other assets (stocks, bonds, commodities), and any relevant upcoming events"
}

IMPORTANT INSTRUCTIONS:
- For affectedCurrencies, analyze ONLY the currencies mentioned in the Bullish/Bearish lists above
- Give at least 3 specific pros and 3 specific cons for EACH currency
- Pros and cons should be directly related to THIS NEWS ARTICLE
- Be specific with levels, avoid generic advice like "watch support"
- If you don't have specific levels, describe what to watch for (e.g., "break above today's high")
- Provide 2-3 realistic trading setups based on the news
- Return ONLY valid JSON, no markdown formatting, no code blocks
- Make sure all quotes are properly escaped in JSON`;

            console.log('Calling Gemini API with prompt...');
            
            // Call Gemini API
            const aiResponse = await callGeminiAPI(prompt);
            
            console.log('Gemini API Response:', aiResponse);
            
            // Parse AI response
            let analysis;
            try {
                // Remove any markdown code blocks
                let cleanedResponse = aiResponse
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .replace(/^[\s\n]*/, '')
                    .replace(/[\s\n]*$/, '')
                    .trim();
                
                // Try to find JSON in the response
                const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[0]);
                    console.log('Successfully parsed AI analysis:', analysis);
                } else {
                    throw new Error('No JSON found in Gemini response');
                }
                
                // Validate that we have the required fields
                if (!analysis.summary || !analysis.fundamentalAnalysis) {
                    throw new Error('Missing required fields in AI response');
                }
                
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                console.error('Raw AI Response:', aiResponse);
                
                // If parsing fails, create a structured fallback but still show the AI's text analysis
                analysis = {
                    summary: aiResponse.substring(0, 400) || "AI analysis generated. Please review the detailed breakdown below.",
                    fundamentalAnalysis: "The market is processing this news event. " + (bullishCurrencies.length > 0 ? `${bullishCurrencies.join(', ')} showing strength due to positive fundamental factors. ` : '') + (bearishCurrencies.length > 0 ? `${bearishCurrencies.join(', ')} facing headwinds from negative developments.` : ''),
                    technicalOutlook: "Monitor key technical levels for confirmation. Watch for volume spikes and momentum shifts at support/resistance zones. Price action will be critical in the next 24-48 hours.",
                    affectedCurrencies: [],
                    tradingRecommendations: [
                        {
                            setup: "Wait for confirmation",
                            entry: "Enter on pullback to support with volume confirmation",
                            stopLoss: "Place stops below recent swing low",
                            takeProfit: "Target previous resistance levels",
                            reasoning: "Risk management is crucial during high-impact news events"
                        }
                    ],
                    keyLevels: {
                        support: ["Previous day's low", "Weekly support zone"],
                        resistance: ["Previous day's high", "Weekly resistance zone"]
                    },
                    riskFactors: [
                        "High volatility during and after major news releases",
                        "Potential for rapid sentiment reversals",
                        "Upcoming economic data could shift the narrative"
                    ],
                    timeHorizon: "Short-term (1-3 days)",
                    confidenceLevel: "Medium",
                    marketContext: "Markets are reacting to this development. Monitor related assets and upcoming economic releases for confirmation."
                };
            }
            
            // Build affectedCurrencies if not provided or empty
            if (!analysis.affectedCurrencies || analysis.affectedCurrencies.length === 0) {
                analysis.affectedCurrencies = [];
                
                // Add bullish currencies
                bullishCurrencies.forEach(curr => {
                    analysis.affectedCurrencies.push({
                        currency: curr,
                        impact: 'Bullish',
                        pros: [
                            `Positive sentiment from ${article.title.substring(0, 50)}...`,
                            "Market momentum favoring strength",
                            "Technical indicators support upside"
                        ],
                        cons: [
                            "Profit-taking could limit gains",
                            "Broader market risk factors",
                            "Potential for sentiment reversal"
                        ],
                        outlook: `${curr} showing bullish momentum on this news. Watch for continued strength.`
                    });
                });
                
                // Add bearish currencies
                bearishCurrencies.forEach(curr => {
                    analysis.affectedCurrencies.push({
                        currency: curr,
                        impact: 'Bearish',
                        pros: [
                            "Potential oversold bounce opportunity",
                            "Could find support at key levels",
                            "Contrarian trade setup possible"
                        ],
                        cons: [
                            `Negative impact from ${article.title.substring(0, 50)}...`,
                            "Momentum favoring further weakness",
                            "Technical breakdown signals downside"
                        ],
                        outlook: `${curr} under pressure from this development. Monitor for capitulation signals.`
                    });
                });
            }
            
            // Add retail positioning data
            analysis.retailPositioning = this.simulateRetailPositioning(article);
            
            return analysis;
            
        } catch (error) {
            console.error('AI Analysis Error:', error);
            
            // Comprehensive fallback with pros/cons for each currency
            const bullishCurrencies = Object.entries(article.currencySentiment || {})
                .filter(([_, s]) => s === 'Bullish')
                .map(([c]) => c);
            const bearishCurrencies = Object.entries(article.currencySentiment || {})
                .filter(([_, s]) => s === 'Bearish')
                .map(([c]) => c);
            
            const affectedCurrencies = [];
            
            // Build detailed pros/cons for bullish currencies
            bullishCurrencies.forEach(curr => {
                affectedCurrencies.push({
                    currency: curr,
                    impact: 'Bullish',
                    pros: [
                        `Strong positive sentiment from ${article.source} news coverage`,
                        `Technical momentum indicators showing upward pressure`,
                        `${article.centralBanks.length > 0 ? 'Supportive central bank policy signals' : 'Favorable economic fundamentals'}`
                    ],
                    cons: [
                        "Overbought conditions could trigger profit-taking",
                        "Potential for news-driven volatility and whipsaws",
                        "Broader risk-off sentiment could reverse gains"
                    ],
                    outlook: `${curr} is benefiting from this news event with bullish momentum building. Traders should watch for continuation patterns above key support levels while being mindful of overbought conditions that could lead to short-term pullbacks.`
                });
            });
            
            // Build detailed pros/cons for bearish currencies
            bearishCurrencies.forEach(curr => {
                affectedCurrencies.push({
                    currency: curr,
                    impact: 'Bearish',
                    pros: [
                        "Oversold conditions presenting potential bounce opportunities",
                        "Strong support levels nearby may attract buyers",
                        "Contrarian positioning could lead to short covering rally"
                    ],
                    cons: [
                        `Negative sentiment from ${article.source} undermining confidence`,
                        `Technical breakdown suggesting further downside risk`,
                        `${article.centralBanks.length > 0 ? 'Dovish central bank signals weighing on outlook' : 'Deteriorating economic fundamentals'}`
                    ],
                    outlook: `${curr} is facing headwinds from this development with bearish momentum accelerating. Traders should be cautious of further weakness unless key support levels hold and we see evidence of capitulation or reversal patterns forming.`
                });
            });
            
            return {
                summary: `Market reacting to ${article.title}. ${bullishCurrencies.length > 0 ? bullishCurrencies.join(', ') + ' showing strength' : ''} ${bearishCurrencies.length > 0 ? (bullishCurrencies.length > 0 ? 'while ' : '') + bearishCurrencies.join(', ') + ' under pressure' : ''}.`,
                fundamentalAnalysis: `This ${article.impact}-impact news from ${article.source} is influencing currency markets. ${article.centralBanks.length > 0 ? `With ${article.centralBanks.join(', ')} involved, traders are reassessing monetary policy expectations. ` : ''}The fundamental drivers suggest ${bullishCurrencies.length > 0 ? 'positive momentum for ' + bullishCurrencies.join(', ') : ''} ${bearishCurrencies.length > 0 ? 'while creating headwinds for ' + bearishCurrencies.join(', ') : ''}. Market participants should monitor follow-through in upcoming sessions and related economic data releases for confirmation of the trend.`,
                technicalOutlook: "From a technical perspective, key support and resistance levels will be critical. Watch for volume confirmation on breakouts and momentum indicator divergences at extremes. Price action in the next 24-48 hours will determine if this move has legs or if we see a reversal. Pay attention to candlestick patterns at major levels.",
                affectedCurrencies: affectedCurrencies,
                tradingRecommendations: bullishCurrencies.length > 0 && bearishCurrencies.length > 0 ? [
                    {
                        setup: `${bullishCurrencies[0]}/${bearishCurrencies[0]} Long`,
                        entry: "Enter on pullbacks to intraday support with volume confirmation, or on break above recent resistance",
                        stopLoss: "Place stop loss 1-2% below entry or below recent swing low to manage risk",
                        takeProfit: "Target 1: Previous resistance level, Target 2: Extension based on recent range",
                        reasoning: `Fundamental divergence between ${bullishCurrencies[0]} strength and ${bearishCurrencies[0]} weakness creates high-probability directional trade setup`
                    },
                    {
                        setup: "Range-bound strategy if consolidation continues",
                        entry: "Buy near support, sell near resistance with tight stops",
                        stopLoss: "Just outside the range to avoid getting stopped out by noise",
                        takeProfit: "Opposite side of the range with partial profit taking",
                        reasoning: "If momentum stalls, markets may consolidate before next directional move"
                    }
                ] : [
                    {
                        setup: "Wait for clearer directional signals",
                        entry: "Monitor for breakout from current consolidation with volume",
                        stopLoss: "Place stops beyond recent swing points",
                        takeProfit: "Target measured move based on breakout range",
                        reasoning: "Current market conditions suggest waiting for stronger confirmation before entering"
                    }
                ],
                keyLevels: {
                    support: [
                        "Today's session low - immediate support",
                        "Previous day's low - key short-term support",
                        "Weekly support zone - major level to watch"
                    ],
                    resistance: [
                        "Today's session high - immediate resistance", 
                        "Previous day's high - key short-term resistance",
                        "Weekly resistance zone - major overhead supply"
                    ]
                },
                riskFactors: [
                    "High volatility during and immediately after major news releases - expect wider spreads and slippage",
                    "Potential for rapid sentiment reversals if follow-up news contradicts initial reaction",
                    "Upcoming economic data releases could significantly alter the current outlook",
                    "Geopolitical developments and central bank communications remain key wildcards",
                    "Low liquidity during certain trading sessions could amplify price moves"
                ],
                timeHorizon: article.impact === 'high' ? 'Short-term (1-3 days)' : article.impact === 'medium' ? 'Medium-term (1-2 weeks)' : 'Intraday (hours)',
                confidenceLevel: article.impact === 'high' && (bullishCurrencies.length > 0 && bearishCurrencies.length > 0) ? 'High' : 'Medium',
                marketContext: `Current market environment shows ${bullishCurrencies.length > 0 ? 'risk-on sentiment with ' + bullishCurrencies.join(', ') + ' benefiting' : ''} ${bearishCurrencies.length > 0 ? (bullishCurrencies.length > 0 ? 'while ' : 'risk-off sentiment with ') + bearishCurrencies.join(', ') + ' facing pressure' : ''}. Monitor correlation with equity markets, bond yields, and commodity prices. Keep an eye on upcoming economic calendar events that could shift the narrative.`,
                retailPositioning: this.simulateRetailPositioning(article)
            };
        }
    }
    
    static simulateRetailPositioning(article) {
        const sentiments = Object.values(article.currencySentiment || {});
        const bullishCount = sentiments.filter(s => s === 'Bullish').length;
        const bearishCount = sentiments.filter(s => s === 'Bearish').length;
        
        let longPercentage = 50;
        
        if (bullishCount > bearishCount) {
            longPercentage = 35 + Math.random() * 15;
        } else if (bearishCount > bullishCount) {
            longPercentage = 50 + Math.random() * 15;
        } else {
            longPercentage = 45 + Math.random() * 10;
        }
        
        return {
            long: Math.round(longPercentage),
            short: Math.round(100 - longPercentage)
        };
    }
    
    static async generateMarketSummary(articles) {
        const summary = {
            overview: '',
            currencies: {}
        };
        
        CONFIG.CURRENCIES.forEach(currency => {
            const currencyArticles = articles.filter(a => 
                a.currencySentiment && a.currencySentiment[currency]
            );
            
            if (currencyArticles.length === 0) {
                summary.currencies[currency] = {
                    sentiment: 'Neutral',
                    strength: 50,
                    description: `No significant news affecting ${CONFIG.CURRENCY_NAMES[currency]} at this time.`,
                    articleCount: 0
                };
                return;
            }
            
            const bullishCount = currencyArticles.filter(a => a.currencySentiment[currency] === 'Bullish').length;
            const bearishCount = currencyArticles.filter(a => a.currencySentiment[currency] === 'Bearish').length;
            
            let sentiment = 'Neutral';
            let strength = 50;
            let description = '';
            
            if (bullishCount > bearishCount * 1.5) {
                sentiment = 'Bullish';
                strength = 70 + Math.min((bullishCount - bearishCount) * 5, 25);
                description = `${CONFIG.CURRENCY_NAMES[currency]} showing strong bullish momentum with ${bullishCount} positive signals vs ${bearishCount} negative.`;
            } else if (bullishCount > bearishCount) {
                sentiment = 'Slightly Bullish';
                strength = 55 + (bullishCount - bearishCount) * 5;
                description = `${CONFIG.CURRENCY_NAMES[currency]} trending slightly higher with cautious optimism.`;
            } else if (bearishCount > bullishCount * 1.5) {
                sentiment = 'Bearish';
                strength = 30 - Math.min((bearishCount - bullishCount) * 5, 25);
                description = `${CONFIG.CURRENCY_NAMES[currency]} under significant pressure with ${bearishCount} negative signals vs ${bullishCount} positive.`;
            } else if (bearishCount > bullishCount) {
                sentiment = 'Slightly Bearish';
                strength = 45 - (bearishCount - bullishCount) * 5;
                description = `${CONFIG.CURRENCY_NAMES[currency]} showing mild weakness with mixed signals.`;
            } else {
                sentiment = 'Neutral';
                strength = 50;
                description = `${CONFIG.CURRENCY_NAMES[currency]} in equilibrium with balanced bullish and bearish forces.`;
            }
            
            summary.currencies[currency] = {
                sentiment,
                strength,
                description,
                articleCount: currencyArticles.length,
                bullishCount,
                bearishCount
            };
        });
        
        // Get AI-powered market overview
        try {
            const currencyData = Object.entries(summary.currencies).map(([curr, data]) => 
                `${curr}: ${data.sentiment} (Strength: ${data.strength}%, Articles: ${data.articleCount})`
            ).join('\n');
            
            const recentNews = articles.slice(0, 5).map(a => a.title).join('\n');
            
            const prompt = `You are a professional forex market analyst. Based on the current market data, provide a brief professional overview.

Currency Sentiment Data:
${currencyData}

Recent Major News:
${recentNews}

Provide a 2-3 sentence professional market overview focusing on:
1. Main market themes
2. Key trading opportunities
3. Risk factors to watch

Keep it concise and actionable for traders. Respond with ONLY the overview text, no additional formatting.`;

            const aiOverview = await callGeminiAPI(prompt);
            summary.overview = aiOverview.trim();
            
        } catch (error) {
            console.error('AI Overview Error:', error);
            
            // Fallback overview
            const strongCurrencies = Object.entries(summary.currencies)
                .filter(([_, data]) => data.sentiment === 'Bullish')
                .map(([currency]) => currency);
            
            const weakCurrencies = Object.entries(summary.currencies)
                .filter(([_, data]) => data.sentiment === 'Bearish')
                .map(([currency]) => currency);
            
            if (strongCurrencies.length > 0 && weakCurrencies.length > 0) {
                summary.overview = `FX markets show clear divergence with ${strongCurrencies.join(', ')} strengthening while ${weakCurrencies.join(', ')} face pressure. This creates high-conviction trading opportunities.`;
            } else if (strongCurrencies.length > 0) {
                summary.overview = `Risk-on sentiment dominates with ${strongCurrencies.join(', ')} leading gains. Market lacks clear bearish catalysts.`;
            } else if (weakCurrencies.length > 0) {
                summary.overview = `Risk-off conditions prevail with ${weakCurrencies.join(', ')} under pressure. Defensive positioning recommended.`;
            } else {
                summary.overview = `FX markets are cautious amid mixed economic data and geopolitical tensions, with currencies trading in tight ranges.`;
            }
        }
        
        return summary;
    }
    
    static findHighConvictionTrades(marketSummary) {
        const trades = [];
        
        const strongCurrencies = Object.entries(marketSummary.currencies)
            .filter(([_, data]) => data.sentiment === 'Bullish' || data.sentiment === 'Slightly Bullish')
            .sort((a, b) => b[1].strength - a[1].strength);
        
        const weakCurrencies = Object.entries(marketSummary.currencies)
            .filter(([_, data]) => data.sentiment === 'Bearish' || data.sentiment === 'Slightly Bearish')
            .sort((a, b) => a[1].strength - b[1].strength);
        
        if (strongCurrencies.length > 0 && weakCurrencies.length > 0) {
            for (let i = 0; i < Math.min(3, strongCurrencies.length); i++) {
                for (let j = 0; j < Math.min(2, weakCurrencies.length); j++) {
                    const [strongCurrency, strongData] = strongCurrencies[i];
                    const [weakCurrency, weakData] = weakCurrencies[j];
                    
                    const convictionScore = (strongData.strength - weakData.strength) / 100;
                    
                    trades.push({
                        pair: `${strongCurrency}/${weakCurrency}`,
                        direction: 'Long',
                        conviction: convictionScore > 0.3 ? 'High' : 'Medium',
                        reason: `${strongCurrency} fundamental strength (${strongData.bullishCount} bullish signals) vs ${weakCurrency} weakness (${weakData.bearishCount} bearish signals). Clear fundamental divergence supports directional trade.`,
                        score: convictionScore
                    });
                }
            }
        }
        
        return trades.sort((a, b) => b.score - a.score).slice(0, 5);
    }
}

// ===== Article Processing =====
class ArticleProcessor {
    static detectCategories(text, feedCategory, feedType) {
        const categories = new Set([feedCategory]);
        const lower = text.toLowerCase();
        
        if (feedType) categories.add(feedType);
        
        if (lower.match(/forex|fx|currency|exchange rate/i)) {
            categories.add('forex');
        }
        
        if (lower.match(/gold|xau|precious metal|silver/i)) {
            categories.add('gold');
        }
        
        // Detect Trump-related content
        if (lower.match(/trump|donald trump|president trump|potus/i)) {
            categories.add('trump');
        }
        
        CONFIG.CURRENCIES.forEach(currency => {
            if (lower.includes(currency.toLowerCase()) || 
                lower.includes(`${currency}/`) ||
                lower.includes(`/${currency}`)) {
                categories.add(currency);
            }
        });
        
        return Array.from(categories);
    }
    
    static detectCentralBank(text) {
        const lower = text.toLowerCase();
        const banks = [];
        
        const bankPatterns = {
            'FED': ['federal reserve', 'fed ', 'fomc', 'jerome powell', 'powell'],
            'BoE': ['bank of england', 'boe ', 'mpc', 'andrew bailey'],
            'ECB': ['european central bank', 'ecb ', 'christine lagarde', 'lagarde'],
            'BoJ': ['bank of japan', 'boj ', 'kazuo ueda', 'ueda'],
            'BoC': ['bank of canada', 'boc ', 'tiff macklem', 'macklem'],
            'SNB': ['swiss national bank', 'snb ', 'thomas jordan', 'jordan'],
            'RBA': ['reserve bank of australia', 'rba ', 'michele bullock', 'bullock']
        };
        
        Object.entries(bankPatterns).forEach(([bank, patterns]) => {
            if (patterns.some(pattern => lower.includes(pattern))) {
                banks.push(bank);
            }
        });
        
        return banks;
    }
    
    static analyzeArticle(article, feed) {
        const fullText = article.title + ' ' + article.description;
        const categories = this.detectCategories(fullText, feed.category, feed.type);
        const centralBanks = this.detectCentralBank(fullText);
        
        const relevantCurrencies = categories.filter(cat => 
            CONFIG.CURRENCIES.includes(cat)
        );
        
        const currencySentiment = SentimentAnalyzer.analyzeArticle(
            article.title,
            article.description,
            relevantCurrencies,
            centralBanks
        );
        
        let goldSentiment = null;
        if (categories.includes('gold')) {
            goldSentiment = SentimentAnalyzer.analyzeGoldSentiment(
                article.title,
                article.description
            );
        }
        
        const enhancedArticle = {
            ...article,
            categories,
            centralBanks,
            currencySentiment,
            goldSentiment,
            type: feed.type,
            bank: feed.bank,
            timestamp: new Date(article.publishedAt).getTime()
        };
        
        enhancedArticle.impact = MarketIntelligence.analyzeImpact(enhancedArticle);
        
        // Add Trump-specific analysis
        if (categories.includes('trump')) {
            enhancedArticle.trumpImpact = SentimentAnalyzer.analyzeTrumpImpact(
                article.title,
                article.description
            );
            
            // Add Trump currency impacts to existing sentiment
            const trumpCurrencyImpact = SentimentAnalyzer.analyzeTrumpCurrencyImpact(
                article.title,
                article.description
            );
            
            // Merge Trump impacts with existing currency sentiment
            Object.entries(trumpCurrencyImpact).forEach(([curr, impact]) => {
                if (!enhancedArticle.currencySentiment[curr]) {
                    enhancedArticle.currencySentiment[curr] = impact;
                }
            });
        }
        
        return enhancedArticle;
    }
    
    static cleanDescription(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        let text = temp.textContent || temp.innerText || '';
        return text.substring(0, 300) + (text.length > 300 ? '...' : '');
    }
}

// ===== Push Notifications =====
class NotificationManager {
    static async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    }
    
    static showNotification(title, body, icon = '📰', tag = 'forexlive-news') {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: icon,
                badge: icon,
                tag: tag,
                requireInteraction: false,
                vibrate: [200, 100, 200]
            });
            
            notification.onclick = function() {
                window.focus();
                this.close();
            };
        }
        
        showToast(title, body);
    }
    
    static checkForNewArticles(newArticles, oldCount) {
        if (oldCount === 0) return;
        
        const newCount = newArticles.length;
        if (newCount > oldCount) {
            const diff = newCount - oldCount;
            const latestArticle = newArticles[0];
            
            // Only notify for high impact if MRKT alerts enabled
            if (state.mrktAlertsEnabled && latestArticle.impact !== 'high') {
                return;
            }
            
            // Special notification for Trump news
            if (latestArticle.categories.includes('trump')) {
                this.showNotification(
                    '🦅 Trump News Alert',
                    latestArticle.title.substring(0, 100),
                    '🦅',
                    'trump-news'
                );
            } else {
                this.showNotification(
                    `${diff} New Market Update${diff > 1 ? 's' : ''}`,
                    latestArticle.title.substring(0, 100)
                );
            }
        }
    }
    
    static checkForTrumpNews(trumpArticles, oldTrumpCount) {
        if (oldTrumpCount === 0) return;
        
        const newCount = trumpArticles.length;
        if (newCount > oldTrumpCount && state.notificationsEnabled) {
            const diff = newCount - oldTrumpCount;
            const latest = trumpArticles[0];
            
            this.showNotification(
                `🦅 ${diff} New Trump Update${diff > 1 ? 's' : ''}`,
                latest.title.substring(0, 100),
                '🦅',
                'trump-tracker'
            );
        }
    }
}

// ===== TradingView Chart Manager =====
class TradingViewManager {
    static initChart(symbol = 'EURUSD') {
        const container = document.getElementById('tradingview_chart');
        if (!container) return;
        
        // Clear existing chart
        container.innerHTML = '';
        
        // Map symbols to TradingView format
        const symbolMap = {
            'EURUSD': 'FX:EURUSD',
            'GBPUSD': 'FX:GBPUSD',
            'USDJPY': 'FX:USDJPY',
            'AUDUSD': 'FX:AUDUSD',
            'USDCAD': 'FX:USDCAD',
            'USDCHF': 'FX:USDCHF',
            'GOLD': 'TVC:GOLD',
            'DXY': 'TVC:DXY'
        };
        
        const tvSymbol = symbolMap[symbol] || 'FX:EURUSD';
        
        state.currentChart = new TradingView.widget({
            autosize: true,
            symbol: tvSymbol,
            interval: '15',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#1a1d29',
            enable_publishing: false,
            allow_symbol_change: false,
            container_id: 'tradingview_chart',
            studies: [
                'MASimple@tv-basicstudies',
                'RSI@tv-basicstudies'
            ],
            hide_side_toolbar: false,
            save_image: false
        });
        
        state.currentChartSymbol = symbol;
    }
}

// ===== API Functions =====
async function fetchRSSFeed(feed) {
    console.log(`📡 Fetching ${feed.name}...`);
    
    // Try RSS2JSON first (best for parsing)
    try {
        const response = await fetch(CONFIG.PROXY_URL + encodeURIComponent(feed.url), {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                console.log(`✅ ${feed.name}: Loaded ${data.items.length} articles`);
                return data.items.map(item => {
                    const article = {
                        title: item.title,
                        description: ArticleProcessor.cleanDescription(item.description || item.content || ''),
                        url: item.link,
                        publishedAt: item.pubDate,
                        source: feed.name
                    };
                    return ArticleProcessor.analyzeArticle(article, feed);
                });
            }
        }
    } catch (error) {
        console.warn(`⚠️ ${feed.name} failed with RSS2JSON, trying backup...`, error.message);
    }
    
    // Try direct fetch with CORS proxy
    for (const proxy of CONFIG.BACKUP_PROXIES) {
        try {
            console.log(`🔄 Trying backup proxy for ${feed.name}...`);
            const response = await fetch(proxy + encodeURIComponent(feed.url));
            
            if (response.ok) {
                const xmlText = await response.text();
                const articles = parseRSSXML(xmlText, feed);
                if (articles.length > 0) {
                    console.log(`✅ ${feed.name}: Loaded ${articles.length} articles via backup`);
                    return articles;
                }
            }
        } catch (error) {
            console.warn(`⚠️ Backup proxy failed for ${feed.name}:`, error.message);
            continue;
        }
    }
    
    console.error(`❌ All methods failed for ${feed.name}`);
    return [];
}

// Parse RSS XML manually
function parseRSSXML(xmlText, feed) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = xmlDoc.querySelectorAll('item');
        const articles = [];
        
        items.forEach((item, index) => {
            if (index < 20) { // Limit to 20 articles per feed
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
                
                if (title && link) {
                    const article = {
                        title: title,
                        description: ArticleProcessor.cleanDescription(description),
                        url: link,
                        publishedAt: pubDate,
                        source: feed.name
                    };
                    articles.push(ArticleProcessor.analyzeArticle(article, feed));
                }
            }
        });
        
        return articles;
    } catch (error) {
        console.error('XML parsing error:', error);
        return [];
    }
}

async function fetchAllNews() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 Fetching REAL-TIME news from', CONFIG.RSS_FEEDS.length, 'sources...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const allArticles = [];
    const promises = CONFIG.RSS_FEEDS.map(feed => fetchRSSFeed(feed));
    const results = await Promise.allSettled(promises);
    
    let successCount = 0;
    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
            allArticles.push(...result.value);
            successCount++;
        } else {
            console.warn(`❌ ${CONFIG.RSS_FEEDS[index].name} returned no articles`);
        }
    });
    
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successfully loaded ${successCount}/${CONFIG.RSS_FEEDS.length} feeds`);
    console.log(`📊 Total LIVE articles: ${allArticles.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return allArticles;
}

// ===== UI Rendering =====
function renderNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const isNew = state.lastUpdateTime && 
                  new Date(article.publishedAt) > new Date(state.lastUpdateTime.getTime() - 300000);
    if (isNew) card.classList.add('new');
    
    // Add Trump badge if applicable
    if (article.categories.includes('trump')) {
        card.classList.add('trump-news');
    }
    
    let sourceClass = 'news-source';
    if (article.type === 'centralbank') sourceClass += ' centralbank';
    if (article.type === 'gold') sourceClass += ' gold';
    if (article.type === 'trump') sourceClass += ' trump';
    
    let sentimentHTML = '';
    const hasCurrencySentiment = Object.keys(article.currencySentiment || {}).length > 0;
    if (hasCurrencySentiment) {
        sentimentHTML = '<div class="sentiment-badges">';
        Object.entries(article.currencySentiment).forEach(([currency, sentiment]) => {
            const sentimentClass = sentiment.toLowerCase();
            const icon = sentiment === 'Bullish' ? '📈' : sentiment === 'Bearish' ? '📉' : '➡️';
            sentimentHTML += `
                <span class="sentiment-badge ${sentimentClass}">
                    ${icon} ${currency}: ${sentiment}
                </span>
            `;
        });
        sentimentHTML += '</div>';
    }
    
    if (article.goldSentiment) {
        const sentimentClass = article.goldSentiment.toLowerCase();
        const icon = article.goldSentiment === 'Bullish' ? '📈' : article.goldSentiment === 'Bearish' ? '📉' : '➡️';
        if (!sentimentHTML) sentimentHTML = '<div class="sentiment-badges">';
        else sentimentHTML = sentimentHTML.replace('</div>', '');
        
        sentimentHTML += `
            <span class="sentiment-badge ${sentimentClass}">
                ${icon} Gold/XAU: ${article.goldSentiment}
            </span>
        </div>
        `;
    }
    
    let centralBankHTML = '';
    if (article.centralBanks && article.centralBanks.length > 0) {
        centralBankHTML = `
            <div class="central-bank-tag">
                🏦 Central Bank: ${article.centralBanks.join(', ')}
            </div>
        `;
    }
    
    // Add Trump impact badge if applicable
    let trumpBadgeHTML = '';
    if (article.categories.includes('trump')) {
        const impactClass = article.trumpImpact || 'medium';
        trumpBadgeHTML = `
            <div class="trump-impact-badge ${impactClass}">
                🦅 Trump Impact: ${(article.trumpImpact || 'medium').toUpperCase()}
            </div>
        `;
    }
    
    const tagsHTML = article.categories
        .filter(cat => !CONFIG.CURRENCIES.includes(cat))
        .slice(0, 4)
        .map(cat => `<span class="tag">${cat}</span>`)
        .join('');
    
    const impactIcon = {
        'high': '🔴',
        'medium': '🟡',
        'low': '🟢'
    }[article.impact] || '⚪';
    
    const timeAgo = getTimeAgo(new Date(article.publishedAt));
    
    card.innerHTML = `
        <div class="news-header">
            <span class="${sourceClass}">${article.source}</span>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="impact-badge ${article.impact}">${impactIcon} ${article.impact.toUpperCase()}</span>
                <span class="news-time">${timeAgo}</span>
            </div>
        </div>
        <h3 class="news-title">${article.title}</h3>
        <p class="news-description">${article.description}</p>
        ${centralBankHTML}
        ${trumpBadgeHTML}
        ${sentimentHTML}
        <div class="news-tags">${tagsHTML}</div>
        <div class="news-card-actions">
            <a href="${article.url}" target="_blank" class="read-more-primary">📰 Read Full Article</a>
        </div>
    `;
    
    return card;
}

function renderNews() {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';
    
    let filtered = state.newsCache.filter(article => {
        if (state.currentFilter !== 'all' && !article.categories.includes(state.currentFilter)) {
            return false;
        }
        
        if (state.currentCurrency !== 'all' && !article.categories.includes(state.currentCurrency)) {
            return false;
        }
        
        if (state.currentSentiment !== 'all') {
            const hasSentiment = Object.values(article.currencySentiment || {})
                .some(sentiment => sentiment === state.currentSentiment) ||
                (article.goldSentiment === state.currentSentiment);
            if (!hasSentiment) return false;
        }
        
        if (state.mrktAlertsEnabled && article.impact !== 'high') {
            return false;
        }
        
        return true;
    });
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="loading-container">
                <p class="loading-message">No articles match the selected filters.</p>
            </div>
        `;
        return;
    }
    
    filtered.slice(0, 100).forEach(article => {
        container.appendChild(renderNewsCard(article));
    });
    
    updateStats();
}

// ===== Trump Tracker Rendering =====
function renderTrumpTracker() {
    const container = document.getElementById('trumpContainer');
    
    if (state.trumpCache.length === 0) {
        container.innerHTML = `
            <div class="loading-container">
                <p class="loading-message">No Trump news currently available.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    state.trumpCache.forEach(article => {
        const card = document.createElement('div');
        card.className = 'trump-news-card';
        
        const impactIcon = {
            'high': '🔴',
            'medium': '🟡',
            'low': '🟢'
        }[article.trumpImpact || 'medium'] || '🟡';
        
        const timeAgo = getTimeAgo(new Date(article.publishedAt));
        
        card.innerHTML = `
            <div class="trump-card-header">
                <span class="trump-source">${article.source}</span>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="trump-impact-indicator ${article.trumpImpact || 'medium'}">
                        ${impactIcon} ${(article.trumpImpact || 'medium').toUpperCase()} IMPACT
                    </span>
                    <span class="trump-time">${timeAgo}</span>
                </div>
            </div>
            <h3 class="trump-title">${article.title}</h3>
            <p class="trump-description">${article.description}</p>
            ${article.currencySentiment && Object.keys(article.currencySentiment).length > 0 ? `
                <div class="trump-market-impact">
                    <div class="impact-label">💱 Affected Currencies:</div>
                    <div class="sentiment-badges">
                        ${Object.entries(article.currencySentiment).map(([currency, sentiment]) => {
                            const icon = sentiment === 'Bullish' ? '📈' : sentiment === 'Bearish' ? '📉' : '➡️';
                            return `<span class="sentiment-badge ${sentiment.toLowerCase()}">${icon} ${currency}: ${sentiment}</span>`;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="trump-card-actions">
                <a href="${article.url}" target="_blank" class="trump-read-more">Read Full Article</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ===== Market Summary Rendering =====
function renderMarketSummary() {
    const container = document.getElementById('marketSummaryContainer');
    const summary = state.marketSummary;
    
    let html = `
        <div class="market-overview">
            <p class="market-overview-text">
                ${summary.overview}
                <span class="ai-badge">🧠 AI Powered</span>
            </p>
        </div>
        
        <div class="currency-cards">
    `;
    
    CONFIG.CURRENCIES.forEach(currency => {
        const data = summary.currencies[currency];
        const flag = CONFIG.CURRENCY_FLAGS[currency];
        const name = CONFIG.CURRENCY_NAMES[currency];
        
        const sentimentClass = data.sentiment.toLowerCase().replace(' ', '-');
        const sentimentIcon = {
            'Bullish': '📈',
            'Bearish': '📉',
            'Slightly Bullish': '📊',
            'Slightly Bearish': '📉',
            'Neutral': '➡️'
        }[data.sentiment] || '➡️';
        
        const strengthClass = data.strength > 60 ? 'strong' : data.strength < 40 ? 'weak' : 'neutral';
        
        html += `
            <div class="currency-card">
                <div class="currency-header">
                    <div class="currency-info">
                        <span class="currency-flag">${flag}</span>
                        <span class="currency-name">${currency}</span>
                    </div>
                    <div class="currency-sentiment ${sentimentClass}">
                        ${sentimentIcon} ${data.sentiment}
                    </div>
                </div>
                <p class="currency-description">${data.description}</p>
                <div class="currency-strength">
                    <div class="strength-label">Currency Strength</div>
                    <div class="strength-bar-container">
                        <div class="strength-bar ${strengthClass}" style="width: ${data.strength}%">
                            ${data.strength}%
                        </div>
                    </div>
                </div>
                <div class="currency-stats">
                    <div class="stat-item">
                        <span class="stat-label">Bullish Signals</span>
                        <span class="stat-value bullish">${data.bullishCount || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Bearish Signals</span>
                        <span class="stat-value bearish">${data.bearishCount || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Articles</span>
                        <span class="stat-value">${data.articleCount}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add high conviction trades
    const trades = MarketIntelligence.findHighConvictionTrades(summary);
    if (trades.length > 0) {
        html += `
            <div class="trade-signals">
                <div class="trade-signals-header">
                    <div class="signal-icon">⚡</div>
                    <div>
                        <h3 class="trade-signals-title">High-Conviction Trade Signals</h3>
                        <p class="trade-signals-subtitle">Based on fundamental divergence analysis</p>
                    </div>
                </div>
                <div class="signal-cards">
        `;
        
        trades.forEach(trade => {
            html += `
                <div class="signal-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <div class="signal-pair">${trade.pair}</div>
                        <span class="conviction-badge ${trade.conviction.toLowerCase()}">${trade.conviction} Conviction</span>
                    </div>
                    <p class="signal-reason">${trade.reason}</p>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// ===== Economic Calendar Widget =====
// ===== REAL Economic Calendar (FMP) =====
async function loadEconomicCalendar() {
    const container = document.getElementById('calendarContainer');
    
    try {
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner-advanced">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p class="loading-message">📅 Loading Economic Calendar...</p>
            </div>
        `;
        
        // Fetch from backend if enabled, otherwise direct from FMP
        const apiUrl = CONFIG.USE_BACKEND 
            ? `${CONFIG.BACKEND_URL}/api/calendar`
            : `https://financialmodelingprep.com/api/v3/economic_calendar?apikey=${CONFIG.FMP_API_KEY}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid calendar response');
        }
        
        console.log(`✅ Loaded ${data.length} economic events`);
        
        // Filter and sort by date - next 50 events
        const now = new Date();
        const sorted = data
            .filter(e => e.impact && new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 50);
        
        if (sorted.length === 0) {
            container.innerHTML = '<p class="no-events">No upcoming economic events found</p>';
            return;
        }
        
        // Group by date
        const grouped = {};
        sorted.forEach(event => {
            const dateKey = new Date(event.date).toLocaleDateString();
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(event);
        });
        
        let html = '<div class="calendar-events-container">';
        
        Object.entries(grouped).forEach(([date, events]) => {
            html += `
                <div class="calendar-date-group">
                    <h3 class="calendar-date-header">📅 ${date}</h3>
                    <div class="calendar-events-list">
            `;
            
            events.forEach(e => {
                const impactClass = 
                    e.impact === 'High' ? 'impact-high' :
                    e.impact === 'Medium' ? 'impact-medium' :
                    'impact-low';
                
                const impactIcon = 
                    e.impact === 'High' ? '🔴' :
                    e.impact === 'Medium' ? '🟡' :
                    '🟢';
                
                const time = new Date(e.date).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZoneName: 'short'
                });
                
                html += `
                    <div class="calendar-event ${impactClass}">
                        <div class="event-left">
                            <div class="event-header">
                                <span class="event-flag">${CONFIG.CURRENCY_FLAGS[e.currency] || '🌍'}</span>
                                <strong class="event-name">${e.event}</strong>
                            </div>
                            <div class="event-details">
                                <span class="event-country">${e.country}</span>
                                <span class="event-separator">•</span>
                                <span class="event-currency">${e.currency}</span>
                            </div>
                            ${e.actual ? `<div class="event-values">
                                <span class="value-label">Actual:</span> <span class="value-actual">${e.actual}</span>
                                ${e.estimate ? `<span class="value-separator">|</span> <span class="value-label">Est:</span> <span class="value-estimate">${e.estimate}</span>` : ''}
                                ${e.previous ? `<span class="value-separator">|</span> <span class="value-label">Prev:</span> <span class="value-previous">${e.previous}</span>` : ''}
                            </div>` : ''}
                        </div>
                        <div class="event-right">
                            <span class="event-impact ${impactClass}">${impactIcon} ${e.impact} Impact</span>
                            <span class="event-time">${time}</span>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('❌ Calendar error:', error);
        container.innerHTML = `
            <div class="error-container">
                <p class="error-message">⚠️ Failed to load economic calendar</p>
                <p class="error-details">${error.message}</p>
                <button class="btn-retry" onclick="loadEconomicCalendar()">🔄 Retry</button>
            </div>
        `;
    }
}

function initEconomicCalendar() {
    loadEconomicCalendar();
}

// ===== AI Analysis Modal =====
async function showAIAnalysis(articleIndex) {
    const article = state.newsCache[articleIndex];
    
    // Show modal first
    document.getElementById('aiAnalysisModal').classList.add('active');
    
    // Get AI analysis
    const analysis = await MarketIntelligence.generateAIAnalysis(article);
    
    const container = document.getElementById('aiAnalysisContainer');
    
    let html = `
        <div class="ai-analysis-header">
            <h3 class="ai-analysis-title">${article.title}</h3>
            <p class="ai-analysis-subtitle">${analysis.summary}</p>
        </div>
    `;
    
    // Fundamental Analysis
    if (analysis.fundamentalAnalysis) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">📊</div>
                    <h4 class="analysis-section-title">Fundamental Analysis</h4>
                </div>
                <p class="analysis-content">${analysis.fundamentalAnalysis}</p>
            </div>
        `;
    }
    
    // Technical Analysis
    if (analysis.technicalOutlook) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">📈</div>
                    <h4 class="analysis-section-title">Technical Outlook</h4>
                </div>
                <p class="analysis-content">${analysis.technicalOutlook}</p>
            </div>
        `;
    }
    
    // Market Context
    if (analysis.marketContext) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">🌍</div>
                    <h4 class="analysis-section-title">Market Context</h4>
                </div>
                <p class="analysis-content">${analysis.marketContext}</p>
            </div>
        `;
    }
    
    // Affected Currencies with Pros & Cons
    if (analysis.affectedCurrencies && analysis.affectedCurrencies.length > 0) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">💱</div>
                    <h4 class="analysis-section-title">Affected Currencies - Detailed Analysis</h4>
                </div>
                <div class="affected-currencies-grid">
        `;
        
        analysis.affectedCurrencies.forEach(curr => {
            const impactClass = curr.impact.toLowerCase();
            const impactIcon = curr.impact === 'Bullish' ? '📈' : curr.impact === 'Bearish' ? '📉' : '➡️';
            
            html += `
                <div class="currency-analysis-card ${impactClass}">
                    <div class="currency-analysis-header">
                        <div class="currency-name-large">${CONFIG.CURRENCY_FLAGS[curr.currency] || ''} ${curr.currency}</div>
                        <div class="currency-impact-badge ${impactClass}">${impactIcon} ${curr.impact}</div>
                    </div>
                    
                    <div class="pros-cons-container">
                        <div class="pros-section">
                            <div class="pros-header">✅ Pros (Bullish Factors)</div>
                            <ul class="pros-list">
                                ${curr.pros.map(pro => `<li>${pro}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="cons-section">
                            <div class="cons-header">⚠️ Cons (Bearish Factors)</div>
                            <ul class="cons-list">
                                ${curr.cons.map(con => `<li>${con}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="currency-outlook">
                        <strong>Outlook:</strong> ${curr.outlook}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Trading Recommendations
    if (analysis.tradingRecommendations && analysis.tradingRecommendations.length > 0) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">💼</div>
                    <h4 class="analysis-section-title">Trading Recommendations</h4>
                </div>
                <div class="time-horizon-badge ${analysis.confidenceLevel?.toLowerCase() || 'medium'}">
                    ⏱️ ${analysis.timeHorizon || 'Short-term (1-3 days)'} | 🎯 Confidence: ${analysis.confidenceLevel || 'Medium'}
                </div>
                <div class="trading-recommendations-grid">
        `;
        
        analysis.tradingRecommendations.forEach((rec, idx) => {
            html += `
                <div class="recommendation-card">
                    <div class="rec-header">
                        <span class="rec-number">#${idx + 1}</span>
                        <span class="rec-setup">${rec.setup}</span>
                    </div>
                    <div class="rec-details">
                        <div class="rec-item">
                            <span class="rec-label">📍 Entry:</span>
                            <span class="rec-value">${rec.entry}</span>
                        </div>
                        <div class="rec-item">
                            <span class="rec-label">🛑 Stop Loss:</span>
                            <span class="rec-value">${rec.stopLoss}</span>
                        </div>
                        <div class="rec-item">
                            <span class="rec-label">🎯 Take Profit:</span>
                            <span class="rec-value">${rec.takeProfit}</span>
                        </div>
                    </div>
                    <div class="rec-reasoning">
                        <strong>Reasoning:</strong> ${rec.reasoning}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Key Levels Section
    if (analysis.keyLevels) {
        html += `
            <div class="analysis-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">🎚️</div>
                    <h4 class="analysis-section-title">Key Technical Levels</h4>
                </div>
                <div class="key-levels-grid">
                    <div class="levels-column">
                        <div class="levels-header support">📉 Support Levels</div>
        `;
        
        if (analysis.keyLevels.support) {
            analysis.keyLevels.support.forEach(level => {
                html += `<div class="level-item">${level}</div>`;
            });
        }
        
        html += `
                    </div>
                    <div class="levels-column">
                        <div class="levels-header resistance">📈 Resistance Levels</div>
        `;
        
        if (analysis.keyLevels.resistance) {
            analysis.keyLevels.resistance.forEach(level => {
                html += `<div class="level-item">${level}</div>`;
            });
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
    }
    
    // Risk Factors Section
    if (analysis.riskFactors && analysis.riskFactors.length > 0) {
        html += `
            <div class="analysis-section risk-section">
                <div class="analysis-section-header">
                    <div class="analysis-icon">⚠️</div>
                    <h4 class="analysis-section-title">Risk Factors to Monitor</h4>
                </div>
                <div class="risk-factors">
        `;
        
        analysis.riskFactors.forEach(risk => {
            html += `
                <div class="risk-item">
                    <span class="risk-bullet">⚠️</span>
                    ${risk}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Retail Positioning
    html += `
        <div class="analysis-section">
            <div class="analysis-section-header">
                <div class="analysis-icon">👥</div>
                <h4 class="analysis-section-title">Retail Positioning Sentiment</h4>
            </div>
            <div class="retail-positioning">
                <div class="positioning-bar-container">
                    <div class="positioning-bar" style="width: ${analysis.retailPositioning.long}%">
                        ${analysis.retailPositioning.long}% Long
                    </div>
                </div>
                <div class="positioning-labels">
                    <span class="positioning-label">Long: ${analysis.retailPositioning.long}%</span>
                    <span class="positioning-label">Short: ${analysis.retailPositioning.short}%</span>
                </div>
            </div>
            <p class="analysis-content" style="margin-top: 1rem;">
                ${analysis.retailPositioning.long > 55 ? '⚠️ Retail traders are heavily long, which often indicates potential for downside moves as institutional players may fade this positioning. Consider contrarian strategies.' :
                  analysis.retailPositioning.long < 45 ? '✅ Retail traders are heavily short, suggesting potential for upside as smart money may be on the long side. This could fuel a short squeeze.' :
                  '➡️ Retail positioning is balanced, indicating indecision and potential for breakout in either direction. Wait for confirmation.'}
            </p>
        </div>
    `;
    
    container.innerHTML = html;
}

function closeAIAnalysis() {
    document.getElementById('aiAnalysisModal').classList.remove('active');
}

// ===== Stats & Status Updates =====
function updateStats() {
    document.getElementById('totalArticles').textContent = state.newsCache.length;
    
    const highImpactCount = state.newsCache.filter(a => a.impact === 'high').length;
    document.getElementById('highImpactCount').textContent = highImpactCount;
    
    const trumpCount = state.trumpCache.length;
    document.getElementById('trumpCount').textContent = trumpCount;
    
    if (state.lastUpdateTime) {
        document.getElementById('lastUpdate').textContent = state.lastUpdateTime.toLocaleTimeString();
    }
}

function updateStatus(message, type = 'loading') {
    const statusCard = document.getElementById('statusCard');
    const statusIcon = statusCard.querySelector('.status-icon');
    const statusText = document.getElementById('statusText');
    
    statusIcon.className = `status-icon ${type}`;
    statusText.textContent = message;
    
    const icons = {
        loading: '⚡',
        success: '✅',
        error: '❌'
    };
    
    statusIcon.textContent = icons[type] || '⚡';
}

// ===== Main Functions =====
async function loadAllNews() {
    if (state.isLoading) return;
    
    state.isLoading = true;
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.disabled = true;
    refreshBtn.classList.add('loading');
    
    updateStatus('Fetching latest news...', 'loading');
    
    try {
        const oldCount = state.newsCache.length;
        const oldTrumpCount = state.trumpCache.length;
        
        const articles = await fetchAllNews();
        
        if (articles.length > 0) {
            state.newsCache = articles;
            
            // Separate Trump news
            state.trumpCache = articles.filter(a => a.categories.includes('trump'));
            
            state.lastUpdateTime = new Date();
            state.marketSummary = await MarketIntelligence.generateMarketSummary(articles);
            renderNews();
            updateStatus(`Loaded ${articles.length} articles`, 'success');
            
            if (state.notificationsEnabled) {
                NotificationManager.checkForNewArticles(articles, oldCount);
                NotificationManager.checkForTrumpNews(state.trumpCache, oldTrumpCount);
            }
        } else {
            updateStatus('No articles found', 'error');
        }
    } catch (error) {
        console.error('Error loading news:', error);
        updateStatus('Failed to load news', 'error');
    } finally {
        state.isLoading = false;
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('loading');
    }
}

// ===== Filter Functions =====
function setSourceFilter(filter) {
    state.currentFilter = filter;
    document.querySelectorAll('.chip[data-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderNews();
}

function applyFilters() {
    state.currentCurrency = document.getElementById('currencyFilter').value;
    state.currentSentiment = document.getElementById('sentimentFilter').value;
    renderNews();
}

// ===== Toggle Functions =====
// ===== Modal Functions =====
function showCalendar() {
    document.getElementById('calendarModal').classList.add('active');
    loadEconomicCalendar();
}

function closeCalendar() {
    document.getElementById('calendarModal').classList.remove('active');
}

function showMarketSummary() {
    renderMarketSummary();
    document.getElementById('marketSummaryModal').classList.add('active');
}

function closeMarketSummary() {
    document.getElementById('marketSummaryModal').classList.remove('active');
}

function showCharts() {
    document.getElementById('chartsModal').classList.add('active');
    TradingViewManager.initChart(state.currentChartSymbol);
}

function closeCharts() {
    document.getElementById('chartsModal').classList.remove('active');
}

function switchChart(symbol, button) {
    // Update active tab
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    button.classList.add('active');
    
    // Load new chart
    TradingViewManager.initChart(symbol);
}

function showTrumpTracker() {
    document.getElementById('trumpModal').classList.add('active');
    renderTrumpTracker();
}

function closeTrumpTracker() {
    document.getElementById('trumpModal').classList.remove('active');
}

function showToast(title, message) {
    const toast = document.getElementById('notificationToast');
    toast.querySelector('.toast-title').textContent = title;
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
}

function closeToast() {
    document.getElementById('notificationToast').classList.remove('show');
}

// ===== Utility Functions =====
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ===== API Key Management =====
// ===== Real-time Update Loop =====
function startRealTimeUpdates() {
    // Auto-refresh news
    setInterval(loadAllNews, CONFIG.AUTO_REFRESH_INTERVAL);
    
    // Check for new articles more frequently
    setInterval(() => {
        if (state.notificationsEnabled && !state.isLoading) {
            loadAllNews();
        }
    }, CONFIG.NOTIFICATION_CHECK_INTERVAL);
}

// ===== Market Hours Functions =====
function showMarketHours() {
    renderMarketHours();
    document.getElementById('marketHoursModal').classList.add('active');
}

function closeMarketHours() {
    document.getElementById('marketHoursModal').classList.remove('active');
}

function renderMarketHours() {
    const container = document.getElementById('marketHoursContainer');
    if (!container) return;
    
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    
    // Define trading sessions (UTC times)
    const sessions = {
        sydney: {
            name: 'Sydney',
            flag: '🇦🇺',
            open: 22,
            close: 7,
            timezone: 'AEDT (UTC+11)',
            color: '#10b981'
        },
        tokyo: {
            name: 'Tokyo',
            flag: '🇯🇵',
            open: 0,
            close: 9,
            timezone: 'JST (UTC+9)',
            color: '#ec4899'
        },
        london: {
            name: 'London',
            flag: '🇬🇧',
            open: 8,
            close: 17,
            timezone: 'GMT (UTC+0)',
            color: '#3b82f6'
        },
        newyork: {
            name: 'New York',
            flag: '🇺🇸',
            open: 13,
            close: 22,
            timezone: 'EST (UTC-5)',
            color: '#10b981'
        }
    };
    
    // Determine which sessions are open
    Object.values(sessions).forEach(session => {
        if (session.open > session.close) {
            // Session crosses midnight
            session.isOpen = utcHour >= session.open || utcHour < session.close;
        } else {
            session.isOpen = utcHour >= session.open && utcHour < session.close;
        }
    });
    
    const openCount = Object.values(sessions).filter(s => s.isOpen).length;
    
    let html = `
        <div class="market-hours-live">
            <div class="current-time-display">
                <h3>🌍 Current UTC Time: ${now.toUTCString()}</h3>
                <p class="sessions-open-count">${openCount} Session${openCount !== 1 ? 's' : ''} Currently OPEN</p>
            </div>
            
            <div class="sessions-grid">
    `;
    
    Object.values(sessions).forEach(session => {
        const statusClass = session.isOpen ? 'open' : 'closed';
        const statusText = session.isOpen ? '🟢 OPEN' : '🔴 CLOSED';
        
        html += `
            <div class="session-card ${statusClass}">
                <div class="session-header">
                    <span class="session-flag">${session.flag}</span>
                    <h4 class="session-name">${session.name}</h4>
                </div>
                <div class="session-status-badge ${statusClass}">${statusText}</div>
                <div class="session-info">
                    <p class="session-timezone">${session.timezone}</p>
                    <p class="session-hours">${session.open}:00 - ${session.close}:00 UTC</p>
                </div>
                <div class="session-indicator" style="background: ${session.isOpen ? session.color : '#374151'}"></div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div class="best-times-section">
                <h3>⭐ Best Trading Times</h3>
                <div class="best-times-grid">
                    <div class="time-slot high-volume">
                        <strong>London Open (08:00-12:00 UTC)</strong>
                        <p>Highest volume and volatility. Best for EUR/USD, GBP/USD</p>
                    </div>
                    <div class="time-slot medium-volume">
                        <strong>New York Open (13:00-17:00 UTC)</strong>
                        <p>Overlap with London. Great for USD pairs</p>
                    </div>
                    <div class="time-slot low-volume">
                        <strong>Tokyo Session (00:00-09:00 UTC)</strong>
                        <p>Good for JPY, AUD, NZD pairs</p>
                    </div>
                </div>
            </div>
            
            <div class="market-hours-note">
                <p>💡 <strong>Tip:</strong> Trading volume peaks during London and New York overlap (13:00-17:00 UTC). Spreads are tightest and liquidity is highest during these hours.</p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 ForexLive Intelligence STARTING...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📰 News Sources: 50+ feeds worldwide');
    console.log('⚡ Auto-refresh: Every 3 seconds');
    console.log('💱 Currency Sentiment: ALL DETECTED');
    console.log('🕐 Market Hours: LIVE');
    console.log(`🔧 Backend Mode: ${CONFIG.USE_BACKEND ? 'ENABLED' : 'DISABLED'}`);
    if (CONFIG.USE_BACKEND) {
        console.log(`📡 Backend URL: ${CONFIG.BACKEND_URL}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Initialize WebSocket for real-time updates
    if (CONFIG.USE_BACKEND) {
        console.log('🔌 Initializing WebSocket...');
        initWebSocket();
    }
    
    loadAllNews();
    startRealTimeUpdates();
    
    // Update market hours every minute
    setInterval(() => {
        const modal = document.getElementById('marketHoursModal');
        if (modal && modal.classList.contains('active')) {
            renderMarketHours();
        }
    }, 60000);
    
    // Close modals on backdrop click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeCalendar();
            closeMarketSummary();
            closeAIAnalysis();
            closeCharts();
            closeTrumpTracker();
            closeMarketHours();
        }
    });
    
    console.log('✅ ForexLive Intelligence READY');
    console.log('🦅 Trump Tracker: Enabled');
    console.log('📊 TradingView Charts: Enabled');
    console.log('📈 Currency Strength: Enabled');  
    console.log('🔔 Push Notifications: Ready');
    console.log('🔌 WebSocket: ' + (CONFIG.USE_BACKEND ? 'Connecting...' : 'Disabled'));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
// ===== LIVE TICKER WITH REAL FOREX DATA =====

async function updateLiveTicker() {
    try {
        // Fetch forex pairs - FMP uses different endpoint for forex
        const forexPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF'];
        const forexUrl = `https://financialmodelingprep.com/api/v3/fx/${forexPairs.join(',')}?apikey=${CONFIG.FMP_API_KEY}`;
        
        // Fetch commodities and crypto
        const otherSymbols = ['XAUUSD', 'XAGUSD', 'BTCUSD', 'DX-Y.NYB']; // DX-Y.NYB is DXY
        const quotesUrl = `https://financialmodelingprep.com/api/v3/quote/${otherSymbols.join(',')}?apikey=${CONFIG.FMP_API_KEY}`;
        
        const [forexResponse, quotesResponse] = await Promise.all([
            fetch(forexUrl),
            fetch(quotesUrl)
        ]);
        
        const forexData = await forexResponse.json();
        const quotesData = await quotesResponse.json();
        
        let tickerHTML = '';
        
        // Process forex pairs
        if (Array.isArray(forexData)) {
            forexData.forEach(quote => {
                if (quote.ticker) {
                    const change = (quote.changes || 0);
                    const isPositive = change > 0;
                    const price = quote.ask || quote.bid || 0;
                    
                    tickerHTML += `
                        <div class="ticker-item ${isPositive ? 'positive' : 'negative'}">
                            <span class="ticker-symbol">${quote.ticker.replace('USD', '/USD').replace('JPY', '/JPY').replace('CAD', '/CAD').replace('CHF', '/CHF')}</span>
                            <span class="ticker-price">${price.toFixed(5)}</span>
                            <span class="ticker-change">${isPositive ? '+' : ''}${(change * 100).toFixed(2)}%</span>
                        </div>
                    `;
                }
            });
        }
        
        // Process other assets
        if (Array.isArray(quotesData)) {
            quotesData.forEach(quote => {
                const change = quote.changesPercentage || 0;
                const isPositive = change > 0;
                const price = quote.price || 0;
                
                let displayName = quote.symbol;
                let decimals = 2;
                
                if (quote.symbol === 'XAUUSD') {
                    displayName = 'Gold';
                    decimals = 2;
                } else if (quote.symbol === 'XAGUSD') {
                    displayName = 'Silver';
                    decimals = 3;
                } else if (quote.symbol === 'BTCUSD') {
                    displayName = 'Bitcoin';
                    decimals = 0;
                } else if (quote.symbol === 'DX-Y.NYB') {
                    displayName = 'DXY';
                    decimals = 3;
                }
                
                tickerHTML += `
                    <div class="ticker-item ${isPositive ? 'positive' : 'negative'}">
                        <span class="ticker-symbol">${displayName}</span>
                        <span class="ticker-price">${price.toFixed(decimals)}</span>
                        <span class="ticker-change">${isPositive ? '+' : ''}${change.toFixed(2)}%</span>
                    </div>
                `;
            });
        }
        
        if (tickerHTML) {
            document.getElementById('liveTicker').innerHTML = tickerHTML + tickerHTML; // Duplicate for scrolling
        } else {
            throw new Error('No ticker data received');
        }
        
    } catch (error) {
        console.error('Ticker update error:', error);
        document.getElementById('liveTicker').innerHTML = `
            <div class="ticker-loading">⚠️ Connecting to live market data...</div>
        `;
    }
}

// Fetch REAL US Treasury Yields
async function updateUSYields() {
    try {
        // Fetch treasury symbols
        const symbols = ['^TNX', '^FVX', '^IRX']; // 10Y, 5Y, 3M
        const url = `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${CONFIG.FMP_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error('No yields data');
        }
        
        const yieldsHTML = data.map(quote => {
            let period = '';
            if (quote.symbol === '^TNX') period = '10Y';
            else if (quote.symbol === '^FVX') period = '5Y';
            else if (quote.symbol === '^IRX') period = '3M';
            
            const rate = quote.price || 0;
            const change = quote.change || 0;
            const isUp = change > 0;
            
            return `
                <div class="yield-item ${isUp ? 'yield-up' : 'yield-down'}">
                    <span class="yield-period">${period}</span>
                    <span class="yield-rate">${rate.toFixed(3)}%</span>
                    <span class="yield-change">${isUp ? '▲' : '▼'} ${Math.abs(change).toFixed(3)}</span>
                </div>
            `;
        }).join('');
        
        document.getElementById('yieldsData').innerHTML = yieldsHTML;
        
    } catch (error) {
        console.error('Yields update error:', error);
        document.getElementById('yieldsData').innerHTML = `
            <div class="yield-loading">⚠️ Loading yields data...</div>
        `;
    }
}

// ===== TRADING PSYCHOLOGY & RISK MANAGEMENT =====

const TRADING_PSYCHOLOGY = {
    quotes: [
        { author: "Jesse Livermore", quote: "The game of speculation is the most uniformly fascinating game in the world. But it is not a game for the stupid, the mentally lazy, the person of inferior emotional balance, or the get-rich-quick adventurer." },
        { author: "Paul Tudor Jones", quote: "Don't focus on making money; focus on protecting what you have." },
        { author: "George Soros", quote: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong." },
        { author: "Ray Dalio", quote: "He who lives by the crystal ball will eat shattered glass." },
        { author: "Warren Buffett", quote: "Risk comes from not knowing what you're doing." },
        { author: "Stanley Druckenmiller", quote: "It's not whether you're right or wrong, it's how much you make when you're right and how much you lose when you're wrong." },
        { author: "Mark Douglas", quote: "The hard, cold reality of trading is that every trade has an uncertain outcome." },
        { author: "Ed Seykota", quote: "Win or lose, everybody gets what they want out of the market." },
        { author: "Bruce Kovner", quote: "Michael Marcus taught me one thing that was incredibly important... He taught me that you could make a million dollars. If you could make a million dollars, you could make $100 million." },
        { author: "Richard Dennis", quote: "I always say that you could publish trading rules in the newspaper and no one would follow them. The key is consistency and discipline." },
        { author: "William Eckhardt", quote: "The majority of people trade far too much...The successful trader is one who can take a loss without emotional devastation." },
        { author: "Linda Raschke", quote: "The best traders have no ego. To be a winner, you need to give up your need to be right." },
        { author: "Van K. Tharp", quote: "Trading is a game of probabilities. Each trade is simply another execution of your edge." },
        { author: "Alexander Elder", quote: "The goal of a successful trader is to make the best trades. Money is secondary." },
        { author: "Nicolas Darvas", quote: "You must have strict money management. Period. Otherwise, you won't survive." }
    ],
    
    principles: {
        psychology: [
            { title: "Control Your Emotions", content: "Fear and greed are the trader's worst enemies. Never let emotions drive your decisions." },
            { title: "Accept Losses", content: "Losses are part of trading. Accept them, learn from them, and move on. Never revenge trade." },
            { title: "Stay Disciplined", content: "Follow your trading plan religiously. Discipline beats discretion 99% of the time." },
            { title: "Manage Expectations", content: "Trading is not a get-rich-quick scheme. Consistent small gains beat occasional big wins." },
            { title: "Detach from Outcomes", content: "Focus on executing your strategy correctly, not on P&L. Good process = good results." },
            { title: "Trade Your Plan", content: "Plan your trade and trade your plan. No plan = gambling." },
            { title: "Avoid Overconfidence", content: "One good trade doesn't make you a genius. Stay humble, stay cautious." },
            { title: "Learn Continuously", content: "Markets evolve. What worked yesterday may not work tomorrow. Keep learning." }
        ],
        
        riskManagement: [
            { title: "Never Risk More Than 1-2%", content: "Risk only 1-2% of your capital per trade. This is the #1 rule of survival." },
            { title: "Use Stop Losses ALWAYS", content: "Every trade MUST have a stop loss. No exceptions. Ever." },
            { title: "Position Sizing Matters", content: "Proper position sizing is more important than entry price." },
            { title: "Risk:Reward Minimum 1:2", content: "Never take a trade with less than 1:2 risk-reward ratio. Aim for 1:3 or better." },
            { title: "Diversify Risk", content: "Don't put all eggs in one basket. Spread risk across pairs and strategies." },
            { title: "Account for Correlation", content: "Trading EURUSD and GBPUSD together = double exposure. Understand correlations." },
            { title: "Preserve Capital", content: "Your first job is to protect capital. Growth comes second." },
            { title: "No Martingale Strategies", content: "Doubling down on losses is a guaranteed way to blow your account." },
            { title: "Take Partial Profits", content: "Lock in profits at key levels. Let runners run, but secure gains." },
            { title: "Daily/Weekly Loss Limits", content: "Set maximum daily and weekly loss limits. When hit, STOP trading." }
        ],
        
        mindset: [
            { title: "Think in Probabilities", content: "No setup is 100%. Even a 70% win rate means 3/10 trades will lose." },
            { title: "Process Over Outcome", content: "Judge yourself on execution quality, not on whether a single trade won or lost." },
            { title: "Marathon Not Sprint", content: "Trading is a long-term game. Focus on consistency over months and years." },
            { title: "Journal Everything", content: "Keep a detailed trading journal. Review it weekly. Learn from mistakes." },
            { title: "Embrace Uncertainty", content: "The market is uncertain. Accept it. Trade probabilities, not certainties." },
            { title: "Quality Over Quantity", content: "10 high-quality setups beat 100 mediocre ones." },
            { title: "Be Patient", content: "Wait for your setup. Boredom is not a reason to trade." },
            { title: "Stay Humble", content: "The market is bigger than you. It doesn't care about your opinion." }
        ]
    }
};

function showPsychology() {
    const modal = document.getElementById('psychologyModal');
    modal.classList.add('active');
    renderPsychology();
}

function closePsychology() {
    document.getElementById('psychologyModal').classList.remove('active');
}

function renderPsychology() {
    const container = document.getElementById('psychologyContainer');
    
    let html = `
        <div class="psychology-sections">
            <!-- Famous Quotes Section -->
            <div class="psych-section">
                <h3 class="psych-section-title">💭 Wisdom from Legendary Traders</h3>
                <div class="quotes-grid">
    `;
    
    TRADING_PSYCHOLOGY.quotes.forEach(q => {
        html += `
            <div class="quote-card">
                <div class="quote-text">"${q.quote}"</div>
                <div class="quote-author">— ${q.author}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <!-- Trading Psychology Principles -->
            <div class="psych-section">
                <h3 class="psych-section-title">🧠 Trading Psychology Principles</h3>
                <div class="principles-grid">
    `;
    
    TRADING_PSYCHOLOGY.principles.psychology.forEach(p => {
        html += `
            <div class="principle-card">
                <div class="principle-title">${p.title}</div>
                <div class="principle-content">${p.content}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <!-- Risk Management Rules -->
            <div class="psych-section">
                <h3 class="psych-section-title">🛡️ Risk Management Rules</h3>
                <div class="principles-grid">
    `;
    
    TRADING_PSYCHOLOGY.principles.riskManagement.forEach(p => {
        html += `
            <div class="principle-card risk-card">
                <div class="principle-title">${p.title}</div>
                <div class="principle-content">${p.content}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <!-- Mindset & Approach -->
            <div class="psych-section">
                <h3 class="psych-section-title">🎯 Winning Mindset</h3>
                <div class="principles-grid">
    `;
    
    TRADING_PSYCHOLOGY.principles.mindset.forEach(p => {
        html += `
            <div class="principle-card mindset-card">
                <div class="principle-title">${p.title}</div>
                <div class="principle-content">${p.content}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ===== DXY-CENTRIC MACRO ENGINE WITH REAL DATA =====

const MACRO_ENGINE = {
    // DXY-based correlations (exactly as user specified)
    assets: {
        'XAUUSD': {
            name: 'Gold (XAU/USD)',
            flag: '🥇',
            correlation: 'Strong Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'Gold is priced in USD. Strong dollar reduces demand globally.',
            exception: 'Crisis risk → Gold can rise even if DXY rises.'
        },
        'EURUSD': {
            name: 'EUR/USD',
            flag: '💶',
            correlation: 'Strong Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'EUR = ~57% of DXY weight. This is almost mechanical.',
            exception: 'ECB hawkish surprise can override DXY impact.'
        },
        'GBPUSD': {
            name: 'GBP/USD',
            flag: '💷',
            correlation: 'Strong Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'Slightly weaker than EUR but structurally inverse.',
            exception: 'BoE policy divergence can weaken correlation.'
        },
        'AUDUSD': {
            name: 'AUD/USD',
            flag: '🇦🇺',
            correlation: 'Negative (Risk Sensitive)',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'BUT: AUD also depends on China growth, risk sentiment, commodities.',
            exception: 'Strong China data or commodity rally can override DXY.'
        },
        'NZDUSD': {
            name: 'NZD/USD',
            flag: '🇳🇿',
            correlation: 'Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'Similar behavior to AUD but more volatile.',
            exception: 'Dairy price moves can cause divergence.'
        },
        'USDJPY': {
            name: 'USD/JPY',
            flag: '🇯🇵',
            correlation: 'Positive',
            dxyBullish: 'Bullish',
            dxyBearish: 'Bearish',
            reason: 'USD is base currency.',
            exception: 'During risk-off, JPY strengthens regardless of DXY.'
        },
        'USDCAD': {
            name: 'USD/CAD',
            flag: '🇨🇦',
            correlation: 'Positive',
            dxyBullish: 'Bullish',
            dxyBearish: 'Bearish',
            reason: 'BUT: Oil matters heavily.',
            exception: 'If oil rallies hard → CAD strengthens → USDCAD falls even if DXY slightly bullish.'
        },
        'USDCHF': {
            name: 'USD/CHF',
            flag: '🇨🇭',
            correlation: 'Positive',
            dxyBullish: 'Bullish',
            dxyBearish: 'Bearish',
            reason: 'CHF behaves like JPY during fear events.',
            exception: 'Risk-off can strengthen CHF regardless of DXY.'
        }
    },
    
    // Correlation strength ranking (as user specified)
    strengthRanking: {
        inverse: ['EURUSD', 'Gold (XAUUSD)', 'GBPUSD', 'AUDUSD', 'NZDUSD'],
        positive: ['USDJPY', 'USDCHF', 'USDCAD']
    },
    
    // Macro driver weights (exactly as user specified)
    drivers: {
        DXY: 0.40,
        Yields: 0.30,
        Risk: 0.20,
        Oil: 0.10
    }
};

// Fetch REAL macro data
async function fetchMacroData() {
    try {
        // Fetch DXY, Yields, VIX, Oil
        const symbols = ['DX-Y.NYB', '^TNX', '^VIX', 'CL=F'];
        const url = `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${CONFIG.FMP_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        const macroData = {
            dxy: data.find(q => q.symbol === 'DX-Y.NYB') || {},
            yields: data.find(q => q.symbol === '^TNX') || {},
            vix: data.find(q => q.symbol === '^VIX') || {},
            oil: data.find(q => q.symbol === 'CL=F') || {}
        };
        
        return macroData;
    } catch (error) {
        console.error('Macro data fetch error:', error);
        return null;
    }
}

// Calculate DXY bias from REAL data
function calculateDXYBias(dxyData) {
    if (!dxyData || !dxyData.price) {
        return {
            bias: 'Neutral',
            confidence: 50,
            momentum: 'Consolidating',
            session: 'Unknown',
            price: 0,
            change: 0,
            changePercent: 0
        };
    }
    
    const changePercent = dxyData.changesPercentage || 0;
    const change = dxyData.change || 0;
    
    let bias = 'Neutral';
    let confidence = 50;
    let momentum = 'Consolidating';
    
    // Determine bias based on real price action
    if (changePercent > 0.3) {
        bias = 'Bullish';
        if (changePercent > 0.7) {
            confidence = 85;
            momentum = 'Expanding';
        } else if (changePercent > 0.5) {
            confidence = 78;
            momentum = 'Building';
        } else {
            confidence = 65;
            momentum = 'Mild';
        }
    } else if (changePercent < -0.3) {
        bias = 'Bearish';
        if (changePercent < -0.7) {
            confidence = 85;
            momentum = 'Expanding';
        } else if (changePercent < -0.5) {
            confidence = 78;
            momentum = 'Building';
        } else {
            confidence = 65;
            momentum = 'Mild';
        }
    }
    
    // Determine session
    const hour = new Date().getUTCHours();
    let session = 'Asian';
    if (hour >= 7 && hour < 16) session = 'London Active';
    else if (hour >= 13 && hour < 22) session = 'NY Active';
    else if (hour >= 0 && hour < 9) session = 'Tokyo Active';
    
    return {
        bias,
        confidence,
        momentum,
        session,
        price: dxyData.price,
        change,
        changePercent
    };
}

// Calculate full macro engine score
function calculateMacroScore(macroData) {
    const scores = {
        dxy: 0,
        yields: 0,
        risk: 0,
        oil: 0
    };
    
    // DXY Score (40% weight)
    const dxyChange = macroData.dxy.changesPercentage || 0;
    if (dxyChange > 0.3) scores.dxy = 1;
    else if (dxyChange < -0.3) scores.dxy = -1;
    
    // Yields Score (30% weight)
    const yieldsChange = macroData.yields.changesPercentage || 0;
    if (yieldsChange > 1) scores.yields = 1;
    else if (yieldsChange < -1) scores.yields = -1;
    
    // Risk Score (20% weight) - VIX inverse
    const vixChange = macroData.vix.changesPercentage || 0;
    if (vixChange < -5) scores.risk = 1; // VIX down = risk on
    else if (vixChange > 5) scores.risk = -1; // VIX up = risk off
    
    // Oil Score (10% weight)
    const oilChange = macroData.oil.changesPercentage || 0;
    if (oilChange > 2) scores.oil = 1;
    else if (oilChange < -2) scores.oil = -1;
    
    return scores;
}

// Project asset biases with REAL calculations
function projectAssetBiases(dxyBias, macroScores) {
    const projections = {};
    
    Object.entries(MACRO_ENGINE.assets).forEach(([symbol, asset]) => {
        let baseConfidence = dxyBias.confidence;
        
        // Calculate weighted confidence
        let weightedScore = 
            macroScores.dxy * MACRO_ENGINE.drivers.DXY +
            macroScores.yields * MACRO_ENGINE.drivers.Yields +
            macroScores.risk * MACRO_ENGINE.drivers.Risk +
            macroScores.oil * MACRO_ENGINE.drivers.Oil;
        
        // Adjust for correlation type
        let projectedBias = 'Neutral';
        let finalConfidence = 50;
        
        if (asset.correlation.includes('Negative')) {
            // Inverse correlation
            if (dxyBias.bias === 'Bullish') {
                projectedBias = 'Bearish';
                finalConfidence = Math.round(baseConfidence * (1 + Math.abs(weightedScore)));
            } else if (dxyBias.bias === 'Bearish') {
                projectedBias = 'Bullish';
                finalConfidence = Math.round(baseConfidence * (1 + Math.abs(weightedScore)));
            }
        } else if (asset.correlation.includes('Positive')) {
            // Direct correlation
            if (dxyBias.bias === 'Bullish') {
                projectedBias = 'Bullish';
                finalConfidence = Math.round(baseConfidence * (1 + Math.abs(weightedScore)));
            } else if (dxyBias.bias === 'Bearish') {
                projectedBias = 'Bearish';
                finalConfidence = Math.round(baseConfidence * (1 + Math.abs(weightedScore)));
            }
        }
        
        // Cap confidence at 95%
        finalConfidence = Math.min(95, finalConfidence);
        
        // Determine strength
        let strength = 'Weak';
        let strengthPrefix = '';
        if (finalConfidence >= 80) {
            strength = 'Strong';
            strengthPrefix = 'Strong ';
        } else if (finalConfidence >= 65) {
            strength = 'Moderate';
            strengthPrefix = 'Moderate ';
        }
        
        projections[symbol] = {
            bias: projectedBias,
            confidence: finalConfidence,
            strength: strength,
            fullBias: `${strengthPrefix}${projectedBias}`
        };
    });
    
    return projections;
}

function showCorrelations() {
    document.getElementById('correlationsModal').classList.add('active');
    renderMacroEngine();
}

function closeCorrelations() {
    document.getElementById('correlationsModal').classList.remove('active');
}

async function renderMacroEngine() {
    const container = document.getElementById('correlationsContainer');
    
    // Show loading
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner-advanced">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p class="loading-message">🔥 Calculating DXY bias and macro projections...</p>
        </div>
    `;
    
    // Fetch REAL macro data
    const macroData = await fetchMacroData();
    
    if (!macroData) {
        container.innerHTML = '<div class="error-message">⚠️ Unable to fetch macro data. Please refresh.</div>';
        return;
    }
    
    const dxyBias = calculateDXYBias(macroData.dxy);
    const macroScores = calculateMacroScore(macroData);
    const projections = projectAssetBiases(dxyBias, macroScores);
    
    let html = `
        <div class="macro-engine-container">
            <!-- Level 1: Auto DXY Bias Detection -->
            <div class="engine-section level-1">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>LEVEL 1 — AUTO DXY BIAS DETECTION</h3>
                </div>
                <div class="engine-subheader">Driver: U.S. Dollar Index</div>
                
                <div class="dxy-output-box">
                    <div class="output-row">
                        <span class="output-label">DXY Bias:</span>
                        <span class="output-value bias-${dxyBias.bias.toLowerCase()}">${dxyBias.bias}</span>
                    </div>
                    <div class="output-row">
                        <span class="output-label">Confidence:</span>
                        <span class="output-value">${dxyBias.confidence}%</span>
                    </div>
                    <div class="output-row">
                        <span class="output-label">Momentum:</span>
                        <span class="output-value">${dxyBias.momentum}</span>
                    </div>
                    <div class="output-row">
                        <span class="output-label">Session:</span>
                        <span class="output-value">${dxyBias.session}</span>
                    </div>
                    <div class="output-row live-data">
                        <span class="output-label">DXY Price:</span>
                        <span class="output-value">${dxyBias.price.toFixed(3)}</span>
                        <span class="output-change ${dxyBias.changePercent > 0 ? 'positive' : 'negative'}">
                            ${dxyBias.changePercent > 0 ? '+' : ''}${dxyBias.changePercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
                
                <div class="engine-note">
                    💡 <strong>This bias projects 70% of major currency moves</strong>
                </div>
            </div>

            <!-- Level 2: Asset Bias Projection -->
            <div class="engine-section level-2">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>LEVEL 2 — AUTO ASSET BIAS PROJECTION</h3>
                </div>
                <div class="engine-subheader">Once DXY bias is known:</div>
                
                <div class="projection-table-modern">
                    <div class="proj-table-header">
                        <div class="proj-col">DXY</div>
                        <div class="proj-col">Gold</div>
                        <div class="proj-col">EURUSD</div>
                        <div class="proj-col">GBPUSD</div>
                        <div class="proj-col">USDJPY</div>
                    </div>
                    <div class="proj-table-row">
                        <div class="proj-col bias-cell bias-${dxyBias.bias.toLowerCase()}">${dxyBias.bias}</div>
                        <div class="proj-col bias-cell bias-${projections['XAUUSD']?.bias.toLowerCase()}">${projections['XAUUSD']?.bias}</div>
                        <div class="proj-col bias-cell bias-${projections['EURUSD']?.bias.toLowerCase()}">${projections['EURUSD']?.bias}</div>
                        <div class="proj-col bias-cell bias-${projections['GBPUSD']?.bias.toLowerCase()}">${projections['GBPUSD']?.bias}</div>
                        <div class="proj-col bias-cell bias-${projections['USDJPY']?.bias.toLowerCase()}">${projections['USDJPY']?.bias}</div>
                    </div>
                </div>
                
                <div class="engine-note">
                    ⚠️ <strong>But that's just layer 1. Now we add filters.</strong>
                </div>
            </div>

            <!-- Level 3: Full Intermarket Engine -->
            <div class="engine-section level-3">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>LEVEL 3 — FULL INTERMARKET ENGINE</h3>
                </div>
                <div class="engine-subheader">We add 4 macro drivers:</div>
                
                <div class="drivers-display">
                    <div class="driver-box">
                        <div class="driver-num">1️⃣</div>
                        <div class="driver-name">DXY</div>
                        <div class="driver-weight">${Math.round(MACRO_ENGINE.drivers.DXY * 100)}%</div>
                        <div class="driver-status ${macroScores.dxy > 0 ? 'bullish' : macroScores.dxy < 0 ? 'bearish' : 'neutral'}">
                            ${macroScores.dxy > 0 ? 'Bullish' : macroScores.dxy < 0 ? 'Bearish' : 'Neutral'}
                        </div>
                    </div>
                    <div class="driver-box">
                        <div class="driver-num">2️⃣</div>
                        <div class="driver-name">US 10Y Yields</div>
                        <div class="driver-weight">${Math.round(MACRO_ENGINE.drivers.Yields * 100)}%</div>
                        <div class="driver-status ${macroScores.yields > 0 ? 'rising' : macroScores.yields < 0 ? 'falling' : 'flat'}">
                            ${macroScores.yields > 0 ? 'Rising' : macroScores.yields < 0 ? 'Falling' : 'Flat'}
                        </div>
                        <div class="driver-value">${(macroData.yields.price || 0).toFixed(3)}%</div>
                    </div>
                    <div class="driver-box">
                        <div class="driver-num">3️⃣</div>
                        <div class="driver-name">Oil</div>
                        <div class="driver-weight">${Math.round(MACRO_ENGINE.drivers.Oil * 100)}%</div>
                        <div class="driver-status ${macroScores.oil > 0 ? 'rising' : macroScores.oil < 0 ? 'falling' : 'flat'}">
                            ${macroScores.oil > 0 ? 'Rising' : macroScores.oil < 0 ? 'Falling' : 'Flat'}
                        </div>
                        <div class="driver-value">$${(macroData.oil.price || 0).toFixed(2)}</div>
                    </div>
                    <div class="driver-box">
                        <div class="driver-num">4️⃣</div>
                        <div class="driver-name">Risk Sentiment</div>
                        <div class="driver-weight">${Math.round(MACRO_ENGINE.drivers.Risk * 100)}%</div>
                        <div class="driver-status ${macroScores.risk > 0 ? 'risk-on' : macroScores.risk < 0 ? 'risk-off' : 'neutral'}">
                            ${macroScores.risk > 0 ? 'Risk-On' : macroScores.risk < 0 ? 'Risk-Off' : 'Neutral'}
                        </div>
                        <div class="driver-value">VIX: ${(macroData.vix.price || 0).toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <!-- Example Output -->
            <div class="engine-section example-output">
                <div class="engine-header">
                    <span class="engine-icon">🧮</span>
                    <h3>LIVE MACRO ENGINE OUTPUT</h3>
                </div>
                
                <div class="output-box-main">
                    <div class="output-section">
                        <h4>Macro Engine Status:</h4>
                        <div class="status-grid">
                            <div class="status-item">
                                <span class="status-label">DXY:</span>
                                <span class="status-val">${dxyBias.bias} (${dxyBias.confidence >= 75 ? 'Strong' : 'Moderate'})</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Yields:</span>
                                <span class="status-val">${macroScores.yields > 0 ? 'Rising' : macroScores.yields < 0 ? 'Falling' : 'Neutral'}</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Risk:</span>
                                <span class="status-val">${macroScores.risk > 0 ? 'On' : macroScores.risk < 0 ? 'Off' : 'Neutral'}</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Oil:</span>
                                <span class="status-val">${macroScores.oil > 0 ? 'Rising' : macroScores.oil < 0 ? 'Falling' : 'Flat'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="output-section">
                        <h4>Projected Bias:</h4>
                        <div class="bias-grid">
    `;
    
    // Add all projections
    Object.entries(projections).forEach(([symbol, proj]) => {
        const asset = MACRO_ENGINE.assets[symbol];
        html += `
            <div class="bias-item">
                <span class="bias-asset">${asset.name}:</span>
                <span class="bias-result ${proj.bias.toLowerCase()}">${proj.fullBias} (${proj.confidence}%)</span>
            </div>
        `;
    });
    
    html += `
                        </div>
                    </div>
                </div>
                
                <div class="engine-note highlight">
                    ✅ <strong>That is real macro alignment.</strong>
                </div>
            </div>

            <!-- Master Correlation Map -->
            <div class="engine-section correlation-map">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>MASTER INTERMARKET CORRELATION MAP</h3>
                    <p class="engine-subtitle">(Using U.S. Dollar Index as base driver)</p>
                </div>
                
                <div class="corr-cards-grid">
    `;
    
    // Add correlation cards
    Object.entries(MACRO_ENGINE.assets).forEach(([symbol, asset]) => {
        html += `
            <div class="corr-card-modern">
                <div class="corr-card-title">
                    <span class="corr-flag-big">${asset.flag}</span>
                    <span class="corr-name-big">${asset.name}</span>
                </div>
                <div class="corr-detail">
                    <strong>Correlation with DXY:</strong> ${asset.correlation}
                </div>
                <div class="corr-reactions-box">
                    <div class="reaction-line">
                        <span class="reaction-cond">DXY Bullish →</span>
                        <span class="reaction-res ${asset.dxyBullish.toLowerCase()}">${asset.dxyBullish}</span>
                    </div>
                    <div class="reaction-line">
                        <span class="reaction-cond">DXY Bearish →</span>
                        <span class="reaction-res ${asset.dxyBearish.toLowerCase()}">${asset.dxyBearish}</span>
                    </div>
                </div>
                <div class="corr-reason-box">
                    <strong>Reason:</strong> ${asset.reason}
                </div>
                <div class="corr-exception-box">
                    ⚠️ <strong>Exception:</strong> ${asset.exception}
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>

            <!-- Structured Summary Table -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">📊</span>
                    <h3>STRUCTURED SUMMARY TABLE</h3>
                </div>
                
                <div class="summary-table-modern">
                    <div class="sum-header">
                        <div class="sum-cell">Asset</div>
                        <div class="sum-cell">Correlation vs DXY</div>
                        <div class="sum-cell">If DXY Bullish</div>
                        <div class="sum-cell">If DXY Bearish</div>
                    </div>
    `;
    
    Object.entries(MACRO_ENGINE.assets).forEach(([symbol, asset]) => {
        html += `
            <div class="sum-row">
                <div class="sum-cell"><strong>${asset.name}</strong></div>
                <div class="sum-cell">${asset.correlation}</div>
                <div class="sum-cell ${asset.dxyBullish.toLowerCase()}-text">${asset.dxyBullish}</div>
                <div class="sum-cell ${asset.dxyBearish.toLowerCase()}-text">${asset.dxyBearish}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>

            <!-- Correlation Strength Ranking -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">⚠️</span>
                    <h3>CORRELATION STRENGTH RANKING</h3>
                </div>
                
                <div class="ranking-boxes">
                    <div class="ranking-box inverse">
                        <h4>From strongest to weakest inverse:</h4>
                        <ol class="ranking-list-modern">
                            ${MACRO_ENGINE.strengthRanking.inverse.map(asset => `<li>${asset}</li>`).join('')}
                        </ol>
                    </div>
                    <div class="ranking-box positive">
                        <h4>Strongest positive:</h4>
                        <ol class="ranking-list-modern">
                            ${MACRO_ENGINE.strengthRanking.positive.map(asset => `<li>${asset}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>

            <!-- What Traders Get Wrong -->
            <div class="engine-section warning-box">
                <div class="engine-header">
                    <span class="engine-icon">🧠</span>
                    <h3>WHAT MOST TRADERS GET WRONG</h3>
                </div>
                
                <div class="warning-content-box">
                    <p class="warning-title"><strong>Correlation ≠ causation.</strong></p>
                    <p>DXY doesn't "cause" moves. Macro expectations (rates, inflation, growth) drive both. DXY is just a reflection.</p>
                    <p>If you blindly trade "DXY down → buy gold" without:</p>
                    <ul class="warning-list">
                        <li>Yield context</li>
                        <li>News context</li>
                        <li>Session liquidity</li>
                    </ul>
                    <p class="warning-danger">⚠️ <strong>You will lose money.</strong></p>
                </div>
            </div>

            <!-- Hard Questions -->
            <div class="engine-section challenge-box">
                <div class="engine-header">
                    <span class="engine-icon">🚨</span>
                    <h3>NOW HERE'S THE HARD QUESTION</h3>
                </div>
                
                <div class="challenge-content">
                    <p class="challenge-intro">You trade gold heavily. Do you actually check:</p>
                    <ul class="challenge-list">
                        <li>✓ US 10Y real yields?</li>
                        <li>✓ Correlation breakdown days?</li>
                        <li>✓ Pre-NFP compression?</li>
                        <li>✓ Liquidity void zones?</li>
                    </ul>
                    <p class="challenge-note">⚠️ <strong>Where This Fails:</strong> If CPI prints far above forecast: DXY spikes, Yields spike, Gold dumps. BUT if market expected even worse? Gold may reverse. Your engine must factor surprise vs expectation, not just direction.</p>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}
    dxyCorrelations: {
        'XAUUSD': {
            name: 'Gold (XAU/USD)',
            flag: '🥇',
            correlation: 'Strong Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'Gold is priced in USD. Strong dollar reduces demand globally.',
            exception: 'Crisis risk → Gold can rise even if DXY rises.',
            weight: 0.85
        },
        'EURUSD': {
            name: 'EUR/USD',
            flag: '💶',
            correlation: 'Strong Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'EUR = ~57% of DXY weight. This is almost mechanical.',
            exception: 'ECB hawkish surprise can override DXY impact.',
            weight: 0.92
        },
        'GBPUSD': {
            name: 'GBP/USD',
            flag: '💷',
            correlation: 'Strong Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'Slightly weaker than EUR but structurally inverse.',
            exception: 'BoE policy divergence can weaken correlation.',
            weight: 0.88
        },
        'AUDUSD': {
            name: 'AUD/USD',
            flag: '🇦🇺',
            correlation: 'Negative (Risk Sensitive)',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'BUT: AUD also depends on China growth, risk sentiment, commodities.',
            exception: 'Strong China data or commodity rally can override DXY.',
            weight: 0.75
        },
        'NZDUSD': {
            name: 'NZD/USD',
            flag: '🇳🇿',
            correlation: 'Negative',
            dxyBullish: 'Bearish',
            dxyBearish: 'Bullish',
            reason: 'Similar behavior to AUD but more volatile.',
            exception: 'Dairy price moves can cause divergence.',
            weight: 0.73
        },
        'USDJPY': {
            name: 'USD/JPY',
            flag: '🇯🇵',
            correlation: 'Positive',
            dxyBullish: 'Bullish',
            dxyBearish: 'Bearish',
            reason: 'USD is base currency.',
            exception: 'During risk-off, JPY strengthens regardless of DXY.',
            weight: 0.82
        },
        'USDCAD': {
            name: 'USD/CAD',
            flag: '🇨🇦',
            correlation: 'Positive',
            dxyBullish: 'Bullish',
            dxyBearish: 'Bearish',
            reason: 'BUT: Oil matters heavily.',
            exception: 'If oil rallies hard → CAD strengthens → USDCAD falls even if DXY bullish.',
            weight: 0.68
        },
        'USDCHF': {
            name: 'USD/CHF',
            flag: '🇨🇭',
            correlation: 'Positive',
            dxyBullish: 'Bullish',
            dxyBearish: 'Bearish',
            reason: 'CHF behaves like JPY during fear events.',
            exception: 'Risk-off can strengthen CHF regardless of DXY.',
            weight: 0.79
        }
    },
    
    // Correlation strength ranking
    strengthRanking: {
        inverseStrong: ['EURUSD', 'XAUUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'],
        positiveStrong: ['USDJPY', 'USDCHF', 'USDCAD']
    },
    
    // Macro drivers with weights
    drivers: {
        DXY: { weight: 0.40, name: 'U.S. Dollar Index' },
        YIELDS: { weight: 0.30, name: 'US 10Y Yields' },
        RISK: { weight: 0.20, name: 'Risk Sentiment' },
        OIL: { weight: 0.10, name: 'Oil Prices' }
    }
};

// Calculate DXY bias (this would use real-time data in production)
async function calculateDXYBias() {
    try {
        // Fetch DXY quote
        const url = `https://financialmodelingprep.com/api/v3/quote/DXY?apikey=${CONFIG.FMP_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data[0]) {
            const dxy = data[0];
            const change = dxy.changesPercentage || 0;
            
            // Determine bias
            let bias = 'Neutral';
            let confidence = 50;
            let momentum = 'Consolidating';
            
            if (change > 0.3) {
                bias = 'Bullish';
                confidence = Math.min(85, 60 + Math.abs(change) * 10);
                momentum = change > 0.5 ? 'Expanding' : 'Building';
            } else if (change < -0.3) {
                bias = 'Bearish';
                confidence = Math.min(85, 60 + Math.abs(change) * 10);
                momentum = change < -0.5 ? 'Expanding' : 'Building';
            }
            
            return {
                bias,
                confidence: Math.round(confidence),
                momentum,
                price: dxy.price,
                change: dxy.change,
                changePercent: dxy.changesPercentage
            };
        }
    } catch (error) {
        console.error('DXY bias calculation error:', error);
    }
    
    // Fallback
    return {
        bias: 'Neutral',
        confidence: 50,
        momentum: 'Consolidating',
        price: 0,
        change: 0,
        changePercent: 0
    };
}

// Project asset biases based on DXY
function projectAssetBiases(dxyBias) {
    const projections = {};
    
    Object.entries(MACRO_ENGINE.dxyCorrelations).forEach(([symbol, data]) => {
        let projectedBias = 'Neutral';
        let confidence = 50;
        
        if (dxyBias.bias === 'Bullish') {
            projectedBias = data.dxyBullish;
            confidence = Math.round(dxyBias.confidence * data.weight);
        } else if (dxyBias.bias === 'Bearish') {
            projectedBias = data.dxyBearish;
            confidence = Math.round(dxyBias.confidence * data.weight);
        }
        
        projections[symbol] = {
            bias: projectedBias,
            confidence,
            strength: confidence > 80 ? 'Strong' : confidence > 60 ? 'Moderate' : 'Weak'
        };
    });
    
    return projections;
}

function showCorrelations() {
    const modal = document.getElementById('correlationsModal');
    modal.classList.add('active');
    renderMacroEngine();
}

function closeCorrelations() {
    document.getElementById('correlationsModal').classList.remove('active');
}

async function renderMacroEngine() {
    const container = document.getElementById('correlationsContainer');
    
    // Show loading
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner-advanced">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p class="loading-message">Calculating DXY bias and projections...</p>
        </div>
    `;
    
    // Calculate DXY bias
    const dxyBias = await calculateDXYBias();
    const projections = projectAssetBiases(dxyBias);
    
    let html = `
        <div class="macro-engine-container">
            <!-- Level 1: DXY Bias Detection -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>LEVEL 1 — AUTO DXY BIAS DETECTION</h3>
                </div>
                <div class="dxy-bias-card">
                    <div class="bias-main">
                        <div class="bias-label">DXY Bias:</div>
                        <div class="bias-value ${dxyBias.bias.toLowerCase()}">${dxyBias.bias}</div>
                    </div>
                    <div class="bias-stats">
                        <div class="stat-item">
                            <span class="stat-label">Confidence:</span>
                            <span class="stat-value">${dxyBias.confidence}%</span>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${dxyBias.confidence}%"></div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Momentum:</span>
                            <span class="stat-value">${dxyBias.momentum}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">DXY Price:</span>
                            <span class="stat-value">${dxyBias.price.toFixed(3)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Change:</span>
                            <span class="stat-value ${dxyBias.changePercent > 0 ? 'positive' : 'negative'}">
                                ${dxyBias.changePercent > 0 ? '+' : ''}${dxyBias.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div class="bias-note">
                        💡 This bias projects 70% of major currency moves
                    </div>
                </div>
            </div>

            <!-- Level 2: Asset Bias Projection -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>LEVEL 2 — AUTO ASSET BIAS PROJECTION</h3>
                </div>
                <div class="projection-table">
                    <div class="projection-header">
                        <div class="proj-col">Asset</div>
                        <div class="proj-col">Projected Bias</div>
                        <div class="proj-col">Confidence</div>
                        <div class="proj-col">Strength</div>
                    </div>
    `;
    
    Object.entries(projections).forEach(([symbol, proj]) => {
        const asset = MACRO_ENGINE.dxyCorrelations[symbol];
        html += `
            <div class="projection-row">
                <div class="proj-col">
                    <span class="asset-flag">${asset.flag}</span>
                    <span class="asset-name">${asset.name}</span>
                </div>
                <div class="proj-col">
                    <span class="bias-badge ${proj.bias.toLowerCase()}">${proj.bias}</span>
                </div>
                <div class="proj-col">
                    <span class="confidence-value">${proj.confidence}%</span>
                </div>
                <div class="proj-col">
                    <span class="strength-badge strength-${proj.strength.toLowerCase()}">${proj.strength}</span>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>

            <!-- Master Correlation Map -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>MASTER INTERMARKET CORRELATION MAP</h3>
                    <p class="engine-subtitle">(Using U.S. Dollar Index as base driver)</p>
                </div>
                <div class="correlation-cards">
    `;
    
    Object.entries(MACRO_ENGINE.dxyCorrelations).forEach(([symbol, data]) => {
        html += `
            <div class="correlation-card">
                <div class="corr-card-header">
                    <span class="corr-flag">${data.flag}</span>
                    <span class="corr-name">${data.name}</span>
                </div>
                <div class="corr-type">Correlation with DXY: <strong>${data.correlation}</strong></div>
                <div class="corr-reactions">
                    <div class="reaction-item">
                        <span class="reaction-if">DXY Bullish →</span>
                        <span class="reaction-result bearish">${data.dxyBullish}</span>
                    </div>
                    <div class="reaction-item">
                        <span class="reaction-if">DXY Bearish →</span>
                        <span class="reaction-result bullish">${data.dxyBearish}</span>
                    </div>
                </div>
                <div class="corr-reason"><strong>Reason:</strong> ${data.reason}</div>
                <div class="corr-exception">⚠️ <strong>Exception:</strong> ${data.exception}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>

            <!-- Structured Summary Table -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">📊</span>
                    <h3>STRUCTURED SUMMARY TABLE</h3>
                </div>
                <div class="summary-table">
                    <div class="summary-header">
                        <div class="sum-col">Asset</div>
                        <div class="sum-col">Correlation vs DXY</div>
                        <div class="sum-col">If DXY Bullish</div>
                        <div class="sum-col">If DXY Bearish</div>
                    </div>
    `;
    
    Object.entries(MACRO_ENGINE.dxyCorrelations).forEach(([symbol, data]) => {
        html += `
            <div class="summary-row">
                <div class="sum-col"><strong>${data.name}</strong></div>
                <div class="sum-col">${data.correlation}</div>
                <div class="sum-col bearish-text">${data.dxyBullish}</div>
                <div class="sum-col bullish-text">${data.dxyBearish}</div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>

            <!-- Correlation Strength Ranking -->
            <div class="engine-section">
                <div class="engine-header">
                    <span class="engine-icon">⚠️</span>
                    <h3>CORRELATION STRENGTH RANKING</h3>
                </div>
                <div class="ranking-grid">
                    <div class="ranking-card inverse">
                        <h4>Strongest Inverse (Negative)</h4>
                        <ol class="ranking-list">
                            ${MACRO_ENGINE.strengthRanking.inverseStrong.map(s => `
                                <li>${MACRO_ENGINE.dxyCorrelations[s].name}</li>
                            `).join('')}
                        </ol>
                    </div>
                    <div class="ranking-card positive">
                        <h4>Strongest Positive</h4>
                        <ol class="ranking-list">
                            ${MACRO_ENGINE.strengthRanking.positiveStrong.map(s => `
                                <li>${MACRO_ENGINE.dxyCorrelations[s].name}</li>
                            `).join('')}
                        </ol>
                    </div>
                </div>
            </div>

            <!-- What Traders Get Wrong -->
            <div class="engine-section warning-section">
                <div class="engine-header">
                    <span class="engine-icon">🧠</span>
                    <h3>WHAT MOST TRADERS GET WRONG</h3>
                </div>
                <div class="warning-content">
                    <p><strong>Correlation ≠ Causation</strong></p>
                    <p>DXY doesn't "cause" moves. Macro expectations (rates, inflation, growth) drive both. DXY is just a reflection.</p>
                    <p>If you blindly trade "DXY down → buy gold" without:</p>
                    <ul>
                        <li>Yield context</li>
                        <li>News context</li>
                        <li>Session liquidity</li>
                    </ul>
                    <p class="warning-highlight">⚠️ You will lose money.</p>
                </div>
            </div>

            <!-- Level 3: Full Intermarket Engine (Preview) -->
            <div class="engine-section level-3">
                <div class="engine-header">
                    <span class="engine-icon">🔥</span>
                    <h3>LEVEL 3 — FULL INTERMARKET ENGINE</h3>
                    <p class="engine-subtitle">4 Macro Drivers Weighted System</p>
                </div>
                <div class="drivers-grid">
    `;
    
    Object.entries(MACRO_ENGINE.drivers).forEach(([key, driver]) => {
        const percentage = Math.round(driver.weight * 100);
        html += `
            <div class="driver-card">
                <div class="driver-name">${driver.name}</div>
                <div class="driver-weight">${percentage}%</div>
                <div class="driver-bar">
                    <div class="driver-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
                <div class="level-3-note">
                    <p>💡 Full engine combines all 4 drivers to calculate precise bias probabilities.</p>
                    <p>🚧 Complete implementation requires real-time yield data, VIX, and oil prices.</p>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}
    pairs: [
        { 
            pair: 'EUR/USD',
            positiveCorr: [
                { with: 'GBP/USD', strength: 0.89, reason: 'Both against USD, European connection' },
                { with: 'AUD/USD', strength: 0.78, reason: 'Risk-on currencies, anti-USD' },
                { with: 'NZD/USD', strength: 0.77, reason: 'Commodity currencies correlation' },
                { with: 'Gold', strength: 0.72, reason: 'Both anti-dollar assets' }
            ],
            negativeCorr: [
                { with: 'USD/CHF', strength: -0.95, reason: 'Perfect inverse - USD is quote vs base' },
                { with: 'USD/JPY', strength: -0.68, reason: 'USD strength inverse' },
                { with: 'USD/CAD', strength: -0.71, reason: 'USD in opposite position' }
            ]
        },
        {
            pair: 'GBP/USD',
            positiveCorr: [
                { with: 'EUR/USD', strength: 0.89, reason: 'European currencies, anti-USD' },
                { with: 'AUD/USD', strength: 0.74, reason: 'Risk-on correlation' },
                { with: 'NZD/USD', strength: 0.72, reason: 'Commonwealth connection' }
            ],
            negativeCorr: [
                { with: 'USD/CHF', strength: -0.87, reason: 'USD opposite position' },
                { with: 'USD/JPY', strength: -0.65, reason: 'USD inverse relationship' }
            ]
        },
        {
            pair: 'USD/JPY',
            positiveCorr: [
                { with: 'USD/CHF', strength: 0.76, reason: 'Both USD base currency' },
                { with: 'USD/CAD', strength: 0.68, reason: 'USD strength moves together' },
                { with: 'US Stocks', strength: 0.71, reason: 'Risk-on sentiment correlation' }
            ],
            negativeCorr: [
                { with: 'EUR/USD', strength: -0.68, reason: 'Inverse USD exposure' },
                { with: 'GBP/USD', strength: -0.65, reason: 'USD opposite sides' },
                { with: 'Gold', strength: -0.58, reason: 'Safe haven vs risk assets' }
            ]
        },
        {
            pair: 'AUD/USD',
            positiveCorr: [
                { with: 'NZD/USD', strength: 0.94, reason: 'Geographic proximity, commodities' },
                { with: 'EUR/USD', strength: 0.78, reason: 'Risk-on currencies' },
                { with: 'Copper', strength: 0.81, reason: 'Australia exports copper' },
                { with: 'Gold', strength: 0.77, reason: 'Australia exports gold' }
            ],
            negativeCorr: [
                { with: 'USD/JPY', strength: -0.59, reason: 'Risk-on vs risk-off' },
                { with: 'USD/CHF', strength: -0.74, reason: 'Opposite USD exposure' }
            ]
        },
        {
            pair: 'USD/CAD',
            positiveCorr: [
                { with: 'USD/JPY', strength: 0.68, reason: 'USD strength correlation' },
                { with: 'Oil', strength: -0.82, reason: 'Inverse - CAD is oil currency' }
            ],
            negativeCorr: [
                { with: 'EUR/USD', strength: -0.71, reason: 'USD opposite position' },
                { with: 'Oil Prices', strength: -0.82, reason: 'CAD strengthens with oil' }
            ]
        },
        {
            pair: 'USD/CHF',
            positiveCorr: [
                { with: 'USD/JPY', strength: 0.76, reason: 'USD strength moves together' }
            ],
            negativeCorr: [
                { with: 'EUR/USD', strength: -0.95, reason: 'Near perfect inverse' },
                { with: 'GBP/USD', strength: -0.87, reason: 'USD opposite sides' },
                { with: 'Gold', strength: -0.71, reason: 'Safe haven vs USD' }
            ]
        },
        {
            pair: 'NZD/USD',
            positiveCorr: [
                { with: 'AUD/USD', strength: 0.94, reason: 'Geographic neighbors, commodities' },
                { with: 'EUR/USD', strength: 0.77, reason: 'Risk currencies' },
                { with: 'Dairy Prices', strength: 0.79, reason: 'NZ dairy exporter' }
            ],
            negativeCorr: [
                { with: 'USD/JPY', strength: -0.56, reason: 'Risk-on vs safe haven' },
                { with: 'USD/CHF', strength: -0.73, reason: 'USD inverse' }
            ]
        },
        {
            pair: 'Gold (XAU/USD)',
            positiveCorr: [
                { with: 'EUR/USD', strength: 0.72, reason: 'Anti-dollar assets' },
                { with: 'AUD/USD', strength: 0.77, reason: 'Australia gold exports' },
                { with: 'Silver', strength: 0.88, reason: 'Precious metals move together' }
            ],
            negativeCorr: [
                { with: 'USD/JPY', strength: -0.58, reason: 'Dollar strength inverse' },
                { with: 'USD Index', strength: -0.79, reason: 'Gold priced in USD' },
                { with: 'Real Yields', strength: -0.67, reason: 'Opportunity cost of holding gold' }
            ]
        }
    ]
};

function showCorrelations() {
    const modal = document.getElementById('correlationsModal');
    modal.classList.add('active');
    renderCorrelations();
}

function closeCorrelations() {
    document.getElementById('correlationsModal').classList.remove('active');
}

function renderCorrelations() {
    const container = document.getElementById('correlationsContainer');
    
    let html = '<div class="correlations-grid">';
    
    CORRELATIONS_DATA.pairs.forEach(data => {
        html += `
            <div class="correlation-section">
                <div class="corr-pair-header">${data.pair}</div>
                
                <div class="corr-category">
                    <div class="corr-category-title positive">✅ Positive Correlations</div>
                    <div class="corr-items">
        `;
        
        data.positiveCorr.forEach(c => {
            const strengthPercent = Math.abs(c.strength * 100);
            const strengthClass = strengthPercent > 80 ? 'very-strong' : strengthPercent > 60 ? 'strong' : 'moderate';
            
            html += `
                <div class="corr-item ${strengthClass}">
                    <div class="corr-with">${c.with}</div>
                    <div class="corr-strength">
                        <div class="corr-bar">
                            <div class="corr-bar-fill" style="width: ${strengthPercent}%"></div>
                        </div>
                        <span class="corr-value">+${c.strength.toFixed(2)}</span>
                    </div>
                    <div class="corr-reason">${c.reason}</div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
                
                <div class="corr-category">
                    <div class="corr-category-title negative">❌ Negative Correlations</div>
                    <div class="corr-items">
        `;
        
        data.negativeCorr.forEach(c => {
            const strengthPercent = Math.abs(c.strength * 100);
            const strengthClass = strengthPercent > 80 ? 'very-strong' : strengthPercent > 60 ? 'strong' : 'moderate';
            
            html += `
                <div class="corr-item negative ${strengthClass}">
                    <div class="corr-with">${c.with}</div>
                    <div class="corr-strength">
                        <div class="corr-bar">
                            <div class="corr-bar-fill negative" style="width: ${strengthPercent}%"></div>
                        </div>
                        <span class="corr-value">${c.strength.toFixed(2)}</span>
                    </div>
                    <div class="corr-reason">${c.reason}</div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
}

// Initialize ticker and yields on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update ticker every 2 seconds
    updateLiveTicker();
    setInterval(updateLiveTicker, 2000);
    
    // Update yields every 10 seconds
    updateUSYields();
    setInterval(updateUSYields, 10000);
});
