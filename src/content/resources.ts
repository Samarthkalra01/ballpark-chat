import type { CategoryKey } from "@/lib/constants";

export interface ResourceArticle {
  slug: string;
  title: string;
  subtitle: string;
  /** lucide-react icon name */
  icon: string;
  readTime: string;
  /** Category to pre-select when the reader clicks "Practise this now". */
  practiceCategory: CategoryKey;
  /** Trusted, static HTML authored here (not user input). */
  html: string;
}

const howToApproach = `
<p>Guesstimates look intimidating because they seem to demand a precise number out of thin air. They don't. Interviewers are grading your <strong>approach</strong> — can you break a messy problem into clean parts, make sensible assumptions, and arrive at a defensible range? Here is a five-step method that works for almost any guesstimate.</p>

<h2>1. Clarify the question</h2>
<p>Never start calculating until you know exactly what you're being asked. Restate the question in your own words and confirm scope: a city or a country? A day or a year? Units or rupees? New customers or total customers? A ten-second clarification saves you from solving the wrong problem.</p>

<h2>2. Choose your approach</h2>
<p>There are usually two routes. <strong>Top-down</strong> starts from a big population and narrows with filters (e.g., India's population → urban → smartphone owners → paying users). <strong>Bottom-up</strong> builds from a unit and scales up (e.g., sales per store × number of stores). You can also think <strong>demand-side</strong> (how much people want) versus <strong>supply-side</strong> (how much is produced). Say which you're using and why.</p>

<h2>3. Build a MECE tree</h2>
<p>Break the problem into parts that are Mutually Exclusive and Collectively Exhaustive — no overlaps, no gaps. Segmenting by age, geography, income, or usage frequency usually does the job. A clear tree is the single thing interviewers notice first.</p>

<h2>4. State assumptions with reasons</h2>
<p>Every number you invent should come with a one-line justification. "I'll assume 30% of urban Indians own a smartphone, because penetration is high in cities but far lower in rural areas." Reasoned assumptions are worth more than lucky ones.</p>

<h2>5. Calculate, sanity-check, and summarise</h2>
<p>Work step by step, keeping units consistent and rounding to make the maths tractable. When you land on a number, <strong>sanity-check</strong> it: is it the right order of magnitude? Does an alternate method land nearby? Finish with a crisp one-line answer and the key driver behind it.</p>

<h2>Worked example: cups of chai sold in Delhi per day</h2>
<p>Delhi has roughly 2 crore (20 million) people. Assume 60% drink chai regularly → 1.2 crore drinkers. Assume an average of 2 cups per drinker per day → 2.4 crore cups. Sanity check: that's about 1.2 cups per person per day across the whole city, which feels right for a tea-loving population. <strong>Answer: ~2–2.5 crore cups per day, driven mainly by the number of regular drinkers and cups per head.</strong></p>
`;

const datasheet = `
<p>Strong guesstimates lean on a handful of round "anchor" numbers you can recall instantly. Memorise the shape of these, not the decimals. <strong>Every figure below is approximate and must be verified against a current public source before you rely on it.</strong></p>

<p><strong>Last reviewed: not yet verified — update this date once you confirm the numbers.</strong></p>

<h2>India — demographics</h2>
<table>
<thead><tr><th>Metric</th><th>Approx. value</th></tr></thead>
<tbody>
<tr><td>Population</td><td>~1.4 billion (approx.)</td></tr>
<tr><td>Urban share</td><td>~35% (approx.)</td></tr>
<tr><td>Households</td><td>~30 crore (approx.)</td></tr>
<tr><td>Average household size</td><td>~4.5 people (approx.)</td></tr>
<tr><td>Smartphone users</td><td>~70 crore (approx.)</td></tr>
<tr><td>Working-age share (15–64)</td><td>~65% (approx.)</td></tr>
</tbody>
</table>

<h2>World</h2>
<table>
<thead><tr><th>Metric</th><th>Approx. value</th></tr></thead>
<tbody>
<tr><td>Population</td><td>~8 billion (approx.)</td></tr>
<tr><td>Urban share</td><td>~57% (approx.)</td></tr>
<tr><td>Global smartphone users</td><td>~4.5 billion (approx.)</td></tr>
<tr><td>Average life expectancy</td><td>~73 years (approx.)</td></tr>
</tbody>
</table>

<h2>Handy conversions</h2>
<ul>
<li>Working days in a year: ~250 (approx.)</li>
<li>Hours a shop is open: ~10–12 per day (approx.)</li>
<li>Weeks in a year: 52; days in a year: 365</li>
<li>1 crore = 10 million; 1 lakh = 100,000</li>
</ul>

<p>When you use any of these in an answer, say "approximately" out loud. Interviewers respect a candidate who signals that a number is a rough anchor, not a fact.</p>
`;

