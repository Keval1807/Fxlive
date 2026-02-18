// ================================================================
// SENTIMENT ENGINE TEST SUITE
// ================================================================

const {
    extractDrivers,
    detectRegime,
    computeCurrencyScores,
    detectPrimaryPair,
    generatePairMatrix,
    analyzeSentiment
} = require('./sentimentEngine.js');

// ──────────────────────────────────────────────────────────────
// TEST SCENARIOS
// ──────────────────────────────────────────────────────────────

const testCases = [
    {
        name: "ECB Surprise Rate Hike",
        article: "The European Central Bank unexpectedly raised interest rates by 25 basis points, citing persistent services inflation. President Lagarde warned that wage pressures remain elevated and inflation risks are tilted to the upside. Markets had largely priced a pause, so bond yields jumped immediately after the announcement. German 10-year yields climbed sharply. The Euro rallied across the board as traders repriced rate expectations.",
        expectedRegime: "Rate Regime",
        expectedPrimaryPair: "EUR/USD",
        expectedEURScore: "Positive",
        expectedBias: "Bullish"
    },
    {
        name: "UK GDP Contracts Unexpectedly",
        article: "UK GDP data showed a contraction of -0.4% versus expectations of slight growth. Business investment declined while consumer spending weakened. Economists warned recession risks are increasing. Bond yields fell as markets priced in faster rate cuts from the Bank of England. The Pound dropped immediately after the release.",
        expectedRegime: "Data Regime",
        expectedPrimaryPair: "GBP/USD",
        expectedGBPScore: "Negative",
        expectedBias: "Bearish"
    },
    {
        name: "BoJ Signals Policy Tightening",
        article: "The Bank of Japan signaled it may move away from ultra-loose monetary policy sooner than expected. Japanese government bond yields surged following the announcement. Traders began unwinding carry trades aggressively. USDJPY dropped sharply within minutes. Volatility in Yen pairs increased significantly.",
        expectedRegime: "Rate Regime",
        expectedPrimaryPair: "USD/JPY",
        expectedJPYScore: "Positive",
        expectedBias: "Bearish"
    },
    {
        name: "Strong Australian Employment",
        article: "Australian employment rose far above expectations, while unemployment fell. Wage growth accelerated in the latest report. Markets reduced expectations for near-term rate cuts from the Reserve Bank of Australia. Australian bond yields moved higher. The Australian Dollar strengthened broadly.",
        expectedRegime: "Data Regime",
        expectedPrimaryPair: "AUD/USD",
        expectedAUDScore: "Positive",
        expectedBias: "Bullish"
    },
    {
        name: "Oil Prices Surge",
        article: "Crude oil prices jumped sharply after supply disruptions in the Middle East. Canada, being a major oil exporter, benefited from improved trade expectations. Energy stocks rallied strongly. Investors increased exposure to commodity-linked currencies. The Canadian Dollar strengthened.",
        expectedRegime: "Economic", // or could be Risk
        expectedPrimaryPair: "USD/CAD",
        expectedCADScore: "Positive",
        expectedBias: "Bearish" // CAD strong = USD/CAD bearish
    },
    {
        name: "Hot US CPI",
        article: "US inflation surprised to the upside, especially in core services. Treasury yields spiked as traders reduced rate cut expectations. The Dollar strengthened immediately across majors. Equity markets pulled back slightly. Gold declined as real yields rose.",
        expectedRegime: "Data Regime",
        expectedPrimaryPair: "EUR/USD",
        expectedUSDScore: "Positive",
        expectedBias: "Bearish" // USD strong = EUR/USD bearish
    },
    {
        name: "Geopolitical Crisis",
        article: "Tensions in the Middle East intensified after fresh military strikes were reported overnight. Oil prices spiked as supply risks increased. Global equity markets declined amid rising uncertainty. Investors moved capital into safe-haven assets. Volatility indexes jumped sharply. Demand for defensive assets increased. Gold rallied to new highs while the Dollar strengthened.",
        expectedRegime: "Crisis Regime",
        expectedPrimaryPair: "XAU/USD", // Could be either XAU/USD or multiple
        expectedXAUScore: "Positive",
        expectedBias: "Bullish"
    }
];

