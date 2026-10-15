import {
  CaseAttempt,
  DatasheetMetric,
  GuesstimateQuestion,
  StudentProfile,
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Student',
  university: 'Oxford / LSE / Ivy League',
  targetRole: 'Management Consultant Associate',
  targetFirm: 'McKinsey & Company',
  targetYear: '2027 Intake',
  streakDays: 7,
  completedCasesCount: 14,
  averageRating: 7.8,
};

export const INITIAL_QUESTIONS: GuesstimateQuestion[] = [
  {
    id: 'q-tennis-london',
    title: 'Estimate the number of tennis balls sold in London annually',
    category: 'market-sizing',
    categoryLabel: 'Market Sizing',
    difficulty: 'medium',
    timeLimitMinutes: 45,
    region: 'UK / London',
    industry: 'Sports & Retail',
    contextPrompt:
      'A leading global sporting goods brand is evaluating warehouse distribution capacity in Greater London. You need to estimate the total volume of tennis balls sold across London annually.',
    keyDataPoints: [
      { label: 'London Population', value: '~9 Million' },
      { label: 'UK Tennis Participation Rate', value: '~5% of urban population' },
      { label: 'Average Tennis Clubs/Courts', value: '~1,200 courts across London' },
      { label: 'Standard Tube Can Size', value: '3 or 4 balls per pressurized tube' },
    ],
    suggestedStructure: [
      '1. Clarify parameters (Greater London vs City, individual buyers vs tennis clubs & tournaments).',
      '2. Top-down Demand Segmentation: Regular players vs Casual players vs Clubs/Schools.',
      '3. Annual Consumption Math: (Players × Matches/Year × Balls Used/Match) + (Club/Tournament Bulk Usage).',
      '4. Sanity Check against total court capacity or UK retail imports.',
      '5. Synthesis & Recommendation for warehouse logistics.',
    ],
    modelAnswer: {
      summary:
        'A comprehensive top-down segmentation yields approximately 3.2 Million to 3.8 Million tennis balls sold in London per year.',
      stepByStep: [
        {
          title: 'Step 1: Population & Player Breakdown',
          detail:
            'Population of London = 9M. Divide into age demographics: 0-14 (15%), 15-60 (65%), 60+ (20%). Active tennis playing rate is highest in 15-60 group (~6%) and youth (~4%). Total active players ≈ 450,000.',
          calculation: '9,000,000 × 5% average participation = 450,000 players',
        },
        {
          title: 'Step 2: Frequency & Ball Replacement Rate',
          detail:
            'Frequent players (20% of 450k = 90k) play twice/month, using 3 new balls every 3 sessions = 24 balls/year. Casual players (80% of 450k = 360k) play 4 times/year, using 3 balls/year = 3 balls/year.',
          calculation:
            '(90,000 × 24) + (360,000 × 3) = 2,160,000 + 1,080,000 = 3,240,000 balls/year',
        },
        {
          title: 'Step 3: Institutional & Club Demand (B2B)',
          detail:
            '1,200 courts in London. Each court hosts ~8 hours of play/day in spring/summer (~200 days/year). Coaching & tournament balls replaced every 2 weeks = 400,000 additional balls/year.',
          calculation: '1,200 courts × 350 balls/court/year = 420,000 balls/year',
        },
        {
          title: 'Step 4: Total & Sanity Check',
          detail:
            'Total Annual Demand = 3.24M (Consumer) + 0.42M (Clubs) = ~3.66 Million balls sold per year (~1.2M cans of 3 balls).',
          calculation: '3,660,000 balls ÷ 9M residents = 0.4 balls per resident/year. Highly plausible.',
        },
      ],
      sanityCheck:
        'Cross-checking with UK total tennis imports (~20M balls annually) indicates London (14% of UK population with higher-than-average disposable income and Wimbledon influence) consuming ~18-20% of UK volume (~3.6M) aligns cleanly.',
      executiveSummary:
        'The annual demand for tennis balls in Greater London is approximately 3.66 Million units ($5.5M market value at ~£1.20/ball). Distribution warehouses should prepare for a 3x seasonal spike around June-July during Wimbledon.',
    },
  },
  {
    id: 'q-sushi-nyc',
    title: 'Estimate the annual revenue of a high-end sushi restaurant in Manhattan',
    category: 'revenue-profit',
    categoryLabel: 'Revenue/Profit',
    difficulty: 'medium',
    timeLimitMinutes: 45,
    region: 'US / New York',
    industry: 'Hospitality & Dining',
    contextPrompt:
      'An Omakase sushi restaurant with 18 seats in Midtown Manhattan wants to evaluate its revenue potential and benchmark profitability against benchmark NYC fine-dining standards.',
    keyDataPoints: [
      { label: 'Seating Capacity', value: '18 counter seats' },
      { label: 'Average Omakase Price', value: '$180 per person (excl. alcohol & tax)' },
      { label: 'Beverage & Add-ons', value: '+$40 per person average' },
      { label: 'Operating Days', value: '6 days per week (310 days/year)' },
    ],
    suggestedStructure: [
      '1. Revenue Drivers: Dine-in Seat Occupancy × Turnovers × Average Check + Beverage Premium.',
      '2. Time Breakdown: Lunch seatings vs Dinner seatings.',
      '3. Occupancy Calibration: Weekday vs Weekend utilization rates.',
      '4. Total Annual Revenue Calculation.',
      '5. Profitability & Sanity Check (Food cost, labor, NYC rent).',
    ],
    modelAnswer: {
      summary:
        'An 18-seat high-end Omakase restaurant operating in Midtown Manhattan generates approximately $2.7 Million to $3.1 Million in annual revenue.',
      stepByStep: [
        {
          title: 'Step 1: Seatings & Capacity',
          detail:
            'Lunch: 2 seatings at 12:00 PM and 1:30 PM (18 seats × 2 = 36 seat capacity/day). Dinner: 3 seatings at 5:30 PM, 7:30 PM, 9:30 PM (18 seats × 3 = 54 seat capacity/day). Total capacity = 90 covers/day.',
        },
        {
          title: 'Step 2: Utilization Rates',
          detail:
            'Lunch average occupancy: 60% (~22 covers). Dinner average occupancy: 85% (~46 covers). Total daily covers = ~68 guests.',
          calculation: '68 guests/day × 310 operating days = 21,080 guests/year',
        },
        {
          title: 'Step 3: Average Spend',
          detail:
            'Lunch tasting menu: $110 + $20 beverage = $130 avg. Dinner tasting menu: $200 + $50 sake/wine = $250 avg. Blended average spend = ~$220 per guest.',
          calculation: '21,080 guests × $220/guest = $4,637,600 maximum blended revenue.',
        },
        {
          title: 'Step 4: Annual Revenue Realization',
          detail:
            'Adjusting for seasonal slowdowns in August/January and private event buyouts, realized annual gross revenue is ~$2.85 Million.',
        },
      ],
      sanityCheck:
        '18 seats earning ~$2.85M equals ~$158,000 revenue per seat/year, which matches benchmark top-tier NYC sushi counters ($140k-$180k/seat).',
      executiveSummary:
        'At $2.85M revenue with a 25% net operating margin (due to high $220 average ticket), net profit stands at ~$710,000 annually.',
    },
  },
  {
    id: 'q-ebus-berlin',
    title: 'Calculate total daily electricity consumption of electric buses in Berlin',
    category: 'mathematical',
    categoryLabel: 'Mathematical',
    difficulty: 'challenging',
    timeLimitMinutes: 45,
    region: 'Germany / EU',
    industry: 'Transit & Energy',
    contextPrompt:
      'The Berlin transit authority (BVG) plans to fully transition its public bus fleet to 100% electric. You must calculate total daily electricity grid demand (in MWh) required to charge the fleet.',
    keyDataPoints: [
      { label: 'Total Berlin Bus Fleet', value: '~1,500 active buses' },
      { label: 'Average Daily Distance per Bus', value: '220 km/day' },
      { label: 'e-Bus Energy Efficiency', value: '1.2 kWh per km (including HVAC)' },
      { label: 'Charging Efficiency Loss', value: '10% loss at charging stations' },
    ],
    suggestedStructure: [
      '1. Define fleet metrics (Active operating buses vs backup/maintenance reserve).',
      '2. Distance & Mileage calculation across routes.',
      '3. Direct battery energy requirement (kWh/day).',
      '4. Grid demand factoring charging station energy loss.',
      '5. Sanity check relative to Berlin overall daily power consumption.',
    ],
    modelAnswer: {
      summary:
        'The fully electrified Berlin bus fleet requires approximately 435 MegaWatt-hours (MWh) of electricity per day from the local power grid.',
      stepByStep: [
        {
          title: 'Step 1: Active Operating Fleet',
          detail:
            'Total fleet = 1,500 buses. 90% in active service daily (1,350 buses), 10% in depot maintenance or spare reserve.',
        },
        {
          title: 'Step 2: Fleet Daily Distance',
          detail:
            '1,350 buses × 220 km per day = 297,000 total vehicle-kilometers daily across Berlin.',
          calculation: '1,350 × 220 km = 297,000 km',
        },
        {
          title: 'Step 3: Direct Battery Energy Requirement',
          detail:
            '297,000 km × 1.3 kWh/km (accounting for summer A/C & winter heating) = 386,100 kWh of battery power needed.',
          calculation: '297,000 km × 1.3 kWh = 386,100 kWh = ~386.1 MWh',
        },
        {
          title: 'Step 4: Grid Power Requirement',
          detail:
            'Adding 10% grid-to-battery charging loss (AC/DC conversion & cable heat): 386.1 MWh ÷ 0.90 = ~429 MWh/day.',
          calculation: '386.1 MWh ÷ 0.9 = 429 MWh per day',
        },
      ],
      sanityCheck:
        'Berlin consumes ~38 GWh per day total energy. 0.429 GWh bus charging represents ~1.1% of Berlin total grid power, which is manageable with overnight off-peak smart charging.',
      executiveSummary:
        'Charging the 1,350 active e-buses demands 429 MWh daily. Peak charging power required at depots during overnight hours (11 PM - 5 AM) will be ~71.5 MW.',
    },
  },
  {
    id: 'q-smartphones-india',
    title: 'How many smartphones are replaced every year in India?',
    category: 'market-sizing',
    categoryLabel: 'Market Sizing',
    difficulty: 'medium',
    timeLimitMinutes: 45,
    region: 'India',
    industry: 'Consumer Tech',
    contextPrompt:
      'A global consumer electronics brand wants to estimate the annual smartphone replacement volume in India to assess trade-in and refurbished market opportunities.',
    keyDataPoints: [
      { label: 'India Total Population', value: '1.4 Billion' },
      { label: 'Smartphone Penetration', value: '~50-55% of population' },
      { label: 'Average Replacement Cycle', value: '2.5 - 3 years' },
    ],
    suggestedStructure: [
      '1. Calculate Installed Base of smartphone users in India.',
      '2. Segment by Income/Urban vs Rural adoption rates.',
      '3. Calculate Replacement Frequency across segments.',
      '4. Add First-time buyer volume vs Pure Replacement volume.',
      '5. Sanity Check against quarterly shipment reports.',
    ],
    modelAnswer: {
      summary:
        'Approximately 140 Million to 160 Million smartphones are replaced or upgraded in India annually.',
      stepByStep: [
        {
          title: 'Step 1: Installed Base',
          detail:
            '1.4B population. Household size = 4. Urban (35% = 490M, 80% penetration = 392M phones), Rural (65% = 910M, 40% penetration = 364M phones). Total installed base = ~750 Million active smartphones.',
        },
        {
          title: 'Step 2: Replacement Cycle',
          detail:
            'Urban users replace phone every 2.5 years (annual replacement rate = 40%). Rural users replace every 3.5 years (annual replacement rate = ~28.5%).',
          calculation:
            '(392M × 40%) + (364M × 28.5%) = 156.8M + 103.7M = ~260M replacements over cycle = ~140M replacements/year.',
        },
        {
          title: 'Step 3: Market Size Realization',
          detail:
            'Total annual smartphone shipments in India = ~150 Million units, of which 90% (~135M) are replacements and 10% (~15M) are first-time buyers upgrading from feature phones.',
        },
      ],
      sanityCheck:
        '140M replacements divided by 750M installed base gives an overall replacement cycle of ~3.2 years, consistent with Counterpoint Research reports for emerging markets.',
      executiveSummary:
        'India’s annual smartphone replacement market volume is ~140 Million units ($28 Billion market value at $200 ASP). Trade-in programs currently capture under 12% of this volume, representing a high-growth opportunity.',
    },
  },
];