const tamSamSom = `
<p>TAM-SAM-SOM is a way to size a market in three nested layers. It stops you from quoting one giant number and calling it a day.</p>

<h2>The three layers</h2>
<ul>
<li><strong>TAM (Total Addressable Market):</strong> the entire demand if everyone who could possibly buy, did.</li>
<li><strong>SAM (Serviceable Available Market):</strong> the slice you can actually reach given your product, geography and channel.</li>
<li><strong>SOM (Serviceable Obtainable Market):</strong> the share you can realistically win in the near term, given competition.</li>
</ul>

<h2>Worked example: online test-prep for consulting aspirants in India</h2>
<p><strong>TAM:</strong> Say ~5 lakh students per year seriously target consulting/management roles. If each might spend ₹10,000 on prep, TAM ≈ ₹500 crore per year.</p>
<p><strong>SAM:</strong> Perhaps 40% are comfortable buying online and in your language/price band → 2 lakh students → ₹200 crore.</p>
<p><strong>SOM:</strong> As a new entrant against established players, winning 5% in year one is ambitious but plausible → ₹10 crore.</p>

<h2>Common mistakes</h2>
<ul>
<li>Treating TAM as the answer — interviewers want to see the funnel narrow.</li>
<li>Jumping to SOM without justifying the market-share assumption.</li>
<li>Double-counting customers across segments (breaks MECE).</li>
</ul>

<p>Picture three circles nested inside each other: the outer is TAM, the middle SAM, the inner SOM. Narrating that funnel out loud is what earns marks.</p>
`;

const marketSizing = `
<p>Market sizing is the most common guesstimate type. Two routes dominate, and knowing when to use each is half the battle.</p>

<h2>Top-down</h2>
<p>Start from a large, known population and apply filters until you reach your target group, then multiply by a per-user value. Best when reliable population data exists.</p>
<p><em>Example — market for running shoes in India:</em> 1.4bn people → ~35% urban → of those, say 20% run regularly → multiply by shoes per runner per year × price.</p>

<h2>Bottom-up</h2>
<p>Build from a single unit and scale. Best when you know a unit economics figure well (sales per store, per machine, per route).</p>
<p><em>Example — revenue of a coffee chain:</em> cups per store per day × price × stores × operating days.</p>

<h2>Demand-side vs supply-side</h2>
<p><strong>Demand-side</strong> asks how much customers want to consume. <strong>Supply-side</strong> asks how much is produced or available (number of outlets × capacity). When both are feasible, doing one and checking against the other is a powerful sanity check.</p>

<h2>Sanity-check techniques</h2>
<ul>
<li><strong>Per-capita test:</strong> divide your total by the population — is the per-head number believable?</li>
<li><strong>Cross-method check:</strong> does top-down land near bottom-up?</li>
<li><strong>Order-of-magnitude test:</strong> is the number in lakhs, crores, or thousands of crores — and does that feel right?</li>
</ul>

<p>End every market-sizing answer by naming the one or two assumptions your estimate is most sensitive to. That shows maturity.</p>
`;

const mece = `
<p>MECE — Mutually Exclusive, Collectively Exhaustive — is the quality test for any breakdown you make. It is the difference between a structure that impresses and one that leaks.</p>

<h2>What the two halves mean</h2>
<ul>
<li><strong>Mutually Exclusive:</strong> your categories don't overlap. A customer belongs to exactly one bucket.</li>
<li><strong>Collectively Exhaustive:</strong> your categories cover everything. No customer is left out.</li>
</ul>

<h2>Good segmentation axes</h2>
<ul>
<li><strong>Age bands:</strong> 0–14, 15–24, 25–44, 45–64, 65+.</li>
<li><strong>Geography:</strong> metro, tier-1, tier-2, rural.</li>
<li><strong>Income:</strong> low, middle, high.</li>
<li><strong>Usage:</strong> heavy, medium, light, non-user.</li>
</ul>

<h2>Non-MECE vs MECE</h2>
<p><strong>Not MECE:</strong> "students, working people, and people who use the internet." The last overlaps with the first two (gap and overlap at once).</p>
<p><strong>MECE:</strong> "by employment status — students, employed, self-employed, unemployed, retired." Every person fits exactly one bucket, and together they cover the population.</p>

<h2>Issue trees</h2>
<p>An issue tree applies MECE top to bottom. To size a business's profit: Profit = Revenue − Cost; Revenue = Price × Quantity; Cost = Fixed + Variable. Each split is MECE, so the branches never double-count.</p>

<p>Before you start calculating, glance at your tree and ask: "Any overlaps? Anything missing?" Fixing it then is free; fixing it after the maths is expensive.</p>
`;

export const RESOURCES: ResourceArticle[] = [
  {
    slug: "how-to-approach",
    title: "How to approach a guesstimate",
    subtitle: "The 5-step method interviewers expect",
    icon: "Compass",
    readTime: "5 min read",
    practiceCategory: "market_sizing",
    html: howToApproach,
  },
  {
    slug: "datasheet",
    title: "Datasheet",
    subtitle: "Handy numbers to anchor your assumptions",
    icon: "Table2",
    readTime: "4 min read",
    practiceCategory: "mathematical",
    html: datasheet,
  },
  {
    slug: "tam-sam-som",
    title: "TAM-SAM-SOM",
    subtitle: "Size the total, serviceable and obtainable market",
    icon: "Target",
    readTime: "5 min read",
    practiceCategory: "market_sizing",
    html: tamSamSom,
  },
  {
    slug: "market-sizing",
    title: "Market Sizing",
    subtitle: "Top-down vs bottom-up, with worked examples",
    icon: "PieChart",
    readTime: "6 min read",
    practiceCategory: "market_sizing",
    html: marketSizing,
  },
  {
    slug: "mece",
    title: "MECE Approach",
    subtitle: "Build structures with no gaps and no overlaps",
    icon: "Layers",
    readTime: "5 min read",
    practiceCategory: "revenue_profit",
    html: mece,
  },
];

export function getArticle(slug: string): ResourceArticle | undefined {
  return RESOURCES.find((a) => a.slug === slug);
}
