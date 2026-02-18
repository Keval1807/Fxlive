// ================================================================
// INSTITUTIONAL-GRADE MACRO SENTIMENT ENGINE
// ================================================================
// Pure modular functions for FX sentiment analysis
// No DOM manipulation - JSON output only
// ================================================================

// ──────────────────────────────────────────────────────────────
// 1. CONFIGURATION & CONSTANTS
// ──────────────────────────────────────────────────────────────

const CURRENCY_UNIVERSE = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'XAU'];

const SIGNAL_PATTERNS = {
    monetary: {
        bullish: [
            { pattern: /(rate hike|hikes? rates?|rais\w+ (?:interest )?rates?|increas\w+ rates?)/, base: 3, modifiers: true },
            { pattern: /hawkish/, base: 2, modifiers: true },
            { pattern: /(policy )?tightening/, base: 2, modifiers: true },
            { pattern: /restrictive( policy)?/, base: 2, modifiers: true },
            { pattern: /remov\w+ accommodation/, base: 2, modifiers: true },
            { pattern: /(move|moving|shift) (?:away from|toward) (?:ultra.?loose|easing)/, base: 2, modifiers: true },
            { pattern: /(reduced?|reduc\w+|less) (?:expectation|bets?) (?:for |of )?(?:rate )?cuts?/, base: 2, modifiers: true },
            { pattern: /hawkish repric\w+/, base: 2, modifiers: true }
        ],
        bearish: [
            { pattern: /(rate cut|cuts? rates?|lower\w+ rates?|reduc\w+ rates?)/, base: -3, modifiers: true },
            { pattern: /dovish/, base: -2, modifiers: true },
            { pattern: /(policy )?easing/, base: -2, modifiers: true },
            { pattern: /accommodative/, base: -2, modifiers: true },
            { pattern: /pivot/, base: -2, modifiers: true },
            { pattern: /(rate )?pause/, base: -1, modifiers: true },
            { pattern: /(faster|near-term|increased) (?:rate )?cuts?/, base: -2, modifiers: true },
            { pattern: /(priced?|pricing) (?:in )?(?:faster |more )?(?:rate )?cuts?/, base: -2, modifiers: true }
        ]
    },
    economic: {
        bullish: [
            { pattern: /gdp (?:beat|above|exceed)/, base: 2, modifiers: true },
            { pattern: /strong (?:growth|expansion|jobs|employment)/, base: 2, modifiers: true },
            { pattern: /robust (?:growth|expansion)/, base: 2, modifiers: true },
            { pattern: /(employment|payrolls) (?:rose|rises|surged?|beat|above)/, base: 2, modifiers: true },
            { pattern: /unemployment (?:fell|falls|drop)/, base: 2, modifiers: true },
            { pattern: /(far )?above (?:expectation|forecast)/, base: 2, modifiers: true },
            { pattern: /wage (?:growth|pressures?)/, base: 1, modifiers: true },
            { pattern: /accelerat\w+/, base: 1, modifiers: true },
            { pattern: /(inflation|cpi) (?:surged?|rose|above|beat|hotter|persistent)/, base: 2, modifiers: true }
        ],
        bearish: [
            { pattern: /(gdp|growth|payrolls|employment|jobs) (?:miss|below|disappoint|weak)/, base: -2, modifiers: true },
            { pattern: /contraction/, base: -3, modifiers: true },
            { pattern: /recession/, base: -3, modifiers: true },
            { pattern: /(unemployment|jobless) (?:rose|rises|increase)/, base: -2, modifiers: true },
            { pattern: /(?:below|miss) (?:expectation|forecast)/, base: -2, modifiers: true },
            { pattern: /declining?/, base: -1, modifiers: true },
            { pattern: /weaken\w+/, base: -1, modifiers: true },
            { pattern: /slowing/, base: -1, modifiers: true }
        ]
    },
    risk: {
        bullish: [
            { pattern: /(safe.?haven|flight to safety|risk.?off)/, base: 2, modifiers: false },
            { pattern: /geopolit\w+ (?:tension|crisis)/, base: 2, modifiers: false },
            { pattern: /(market|equity) (?:panic|sell.?off|declined?|pulled? back)/, base: 2, modifiers: false },
            { pattern: /(military strike|supply disruption|escalat\w+|carry (?:trade )?unwind)/, base: 2, modifiers: false },
            { pattern: /(volatility|uncertainty) (?:spike|jump|increase)/, base: 2, modifiers: false }
        ],
        bearish: [
            { pattern: /risk.?on/, base: -2, modifiers: false },
            { pattern: /risk appetite/, base: -1, modifiers: true },
            { pattern: /(market|equity) (?:rallied?|gains?)/, base: -1, modifiers: true }
        ]
    }
};