export const MOCK_PAST_ATTEMPTS: CaseAttempt[] = [
  {
    id: 'attempt-101',
    date: 'Oct 24, 2026',
    questionTitle: 'Estimate the number of tennis balls sold in London annually',
    category: 'market-sizing',
    categoryLabel: 'Market Entry / Sizing',
    difficulty: 'medium',
    timeSpentSeconds: 1840,
    studentAnswer: `## Approach & Framework
To estimate the annual volume of tennis balls sold in Greater London, I used a **top-down demand-side market sizing framework** segmented into Consumer Players and Institutional Clubs/Courts.

### 1. Population & Demographics
- Greater London Population: 9 Million
- Target demographic (Age 15 - 65): ~65% = 5.85 Million
- Tennis Participation Rate: ~5% = ~292,500 active tennis players in London.

### 2. Player Frequency & Ball Consumption
- **Avid Players (20% = 58,500):** Play 3x/month. Use 1 tube (3 balls) every 2 matches.
  - Annual balls = 58,500 × 18 tubes/yr × 3 = 3,159,000 balls.
- **Casual Players (80% = 234,000):** Play 5x/year. Buy 1 tube of 3 balls per year.
  - Annual balls = 234,000 × 3 = 702,000 balls.
- Subtotal Consumer = **3.86 Million balls**.

### 3. Institutional Usage (Clubs & Schools)
- ~1,000 tennis courts in Greater London.
- Replaced 4 times/year with bulk packs (72 balls/pack).
- Institutional demand = 1,000 × 4 × 72 = **288,000 balls**.

### 4. Total Market & Sanity Check
- Total Estimated Annual Sales = **4.15 Million balls** (~1.38 Million cans).
- Sanity check: 4.15M balls / 9M population = ~0.46 balls per resident. Seems very realistic considering Wimbledon popularity in London.`,
    evaluation: {
      overallScore: 8,
      ratingLabel: 'MBB Interview Ready',
      whatYouDidWell: [
        'Excellent initial framework structuring, capturing all key market dimensions cleanly (B2C + B2B).',
        'Quick and accurate mental math during the demand estimation phase.',
        'Strong executive summary at the conclusion with actionable market context.',
      ],
      areasForImprovement: [
        'Consider deeper analysis on competitor response or retail import distribution channels before concluding.',
        'Synthesis could be tighter; avoid restating raw intermediate numbers in the final recommendation.',
      ],
      rubric: {
        structuringScore: 2.8,
        benchmarksScore: 2.5,
        mathScore: 2.0,
        synthesisScore: 1.7,
      },
      feedbackSummary:
        'Your approach demonstrated classic McKinsey MECE structuring. You correctly identified both consumer and institutional demand streams. Math was crisp with zero arithmetic flaws.',
      calculationErrorsFound: [],
      missingKeyAssumptions: [
        'Did not explicitly account for tourist/Wimbledon peak summer visitor spikes.',
      ],
      modelComparison:
        'Your final figure of 4.15M is within 12% of the benchmark model (3.66M). Your player frequency assumption for avid players was slightly higher, but well justified.',
    },
  },
  {
    id: 'attempt-102',
    date: 'Oct 21, 2026',
    questionTitle: 'Estimate annual revenue of a luxury gym chain in NYC',
    category: 'revenue-profit',
    categoryLabel: 'Profitability',
    difficulty: 'challenging',
    timeSpentSeconds: 2210,
    studentAnswer: `### Revenue Framework
1. Membership Revenue: Number of members × Monthly fee × 12.
2. Personal Training Revenue: Members × PT adoption rate × Sessions/month × Fee/session.
3. Auxiliary Services: Smoothie bar, retail merchandise, spa.

### Numbers
- NYC Locations: 8 clubs
- Members per club: 2,500 members
- Total Members = 20,000
- Monthly Dues = $280
- Annual Dues Revenue = 20,000 × $280 × 12 = $67,200,000.
- PT Revenue: 15% adoption = 3,000 members taking 4 sessions/mo @ $120 = $17,280,000.
- Total Revenue = ~$84.5 Million.`,
    evaluation: {
      overallScore: 6.5,
      ratingLabel: 'Needs Math Precision',
      whatYouDidWell: [
        'Clear breakdown of revenue buckets (Dues + Personal Training + Ancillary).',
        'Good baseline knowledge of NYC luxury gym pricing ($280/month).',
      ],
      areasForImprovement: [
        'Missed member churn / attrition rate (luxury gyms typically lose 25-30% of members per year).',
        'Did not factor capacity constraints (square footage per member during peak hours 6-8 AM).',
        'Lacked a proper executive synthesis for the partner.',
      ],
      rubric: {
        structuringScore: 2.0,
        benchmarksScore: 2.0,
        mathScore: 1.5,
        synthesisScore: 1.0,
      },
      feedbackSummary:
        'Solid top-line framework, but missed key operational realities like member churn and peak capacity bottlenecks.',
      calculationErrorsFound: [],
      missingKeyAssumptions: [
        'Member Churn / Retention rate',
        'Capacity constraints during peak hours',
      ],
      modelComparison:
        'Model benchmark estimates $62M revenue after accounting for a 28% annual churn rate and join fees.',
    },
  },
  {
    id: 'attempt-103',
    date: 'Oct 18, 2026',
    questionTitle: 'Market sizing for cloud software in healthcare',
    category: 'market-sizing',
    categoryLabel: 'M&A Strategy',
    difficulty: 'easy',
    timeSpentSeconds: 1250,
    studentAnswer: `Used a hospital-bed based bottom-up model. Total US Hospitals = ~6,000. Divided by size (Large 500+ beds, Medium 100-500 beds, Small <100 beds). Average SaaS seat license per hospital = $150k/yr. Total TAM = $1.2 Billion.`,
    evaluation: {
      overallScore: 9,
      ratingLabel: 'Exceptional',
      whatYouDidWell: [
        'Outstanding bottom-up hospital size segmentation.',
        'Extremely accurate seat license benchmarks for EHR software.',
        'Concise and structured executive delivery.',
      ],
      areasForImprovement: [
        'Could briefly explore outpatient clinics in addition to acute care hospitals.',
      ],
      rubric: {
        structuringScore: 3.0,
        benchmarksScore: 2.8,
        mathScore: 2.0,
        synthesisScore: 1.8,
      },
      feedbackSummary:
        'Near flawless execution of a tech M&A market sizing scenario.',
      calculationErrorsFound: [],
      missingKeyAssumptions: [],
      modelComparison: 'Matched model benchmark within 4%.',
    },
  },
  {
    id: 'attempt-104',
    date: 'Oct 15, 2026',
    questionTitle: 'Price points for electric scooter rentals in Paris',
    category: 'unconventional',
    categoryLabel: 'Pricing',
    difficulty: 'medium',
    timeSpentSeconds: 1620,
    studentAnswer: `Evaluated willingness to pay vs cost-plus vs competitor positioning (Metro ticket €2.10 vs Taxi €12). Recommended €1 unlock fee + €0.25 per minute.`,
    evaluation: {
      overallScore: 7.5,
      ratingLabel: 'Strong Progress',
      whatYouDidWell: [
        'Good comparative pricing against substitute transit options.',
        'Structured price elasticities accurately.',
      ],
      areasForImprovement: [
        'Consider municipal fleet caps and licensing fees imposed by Paris city hall.',
      ],
      rubric: {
        structuringScore: 2.3,
        benchmarksScore: 2.2,
        mathScore: 1.8,
        synthesisScore: 1.2,
      },
      feedbackSummary: 'Good logic on value-based pricing, minor municipal policy gaps.',
      calculationErrorsFound: [],
      missingKeyAssumptions: ['City regulatory fleet caps'],
      modelComparison: 'Within expected price range.',
    },
  },
];

