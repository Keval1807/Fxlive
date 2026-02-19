// ================================================================
// WEIGHTED MACRO SENTIMENT ENGINE
// ================================================================
// ONE output per article - no contradictions
// Gold integrated into macro scoring
// ================================================================

const MacroSentimentEngine = (function() {
    'use strict';

    // ──────────────────────────────────────────────────────────────
    // CONFIGURATION
    // ──────────────────────────────────────────────────────────────

    const DRIVER_WEIGHTS = {
        crisis: 0.40,      // 40%
        monetary: 0.35,    // 35%
        economic: 0.20,    // 20%
        commentary: 0.05   // 5%
    };

    const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];

    const PAIR_MAPPING = {
        'USD': 'EUR/USD',
        'EUR': 'EUR/USD',
        'GBP': 'GBP/USD',
        'JPY': 'USD/JPY',
        'AUD': 'AUD/USD',
        'CAD': 'USD/CAD',
        'CHF': 'USD/CHF',
        'NZD': 'NZD/USD'
    };

    // ──────────────────────────────────────────────────────────────
    // SIGNAL PATTERNS WITH SCORING
    // ──────────────────────────────────────────────────────────────

    const SIGNALS = {
        // ═══ CRISIS / GEOPOLITICAL RISK (40%) ═══
        crisis: [
            {
                pattern: /(geopolit\w+|military|war|conflict|tension|escalat|attack|strike|sanction|crisis)/i,
                type: 'risk_off',
                apply: (scores) => {
                    scores.USD += 40;
                    scores.JPY += 40;
                    scores.CHF += 40;
                    scores.AUD -= 40;
                    scores.NZD -= 40;
                    scores.GOLD += 40;
                }
            },
            {
                pattern: /risk.?off|flight.to.safety|safe.?haven.demand/i,
                type: 'risk_off',
                apply: (scores) => {
                    scores.USD += 40;
                    scores.JPY += 40;
                    scores.CHF += 40;
                    scores.GOLD += 40;
                }
            },
            {
                pattern: /risk.?on|risk.appetite|market.?rallies?/i,
                type: 'risk_on',
                apply: (scores) => {
                    scores.USD -= 40;
                    scores.JPY -= 40;
                    scores.CHF -= 40;
                    scores.AUD += 40;
                    scores.NZD += 40;
                    scores.GOLD -= 30;
                }
            }
        ],

        // ═══ MONETARY POLICY (35%) ═══
        monetary: [
            // FED / USD
            {
                pattern: /(fed|federal.reserve|fomc|powell).*(hawkish|hike|hikes?|rais\w+.rates?|tighten)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD += 35; scores.GOLD -= 25; }
            },
            {
                pattern: /(fed|federal.reserve|fomc|powell).*(dovish|cut|cuts?|lower\w+.rates?|eas\w+|pivot)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD -= 35; scores.GOLD += 25; }
            },
            {
                pattern: /(reduc\w+|less|fewer).*(expectation|bets?).*(rate)?.cuts?/i,
                currency: 'USD',
                apply: (scores) => { scores.USD += 35; scores.GOLD -= 25; }
            },
            {
                pattern: /(pricing|priced?).*(faster|more).*(rate)?.cuts?/i,
                currency: 'USD',
                apply: (scores) => { scores.USD -= 35; scores.GOLD += 25; }
            },

            // ECB / EUR
            {
                pattern: /(ecb|european.central.bank|lagarde).*(hawkish|hike|hikes?|rais\w+.rates?|tighten)/i,
                currency: 'EUR',
                apply: (scores) => { scores.EUR += 35; }
            },
            {
                pattern: /(ecb|european.central.bank|lagarde).*(dovish|cut|cuts?|lower\w+.rates?|eas\w+)/i,
                currency: 'EUR',
                apply: (scores) => { scores.EUR -= 35; }
            },

            // BOE / GBP
            {
                pattern: /(boe|bank.of.england|bailey).*(hawkish|hike|hikes?|rais\w+.rates?|tighten)/i,
                currency: 'GBP',
                apply: (scores) => { scores.GBP += 35; }
            },
            {
                pattern: /(boe|bank.of.england|bailey).*(dovish|cut|cuts?|lower\w+.rates?|eas\w+)/i,
                currency: 'GBP',
                apply: (scores) => { scores.GBP -= 35; }
            },

            // BOJ / JPY
            {
                pattern: /(boj|bank.of.japan|ueda).*(hawkish|hike|hikes?|tighten|away.from|signal|mov\w+.away)/i,
                currency: 'JPY',
                apply: (scores) => { scores.JPY += 35; }
            },
            {
                pattern: /(boj|bank.of.japan|ueda).*(dovish|ultra.loose|eas\w+|maintain)/i,
                currency: 'JPY',
                apply: (scores) => { scores.JPY -= 35; }
            },

            // RBA / AUD
            {
                pattern: /(rba|reserve.bank.of.australia).*(hawkish|hike|hikes?|rais\w+.rates?)/i,
                currency: 'AUD',
                apply: (scores) => { scores.AUD += 35; }
            },
            {
                pattern: /(rba|reserve.bank.of.australia).*(dovish|cut|cuts?|lower\w+.rates?)/i,
                currency: 'AUD',
                apply: (scores) => { scores.AUD -= 35; }
            },

            // BOC / CAD
            {
                pattern: /(boc|bank.of.canada).*(hawkish|hike|hikes?|rais\w+.rates?)/i,
                currency: 'CAD',
                apply: (scores) => { scores.CAD += 35; }
            },
            {
                pattern: /(boc|bank.of.canada).*(dovish|cut|cuts?|lower\w+.rates?)/i,
                currency: 'CAD',
                apply: (scores) => { scores.CAD -= 35; }
            },

            // SNB / CHF
            {
                pattern: /(snb|swiss.national.bank).*(hawkish|hike|hikes?|rais\w+.rates?)/i,
                currency: 'CHF',
                apply: (scores) => { scores.CHF += 35; }
            },
            {
                pattern: /(snb|swiss.national.bank).*(dovish|cut|cuts?|lower\w+.rates?)/i,
                currency: 'CHF',
                apply: (scores) => { scores.CHF -= 35; }
            },

            // RBNZ / NZD
            {
                pattern: /(rbnz|reserve.bank.of.new.zealand).*(hawkish|hike|hikes?|rais\w+.rates?)/i,
                currency: 'NZD',
                apply: (scores) => { scores.NZD += 35; }
            },
            {
                pattern: /(rbnz|reserve.bank.of.new.zealand).*(dovish|cut|cuts?|lower\w+.rates?)/i,
                currency: 'NZD',
                apply: (scores) => { scores.NZD -= 35; }
            }
        ],

        // ═══ ECONOMIC DATA (20%) ═══
        economic: [
            // US Data - Strong
            {
                pattern: /(us|united.states|american).*(cpi|inflation).*(hot|hotter|above|beat|surge|rose|persistent|surprised?.upside)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD += 20; scores.GOLD -= 15; }
            },
            {
                pattern: /(nonfarm|nfp|payroll|us.jobs|us.employment).*(strong|beat|above|surge|rose)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD += 20; scores.GOLD -= 15; }
            },
            {
                pattern: /(us.gdp|us.growth).*(strong|beat|above|robust)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD += 20; scores.GOLD -= 15; }
            },
            
            // US Data - Weak
            {
                pattern: /(us|united.states|american).*(cpi|inflation).*(soft|cool|below|miss|ease|fell)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD -= 20; scores.GOLD += 15; }
            },
            {
                pattern: /(nonfarm|nfp|payroll|us.jobs|us.employment).*(weak|miss|below|disappoint|fell)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD -= 20; scores.GOLD += 15; }
            },
            {
                pattern: /(us.gdp|us.growth).*(weak|miss|below|contraction|recession)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD -= 20; scores.GOLD += 15; }
            },

            // EUR Data
            {
                pattern: /(eurozone|euro.area|german|eu).*(gdp|growth|cpi|inflation|pmi).*(strong|beat|above|robust)/i,
                currency: 'EUR',
                apply: (scores) => { scores.EUR += 20; }
            },
            {
                pattern: /(eurozone|euro.area|german|eu).*(gdp|growth|cpi|inflation|pmi).*(weak|miss|below|contraction)/i,
                currency: 'EUR',
                apply: (scores) => { scores.EUR -= 20; }
            },

            // UK Data
            {
                pattern: /(uk|britain|british).*(gdp|growth|cpi|inflation|employment).*(strong|beat|above|robust)/i,
                currency: 'GBP',
                apply: (scores) => { scores.GBP += 20; }
            },
            {
                pattern: /(uk|britain|british).*(gdp|growth|cpi|inflation|employment).*(weak|miss|below|contraction|recession)/i,
                currency: 'GBP',
                apply: (scores) => { scores.GBP -= 20; }
            },

            // Japan Data
            {
                pattern: /(japan|japanese).*(gdp|growth|cpi|inflation).*(strong|beat|above|robust)/i,
                currency: 'JPY',
                apply: (scores) => { scores.JPY += 20; }
            },
            {
                pattern: /(japan|japanese).*(gdp|growth|cpi|inflation).*(weak|miss|below)/i,
                currency: 'JPY',
                apply: (scores) => { scores.JPY -= 20; }
            },

            // Australia Data
            {
                pattern: /(australia|australian).*(employment|jobs|gdp|growth).*(strong|beat|above|rose)/i,
                currency: 'AUD',
                apply: (scores) => { scores.AUD += 20; }
            },
            {
                pattern: /(australia|australian).*(employment|jobs|gdp|growth).*(weak|miss|below|fell)/i,
                currency: 'AUD',
                apply: (scores) => { scores.AUD -= 20; }
            },

            // Canada / Oil
            {
                pattern: /(oil|crude|wti|brent).*(surge|rally|rise|jump|spike)/i,
                currency: 'CAD',
                apply: (scores) => { scores.CAD += 20; }
            },
            {
                pattern: /(oil|crude|wti|brent).*(fall|drop|tumble|decline|plunge)/i,
                currency: 'CAD',
                apply: (scores) => { scores.CAD -= 20; }
            }
        ],

        // ═══ GENERIC COMMENTARY (5%) ═══
        commentary: [
            {
                pattern: /(dollar|usd).*(strengthen|rallies?|gains?|surge)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD += 5; scores.GOLD -= 5; }
            },
            {
                pattern: /(dollar|usd).*(weaken|falls?|drops?|decline)/i,
                currency: 'USD',
                apply: (scores) => { scores.USD -= 5; scores.GOLD += 5; }
            },
            {
                pattern: /(euro|eur).*(strengthen|rallies?|gains?|surge)/i,
                currency: 'EUR',
                apply: (scores) => { scores.EUR += 5; }
            },
            {
                pattern: /(euro|eur).*(weaken|falls?|drops?|decline)/i,
                currency: 'EUR',
                apply: (scores) => { scores.EUR -= 5; }
            },
            {
                pattern: /(pound|sterling|gbp).*(strengthen|rallies?|gains?|surge)/i,
                currency: 'GBP',
                apply: (scores) => { scores.GBP += 5; }
            },
            {
                pattern: /(pound|sterling|gbp).*(weaken|falls?|drops?|decline)/i,
                currency: 'GBP',
                apply: (scores) => { scores.GBP -= 5; }
            },
            {
                pattern: /(yen|jpy).*(strengthen|rallies?|gains?)/i,
                currency: 'JPY',
                apply: (scores) => { scores.JPY += 5; }
            },
            {
                pattern: /(yen|jpy).*(weaken|falls?|drops?)/i,
                currency: 'JPY',
                apply: (scores) => { scores.JPY -= 5; }
            },
            {
                pattern: /(gold|xau|bullion).*(rally|rallies?|surge|gains?|rise)/i,
                apply: (scores) => { scores.GOLD += 10; }
            },
            {
                pattern: /(gold|xau|bullion).*(fall|falls?|drop|drops?|decline|tumble)/i,
                apply: (scores) => { scores.GOLD -= 10; }
            }
        ]
    };

    // ──────────────────────────────────────────────────────────────
    // CORE ENGINE FUNCTIONS
    // ──────────────────────────────────────────────────────────────

    function initializeScores() {
        const scores = { GOLD: 0 };
        CURRENCIES.forEach(curr => scores[curr] = 0);
        return scores;
    }

    function normalizeText(text) {
        return text.toLowerCase().replace(/\s+/g, '.');
    }

    function detectAndApplySignals(text, scores) {
        const normalized = normalizeText(text);
        const detectedDrivers = { crisis: 0, monetary: 0, economic: 0, commentary: 0 };

        // Process all signal categories
        for (const [category, signals] of Object.entries(SIGNALS)) {
            for (const signal of signals) {
                if (signal.pattern.test(normalized)) {
                    signal.apply(scores);
                    detectedDrivers[category]++;
                }
            }
        }

        // Determine dominant driver
        let dominantDriver = 'commentary';
        let maxCount = 0;
        
        for (const [driver, count] of Object.entries(detectedDrivers)) {
            if (count > maxCount) {
                maxCount = count;
                dominantDriver = driver;
            }
        }

        return dominantDriver;
    }

    function findDominantCurrency(scores) {
        let maxAbsScore = 0;
        let dominantCurrency = null;

        for (const curr of CURRENCIES) {
            const absScore = Math.abs(scores[curr]);
            if (absScore > maxAbsScore) {
                maxAbsScore = absScore;
                dominantCurrency = curr;
            }
        }

        return dominantCurrency;
    }

    function determinePairBias(currency, currencyScore, pair) {
        const currencyBias = currencyScore > 0 ? 'Bullish' : 'Bearish';
        const isBaseCurrency = pair.startsWith(currency);
        
        if (isBaseCurrency) {
            return currencyBias;
        } else {
            return currencyBias === 'Bullish' ? 'Bearish' : 'Bullish';
        }
    }

    function determineGoldBias(goldScore) {
        if (goldScore >= 15) return 'Bullish';
        if (goldScore <= -15) return 'Bearish';
        return 'Neutral';
    }

    // ──────────────────────────────────────────────────────────────
    // MAIN ANALYSIS FUNCTION
    // ──────────────────────────────────────────────────────────────

    function analyzeSentiment(articleText) {
        const scores = initializeScores();
        const dominantDriver = detectAndApplySignals(articleText, scores);
        const affectedCurrency = findDominantCurrency(scores);
        
        // Handle case where no currency has significant score
        if (!affectedCurrency || Math.abs(scores[affectedCurrency]) < 5) {
            return {
                dominantDriver: dominantDriver,
                affectedCurrency: 'USD',
                currencyScore: 0,
                currencyBias: 'Neutral',
                affectedPair: 'EUR/USD',
                pairBias: 'Neutral',
                goldScore: scores.GOLD,
                goldBias: determineGoldBias(scores.GOLD)
            };
        }
        
        const affectedPair = PAIR_MAPPING[affectedCurrency];
        const currencyScore = scores[affectedCurrency];
        const currencyBias = currencyScore > 0 ? 'Bullish' : 'Bearish';
        const pairBias = determinePairBias(affectedCurrency, currencyScore, affectedPair);
        const goldScore = scores.GOLD;
        const goldBias = determineGoldBias(goldScore);
        
        return {
            dominantDriver: dominantDriver,
            affectedCurrency: affectedCurrency,
            currencyScore: currencyScore,
            currencyBias: currencyBias,
            affectedPair: affectedPair,
            pairBias: pairBias,
            goldScore: goldScore,
            goldBias: goldBias
        };
    }

    return { analyzeSentiment };
})();

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MacroSentimentEngine;
}
