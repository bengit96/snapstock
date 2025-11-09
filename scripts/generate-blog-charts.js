const fs = require('fs');
const path = require('path');

// Create simple SVG chart placeholders
const createMomentumChart = () => `
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .chart-bg { fill: #ffffff; }
      .grid { stroke: #e5e7eb; stroke-width: 1; }
      .candle-green { fill: #10b981; stroke: #10b981; }
      .candle-red { fill: #ef4444; stroke: #ef4444; }
      .line-purple { stroke: #8b5cf6; stroke-width: 3; fill: none; }
      .text-title { font: bold 24px Arial; fill: #111827; }
      .text-label { font: bold 14px Arial; fill: #8b5cf6; }
      .volume { opacity: 0.5; }
    </style>
  </defs>

  <rect class="chart-bg" width="1200" height="600"/>

  <!-- Grid -->
  ${Array.from({length: 20}, (_, i) => `<line class="grid" x1="${60*i}" y1="0" x2="${60*i}" y2="600"/>`).join('')}
  ${Array.from({length: 10}, (_, i) => `<line class="grid" x1="0" y1="${60*i}" x2="1200" y2="${60*i}"/>`).join('')}

  <text class="text-title" x="50" y="40">Strong Momentum Example - Higher Highs &amp; Higher Lows</text>

  <!-- Candlesticks showing uptrend -->
  <rect class="candle-green" x="90" y="350" width="30" height="40"/>
  <line class="candle-green" x1="105" y1="340" x2="105" y2="395" stroke-width="2"/>

  <rect class="candle-green" x="160" y="335" width="30" height="45"/>
  <line class="candle-green" x1="175" y1="325" x2="175" y2="385" stroke-width="2"/>

  <rect class="candle-green" x="230" y="310" width="30" height="50"/>
  <line class="candle-green" x1="245" y1="295" x2="245" y2="370" stroke-width="2"/>

  <rect class="candle-green" x="300" y="280" width="30" height="55"/>
  <line class="candle-green" x1="315" y1="265" x2="315" y2="345" stroke-width="2"/>

  <rect class="candle-green" x="370" y="270" width="30" height="45"/>
  <line class="candle-green" x1="385" y1="260" x2="385" y2="325" stroke-width="2"/>

  <rect class="candle-green" x="440" y="250" width="30" height="50"/>
  <line class="candle-green" x1="455" y1="235" x2="455" y2="310" stroke-width="2"/>

  <rect class="candle-green" x="510" y="225" width="30" height="55"/>
  <line class="candle-green" x1="525" y1="210" x2="525" y2="290" stroke-width="2"/>

  <rect class="candle-green" x="580" y="200" width="30" height="60"/>
  <line class="candle-green" x1="595" y1="185" x2="595" y2="270" stroke-width="2"/>

  <rect class="candle-green" x="650" y="190" width="30" height="50"/>
  <line class="candle-green" x1="665" y1="175" x2="665" y2="250" stroke-width="2"/>

  <rect class="candle-green" x="720" y="165" width="30" height="55"/>
  <line class="candle-green" x1="735" y1="150" x2="735" y2="230" stroke-width="2"/>

  <rect class="candle-green" x="790" y="140" width="30" height="60"/>
  <line class="candle-green" x1="805" y1="125" x2="805" y2="210" stroke-width="2"/>

  <rect class="candle-green" x="860" y="125" width="30" height="55"/>
  <line class="candle-green" x1="875" y1="110" x2="875" y2="190" stroke-width="2"/>

  <!-- Trendline -->
  <line class="line-purple" x1="105" y1="390" x2="875" y2="140"/>

  <!-- Volume bars -->
  <rect class="candle-green volume" x="97" y="520" width="16" height="40"/>
  <rect class="candle-green volume" x="167" y="510" width="16" height="50"/>
  <rect class="candle-green volume" x="237" y="490" width="16" height="70"/>
  <rect class="candle-green volume" x="307" y="480" width="16" height="80"/>
  <rect class="candle-green volume" x="377" y="500" width="16" height="60"/>
  <rect class="candle-green volume" x="447" y="490" width="16" height="70"/>
  <rect class="candle-green volume" x="517" y="470" width="16" height="90"/>
  <rect class="candle-green volume" x="587" y="460" width="16" height="100"/>
  <rect class="candle-green volume" x="657" y="485" width="16" height="75"/>
  <rect class="candle-green volume" x="727" y="475" width="16" height="85"/>
  <rect class="candle-green volume" x="797" y="450" width="16" height="110"/>
  <rect class="candle-green volume" x="867" y="470" width="16" height="90"/>

  <!-- Labels -->
  <text class="text-label" x="150" y="450">Higher Lows</text>
  <text class="text-label" x="800" y="200">Higher Highs</text>
  <text class="text-label" x="450" y="440" fill="#10b981">Increasing Volume</text>
  <text style="font: 12px Arial; fill: #666;" x="20" y="540">Volume</text>
</svg>`;

