// ===== Configuration =====
const CONFIG = {
    RSS_FEEDS: [
        // Forex News Feeds
        { name: 'FXStreet', url: 'https://www.fxstreet.com/rss/news', category: 'forex', type: 'forex' },
        { name: 'DailyFX', url: 'https://www.dailyfx.com/feeds/market-news', category: 'forex', type: 'forex' },
        { name: 'Investing.com', url: 'https://www.investing.com/rss/news.rss', category: 'forex', type: 'forex' },
        { name: 'ForexLive', url: 'https://www.forexlive.com/feed/news', category: 'forex', type: 'forex' },
        { name: 'Investing.live', url: 'https://investinglive.com/live-feed', category: 'forex', type: 'forex' },
        
        // Gold/Precious Metals
        { name: 'Kitco Gold', url: 'https://www.kitco.com/rss/KitcoNews.xml', category: 'gold', type: 'gold' },
        { name: 'Gold.org', url: 'https://www.gold.org/feed', category: 'gold', type: 'gold' },
        
        // Central Bank Feeds
        { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml', category: 'USD', type: 'centralbank', bank: 'FED' },
        { name: 'Bank of England', url: 'https://www.bankofengland.co.uk/rss/news', category: 'GBP', type: 'centralbank', bank: 'BoE' },
        { name: 'European Central Bank', url: 'https://www.ecb.europa.eu/rss/press.xml', category: 'EUR', type: 'centralbank', bank: 'ECB' },
        { name: 'Bank of Japan', url: 'https://www.boj.or.jp/en/rss/pressrelease.xml', category: 'JPY', type: 'centralbank', bank: 'BoJ' },
        { name: 'Bank of Canada', url: 'https://www.bankofcanada.ca/feeds/press_releases.xml', category: 'CAD', type: 'centralbank', bank: 'BoC' },
        { name: 'Swiss National Bank', url: 'https://www.snb.ch/en/mmr/rss/rss_feed', category: 'CHF', type: 'centralbank', bank: 'SNB' },
        { name: 'Reserve Bank of Australia', url: 'https://www.rba.gov.au/rss/rss.xml', category: 'AUD', type: 'centralbank', bank: 'RBA' },
        
        // Trump News Feeds
        { name: 'Reuters Trump', url: 'https://www.reuters.com/rss/donald-trump', category: 'trump', type: 'trump' },
        { name: 'AP News Politics', url: 'https://feeds.apnews.com/rss/apf-politics', category: 'trump', type: 'trump' },
        { name: 'BBC News US Politics', url: 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', category: 'trump', type: 'trump' }
    ],
    PROXY_URL: 'https://api.rss2json.com/v1/api.json?rss_url=',
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds for real-time updates
    NOTIFICATION_CHECK_INTERVAL: 15000, // Check for new articles every 15 seconds
    CURRENCIES: ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'],
    CURRENCY_FLAGS: {
        'EUR': '🇪🇺',
        'USD': '🇺🇸',
        'GBP': '🇬🇧',
        'JPY': '🇯🇵',
        'AUD': '🇦🇺',
        'CAD': '🇨🇦',
        'CHF': '🇨🇭'
    },
    CURRENCY_NAMES: {
        'EUR': 'Euro',
        'USD': 'US Dollar',
        'GBP': 'British Pound',
        'JPY': 'Japanese Yen',
        'AUD': 'Australian Dollar',
        'CAD': 'Canadian Dollar',
        'CHF': 'Swiss Franc'
    }
};

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
    pushSubscription: null
};

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
        
        detectedCurrencies.forEach(currency => {
            sentiment[currency] = null;
        });
        
        detectedCurrencies.forEach(currency => {
            const analysis = this.analyzeSingleCurrency(fullText, title, currency, centralBanks);
            if (analysis) {
                sentiment[currency] = analysis;
            }
        });
        
        this.applyPairCorrelations(fullText, sentiment, detectedCurrencies);
        
        Object.keys(sentiment).forEach(key => {
            if (sentiment[key] === null) {
                delete sentiment[key];
            }
        });
        
        return sentiment;
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
        
        const minScore = 0.5;
        if (bullishScore >= minScore && bullishScore > bearishScore) return 'Bullish';
        if (bearishScore >= minScore && bearishScore > bullishScore) return 'Bearish';
        
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
        
        const minScore = 0.5;
        if (bullishScore >= minScore && bullishScore > bearishScore) return 'Bullish';
        if (bearishScore >= minScore && bearishScore > bullishScore) return 'Bearish';
        
        return null;
    }
    
    static analyzeTrumpImpact(title, description) {
        const fullText = (title + ' ' + description).toLowerCase();
        let marketImpact = 'low';
        
        // High impact keywords related to Trump
        const highImpactKeywords = [
            'tariff', 'trade war', 'china deal', 'mexico wall', 'fed chair',
            'interest rate', 'tax', 'economic policy', 'trade agreement',
            'sanctions', 'immigration policy', 'executive order', 'military',
            'stock market', 'economy', 'unemployment', 'gdp'
        ];
        
        const mediumImpactKeywords = [
            'tweet', 'statement', 'press conference', 'rally', 'speech',
            'white house', 'policy', 'announcement', 'meeting'
        ];
        
        const hasHighImpact = highImpactKeywords.some(keyword => fullText.includes(keyword));
        const hasMediumImpact = mediumImpactKeywords.some(keyword => fullText.includes(keyword));
        
        if (hasHighImpact) marketImpact = 'high';
        else if (hasMediumImpact) marketImpact = 'medium';
        
        return marketImpact;
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

            console.log('AI Analysis disabled - using fallback');
            
            // Skip AI API call - throw to use fallback
            throw new Error('AI features disabled');
            
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
        
        // Use fallback overview (AI disabled)
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
    try {
        const response = await fetch(CONFIG.PROXY_URL + encodeURIComponent(feed.url));
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
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
        return [];
    } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error);
        return [];
    }
}