// ──────────────────────────────────────────────────────────────
// TEST RUNNER
// ──────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════');
console.log('   INSTITUTIONAL SENTIMENT ENGINE - TEST SUITE');
console.log('═══════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;

testCases.forEach((test, index) => {
    console.log(`\n📋 TEST ${index + 1}: ${test.name}`);
    console.log('─'.repeat(60));
    
    try {
        // Run full analysis
        const result = analyzeSentiment(test.article);
        
        // Display results
        console.log(`\n🎯 Regime: ${result.regime}`);
        console.log(`📊 Weights: M=${result.weights.monetary}, E=${result.weights.economic}, R=${result.weights.risk}`);
        
        console.log('\n💱 Currency Scores:');
        Object.entries(result.currencyScores)
            .filter(([_, score]) => score !== 0)
            .forEach(([curr, score]) => {
                const arrow = score > 0 ? '↑' : score < 0 ? '↓' : '→';
                console.log(`   ${curr}: ${score.toFixed(2)} ${arrow}`);
            });
        
        console.log(`\n🎯 Primary Pair: ${result.primaryPair.name}`);
        console.log(`   Score: ${result.primaryPair.score.toFixed(2)}`);
        console.log(`   Bias: ${result.primaryPair.bias}`);
        
        console.log('\n📈 Top 5 Pair Rankings:');
        result.rankedPairs.slice(0, 5).forEach((pair, i) => {
            console.log(`   ${i + 1}. ${pair.pair}: ${pair.score.toFixed(2)} (${pair.bias})`);
        });
        
        console.log(`\n🔍 Drivers Detected: ${result.drivers.length}`);
        const driversByCategory = result.drivers.reduce((acc, d) => {
            acc[d.category] = (acc[d.category] || 0) + 1;
            return acc;
        }, {});
        console.log(`   Breakdown: ${JSON.stringify(driversByCategory)}`);
        
        // Validation
        let passed = true;
        const errors = [];
        
        if (result.regime !== test.expectedRegime && test.expectedRegime) {
            errors.push(`❌ Regime: expected ${test.expectedRegime}, got ${result.regime}`);
            passed = false;
        }
        
        if (result.primaryPair.name !== test.expectedPrimaryPair && test.expectedPrimaryPair) {
            errors.push(`❌ Primary Pair: expected ${test.expectedPrimaryPair}, got ${result.primaryPair.name}`);
            passed = false;
        }
        
        // Check score direction
        if (test.expectedEURScore === "Positive" && result.currencyScores.EUR <= 0) {
            errors.push(`❌ EUR should be positive, got ${result.currencyScores.EUR}`);
            passed = false;
        }
        if (test.expectedEURScore === "Negative" && result.currencyScores.EUR >= 0) {
            errors.push(`❌ EUR should be negative, got ${result.currencyScores.EUR}`);
            passed = false;
        }
        
        if (test.expectedGBPScore === "Positive" && result.currencyScores.GBP <= 0) {
            errors.push(`❌ GBP should be positive, got ${result.currencyScores.GBP}`);
            passed = false;
        }
        if (test.expectedGBPScore === "Negative" && result.currencyScores.GBP >= 0) {
            errors.push(`❌ GBP should be negative, got ${result.currencyScores.GBP}`);
            passed = false;
        }
        
        if (test.expectedUSDScore === "Positive" && result.currencyScores.USD <= 0) {
            errors.push(`❌ USD should be positive, got ${result.currencyScores.USD}`);
            passed = false;
        }
        if (test.expectedUSDScore === "Negative" && result.currencyScores.USD >= 0) {
            errors.push(`❌ USD should be negative, got ${result.currencyScores.USD}`);
            passed = false;
        }
        
        if (test.expectedJPYScore === "Positive" && result.currencyScores.JPY <= 0) {
            errors.push(`❌ JPY should be positive, got ${result.currencyScores.JPY}`);
            passed = false;
        }
        
        if (test.expectedAUDScore === "Positive" && result.currencyScores.AUD <= 0) {
            errors.push(`❌ AUD should be positive, got ${result.currencyScores.AUD}`);
            passed = false;
        }
        
        if (test.expectedCADScore === "Positive" && result.currencyScores.CAD <= 0) {
            errors.push(`❌ CAD should be positive, got ${result.currencyScores.CAD}`);
            passed = false;
        }
        
        if (test.expectedXAUScore === "Positive" && result.currencyScores.XAU <= 0) {
            errors.push(`❌ XAU should be positive, got ${result.currencyScores.XAU}`);
            passed = false;
        }
        
        // Display result
        if (passed) {
            console.log('\n✅ PASSED');
            passCount++;
        } else {
            console.log('\n⚠️  VALIDATION WARNINGS:');
            errors.forEach(err => console.log(`   ${err}`));
            failCount++;
        }
        
    } catch (error) {
        console.log(`\n❌ ERROR: ${error.message}`);
        console.log(error.stack);
        failCount++;
    }
});

console.log('\n═══════════════════════════════════════════════════════');
console.log(`   RESULTS: ${passCount} passed, ${failCount} failed`);
console.log('═══════════════════════════════════════════════════════\n');