const INTENSITY_MODIFIERS = {
    extreme: 1.5,
    very: 1.3,
    highly: 1.3,
    significantly: 1.2,
    moderately: 0.8,
    slightly: 0.6,
    somewhat: 0.7
};

const CURRENCY_PATTERNS = {
    USD: /\b(dollar|usd|greenback|dxy|fed|federal reserve|fomc|powell|us economy|us inflation|us gdp|nonfarm|nfp|us jobs|treasury|united states|american)\b/i,
    EUR: /\b(euro|eur|ecb|european central bank|lagarde|eurozone|euro area|germany|german|france)\b/i,
    GBP: /\b(pound|sterling|gbp|boe|bank of england|bailey|uk economy|uk gdp|uk|united kingdom|britain|british)\b/i,
    JPY: /\b(yen|jpy|boj|bank of japan|ueda|japan economy|japan|japanese)\b/i,
    AUD: /\b(aussie|aud|rba|reserve bank of australia|australia economy|australia|australian)\b/i,
    CAD: /\b(loonie|cad|boc|bank of canada|canada economy|canada|canadian|oil|crude|wti|brent)\b/i,
    CHF: /\b(franc|chf|snb|swiss national bank|switzerland|swiss)\b/i,
    NZD: /\b(kiwi|nzd|rbnz|reserve bank of new zealand|new zealand)\b/i,
    XAU: /\b(gold|xau|bullion)\b/i
};

const REGIME_THRESHOLDS = {
    rateRegime: { monetary: 0.5 },
    dataRegime: { economic: 0.5 },
    crisisRegime: { risk: 0.4 }
};

const REGIME_WEIGHTS = {
    'Rate Regime': { monetary: 0.7, economic: 0.2, risk: 0.1 },
    'Data Regime': { monetary: 0.2, economic: 0.7, risk: 0.1 },
    'Crisis Regime': { monetary: 0.1, economic: 0.2, risk: 0.7 },
    'Balanced Regime': { monetary: 0.4, economic: 0.4, risk: 0.2 }
};

const MAJOR_PAIRS = [
    { pair: 'EUR/USD', base: 'EUR', quote: 'USD' },
    { pair: 'GBP/USD', base: 'GBP', quote: 'USD' },
    { pair: 'USD/JPY', base: 'USD', quote: 'JPY' },
    { pair: 'USD/CHF', base: 'USD', quote: 'CHF' },
    { pair: 'USD/CAD', base: 'USD', quote: 'CAD' },
    { pair: 'AUD/USD', base: 'AUD', quote: 'USD' },
    { pair: 'NZD/USD', base: 'NZD', quote: 'USD' },
    { pair: 'EUR/GBP', base: 'EUR', quote: 'GBP' },
    { pair: 'EUR/JPY', base: 'EUR', quote: 'JPY' },
    { pair: 'GBP/JPY', base: 'GBP', quote: 'JPY' },
    { pair: 'AUD/JPY', base: 'AUD', quote: 'JPY' },
    { pair: 'CAD/JPY', base: 'CAD', quote: 'JPY' },
    { pair: 'CHF/JPY', base: 'CHF', quote: 'JPY' },
    { pair: 'XAU/USD', base: 'XAU', quote: 'USD' }
];

// ──────────────────────────────────────────────────────────────
// 2. UTILITY FUNCTIONS
// ──────────────────────────────────────────────────────────────

function normalizeText(text) {
    return text.toLowerCase().trim();
}

