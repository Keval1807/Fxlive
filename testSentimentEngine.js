/*
  Minimal deterministic tests for sentimentEngine.js
  Run:
    node testSentimentEngine.js
*/

const SentimentEngine = require('./sentimentEngine.js');

function assert(name, cond) {
  if (!cond) {
    console.error('✗', name);
    process.exitCode = 1;
  } else {
    console.log('✓', name);
  }
}

function runCase(label, text) {
  const a = SentimentEngine.analyzeSentiment(text);
  console.log('\nCASE:', label);
  console.log('Regime:', a.regime);
  console.log('Primary:', a.primaryPair);
  console.log('Top 3:', (a.rankedPairs || []).slice(0, 3));
  return a;
}

// 1) Rate regime / hawkish
const c1 = runCase(
  'Hawkish rates story',
  'Federal Reserve signals rate hike and further tightening as inflation remains persistent. US dollar firms.'
);
assert('c1 has regime', typeof c1.regime === 'string');
assert('c1 has weights', typeof c1.weights === 'object');
assert('c1 has rankedPairs array', Array.isArray(c1.rankedPairs));
assert('c1 primaryPair exists', !!c1.primaryPair);

// 2) Data regime / weak data
const c2 = runCase(
  'Weak data story',
  'US data misses estimates as retail sales down and PMI falls. Markets reassess growth outlook.'
);
assert('c2 has currencyScores', typeof c2.currencyScores === 'object');

// 3) Crisis regime / risk-off
const c3 = runCase(
  'Risk-off crisis story',
  'Geopolitical conflict escalates, markets plunge in risk-off move, safe haven demand rises for the yen.'
);
assert('c3 drivers present (may be empty but array)', Array.isArray(c3.drivers));

if (!process.exitCode) {
  console.log('\nAll tests passed.');
}