const createVWAPChart = () => `
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .chart-bg { fill: #ffffff; }
      .grid { stroke: #e5e7eb; stroke-width: 1; }
      .candle-green { fill: #10b981; stroke: #10b981; }
      .candle-red { fill: #ef4444; stroke: #ef4444; }
      .line-vwap { stroke: #f59e0b; stroke-width: 3; fill: none; }
      .text-title { font: bold 24px Arial; fill: #111827; }
      .text-label { font: bold 14px Arial; }
      .arrow { fill: #10b981; }
    </style>
  </defs>

  <rect class="chart-bg" width="1200" height="600"/>

  <!-- Grid -->
  ${Array.from({length: 20}, (_, i) => `<line class="grid" x1="${60*i}" y1="0" x2="${60*i}" y2="600"/>`).join('')}
  ${Array.from({length: 10}, (_, i) => `<line class="grid" x1="0" y1="${60*i}" x2="1200" y2="${60*i}"/>`).join('')}

  <text class="text-title" x="50" y="40">VWAP Pullback Entry Setup</text>

  <!-- Candlesticks -->
  <rect class="candle-green" x="90" y="340" width="35" height="50"/>
  <line class="candle-green" x1="107" y1="325" x2="107" y2="395" stroke-width="2"/>

  <rect class="candle-green" x="170" y="310" width="35" height="60"/>
  <line class="candle-green" x1="187" y1="295" x2="187" y2="380" stroke-width="2"/>

  <rect class="candle-green" x="250" y="275" width="35" height="65"/>
  <line class="candle-green" x1="267" y1="260" x2="267" y2="350" stroke-width="2"/>

  <rect class="candle-green" x="330" y="260" width="35" height="50"/>
  <line class="candle-green" x1="347" y1="245" x2="347" y2="320" stroke-width="2"/>

  <rect class="candle-red" x="410" y="285" width="35" height="45"/>
  <line class="candle-red" x1="427" y1="275" x2="427" y2="340" stroke-width="2"/>

  <rect class="candle-red" x="490" y="305" width="35" height="40"/>
  <line class="candle-red" x1="507" y1="295" x2="507" y2="355" stroke-width="2"/>

  <rect class="candle-red" x="570" y="325" width="35" height="35"/>
  <line class="candle-red" x1="587" y1="315" x2="587" y2="370" stroke-width="2"/>

  <!-- Bounce off VWAP -->
  <rect class="candle-green" x="650" y="310" width="35" height="55"/>
  <line class="candle-green" x1="667" y1="300" x2="667" y2="370" stroke-width="2"/>

  <rect class="candle-green" x="730" y="275" width="35" height="60"/>
  <line class="candle-green" x1="747" y1="260" x2="747" y2="345" stroke-width="2"/>

  <rect class="candle-green" x="810" y="240" width="35" height="65"/>
  <line class="candle-green" x1="827" y1="225" x2="827" y2="315" stroke-width="2"/>

  <rect class="candle-green" x="890" y="215" width="35" height="60"/>
  <line class="candle-green" x1="907" y1="200" x2="907" y2="285" stroke-width="2"/>

  <rect class="candle-green" x="970" y="195" width="35" height="55"/>
  <line class="candle-green" x1="987" y1="180" x2="987" y2="260" stroke-width="2"/>

  <!-- VWAP line -->
  <path class="line-vwap" d="M 107 360 L 187 353 L 267 346 L 347 339 L 427 332 L 507 325 L 587 318 L 667 311 L 747 304 L 827 297 L 907 290 L 987 283"/>

  <text style="font: bold 16px Arial; fill: #f59e0b;" x="1000" y="285">VWAP</text>

  <!-- Entry arrow -->
  <polygon class="arrow" points="667,280 647,240 687,240"/>
  <text class="text-label" fill="#10b981" x="640" y="230">Entry</text>

  <!-- Labels -->
  <text class="text-label" fill="#ef4444" x="450" y="400">Pullback to VWAP</text>
  <text class="text-label" fill="#10b981" x="750" y="220">Continuation Higher</text>
</svg>`;