function detectIntensity(sentence, termIndex) {
    const words = sentence.split(/\s+/);
    const termPosition = sentence.substring(0, termIndex).split(/\s+/).length - 1;
    
    // Check 2 words before the term
    for (let i = Math.max(0, termPosition - 2); i < termPosition; i++) {
        const word = words[i];
        if (INTENSITY_MODIFIERS[word]) {
            return INTENSITY_MODIFIERS[word];
        }
    }
    return 1.0;
}

function extractSentences(text) {
    // Split on sentence boundaries while preserving structure
    return text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
}

function clampScore(score, min = -3, max = 3) {
    return Math.max(min, Math.min(max, score));
}

// ──────────────────────────────────────────────────────────────
// 3. DRIVER EXTRACTION
// ──────────────────────────────────────────────────────────────

/**
 * Extract monetary, economic, and risk drivers from article text
 * @param {string} articleText - Full article title + body
 * @returns {Array} Array of driver objects with currency, category, rawScore
 */
function extractDrivers(articleText) {
    const normalized = normalizeText(articleText);
    const sentences = extractSentences(normalized);
    const drivers = [];
    const processedSentences = new Set();

    // Detect which currencies are mentioned
    const mentionedCurrencies = CURRENCY_UNIVERSE.filter(currency => 
        CURRENCY_PATTERNS[currency].test(normalized)
    );

    // If no currencies detected, return empty
    if (mentionedCurrencies.length === 0) {
        return drivers;
    }

    // Process each category
    for (const [category, directions] of Object.entries(SIGNAL_PATTERNS)) {
        for (const direction of ['bullish', 'bearish']) {
            for (const signal of directions[direction]) {
                // Find all occurrences in text using regex
                let match;
                const globalPattern = new RegExp(signal.pattern.source, 'gi');
                
                while ((match = globalPattern.exec(normalized)) !== null) {
                    // Find which sentence this occurs in
                    const sentenceIndex = sentences.findIndex(s => {
                        const sStart = normalized.indexOf(s);
                        const sEnd = sStart + s.length;
                        return sStart <= match.index && match.index < sEnd;
                    });
                    
                    if (sentenceIndex === -1) continue;
                    
                    const sentenceKey = `${sentenceIndex}-${signal.pattern.source}`;
                    
                    // Skip if already processed (prevents duplicate stacking)
                    if (processedSentences.has(sentenceKey)) continue;
                    processedSentences.add(sentenceKey);

                    const sentence = sentences[sentenceIndex];
                    
                    // Apply intensity modifier if enabled
                    let finalScore = signal.base;
                    if (signal.modifiers) {
                        const intensity = detectIntensity(sentence, match.index - normalized.indexOf(sentence));
                        finalScore = signal.base * intensity;
                    }
                    
                    // Clamp to -3/+3 range
                    finalScore = clampScore(finalScore);

                    // Assign to mentioned currencies in this sentence
                    for (const currency of mentionedCurrencies) {
                        if (CURRENCY_PATTERNS[currency].test(sentence)) {
                            drivers.push({
                                currency,
                                category: category.charAt(0).toUpperCase() + category.slice(1),
                                rawScore: parseFloat(finalScore.toFixed(2)),
                                signal: match[0] // Include matched text for debugging
                            });
                        }
                    }
                }
            }
        }
    }

    return drivers;
}

// ──────────────────────────────────────────────────────────────
// 4. REGIME DETECTION
// ──────────────────────────────────────────────────────────────

/**
 * Detect market regime from drivers
 * @param {Array} drivers - Array of driver objects
 * @returns {Object} { regime: string, weights: object }
 */
