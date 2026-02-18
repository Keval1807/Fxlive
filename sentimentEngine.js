/*
  SentimentEngine.js
  Lightweight, deterministic sentiment + regime engine.
  - Browser: exposes window.SentimentEngine
  - Node: module.exports = SentimentEngine

  API:
    SentimentEngine.analyzeSentiment(text)
    SentimentEngine.extractDrivers(text)
    SentimentEngine.detectRegime(drivers)
    SentimentEngine.computeCurrencyScores(drivers, weights)
    SentimentEngine.detectPrimaryPair(text, scores)
    SentimentEngine.generatePairMatrix(scores)
*/

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SentimentEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];

  const PAIRS = [
    ['EUR/USD', 'EUR', 'USD'],
    ['GBP/USD', 'GBP', 'USD'],
    ['USD/JPY', 'USD', 'JPY'],
    ['AUD/USD', 'AUD', 'USD'],
    ['NZD/USD', 'NZD', 'USD'],
    ['USD/CAD', 'USD', 'CAD'],
    ['USD/CHF', 'USD', 'CHF']
  ];

  // Keyword sets are intentionally small & deterministic.
  // This is meant to be a plug-in engine that can be expanded later.
  const KEYWORDS = {
    monetary: {
      bullish: [
        'rate hike', 'rates hike', 'raising rates', 'higher rates', 'hawkish', 'tightening',
        'inflation sticky', 'inflation persistent', 'yields rise', 'bond yields rise'
      ],
      bearish: [
        'rate cut', 'rates cut', 'lowering rates', 'dovish', 'easing', 'stimulus',
        'quantitative easing', 'qe', 'yields fall', 'bond yields fall'
      ]
    },
    economic: {
      bullish: [
        'beats forecast', 'beats estimates', 'better than expected', 'strong data',
        'gdp growth', 'jobs growth', 'employment gains', 'pmi rises', 'retail sales up'
      ],
      bearish: [
        'misses forecast', 'misses estimates', 'worse than expected', 'weak data',
        'gdp contraction', 'job losses', 'unemployment rises', 'pmi falls', 'retail sales down'
      ]
    },
    risk: {
      bullish: [
        'risk-on', 'stocks rally', 'equities rally', 'markets rebound', 'calmer markets'
      ],
      bearish: [
        'risk-off', 'safe haven demand', 'geopolitical', 'war', 'conflict', 'crisis',
        'stocks plunge', 'equities plunge', 'market turmoil', 'credit stress'
      ]
    }
  };

  const CURRENCY_ALIASES = {
    USD: ['usd', 'dollar', 'greenback', 'dxy', 'u.s. dollar', 'us dollar'],
    EUR: ['eur', 'euro'],
    GBP: ['gbp', 'pound', 'sterling'],
    JPY: ['jpy', 'yen'],
    AUD: ['aud', 'aussie', 'australian dollar'],
    CAD: ['cad', 'loonie', 'canadian dollar'],
    CHF: ['chf', 'swissy', 'swiss franc'],
    NZD: ['nzd', 'kiwi', 'new zealand dollar']
  };

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function biasFromScore(score) {
    if (score > 0.75) return 'Strong Bullish';
    if (score > 0.25) return 'Bullish';
    if (score < -0.75) return 'Strong Bearish';
    if (score < -0.25) return 'Bearish';
    return 'Neutral';
  }

  function detectCurrencies(textLower) {
    const found = new Set();
    for (const [ccy, aliases] of Object.entries(CURRENCY_ALIASES)) {
      if (aliases.some(a => textLower.includes(a))) found.add(ccy);
    }

    // If no explicit currency mention, default to USD so the engine still returns something.
    if (found.size === 0) found.add('USD');

    return Array.from(found);
  }

  function countMatches(textLower, arr) {
    let n = 0;
    for (const k of arr) if (textLower.includes(k)) n++;
    return n;
  }

  function extractDrivers(articleText) {
    const textLower = String(articleText || '').toLowerCase();
    const currencies = detectCurrencies(textLower);

    const drivers = [];

    for (const [category, sets] of Object.entries(KEYWORDS)) {
      const bullHits = countMatches(textLower, sets.bullish);
      const bearHits = countMatches(textLower, sets.bearish);

      if (bullHits === 0 && bearHits === 0) continue;

      // Determine the sign of the driver signal.
      // If both hit, whichever is larger wins; tie -> neutral (ignored).
      let rawScore = 0;
      if (bullHits > bearHits) rawScore = +1;
      else if (bearHits > bullHits) rawScore = -1;
      else rawScore = 0;

      if (rawScore === 0) continue;

      // Apply same driver to each detected currency.
      // (Keeps scoring deterministic and simple.)
      for (const ccy of currencies) {
        drivers.push({
          currency: ccy,
          category: category[0].toUpperCase() + category.slice(1),
          rawScore,
          signal:
            rawScore > 0
              ? (category === 'monetary' ? 'hawkish / tightening' : category === 'economic' ? 'better data' : 'risk-on')
              : (category === 'monetary' ? 'dovish / easing' : category === 'economic' ? 'weaker data' : 'risk-off')
        });
      }
    }

    return drivers;
  }

  function detectRegime(drivers) {
    const counts = { Monetary: 0, Economic: 0, Risk: 0 };
    for (const d of drivers || []) {
      if (counts[d.category] !== undefined) counts[d.category]++;
    }

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [topCat, topCount] = entries[0];

    let regime = 'Balanced Regime';
    if (topCount >= 2 && topCat === 'Monetary') regime = 'Rate Regime';
    else if (topCount >= 2 && topCat === 'Economic') regime = 'Data Regime';
    else if (topCount >= 2 && topCat === 'Risk') regime = 'Crisis Regime';

    // Weights mirror the guide: dominant theme gets higher weight.
    let weights;
    if (regime === 'Rate Regime') weights = { monetary: 0.7, economic: 0.2, risk: 0.1 };
    else if (regime === 'Data Regime') weights = { monetary: 0.2, economic: 0.7, risk: 0.1 };
    else if (regime === 'Crisis Regime') weights = { monetary: 0.15, economic: 0.15, risk: 0.7 };
    else weights = { monetary: 0.34, economic: 0.33, risk: 0.33 };

    return { regime, weights };
  }

  function computeCurrencyScores(drivers, weights) {
    const scores = {};
    for (const c of CURRENCIES) scores[c] = 0;

    for (const d of drivers || []) {
      const w =
        d.category === 'Monetary' ? (weights.monetary ?? 0.33) :
        d.category === 'Economic' ? (weights.economic ?? 0.33) :
        (weights.risk ?? 0.33);

      scores[d.currency] = (scores[d.currency] || 0) + d.rawScore * w;
    }

    // Clamp to the guide’s stated range.
    for (const k of Object.keys(scores)) {
      scores[k] = clamp(+scores[k].toFixed(2), -3, 3);
    }

    // Remove currencies that never appeared (keeps UI cleaner)
    // but keep USD if everything is empty.
    const nonZero = Object.entries(scores).filter(([, v]) => Math.abs(v) > 0.01);
    if (nonZero.length === 0) return { USD: 0 };

    const compact = {};
    for (const [k, v] of nonZero) compact[k] = v;
    return compact;
  }

  function generatePairMatrix(currencyScores) {
    const matrix = [];
    for (const [pair, base, quote] of PAIRS) {
      const b = currencyScores[base] ?? 0;
      const q = currencyScores[quote] ?? 0;
      const score = +(b - q).toFixed(2);
      matrix.push({ pair, score, bias: biasFromScore(score) });
    }
    return matrix;
  }

  function detectPrimaryPair(_articleText, currencyScores) {
    const rankedPairs = generatePairMatrix(currencyScores)
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

    const top = rankedPairs[0];
    if (!top) return null;

    return { name: top.pair, score: top.score, bias: top.bias };
  }

  function analyzeSentiment(articleText) {
    const drivers = extractDrivers(articleText);
    const { regime, weights } = detectRegime(drivers);
    const currencyScores = computeCurrencyScores(drivers, weights);
    const primaryPair = detectPrimaryPair(articleText, currencyScores);
    const rankedPairs = generatePairMatrix(currencyScores)
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

    return {
      regime,
      weights,
      currencyScores,
      primaryPair,
      rankedPairs,
      drivers
    };
  }

  return {
    analyzeSentiment,
    extractDrivers,
    detectRegime,
    computeCurrencyScores,
    detectPrimaryPair,
    generatePairMatrix
  };
});