export const CHEAT_SHEET_DATASHEET: DatasheetMetric[] = [
  // Demographics
  { id: 'm1', metric: 'US Population', value: '335 Million', category: 'Demographics', region: 'US', sourceOrNote: 'Household size: 2.5 people (~134M households)' },
  { id: 'm2', metric: 'UK Population', value: '68 Million', category: 'Demographics', region: 'UK', sourceOrNote: 'Greater London: 9M population' },
  { id: 'm3', metric: 'EU Population', value: '450 Million', category: 'Demographics', region: 'Europe', sourceOrNote: 'Germany: 84M, France: 68M, Italy: 59M' },
  { id: 'm4', metric: 'India Population', value: '1.42 Billion', category: 'Demographics', region: 'India', sourceOrNote: 'Urban population: 35%, Rural: 65%' },
  { id: 'm5', metric: 'Global Population', value: '8.1 Billion', category: 'Demographics', region: 'Global', sourceOrNote: 'Developed markets: ~1.2B, Emerging: ~6.9B' },
  { id: 'm6', metric: 'Average Life Expectancy', value: '80 Years', category: 'Demographics', region: 'US', sourceOrNote: 'Use 80 years for standard 0-20, 20-40, 40-60, 60-80 generational age splits (25% each)' },
  
  // Economics & Pricing
  { id: 'm7', metric: 'US Median Household Income', value: '$75,000 / year', category: 'Economics', region: 'US', sourceOrNote: 'Disposable income ~70% after tax' },
  { id: 'm8', metric: 'UK Median Household Income', value: '£34,000 / year', category: 'Economics', region: 'UK', sourceOrNote: 'London median: £42,000' },
  { id: 'm9', metric: 'Commercial Real Estate Rent (NYC)', value: '$120 - $250 / sq ft / year', category: 'Economics', region: 'US', sourceOrNote: 'Midtown Manhattan prime ground floor' },
  { id: 'm10', metric: 'Average Coffee Shop Ticket', value: '$4.50 - $6.00', category: 'Consumer Behavior', region: 'US', sourceOrNote: 'Margin on espresso drinks: ~75-80%' },
  
  // Infrastructure & Operations
  { id: 'm11', metric: 'Commercial Aircraft Capacity', value: '150 - 180 seats', category: 'Infrastructure', region: 'Global', sourceOrNote: 'Boeing 737 / Airbus A320 narrowbody benchmark' },
  { id: 'm12', metric: 'Hotel Average Occupancy Rate', value: '65% - 70%', category: 'Infrastructure', region: 'US', sourceOrNote: 'Urban business hotels weekday ~80%, weekend ~50%' },
  { id: 'm13', metric: 'Gasoline Station Pump Volume', value: '2,000 - 3,500 gallons / day', category: 'Infrastructure', region: 'US', sourceOrNote: 'Average transaction: 12 gallons' },
  { id: 'm14', metric: 'Smartphone Replacement Cycle', value: '2.5 - 3.0 years', category: 'Conversion Rates', region: 'Global', sourceOrNote: 'Flagship replacement ~2 yrs, Budget ~3.5 yrs' },
  { id: 'm15', metric: 'E-commerce Conversion Rate', value: '2.5% - 3.5%', category: 'Conversion Rates', region: 'Global', sourceOrNote: 'Mobile conversion ~2.2%, Desktop ~3.8%' },
];