function detectRegime(drivers) {
    if (drivers.length === 0) {
        return {
            regime: 'Balanced Regime',
            weights: REGIME_WEIGHTS['Balanced Regime']
        };
    }

    // Count drivers by category
    const categoryCounts = {
        Monetary: 0,
        Economic: 0,
        Risk: 0
    };

    drivers.forEach(d => {
        categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    const total = drivers.length;
    const proportions = {
        monetary: categoryCounts.Monetary / total,
        economic: categoryCounts.Economic / total,
        risk: categoryCounts.Risk / total
    };

    // Apply regime rules
    if (proportions.monetary > REGIME_THRESHOLDS.rateRegime.monetary) {
        return {
            regime: 'Rate Regime',
            weights: REGIME_WEIGHTS['Rate Regime']
        };
    }
    
    if (proportions.economic > REGIME_THRESHOLDS.dataRegime.economic) {
        return {
            regime: 'Data Regime',
            weights: REGIME_WEIGHTS['Data Regime']
        };
    }
    
    if (proportions.risk > REGIME_THRESHOLDS.crisisRegime.risk) {
        return {
            regime: 'Crisis Regime',
            weights: REGIME_WEIGHTS['Crisis Regime']
        };
    }

    return {
        regime: 'Balanced Regime',
        weights: REGIME_WEIGHTS['Balanced Regime']
    };
}

// ──────────────────────────────────────────────────────────────
// 5. CURRENCY SCORING
// ──────────────────────────────────────────────────────────────

/**
 * Compute weighted currency scores
 * @param {Array} drivers - Array of driver objects
 * @param {Object} weights - Regime weights { monetary, economic, risk }
 * @returns {Object} Currency scores { USD: 0.3, EUR: -1.2, ... }
 */
function computeCurrencyScores(drivers, weights) {
    // Initialize all currencies to 0
    const scores = {};
    CURRENCY_UNIVERSE.forEach(currency => {
        scores[currency] = 0;
    });

    // Aggregate scores by currency and category
    const aggregated = {};
    
    drivers.forEach(driver => {
        const { currency, category, rawScore } = driver;
        
        if (!aggregated[currency]) {
            aggregated[currency] = { Monetary: 0, Economic: 0, Risk: 0 };
        }
        
        aggregated[currency][category] += rawScore;
    });

    // Apply weighted formula
    for (const [currency, categoryScores] of Object.entries(aggregated)) {
        const weightedScore = 
            (categoryScores.Monetary * weights.monetary) +
            (categoryScores.Economic * weights.economic) +
            (categoryScores.Risk * weights.risk);
        
        scores[currency] = parseFloat(weightedScore.toFixed(2));
    }

    return scores;
}

// ──────────────────────────────────────────────────────────────
// 6. PRIMARY PAIR DETECTION
// ──────────────────────────────────────────────────────────────

/**
 * Detect primary currency pair from article
 * @param {string} articleText - Full article text
 * @param {Object} currencyScores - Currency scores object
 * @returns {string} Primary pair (e.g., "EUR/USD")
 */
function detectPrimaryPair(articleText, currencyScores) {
    const normalized = normalizeText(articleText);

    // 1. Check for explicit pair mentions
    const explicitPairs = [
        'eur/usd', 'eurusd',
        'gbp/usd', 'gbpusd',
        'usd/jpy', 'usdjpy',
        'aud/usd', 'audusd',
        'usd/cad', 'usdcad',
        'nzd/usd', 'nzdusd',
        'usd/chf', 'usdchf',
        'xau/usd', 'xauusd'
    ];

    for (const pairStr of explicitPairs) {
        if (normalized.includes(pairStr)) {
            // Convert to standard format
            const standardized = pairStr.replace('usd', '/usd').replace('jpy', '/jpy').toUpperCase();
            return standardized.includes('/') ? standardized : 
                   standardized.substring(0, 3) + '/' + standardized.substring(3);
        }
    }

    // 2. Gold mentioned → XAU/USD
    if (/\b(gold|xau|bullion)\b/i.test(normalized)) {
        return 'XAU/USD';
    }

    // 3. Central bank mentioned → currency vs USD
    const centralBanks = {
        'ecb': 'EUR/USD',
        'european central bank': 'EUR/USD',
        'lagarde': 'EUR/USD',
        'boe': 'GBP/USD',
        'bank of england': 'GBP/USD',
        'bailey': 'GBP/USD',
        'boj': 'USD/JPY',
        'bank of japan': 'USD/JPY',
        'ueda': 'USD/JPY',
        'rba': 'AUD/USD',
        'reserve bank of australia': 'AUD/USD',
        'boc': 'USD/CAD',
        'bank of canada': 'USD/CAD',
        'rbnz': 'NZD/USD',
        'reserve bank of new zealand': 'NZD/USD',
        'snb': 'USD/CHF',
        'swiss national bank': 'USD/CHF'
    };

    for (const [term, pair] of Object.entries(centralBanks)) {
        if (normalized.includes(term)) {
            return pair;
        }
    }

    // 4. Dominant currency (highest absolute score) vs USD
    const sortedCurrencies = Object.entries(currencyScores)
        .filter(([curr]) => curr !== 'USD')
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

    if (sortedCurrencies.length > 0) {
        const dominant = sortedCurrencies[0][0];
        
        // Check if USD-quote or USD-base
        if (['JPY', 'CHF', 'CAD'].includes(dominant)) {
            return `USD/${dominant}`;
        }
        return `${dominant}/USD`;
    }

    // Default fallback
    return 'EUR/USD';
}

// ──────────────────────────────────────────────────────────────
// 7. PAIR MATRIX GENERATION
// ──────────────────────────────────────────────────────────────

/**
 * Generate bias classification from score
 * @param {number} score - Pair score
 * @returns {string} Bias classification
 */
function classifyBias(score) {
    if (score >= 0.75) return 'Strong Bullish';
    if (score >= 0.25) return 'Bullish';
    if (score >= -0.25) return 'Neutral';
    if (score >= -0.75) return 'Bearish';
    return 'Strong Bearish';
}

/**
 * Generate projections for all major pairs
 * @param {Object} currencyScores - Currency scores
 * @returns {Array} Sorted array of pair projections
 */
function generatePairMatrix(currencyScores) {
    const pairProjections = [];

    for (const { pair, base, quote } of MAJOR_PAIRS) {
        const baseScore = currencyScores[base] || 0;
        const quoteScore = currencyScores[quote] || 0;
        const pairScore = parseFloat((baseScore - quoteScore).toFixed(2));
        const bias = classifyBias(pairScore);

        pairProjections.push({
            pair,
            score: pairScore,
            bias
        });
    }

    // Sort by absolute score descending
    return pairProjections.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
}

// ──────────────────────────────────────────────────────────────
// 8. MAIN ORCHESTRATOR
// ──────────────────────────────────────────────────────────────

/**
 * Main sentiment analysis function
 * @param {string} articleText - Full article title + body
 * @returns {Object} Complete analysis result
 */
function analyzeSentiment(articleText) {
    // Step 1: Extract drivers
    const drivers = extractDrivers(articleText);

    // Step 2: Detect regime
    const { regime, weights } = detectRegime(drivers);

    // Step 3: Compute currency scores
    const currencyScores = computeCurrencyScores(drivers, weights);

    // Step 4: Detect primary pair
    const primaryPairName = detectPrimaryPair(articleText, currencyScores);

    // Step 5: Generate pair matrix
    const rankedPairs = generatePairMatrix(currencyScores);

    // Step 6: Find primary pair details
    const primaryPair = rankedPairs.find(p => p.pair === primaryPairName) || rankedPairs[0];

    // Return structured JSON
    return {
        regime,
        weights,
        currencyScores,
        primaryPair: {
            name: primaryPair.pair,
            score: primaryPair.score,
            bias: primaryPair.bias
        },
        rankedPairs,
        drivers // Include for debugging/transparency
    };
}

// ──────────────────────────────────────────────────────────────
// 9. EXPORTS
// ──────────────────────────────────────────────────────────────

// For ES6 modules
export {
    extractDrivers,
    detectRegime,
    computeCurrencyScores,
    detectPrimaryPair,
    generatePairMatrix,
    analyzeSentiment
};

// For Node.js / CommonJS (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractDrivers,
        detectRegime,
        computeCurrencyScores,
        detectPrimaryPair,
        generatePairMatrix,
        analyzeSentiment
    };
}

// For browser global (if needed)
if (typeof window !== 'undefined') {
    window.SentimentEngine = {
        extractDrivers,
        detectRegime,
        computeCurrencyScores,
        detectPrimaryPair,
        generatePairMatrix,
        analyzeSentiment
    };
}