async function fetchAllNews() {
    const allArticles = [];
    const promises = CONFIG.RSS_FEEDS.map(feed => fetchRSSFeed(feed));
    const results = await Promise.all(promises);
    
    results.forEach(articles => {
        allArticles.push(...articles);
    });
    
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
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
    
    // Enhanced Correlation-Based Sentiment Analysis - ALWAYS SHOW
    let correlationSentimentHTML = '';
    const correlationAnalysis = [];
    
    // Check if we have currency sentiment data
    if (article.currencySentiment && Object.keys(article.currencySentiment).length > 0) {
        // If USD is bullish/bearish, show correlated pairs
        if (article.currencySentiment['USD']) {
            const usdSentiment = article.currencySentiment['USD'];
            if (usdSentiment === 'Bullish') {
                correlationAnalysis.push({
                    pair: 'DXY',
                    sentiment: 'Bullish',
                    reason: 'USD Strength'
                });
                correlationAnalysis.push({
                    pair: 'GOLD',
                    sentiment: 'Bearish',
                    reason: 'Strong USD (Negative Correlation)'
                });
                correlationAnalysis.push({
                    pair: 'EUR/USD',
                    sentiment: 'Bearish',
                    reason: 'USD Strength'
                });
                correlationAnalysis.push({
                    pair: 'GBP/USD',
                    sentiment: 'Bearish',
                    reason: 'USD Strength'
                });
                correlationAnalysis.push({
                    pair: 'USD/JPY',
                    sentiment: 'Bullish',
                    reason: 'USD Strength'
                });
            } else if (usdSentiment === 'Bearish') {
                correlationAnalysis.push({
                    pair: 'DXY',
                    sentiment: 'Bearish',
                    reason: 'USD Weakness'
                });
                correlationAnalysis.push({
                    pair: 'GOLD',
                    sentiment: 'Bullish',
                    reason: 'Weak USD (Negative Correlation)'
                });
                correlationAnalysis.push({
                    pair: 'EUR/USD',
                    sentiment: 'Bullish',
                    reason: 'USD Weakness'
                });
                correlationAnalysis.push({
                    pair: 'GBP/USD',
                    sentiment: 'Bullish',
                    reason: 'USD Weakness'
                });
                correlationAnalysis.push({
                    pair: 'USD/JPY',
                    sentiment: 'Bearish',
                    reason: 'USD Weakness'
                });
            }
        }
        
        // Add gold sentiment if available
        if (article.goldSentiment) {
            correlationAnalysis.push({
                pair: 'XAU/USD',
                sentiment: article.goldSentiment,
                reason: 'Direct Gold News'
            });
        }
        
        // Generate pairs sentiment based on currencies detected
        const pairs = [
            { pair: 'EUR/USD', base: 'EUR', quote: 'USD' },
            { pair: 'GBP/USD', base: 'GBP', quote: 'USD' },
            { pair: 'USD/JPY', base: 'USD', quote: 'JPY' },
            { pair: 'AUD/USD', base: 'AUD', quote: 'USD' },
            { pair: 'USD/CAD', base: 'USD', quote: 'CAD' },
            { pair: 'USD/CHF', base: 'USD', quote: 'CHF' },
            { pair: 'NZD/USD', base: 'NZD', quote: 'USD' }
        ];
        
        pairs.forEach(({pair, base, quote}) => {
            const baseSentiment = article.currencySentiment[base];
            const quoteSentiment = article.currencySentiment[quote];
            
            // Skip if already added by USD logic
            if (correlationAnalysis.some(item => item.pair === pair)) return;
            
            if (baseSentiment && quoteSentiment) {
                if (baseSentiment === 'Bullish' && quoteSentiment === 'Bearish') {
                    correlationAnalysis.push({
                        pair: pair,
                        sentiment: 'Bullish',
                        reason: `${base} Strong / ${quote} Weak`
                    });
                } else if (baseSentiment === 'Bearish' && quoteSentiment === 'Bullish') {
                    correlationAnalysis.push({
                        pair: pair,
                        sentiment: 'Bearish',
                        reason: `${base} Weak / ${quote} Strong`
                    });
                }
            } else if (baseSentiment && !quoteSentiment) {
                if (baseSentiment === 'Bullish') {
                    correlationAnalysis.push({
                        pair: pair,
                        sentiment: 'Bullish',
                        reason: `${base} Strength`
                    });
                } else if (baseSentiment === 'Bearish') {
                    correlationAnalysis.push({
                        pair: pair,
                        sentiment: 'Bearish',
                        reason: `${base} Weakness`
                    });
                }
            } else if (!baseSentiment && quoteSentiment) {
                if (quoteSentiment === 'Bullish') {
                    correlationAnalysis.push({
                        pair: pair,
                        sentiment: 'Bearish',
                        reason: `${quote} Strength`
                    });
                } else if (quoteSentiment === 'Bearish') {
                    correlationAnalysis.push({
                        pair: pair,
                        sentiment: 'Bullish',
                        reason: `${quote} Weakness`
                    });
                }
            }
        });
    } else {
        // INDIVIDUAL CURRENCY SENTIMENT ANALYSIS FOR EVERY ARTICLE
        const text = (article.title + ' ' + article.description).toLowerCase();
        const currencies = {};
        
        // Analyze USD
        if (text.includes('dollar') || text.includes('usd') || text.includes('greenback') || text.includes(' us ')) {
            if (text.includes('dollar strength') || text.includes('usd strengthens') || 
                text.includes('firmer greenback') || text.includes('broadly firmer') ||
                text.includes('stronger dollar') || text.includes('dollar gains') ||
                text.includes('dollar rallies') || text.includes('usd advances') ||
                text.includes('dollar rises') || text.includes('greenback strengthens')) {
                currencies['USD'] = 'Bullish';
            } else if (text.includes('dollar weakness') || text.includes('usd weakens') || 
                      text.includes('dollar struggles') || text.includes('weaker dollar') ||
                      text.includes('dollar falls') || text.includes('usd declines') ||
                      text.includes('dollar under pressure') || text.includes('lost ground') ||
                      text.includes('greenback weakens') || text.includes('dollar weighs')) {
                currencies['USD'] = 'Bearish';
            } else {
                currencies['USD'] = 'Neutral';
            }
        }
        
        // Analyze EUR
        if (text.includes('euro') || (text.includes('eur') && !text.includes('europe'))) {
            if (text.includes('euro strengthens') || text.includes('euro gains') || 
                text.includes('euro rallies') || text.includes('euro advances') ||
                text.includes('stronger euro') || text.includes('euro rises') ||
                text.includes('eur strength')) {
                currencies['EUR'] = 'Bullish';
            } else if (text.includes('euro weakens') || text.includes('euro falls') || 
                      text.includes('euro declines') || text.includes('weaker euro') ||
                      text.includes('euro struggles') || text.includes('euro drops') ||
                      text.includes('eur weakness')) {
                currencies['EUR'] = 'Bearish';
            } else {
                currencies['EUR'] = 'Neutral';
            }
        }
        
        // Analyze GBP
        if (text.includes('pound') || text.includes('gbp') || text.includes('sterling')) {
            if (text.includes('pound strengthens') || text.includes('sterling gains') || 
                text.includes('gbp rallies') || text.includes('pound advances') ||
                text.includes('stronger pound') || text.includes('sterling rises') ||
                text.includes('pound gains')) {
                currencies['GBP'] = 'Bullish';
            } else if (text.includes('pound weakens') || text.includes('sterling falls') || 
                      text.includes('gbp declines') || text.includes('weaker pound') ||
                      text.includes('pound struggles') || text.includes('sterling drops')) {
                currencies['GBP'] = 'Bearish';
            } else {
                currencies['GBP'] = 'Neutral';
            }
        }
        
        // Analyze JPY
        if (text.includes('yen') || text.includes('jpy') || text.includes('japanese')) {
            if (text.includes('yen strengthens') || text.includes('yen gains') || 
                text.includes('jpy rallies') || text.includes('yen advances') ||
                text.includes('stronger yen') || text.includes('yen rises') ||
                text.includes('safe haven demand')) {
                currencies['JPY'] = 'Bullish';
            } else if (text.includes('yen weakens') || text.includes('yen falls') || 
                      text.includes('jpy declines') || text.includes('weaker yen') ||
                      text.includes('yen struggles') || text.includes('yen drops')) {
                currencies['JPY'] = 'Bearish';
            } else {
                currencies['JPY'] = 'Neutral';
            }
        }
        
        // Analyze AUD
        if (text.includes('australian dollar') || text.includes('aud') || text.includes('aussie')) {
            if (text.includes('aud rebounds') || text.includes('aussie strengthens') || 
                text.includes('aud gains') || text.includes('australian dollar rallies') ||
                text.includes('aud advances') || text.includes('aussie rises') ||
                text.includes('australian dollar rises') || text.includes('trimming losses') ||
                text.includes('aud strength')) {
                currencies['AUD'] = 'Bullish';
            } else if (text.includes('aud weakens') || text.includes('aussie falls') || 
                      text.includes('aud declines') || text.includes('australian dollar drops') ||
                      text.includes('aud struggles') || text.includes('aud losses') ||
                      text.includes('aussie weakness')) {
                currencies['AUD'] = 'Bearish';
            } else {
                currencies['AUD'] = 'Neutral';
            }
        }
        
        // Analyze CAD
        if (text.includes('canadian dollar') || text.includes('cad') || text.includes('loonie')) {
            if (text.includes('cad strengthens') || text.includes('loonie gains') || 
                text.includes('cad rallies') || text.includes('canadian dollar advances') ||
                text.includes('cad strength')) {
                currencies['CAD'] = 'Bullish';
            } else if (text.includes('cad weakens') || text.includes('loonie falls') || 
                      text.includes('cad declines') || text.includes('canadian dollar drops') ||
                      text.includes('cad weakness')) {
                currencies['CAD'] = 'Bearish';
            } else {
                currencies['CAD'] = 'Neutral';
            }
        }
        
        // Analyze CHF
        if (text.includes('swiss franc') || text.includes('chf') || text.includes('swissy')) {
            if (text.includes('chf strengthens') || text.includes('franc gains') || 
                text.includes('swiss franc rallies') || text.includes('chf strength')) {
                currencies['CHF'] = 'Bullish';
            } else if (text.includes('chf weakens') || text.includes('franc falls') || 
                      text.includes('swiss franc declines') || text.includes('chf weakness')) {
                currencies['CHF'] = 'Bearish';
            } else {
                currencies['CHF'] = 'Neutral';
            }
        }
        
        // Analyze NZD
        if (text.includes('new zealand dollar') || text.includes('nzd') || text.includes('kiwi')) {
            if (text.includes('nzd strengthens') || text.includes('kiwi gains') || 
                text.includes('nzd rallies') || text.includes('nzd strength')) {
                currencies['NZD'] = 'Bullish';
            } else if (text.includes('nzd weakens') || text.includes('kiwi falls') || 
                      text.includes('nzd declines') || text.includes('nzd weakness')) {
                currencies['NZD'] = 'Bearish';
            } else {
                currencies['NZD'] = 'Neutral';
            }
        }
        
        // Generate display - show each currency individually
        Object.entries(currencies).forEach(([currency, sentiment]) => {
            correlationAnalysis.push({
                pair: currency,
                sentiment: sentiment,
                reason: `${currency} ${sentiment}`
            });
        });
    }
    
    // Generate HTML if we have any analysis
    if (correlationAnalysis.length > 0) {
        correlationSentimentHTML = `
            <div class="correlation-sentiment-section">
                <div class="sentiment-header">📊 Market Impact Analysis</div>
                <div class="sentiment-grid">
                    ${correlationAnalysis.map(item => `
                        <div class="sentiment-item ${item.sentiment.toLowerCase()}">
                            <div class="sentiment-pair">${item.pair}</div>
                            <div class="sentiment-direction ${item.sentiment.toLowerCase()}">
                                ${item.sentiment === 'Bullish' ? '📈' : '📉'} ${item.sentiment}
                            </div>
                            <div class="sentiment-reason">${item.reason}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
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
        ${correlationSentimentHTML}
        <div class="news-tags">${tagsHTML}</div>
        <div class="news-card-actions">
            <a href="${article.url}" target="_blank" class="read-more">Read Full Article</a>
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
function initEconomicCalendar() {
    const container = document.getElementById('calendarContainer');
    
    // TradingView Economic Calendar Widget
    container.innerHTML = `
        <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
            <div class="tradingview-widget-container__widget" style="height: calc(100% - 32px); width: 100%;"></div>
        </div>
    `;
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        "colorTheme": "dark",
        "isTransparent": false,
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "importanceFilter": "0,1"
    });
    
    const widgetContainer = container.querySelector('.tradingview-widget-container__widget');
    widgetContainer.appendChild(script);
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
async function toggleNotifications() {
    if (!state.notificationsEnabled) {
        const granted = await NotificationManager.requestPermission();
        if (granted) {
            state.notificationsEnabled = true;
            document.getElementById('notifBadge').textContent = 'ON';
            document.getElementById('notifBadge').classList.add('active');
            showToast('Push Notifications Enabled', 'You will receive real-time alerts for market updates');
        } else {
            showToast('Permission Denied', 'Please enable notifications in browser settings');
        }
    } else {
        state.notificationsEnabled = false;
        document.getElementById('notifBadge').textContent = 'OFF';
        document.getElementById('notifBadge').classList.remove('active');
        showToast('Push Notifications Disabled', 'Alerts turned off');
    }
}

function toggleMRKTAlerts() {
    state.mrktAlertsEnabled = !state.mrktAlertsEnabled;
    const badge = document.getElementById('mrktBadge');
    
    if (state.mrktAlertsEnabled) {
        badge.textContent = 'ON';
        badge.classList.add('active');
        showToast('MRKT Alerts Enabled', 'Showing only high-impact news');
    } else {
        badge.textContent = 'OFF';
        badge.classList.remove('active');
        showToast('MRKT Alerts Disabled', 'Showing all news');
    }
    
    renderNews();
}

// ===== Modal Functions =====
function showCalendar() {
    document.getElementById('calendarModal').classList.add('active');
    initEconomicCalendar();
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

// ===== Correlations Modal =====
function showCorrelations() {
    const modal = document.getElementById('correlationsModal');
    const container = document.getElementById('correlationsContainer');
    
    if (!modal || !container) return;
    
    // Populate correlations content
    container.innerHTML = `
        <!-- Correlation Cards Grid -->
        <div class="correlation-cards-grid">
            <!-- Gold Card -->
            <div class="correlation-card negative-corr">
                <div class="card-header">
                    <h3>🥇 GOLD (XAU/USD)</h3>
                    <span class="correlation-badge negative">Strong Negative</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bearish">Gold Bearish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bullish">Gold Bullish</span>
                        </div>
                    </div>
                    <p class="reason"><strong>Reason:</strong> Gold is priced in USD. Strong dollar reduces demand globally.</p>
                    <p class="exception"><strong>⚠ Exception:</strong> Crisis risk → Gold can rise even if DXY rises.</p>
                </div>
            </div>

            <!-- EUR/USD Card -->
            <div class="correlation-card negative-corr">
                <div class="card-header">
                    <h3>💶 EUR/USD</h3>
                    <span class="correlation-badge negative">Strong Negative</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bearish">EUR/USD Bearish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bullish">EUR/USD Bullish</span>
                        </div>
                    </div>
                    <p class="reason"><strong>Reason:</strong> EUR = ~57% of DXY weight. This is almost mechanical.</p>
                </div>
            </div>

            <!-- GBP/USD Card -->
            <div class="correlation-card negative-corr">
                <div class="card-header">
                    <h3>💷 GBP/USD</h3>
                    <span class="correlation-badge negative">Strong Negative</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bearish">GBP/USD Bearish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bullish">GBP/USD Bullish</span>
                        </div>
                    </div>
                    <p class="reason">Slightly weaker than EUR but structurally inverse.</p>
                </div>
            </div>

            <!-- AUD/USD Card -->
            <div class="correlation-card negative-corr risk-sensitive">
                <div class="card-header">
                    <h3>🇦🇺 AUD/USD</h3>
                    <span class="correlation-badge negative">Negative (Risk Sensitive)</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bearish">AUD/USD Bearish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bullish">AUD/USD Bullish</span>
                        </div>
                    </div>
                    <p class="reason"><strong>BUT:</strong> AUD also depends on: China growth, Risk sentiment, Commodities</p>
                </div>
            </div>

            <!-- NZD/USD Card -->
            <div class="correlation-card negative-corr">
                <div class="card-header">
                    <h3>🇳🇿 NZD/USD</h3>
                    <span class="correlation-badge negative">Negative</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bearish">NZD/USD Bearish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bullish">NZD/USD Bullish</span>
                        </div>
                    </div>
                    <p class="reason">Similar behavior to AUD but more volatile.</p>
                </div>
            </div>

            <!-- USD/JPY Card -->
            <div class="correlation-card positive-corr">
                <div class="card-header">
                    <h3>🇯🇵 USD/JPY</h3>
                    <span class="correlation-badge positive">Positive</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bullish">USD/JPY Bullish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bearish">USD/JPY Bearish</span>
                        </div>
                    </div>
                    <p class="reason"><strong>Reason:</strong> USD is base currency.</p>
                    <p class="exception"><strong>⚠ Exception:</strong> During risk-off, JPY strengthens regardless of DXY.</p>
                </div>
            </div>

            <!-- USD/CAD Card -->
            <div class="correlation-card positive-corr">
                <div class="card-header">
                    <h3>🇨🇦 USD/CAD</h3>
                    <span class="correlation-badge positive">Positive</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bullish">USD/CAD Bullish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bearish">USD/CAD Bearish</span>
                        </div>
                    </div>
                    <p class="reason"><strong>BUT:</strong> Oil matters heavily. If oil rallies hard → CAD strengthens → USD/CAD falls even if DXY slightly bullish.</p>
                </div>
            </div>

            <!-- USD/CHF Card -->
            <div class="correlation-card positive-corr">
                <div class="card-header">
                    <h3>🇨🇭 USD/CHF</h3>
                    <span class="correlation-badge positive">Positive</span>
                </div>
                <div class="card-body">
                    <div class="correlation-scenarios">
                        <div class="scenario">
                            <span class="scenario-label bullish">DXY Bullish →</span>
                            <span class="scenario-result bullish">USD/CHF Bullish</span>
                        </div>
                        <div class="scenario">
                            <span class="scenario-label bearish">DXY Bearish →</span>
                            <span class="scenario-result bearish">USD/CHF Bearish</span>
                        </div>
                    </div>
                    <p class="reason">CHF behaves like JPY during fear events.</p>
                </div>
            </div>
        </div>

        <!-- Summary Table -->
        <div class="summary-section">
            <h2>📊 Structured Summary Table</h2>
            <div class="table-wrapper">
                <table class="correlation-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Correlation vs DXY</th>
                            <th>Reaction if DXY Bullish</th>
                            <th>Reaction if DXY Bearish</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Gold (XAU/USD)</td><td><span class="badge negative">Strong Negative</span></td><td><span class="badge bearish">Bearish</span></td><td><span class="badge bullish">Bullish</span></td></tr>
                        <tr><td>EUR/USD</td><td><span class="badge negative">Strong Negative</span></td><td><span class="badge bearish">Bearish</span></td><td><span class="badge bullish">Bullish</span></td></tr>
                        <tr><td>GBP/USD</td><td><span class="badge negative">Strong Negative</span></td><td><span class="badge bearish">Bearish</span></td><td><span class="badge bullish">Bullish</span></td></tr>
                        <tr><td>AUD/USD</td><td><span class="badge negative">Negative</span></td><td><span class="badge bearish">Bearish</span></td><td><span class="badge bullish">Bullish</span></td></tr>
                        <tr><td>NZD/USD</td><td><span class="badge negative">Negative</span></td><td><span class="badge bearish">Bearish</span></td><td><span class="badge bullish">Bullish</span></td></tr>
                        <tr><td>USD/JPY</td><td><span class="badge positive">Positive</span></td><td><span class="badge bullish">Bullish</span></td><td><span class="badge bearish">Bearish</span></td></tr>
                        <tr><td>USD/CAD</td><td><span class="badge positive">Positive</span></td><td><span class="badge bullish">Bullish</span></td><td><span class="badge bearish">Bearish</span></td></tr>
                        <tr><td>USD/CHF</td><td><span class="badge positive">Positive</span></td><td><span class="badge bullish">Bullish</span></td><td><span class="badge bearish">Bearish</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Rankings and Warning -->
        <div class="bottom-section">
            <div class="rankings-box">
                <h3>⚠ Correlation Strength Ranking</h3>
                <div class="ranking-list">
                    <h4>Strongest Inverse:</h4>
                    <ol>
                        <li>EUR/USD</li>
                        <li>Gold</li>
                        <li>GBP/USD</li>
                        <li>AUD/USD</li>
                        <li>NZD/USD</li>
                    </ol>
                    <h4>Strongest Positive:</h4>
                    <ol>
                        <li>USD/JPY</li>
                        <li>USD/CHF</li>
                        <li>USD/CAD</li>
                    </ol>
                </div>
            </div>

            <div class="warning-box">
                <h3>🧠 What Most Traders Get Wrong</h3>
                <p><strong>Correlation ≠ causation.</strong></p>
                <p>DXY doesn't "cause" moves. Macro expectations (rates, inflation, growth) drive both. DXY is just a reflection.</p>
                <p>If you blindly trade "DXY down → buy gold" without:</p>
                <ul>
                    <li>Yield context</li>
                    <li>News context</li>
                    <li>Session liquidity</li>
                </ul>
                <p class="warning-text">You will lose money.</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeCorrelations() {
    const modal = document.getElementById('correlationsModal');
    if (modal) modal.classList.remove('active');
}

// ===== Psychology Modal =====
function showPsychology() {
    const modal = document.getElementById('psychologyModal');
    const container = document.getElementById('psychologyContainer');
    
    if (!modal || !container) return;
    
    const quotes = [
        { quote: "The goal of a successful trader is to make the best trades. Money is secondary.", author: "Alexander Elder", category: "Risk Management" },
        { quote: "The market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett", category: "Patience" },
        { quote: "Risk comes from not knowing what you're doing.", author: "Warren Buffett", category: "Risk Management" },
        { quote: "The elements of good trading are: (1) cutting losses, (2) cutting losses, and (3) cutting losses. If you can follow these three rules, you may have a chance.", author: "Ed Seykota", category: "Loss Management" },
        { quote: "In trading, the impossible happens about twice a year.", author: "Henri M. Simoes", category: "Market Behavior" },
        { quote: "The trend is your friend until the end when it bends.", author: "Ed Seykota", category: "Trend Following" },
        { quote: "Markets can remain irrational longer than you can remain solvent.", author: "John Maynard Keynes", category: "Market Psychology" },
        { quote: "The four most dangerous words in investing are: 'This time it's different.'", author: "Sir John Templeton", category: "Market Cycles" },
        { quote: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.", author: "George Soros", category: "Risk/Reward" },
        { quote: "Lose your opinion – not your money.", author: "Larry Hite", category: "Flexibility" },
        { quote: "The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading.", author: "Victor Sperandeo", category: "Discipline" },
        { quote: "Never risk more than 1% of total equity on any one trade. By only risking 1%, I am indifferent to any individual trade.", author: "Larry Hite", category: "Position Sizing" },
        { quote: "I always define my risk, and I don't have to worry about it.", author: "Tony Saliba", category: "Risk Management" },
        { quote: "The best trades are the ones in which you have all three things going for you: fundamentals, technicals, and market tone.", author: "Michael Marcus", category: "Trade Setup" },
        { quote: "Trading is not about being right. It's about making money.", author: "Mark Douglas", category: "Mindset" },
        { quote: "You can't control the market. You can only control your reaction to it.", author: "Mark Douglas", category: "Control" },
        { quote: "The hard part is discipline, patience and judgment.", author: "Seth Klarman", category: "Discipline" },
        { quote: "Good traders manage risk. Great traders manage emotions.", author: "Anonymous", category: "Emotions" },
        { quote: "Risk management is the most important thing to be well understood.", author: "Ray Dalio", category: "Risk Management" },
        { quote: "The market does not know you exist. You can do nothing to influence it. You can only control your behavior.", author: "Alexander Elder", category: "Market Nature" },
        { quote: "Plan your trade and trade your plan.", author: "Jesse Livermore", category: "Planning" },
        { quote: "The most important rule of trading is to play great defense, not great offense.", author: "Paul Tudor Jones", category: "Defense" },
        { quote: "Don't focus on making money; focus on protecting what you have.", author: "Paul Tudor Jones", category: "Preservation" },
        { quote: "Every trader has strengths and weakness. Some are good holders of winners, but may hold their losers a little too long. Others may cut their winners a little short, but are quick to take their losses. As long as you stick to your own style, you get the good and bad in your own approach.", author: "Michael Marcus", category: "Trading Style" },
        { quote: "There is a time to go long, a time to go short and a time to go fishing.", author: "Jesse Livermore", category: "Patience" }
    ];
    
    container.innerHTML = `
        <div class="psychology-grid">
            ${quotes.map(q => `
                <div class="quote-card">
                    <div class="quote-text">"${q.quote}"</div>
                    <div class="quote-author">— ${q.author}</div>
                    <div class="quote-category">${q.category}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.add('active');
}

function closePsychology() {
    const modal = document.getElementById('psychologyModal');
    if (modal) modal.classList.remove('active');
}

// ===== Market Hours Modal =====
function showMarketHours() {
    const modal = document.getElementById('marketHoursModal');
    const container = document.getElementById('marketHoursContainer');
    
    if (!modal || !container) return;
    
    // Get current time
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const currentTime = utcHours + utcMinutes / 60;
    
    // Define market sessions (in UTC)
    const markets = [
        {
            name: 'Sydney',
            flag: '🇦🇺',
            open: 22, // 10 PM UTC
            close: 7,  // 7 AM UTC (next day)
            timezone: 'AEDT (UTC+11)'
        },
        {
            name: 'Tokyo',
            flag: '🇯🇵',
            open: 0, // 12 AM UTC
            close: 9, // 9 AM UTC
            timezone: 'JST (UTC+9)'
        },
        {
            name: 'London',
            flag: '🇬🇧',
            open: 8, // 8 AM UTC
            close: 16.5, // 4:30 PM UTC
            timezone: 'GMT (UTC+0)'
        },
        {
            name: 'New York',
            flag: '🇺🇸',
            open: 13, // 1 PM UTC
            close: 22, // 10 PM UTC
            timezone: 'EST (UTC-5)'
        }
    ];
    
    // Check if market is open
    function isMarketOpen(market) {
        if (market.close > market.open) {
            // Normal case: open and close on same day
            return currentTime >= market.open && currentTime < market.close;
        } else {
            // Crosses midnight
            return currentTime >= market.open || currentTime < market.close;
        }
    }
    
    // Get time until open/close
    function getTimeStatus(market) {
        const isOpen = isMarketOpen(market);
        
        if (isOpen) {
            let hoursUntilClose;
            if (market.close > market.open) {
                hoursUntilClose = market.close - currentTime;
            } else {
                if (currentTime >= market.open) {
                    hoursUntilClose = (24 - currentTime) + market.close;
                } else {
                    hoursUntilClose = market.close - currentTime;
                }
            }
            
            const hours = Math.floor(hoursUntilClose);
            const minutes = Math.floor((hoursUntilClose - hours) * 60);
            return {
                isOpen: true,
                status: 'OPEN',
                time: `Closes in ${hours}h ${minutes}m`
            };
        } else {
            let hoursUntilOpen;
            if (currentTime < market.open) {
                hoursUntilOpen = market.open - currentTime;
            } else {
                hoursUntilOpen = (24 - currentTime) + market.open;
            }
            
            const hours = Math.floor(hoursUntilOpen);
            const minutes = Math.floor((hoursUntilOpen - hours) * 60);
            return {
                isOpen: false,
                status: 'CLOSED',
                time: `Opens in ${hours}h ${minutes}m`
            };
        }
    }
    
    // Get current time display
    const localTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const utcTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    });
    
    // Helper function to format hours
    function formatHour(hour) {
        const h = Math.floor(hour);
        const m = Math.floor((hour - h) * 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    
    container.innerHTML = `
        <div class="current-time-display">
            <div class="time-card">
                <div class="time-label">Your Local Time</div>
                <div class="time-value">${localTime}</div>
            </div>
            <div class="time-card">
                <div class="time-label">UTC Time</div>
                <div class="time-value">${utcTime}</div>
            </div>
        </div>
        
        <div class="markets-grid">
            ${markets.map(market => {
                const status = getTimeStatus(market);
                return `
                    <div class="market-card ${status.isOpen ? 'open' : 'closed'}">
                        <div class="market-header">
                            <div class="market-title">
                                <span class="market-flag">${market.flag}</span>
                                <h3>${market.name}</h3>
                            </div>
                            <span class="market-status ${status.isOpen ? 'open' : 'closed'}">${status.status}</span>
                        </div>
                        <div class="market-body">
                            <div class="market-info">
                                <span class="info-label">Timezone:</span>
                                <span class="info-value">${market.timezone}</span>
                            </div>
                            <div class="market-info">
                                <span class="info-label">Trading Hours:</span>
                                <span class="info-value">${formatHour(market.open)} - ${formatHour(market.close)} UTC</span>
                            </div>
                            <div class="market-countdown">
                                ${status.time}
                            </div>
                        </div>
                        <div class="market-progress">
                            <div class="progress-bar ${status.isOpen ? 'active' : ''}"></div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="market-hours-info">
            <h3>💡 Trading Session Overview</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Sydney Session (22:00-07:00 UTC)</strong>
                    <p>Starts the trading week. Lower volatility, good for AUD and NZD pairs.</p>
                </div>
                <div class="info-item">
                    <strong>Tokyo Session (00:00-09:00 UTC)</strong>
                    <p>Asian market hours. Focus on JPY pairs. Moderate volatility.</p>
                </div>
                <div class="info-item">
                    <strong>London Session (08:00-16:30 UTC)</strong>
                    <p>Highest volume. Major EUR and GBP movements. Overlaps with NY for high volatility.</p>
                </div>
                <div class="info-item">
                    <strong>New York Session (13:00-22:00 UTC)</strong>
                    <p>USD pairs most active. Major news releases. Overlap with London creates peak liquidity.</p>
                </div>
            </div>
            <div class="peak-hours">
                <strong>🔥 Peak Trading Hours:</strong> London/NY Overlap (13:00-16:30 UTC) - Highest liquidity and volatility
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Update every minute
    if (window.marketHoursInterval) clearInterval(window.marketHoursInterval);
    window.marketHoursInterval = setInterval(() => {
        if (modal.classList.contains('active')) {
            showMarketHours();
        }
    }, 60000);
}

function closeMarketHours() {
    const modal = document.getElementById('marketHoursModal');
    if (modal) modal.classList.remove('active');
    if (window.marketHoursInterval) {
        clearInterval(window.marketHoursInterval);
        window.marketHoursInterval = null;
    }
}

// ===== Candlestick Patterns Modal =====
function showCandlestickPatterns() {
    const modal = document.getElementById('patternsModal');
    const container = document.getElementById('patternsContainer');
    
    if (!modal || !container) return;
    
    const patterns = {
        single: [
            {
                name: 'Hammer',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="5" x2="20" y2="20" stroke="#00ff88" stroke-width="2"/><rect x="14" y="20" width="12" height="15" fill="#00ff88" rx="1"/><line x1="20" y1="35" x2="20" y2="75" stroke="#00ff88" stroke-width="2"/></svg>',
                description: 'Small body at top, long lower wick. Found at bottom of downtrend. Signals reversal.'
            },
            {
                name: 'Inverted Hammer',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="5" x2="20" y2="45" stroke="#00ff88" stroke-width="2"/><rect x="14" y="45" width="12" height="15" fill="#00ff88" rx="1"/><line x1="20" y1="60" x2="20" y2="70" stroke="#00ff88" stroke-width="2"/></svg>',
                description: 'Small body at bottom, long upper wick. Found at bottom of downtrend.'
            },
            {
                name: 'Bullish Spinning Top',
                type: 'Neutral',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="10" x2="20" y2="30" stroke="#00ff88" stroke-width="2"/><rect x="15" y="30" width="10" height="10" fill="#00ff88" rx="1"/><line x1="20" y1="40" x2="20" y2="70" stroke="#00ff88" stroke-width="2"/></svg>',
                description: 'Small body with equal wicks. Indicates indecision in the market.'
            },
            {
                name: 'Bullish Marubozu',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><rect x="12" y="15" width="16" height="50" fill="#00ff88" rx="1"/></svg>',
                description: 'Large body, no wicks. Strong bullish momentum, buyers in control.'
            },
            {
                name: 'Doji',
                type: 'Neutral',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="10" x2="20" y2="35" stroke="#ffffff" stroke-width="2"/><rect x="18" y="35" width="4" height="4" fill="#ffffff"/><line x1="20" y1="39" x2="20" y2="70" stroke="#ffffff" stroke-width="2"/></svg>',
                description: 'Open equals close. Market indecision, potential reversal signal.'
            },
            {
                name: 'Shooting Star',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="5" x2="20" y2="45" stroke="#ff4d6a" stroke-width="2"/><rect x="14" y="45" width="12" height="15" fill="#ff4d6a" rx="1"/><line x1="20" y1="60" x2="20" y2="70" stroke="#ff4d6a" stroke-width="2"/></svg>',
                description: 'Small body at bottom, long upper wick. Found at top of uptrend.'
            },
            {
                name: 'Hanging Man',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="5" x2="20" y2="20" stroke="#ff4d6a" stroke-width="2"/><rect x="14" y="20" width="12" height="15" fill="#ff4d6a" rx="1"/><line x1="20" y1="35" x2="20" y2="75" stroke="#ff4d6a" stroke-width="2"/></svg>',
                description: 'Small body at top, long lower wick. Found at top of uptrend. Signals reversal.'
            },
            {
                name: 'Bearish Spinning Top',
                type: 'Neutral',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><line x1="20" y1="10" x2="20" y2="30" stroke="#ff4d6a" stroke-width="2"/><rect x="15" y="30" width="10" height="10" fill="#ff4d6a" rx="1"/><line x1="20" y1="40" x2="20" y2="70" stroke="#ff4d6a" stroke-width="2"/></svg>',
                description: 'Small body with equal wicks. Indicates indecision in the market.'
            },
            {
                name: 'Bearish Marubozu',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 40 80" class="candle-svg"><rect x="12" y="15" width="16" height="50" fill="#ff4d6a" rx="1"/></svg>',
                description: 'Large body, no wicks. Strong bearish momentum, sellers in control.'
            }
        ],
        double: [
            {
                name: 'Bullish Engulfing',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><rect x="15" y="25" width="10" height="30" fill="#ff4d6a" rx="1"/><rect x="40" y="15" width="16" height="50" fill="#00ff88" rx="1"/></svg>',
                description: 'Small red candle followed by larger green candle that engulfs it. Strong reversal.'
            },
            {
                name: 'Bullish Harami',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><rect x="12" y="15" width="16" height="50" fill="#ff4d6a" rx="1"/><rect x="42" y="30" width="10" height="20" fill="#00ff88" rx="1"/></svg>',
                description: 'Large red candle followed by small green candle inside its body.'
            },
            {
                name: 'Piercing Line',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><rect x="15" y="15" width="12" height="40" fill="#ff4d6a" rx="1"/><line x1="46" y1="55" x2="46" y2="65" stroke="#00ff88" stroke-width="2"/><rect x="40" y="30" width="12" height="25" fill="#00ff88" rx="1"/></svg>',
                description: 'Red candle followed by green that opens lower but closes above midpoint.'
            },
            {
                name: 'Tweezer Bottom',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><line x1="20" y1="15" x2="20" y2="30" stroke="#ff4d6a" stroke-width="2"/><rect x="14" y="30" width="12" height="25" fill="#ff4d6a" rx="1"/><line x1="20" y1="55" x2="20" y2="65" stroke="#ff4d6a" stroke-width="2"/><line x1="46" y1="15" x2="46" y2="30" stroke="#00ff88" stroke-width="2"/><rect x="40" y="30" width="12" height="25" fill="#00ff88" rx="1"/><line x1="46" y1="55" x2="46" y2="65" stroke="#00ff88" stroke-width="2"/></svg>',
                description: 'Two candles with matching lows. Strong support level confirmed.'
            },
            {
                name: 'Bearish Engulfing',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><rect x="15" y="25" width="10" height="30" fill="#00ff88" rx="1"/><rect x="40" y="15" width="16" height="50" fill="#ff4d6a" rx="1"/></svg>',
                description: 'Small green candle followed by larger red candle that engulfs it.'
            },
            {
                name: 'Bearish Harami',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><rect x="12" y="15" width="16" height="50" fill="#00ff88" rx="1"/><rect x="42" y="30" width="10" height="20" fill="#ff4d6a" rx="1"/></svg>',
                description: 'Large green candle followed by small red candle inside its body.'
            },
            {
                name: 'Dark Cloud Cover',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><line x1="20" y1="45" x2="20" y2="55" stroke="#00ff88" stroke-width="2"/><rect x="14" y="25" width="12" height="20" fill="#00ff88" rx="1"/><rect x="40" y="15" width="12" height="40" fill="#ff4d6a" rx="1"/><line x1="46" y1="55" x2="46" y2="65" stroke="#ff4d6a" stroke-width="2"/></svg>',
                description: 'Green candle followed by red that opens higher but closes below midpoint.'
            },
            {
                name: 'Tweezer Top',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 80 80" class="candle-svg"><line x1="20" y1="15" x2="20" y2="25" stroke="#00ff88" stroke-width="2"/><rect x="14" y="25" width="12" height="25" fill="#00ff88" rx="1"/><line x1="20" y1="50" x2="20" y2="65" stroke="#00ff88" stroke-width="2"/><line x1="46" y1="15" x2="46" y2="25" stroke="#ff4d6a" stroke-width="2"/><rect x="40" y="25" width="12" height="25" fill="#ff4d6a" rx="1"/><line x1="46" y1="50" x2="46" y2="65" stroke="#ff4d6a" stroke-width="2"/></svg>',
                description: 'Two candles with matching highs. Strong resistance level confirmed.'
            }
        ],
        triple: [
            {
                name: 'Morning Star',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 120 80" class="candle-svg"><rect x="8" y="15" width="14" height="45" fill="#ff4d6a" rx="1"/><line x1="46" y1="35" x2="46" y2="45" stroke="#ffffff" stroke-width="2"/><rect x="44" y="45" width="4" height="4" fill="#ffffff"/><line x1="46" y1="49" x2="46" y2="60" stroke="#ffffff" stroke-width="2"/><rect x="72" y="20" width="14" height="45" fill="#00ff88" rx="1"/></svg>',
                description: 'Long red, small doji, long green. Strong bullish reversal at bottom.'
            },
            {
                name: 'Three White Soldiers',
                type: 'Bullish',
                svg: '<svg viewBox="0 0 120 80" class="candle-svg"><rect x="8" y="35" width="12" height="35" fill="#00ff88" rx="1"/><rect x="42" y="25" width="12" height="35" fill="#00ff88" rx="1"/><rect x="76" y="15" width="12" height="35" fill="#00ff88" rx="1"/></svg>',
                description: 'Three consecutive green candles with higher closes. Strong uptrend.'
            },
            {
                name: 'Evening Star',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 120 80" class="candle-svg"><rect x="8" y="20" width="14" height="45" fill="#00ff88" rx="1"/><line x1="46" y1="30" x2="46" y2="40" stroke="#ffffff" stroke-width="2"/><rect x="44" y="40" width="4" height="4" fill="#ffffff"/><line x1="46" y1="44" x2="46" y2="55" stroke="#ffffff" stroke-width="2"/><rect x="72" y="25" width="14" height="45" fill="#ff4d6a" rx="1"/></svg>',
                description: 'Long green, small doji, long red. Strong bearish reversal at top.'
            },
            {
                name: 'Three Black Crows',
                type: 'Bearish',
                svg: '<svg viewBox="0 0 120 80" class="candle-svg"><rect x="8" y="15" width="12" height="35" fill="#ff4d6a" rx="1"/><rect x="42" y="25" width="12" height="35" fill="#ff4d6a" rx="1"/><rect x="76" y="35" width="12" height="35" fill="#ff4d6a" rx="1"/></svg>',
                description: 'Three consecutive red candles with lower closes. Strong downtrend.'
            }
        ]
    };
    
    container.innerHTML = `
        <!-- Candlestick Anatomy -->
        <div class="pattern-section">
            <h3 class="pattern-section-title">📖 Candlestick Anatomy</h3>
            <div class="anatomy-grid">
                <div class="anatomy-card bullish">
                    <h4>Bullish Candle (Green)</h4>
                    <svg viewBox="0 0 80 120" class="anatomy-svg">
                        <!-- Upper Wick -->
                        <line x1="40" y1="10" x2="40" y2="30" stroke="#00ff88" stroke-width="3"/>
                        <text x="50" y="20" fill="#00ff88" font-size="10">Upper Wick</text>
                        
                        <!-- Body -->
                        <rect x="25" y="30" width="30" height="50" fill="#00ff88" rx="2"/>
                        <text x="60" y="40" fill="#00ff88" font-size="10">Close</text>
                        <text x="60" y="55" fill="#00ff88" font-size="10">Real</text>
                        <text x="60" y="65" fill="#00ff88" font-size="10">Body</text>
                        <text x="60" y="75" fill="#00ff88" font-size="10">Open</text>
                        
                        <!-- Lower Wick -->
                        <line x1="40" y1="80" x2="40" y2="110" stroke="#00ff88" stroke-width="3"/>
                        <text x="50" y="100" fill="#00ff88" font-size="10">Lower Wick</text>
                        
                        <!-- High/Low markers -->
                        <text x="5" y="15" fill="#00ff88" font-size="12" font-weight="bold">High</text>
                        <text x="5" y="115" fill="#00ff88" font-size="12" font-weight="bold">Low</text>
                    </svg>
                    <p class="anatomy-desc">Price opened at bottom, closed at top. Buyers in control.</p>
                </div>
                <div class="anatomy-card bearish">
                    <h4>Bearish Candle (Red)</h4>
                    <svg viewBox="0 0 80 120" class="anatomy-svg">
                        <!-- Upper Wick -->
                        <line x1="40" y1="10" x2="40" y2="30" stroke="#ff4d6a" stroke-width="3"/>
                        <text x="50" y="20" fill="#ff4d6a" font-size="10">Upper Wick</text>
                        
                        <!-- Body -->
                        <rect x="25" y="30" width="30" height="50" fill="#ff4d6a" rx="2"/>
                        <text x="60" y="40" fill="#ff4d6a" font-size="10">Open</text>
                        <text x="60" y="55" fill="#ff4d6a" font-size="10">Real</text>
                        <text x="60" y="65" fill="#ff4d6a" font-size="10">Body</text>
                        <text x="60" y="75" fill="#ff4d6a" font-size="10">Close</text>
                        
                        <!-- Lower Wick -->
                        <line x1="40" y1="80" x2="40" y2="110" stroke="#ff4d6a" stroke-width="3"/>
                        <text x="50" y="100" fill="#ff4d6a" font-size="10">Lower Wick</text>
                        
                        <!-- High/Low markers -->
                        <text x="5" y="15" fill="#ff4d6a" font-size="12" font-weight="bold">High</text>
                        <text x="5" y="115" fill="#ff4d6a" font-size="12" font-weight="bold">Low</text>
                    </svg>
                    <p class="anatomy-desc">Price opened at top, closed at bottom. Sellers in control.</p>
                </div>
            </div>
        </div>
        
        <!-- Single Candlestick Patterns -->
        <div class="pattern-section">
            <h3 class="pattern-section-title">📍 Single Candlestick Patterns</h3>
            <div class="patterns-grid">
                ${patterns.single.map(p => `
                    <div class="pattern-card ${p.type.toLowerCase()}">
                        <div class="pattern-visual">${p.svg}</div>
                        <div class="pattern-info">
                            <h4 class="pattern-name">${p.name}</h4>
                            <span class="pattern-badge ${p.type.toLowerCase()}">${p.type}</span>
                            <p class="pattern-desc">${p.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Double Candlestick Patterns -->
        <div class="pattern-section">
            <h3 class="pattern-section-title">📊 Double Candlestick Patterns</h3>
            <div class="patterns-grid">
                ${patterns.double.map(p => `
                    <div class="pattern-card ${p.type.toLowerCase()}">
                        <div class="pattern-visual">${p.svg}</div>
                        <div class="pattern-info">
                            <h4 class="pattern-name">${p.name}</h4>
                            <span class="pattern-badge ${p.type.toLowerCase()}">${p.type}</span>
                            <p class="pattern-desc">${p.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Triple Candlestick Patterns -->
        <div class="pattern-section">
            <h3 class="pattern-section-title">📈 Triple Candlestick Patterns</h3>
            <div class="patterns-grid">
                ${patterns.triple.map(p => `
                    <div class="pattern-card ${p.type.toLowerCase()}">
                        <div class="pattern-visual">${p.svg}</div>
                        <div class="pattern-info">
                            <h4 class="pattern-name">${p.name}</h4>
                            <span class="pattern-badge ${p.type.toLowerCase()}">${p.type}</span>
                            <p class="pattern-desc">${p.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Quick Reference -->
        <div class="pattern-section">
            <h3 class="pattern-section-title">⚡ Quick Reference Guide</h3>
            <div class="reference-grid">
                <div class="reference-card bullish-ref">
                    <h4>🟢 Bullish Patterns</h4>
                    <ul>
                        <li><strong>Reversal:</strong> Hammer, Inverted Hammer, Morning Star, Bullish Engulfing</li>
                        <li><strong>Continuation:</strong> Three White Soldiers, Bullish Marubozu</li>
                        <li><strong>Where to Look:</strong> Bottom of downtrends, support levels</li>
                        <li><strong>Confirmation:</strong> Wait for next candle to confirm direction</li>
                    </ul>
                </div>
                <div class="reference-card bearish-ref">
                    <h4>🔴 Bearish Patterns</h4>
                    <ul>
                        <li><strong>Reversal:</strong> Shooting Star, Hanging Man, Evening Star, Bearish Engulfing</li>
                        <li><strong>Continuation:</strong> Three Black Crows, Bearish Marubozu</li>
                        <li><strong>Where to Look:</strong> Top of uptrends, resistance levels</li>
                        <li><strong>Confirmation:</strong> Wait for next candle to confirm direction</li>
                    </ul>
                </div>
                <div class="reference-card neutral-ref">
                    <h4>⚪ Neutral Patterns (Indecision)</h4>
                    <ul>
                        <li><strong>Patterns:</strong> Doji, Spinning Tops</li>
                        <li><strong>Meaning:</strong> Market indecision, buyers and sellers balanced</li>
                        <li><strong>What to Do:</strong> Wait for confirmation before trading</li>
                        <li><strong>Context Matters:</strong> Can signal reversal at extremes</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Trading Tips -->
        <div class="pattern-tips">
            <h4>💡 Pro Trading Tips</h4>
            <div class="tips-grid">
                <div class="tip-item">
                    <span class="tip-icon">1️⃣</span>
                    <strong>Always Confirm:</strong> Never trade on a single candle. Wait for the next candle to confirm the pattern.
                </div>
                <div class="tip-item">
                    <span class="tip-icon">2️⃣</span>
                    <strong>Volume Matters:</strong> Patterns are more reliable with high volume. Low volume = weak signal.
                </div>
                <div class="tip-item">
                    <span class="tip-icon">3️⃣</span>
                    <strong>Context is Key:</strong> Look at the bigger picture. Where in the trend is the pattern forming?
                </div>
                <div class="tip-item">
                    <span class="tip-icon">4️⃣</span>
                    <strong>Combine with Support/Resistance:</strong> Patterns at key levels are much more powerful.
                </div>
                <div class="tip-item">
                    <span class="tip-icon">5️⃣</span>
                    <strong>Risk Management:</strong> Always use stop losses. Even the best patterns can fail.
                </div>
                <div class="tip-item">
                    <span class="tip-icon">6️⃣</span>
                    <strong>Practice:</strong> Study historical charts to recognize patterns in real-time.
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeCandlestickPatterns() {
    const modal = document.getElementById('patternsModal');
    if (modal) modal.classList.remove('active');
}

// ===== US Yields Widget =====
async function updateYieldsWidget() {
    try {
        // Real initial yield values (these would come from Treasury.gov API in production)
        const yields = {
            '2y': '4.25',
            '10y': '4.48', 
            '30y': '4.65'
        };
        
        // Add small random fluctuation to simulate market movement
        const fluctuation2y = (parseFloat(yields['2y']) + (Math.random() * 0.06 - 0.03)).toFixed(2);
        const fluctuation10y = (parseFloat(yields['10y']) + (Math.random() * 0.06 - 0.03)).toFixed(2);
        const fluctuation30y = (parseFloat(yields['30y']) + (Math.random() * 0.06 - 0.03)).toFixed(2);
        
        // Update display
        const yield2yEl = document.getElementById('yield2y');
        const yield10yEl = document.getElementById('yield10y');
        const yield30yEl = document.getElementById('yield30y');
        
        if (yield2yEl) yield2yEl.textContent = fluctuation2y + '%';
        if (yield10yEl) yield10yEl.textContent = fluctuation10y + '%';
        if (yield30yEl) yield30yEl.textContent = fluctuation30y + '%';
        
        console.log('✅ Yields updated:', {
            '2Y': fluctuation2y + '%',
            '10Y': fluctuation10y + '%',
            '30Y': fluctuation30y + '%'
        });
        
    } catch (error) {
        console.error('Error updating yields:', error);
    }
}

// Initialize yields widget on load
function initializeYieldsWidget() {
    console.log('🔄 Initializing yields widget...');
    updateYieldsWidget();
    // Update every 30 seconds
    setInterval(updateYieldsWidget, 30000);
}

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

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadAllNews();
    startRealTimeUpdates();
    initializeYieldsWidget();
    
    // Close modals on backdrop click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            closeCalendar();
            closeMarketSummary();
            closeCharts();
            closeTrumpTracker();
            closeCorrelations();
            closePsychology();
            closeMarketHours();
            closeCandlestickPatterns();
        }
    });
    
    console.log('ForexLive Intelligence with Real-time Features initialized successfully');
    console.log('🦅 Trump Tracker: Enabled');
    console.log('📊 TradingView Charts: Enabled');
    console.log('📈 Currency Strength Meter: Enabled');
    console.log('🔔 Push Notifications: Ready');
});