const createPullbackChart = () => `
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .chart-bg { fill: #ffffff; }
      .grid { stroke: #e5e7eb; stroke-width: 1; }
      .candle-green { fill: #10b981; stroke: #10b981; }
      .candle-red { fill: #ef4444; stroke: #ef4444; }
      .support-line { stroke: #3b82f6; stroke-width: 2; fill: none; }
      .support-dashed { stroke: #3b82f6; stroke-width: 2; fill: none; stroke-dasharray: 5,5; }
      .text-title { font: bold 24px Arial; fill: #111827; }
      .text-label { font: bold 16px Arial; }
      .arrow { fill: #10b981; }
    </style>
  </defs>

  <rect class="chart-bg" width="1200" height="600"/>

  <!-- Grid -->
  ${Array.from({length: 20}, (_, i) => `<line class="grid" x1="${60*i}" y1="0" x2="${60*i}" y2="600"/>`).join('')}
  ${Array.from({length: 10}, (_, i) => `<line class="grid" x1="0" y1="${60*i}" x2="1200" y2="${60*i}"/>`).join('')}

  <text class="text-title" x="50" y="40">First Pullback Entry Pattern</text>

  <!-- Phase 1: Initial Move -->
  <rect class="candle-green" x="100" y="350" width="40" height="50"/>
  <line class="candle-green" x1="120" y1="335" x2="120" y2="405" stroke-width="2"/>

  <rect class="candle-green" x="190" y="310" width="40" height="60"/>
  <line class="candle-green" x1="210" y1="295" x2="210" y2="380" stroke-width="2"/>

  <rect class="candle-green" x="280" y="265" width="40" height="70"/>
  <line class="candle-green" x1="300" y1="248" x2="300" y2="345" stroke-width="2"/>

  <rect class="candle-green" x="370" y="225" width="40" height="75"/>
  <line class="candle-green" x1="390" y1="208" x2="390" y2="310" stroke-width="2"/>

  <!-- Phase 2: Pullback/Consolidation -->
  <rect class="candle-red" x="460" y="255" width="40" height="50"/>
  <line class="candle-red" x1="480" y1="245" x2="480" y2="315" stroke-width="2"/>

  <rect class="candle-green" x="550" y="270" width="40" height="40"/>
  <line class="candle-green" x1="570" y1="260" x2="570" y2="320" stroke-width="2"/>

  <rect class="candle-green" x="640" y="275" width="40" height="35"/>
  <line class="candle-green" x1="660" y1="265" x2="660" y2="320" stroke-width="2"/>

  <!-- Phase 3: Second Leg -->
  <rect class="candle-green" x="730" y="245" width="40" height="60"/>
  <line class="candle-green" x1="750" y1="230" x2="750" y2="315" stroke-width="2"/>

  <rect class="candle-green" x="820" y="210" width="40" height="65"/>
  <line class="candle-green" x1="840" y1="195" x2="840" y2="285" stroke-width="2"/>

  <rect class="candle-green" x="910" y="175" width="40" height="70"/>
  <line class="candle-green" x1="930" y1="160" x2="930" y2="255" stroke-width="2"/>

  <rect class="candle-green" x="1000" y="150" width="40" height="65"/>
  <line class="candle-green" x1="1020" y1="135" x2="1020" y2="225" stroke-width="2"/>

  <!-- Support line -->
  <line class="support-line" x1="370" y1="305" x2="660" y2="305"/>
  <line class="support-dashed" x1="660" y1="305" x2="1020" y2="305"/>

  <text style="font: bold 14px Arial; fill: #3b82f6;" x="480" y="325">Support Level</text>

  <!-- Entry arrow -->
  <polygon class="arrow" points="750,280 730,230 770,230"/>
  <text class="text-label" fill="#10b981" x="720" y="220">Entry</text>

  <!-- Phase labels -->
  <text class="text-label" fill="#10b981" x="200" y="450">Initial Move</text>
  <text class="text-label" fill="#f59e0b" x="450" y="370">Consolidation</text>
  <text class="text-label" fill="#10b981" x="850" y="120">Second Leg Higher</text>
</svg>`;

// Ensure directory exists
const blogDir = path.join(__dirname, '../public/blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Write SVG files
fs.writeFileSync(path.join(blogDir, 'momentum-chart.svg'), createMomentumChart());
fs.writeFileSync(path.join(blogDir, 'vwap-chart.svg'), createVWAPChart());
fs.writeFileSync(path.join(blogDir, 'pullback-chart.svg'), createPullbackChart());

console.log('Blog chart images generated successfully!');
console.log('- momentum-chart.svg');
console.log('- vwap-chart.svg');
console.log('- pullback-chart.svg');
