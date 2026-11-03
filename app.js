/**
 * IoT Based Traffic Management System - Main Application Logic
 * Topic: Mind Mapping & Edge IoT Max-Pressure Signal Control
 * Authors: Jay Davera, Ruchit Karnavat, Rushirajsinh Vala, Prayag Shah
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initNavigation();
  initProblemTabs();
  initArchitecturePipeline();
  initAlgorithmTabs();
  initMaxPressureSimulator();
  initOperatingCycleSimulator();
  initSensingDiagramInteractivity();
  initSupabaseTelemetry();
});

/* ==========================================================================
   0. SUPABASE CLOUD INTEGRATION & TELEMETRY
   ========================================================================== */
function initSupabaseTelemetry() {
  const check = async () => {
    let client = window.supabaseClient;
    if (!client && typeof window.getSupabaseClient === 'function') {
      client = await window.getSupabaseClient(3000);
    }
    if (client && typeof client.checkConnection === 'function') {
      const result = await client.checkConnection();
      if (result && result.success) {
        console.log('📡 [Supabase Telemetry] Connection verified against project https://ibrtpfesjjerjyexdcyr.supabase.co');
      }
    }
  };
  check();
}

/* ==========================================================================
   1. CYBER BACKGROUND CANVAS ANIMATION
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  const particles = [];
  const particleCount = 45;
  const connectionDistance = 140;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create telemetry particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.2,
      color: i % 4 === 0 ? '#10B981' : '#26D0E8', // emerald or cyan
      pulse: Math.random() * Math.PI,
    });
  }

  // Mouse interaction
  const mouse = { x: null, y: null, maxDist: 120 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw subtle grid points / particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.pulse += 0.03;
      const currentRadius = p.radius + Math.sin(p.pulse) * 0.6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect to mouse
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(38, 208, 232, ${1 - (dist / mouse.maxDist) * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to neighboring particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(38, 208, 232, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section.section');

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Active link scroll spy
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-active');
          } else {
            link.classList.remove('nav-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   3. PROBLEM STATEMENT INTERACTIVE DRAWER
   ========================================================================== */
function initProblemTabs() {
  const problemCards = document.querySelectorAll('.problems-grid .problem-card');
  const detailBadge = document.getElementById('detail-badge');
  const detailTitle = document.getElementById('detail-title');
  const detailIntro = document.getElementById('detail-intro');
  const detailAim = document.getElementById('detail-aim');
  const detailGap = document.getElementById('detail-gap');
  const detailAdv = document.getElementById('detail-adv');
  const detailDis = document.getElementById('detail-dis');
  const detailPanel = document.getElementById('problem-detail-panel');

  const problemData = {
    1: {
      badge: 'PROBLEM 01 DETAILED BREAKDOWN',
      title: 'Problem 1: Fixed-Timing Traffic Signals',
      intro: 'Traditional traffic signals run on a fixed green/red duration regardless of actual vehicle count on the road.',
      aim: 'To dynamically adjust green/red light duration based on real-time number of vehicles present at an intersection.',
      gap: 'Existing systems flash the same stretch of green/red at all times, with no responsiveness to actual congestion levels.',
      adv: 'Reduces unnecessary idle time at signals, improves traffic flow, lowers commute cost and environmental pollution.',
      dis: 'Requires continuous camera monitoring and processing hardware (Raspberry Pi), adding hardware dependency.',
    },
    2: {
      badge: 'PROBLEM 02 DETAILED BREAKDOWN',
      title: 'Problem 2: Dependence on Manual Police',
      intro: 'In most cities, traffic police are stationed at intersections even where traffic lights exist, manually overriding cycles.',
      aim: 'To automate junction management with autonomous edge controllers, liberating traffic police for critical law enforcement.',
      gap: 'Manual traffic control is physically exhausting, inconsistent across shifts, hazardous for officers in heavy exhaust fumes, and prone to human error.',
      adv: '24/7 continuous autonomous operation with microsecond precision, zero human fatigue, and significantly lower civic operational expenditure.',
      dis: 'Requires fail-safe manual override mechanisms for emergency escort vehicles and extreme weather disruptions.',
    },
    3: {
      badge: 'PROBLEM 03 DETAILED BREAKDOWN',
      title: 'Problem 3: Non-Smart Decision-Making',
      intro: "Current systems don't use data-driven logic; traffic light timing is pre-set statically by calendar or time-of-day tables.",
      aim: 'To deploy edge machine vision and localized Max-Pressure algorithmic scheduling that recalculates signal priority every 3 seconds.',
      gap: 'Static time-of-day schedules cannot handle unexpected traffic spikes, vehicle breakdowns, special events, or lane obstructions.',
      adv: 'Highly responsive to sudden surges, guarantees optimal green wave propagation, and minimizes intersection queue lengths.',
      dis: 'Edge algorithms must handle edge cases like sensor glare, camera occlusions, or intermittent camera connection dropouts.',
    },
    4: {
      badge: 'PROBLEM 04 DETAILED BREAKDOWN',
      title: 'Problem 4: Urban Infrastructure Pressure',
      intro: 'Rapid urban population growth strains transport systems far faster than roads can physically expand in dense metropolises.',
      aim: 'To maximize vehicular throughput on existing road geometries by eliminating empty green phases and dead waiting time.',
      gap: 'Traditional systems waste 30–45% of green phase capacity when lanes are sparsely occupied while cross lanes wait in gridlock.',
      adv: 'Increases effective road throughput by 25–40% without spending millions on civil road widening or expensive land acquisition.',
      dis: 'Works within the physical boundary limits of existing intersections; cannot prevent hyper-saturation when entire networks choke.',
    },
    5: {
      badge: 'PROBLEM 05 DETAILED BREAKDOWN',
      title: 'Problem 5: Lack of Real-Time Data',
      intro: 'Traditional signals generate no usable data trail, leaving civic authorities without historical traffic insights or trend visibility.',
      aim: 'To continuously stream structured vehicle counts, waiting times, and directional pressures to Firebase cloud storage every 60 seconds.',
      gap: 'Traffic departments rely on costly manual headcounts once a year, resulting in obsolete planning models.',
      adv: 'Empowers urban planners with continuous data dashboards, heatmaps, peak-hour analytics, and predictive civic infrastructure insights.',
      dis: 'Demands reliable IoT connectivity (Wi-Fi / 4G cellular gateway) and cloud data storage governance.',
    },
  };

  problemCards.forEach((card) => {
    card.addEventListener('click', () => {
      const problemId = card.getAttribute('data-problem');
      if (!problemId || !problemData[problemId]) return;

      // Toggle active states
      problemCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      // Update Panel with subtle transition
      if (detailPanel) {
        detailPanel.style.opacity = '0.5';
        detailPanel.style.transform = 'translateY(4px)';
        setTimeout(() => {
          const data = problemData[problemId];
          if (detailBadge) detailBadge.textContent = data.badge;
          if (detailTitle) detailTitle.textContent = data.title;
          if (detailIntro) detailIntro.textContent = data.intro;
          if (detailAim) detailAim.textContent = data.aim;
          if (detailGap) detailGap.textContent = data.gap;
          if (detailAdv) detailAdv.textContent = data.adv;
          if (detailDis) detailDis.textContent = data.dis;

          detailPanel.style.opacity = '1';
          detailPanel.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   4. SYSTEM ARCHITECTURE PIPELINE INTERACTION
   ========================================================================== */
function initArchitecturePipeline() {
  const nodes = document.querySelectorAll('.arch-node');
  const specCards = document.querySelectorAll('.subsystem-spec-grid .spec-card');

  const nodeToSpecMap = {
    camera: 0,
    pi: 1,
    firebase: 2,
    nodemcu: 3,
    led: 3,
  };

  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const nodeKey = node.getAttribute('data-node');

      // Highlight clicked node
      nodes.forEach((n) => n.classList.remove('node-active'));
      node.classList.add('node-active');

      // Highlight matching spec card
      const targetIndex = nodeToSpecMap[nodeKey];
      specCards.forEach((card, idx) => {
        if (idx === targetIndex) {
          card.classList.add('spec-highlight');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          card.classList.remove('spec-highlight');
        }
      });
    });
  });
}

/* ==========================================================================
   5. ALGORITHM COMPARISON TABS
   ========================================================================== */
function initAlgorithmTabs() {
  const tabs = document.querySelectorAll('.algo-tabs .algo-tab');
  const algoTag = document.getElementById('algo-tag');
  const algoName = document.getElementById('algo-name');
  const algoBadgeBox = document.getElementById('algo-badge-box');
  const logicStepsList = document.getElementById('logic-steps-list');
  const algoCodeSnippet = document.getElementById('algo-code-snippet');
  const contentCard = document.getElementById('algo-content-card');

  const algorithms = {
    webster: {
      tag: "ALGORITHM 01 | CLASSICAL CYCLE OPTIMIZATION",
      name: "Webster's Minimum Delay Formula",
      badgeHtml: '<span class="pill-neutral">Historical Benchmark (1958)</span>',
      steps: [
        '<strong>Measure Saturation Flows:</strong> Calculate incoming flow rates ($q_i$) and maximum saturation capacities ($s_i$).',
        '<strong>Compute Critical Flow Ratio:</strong> Aggregate phase ratios $Y = \\sum \\frac{q_i}{s_i}$ across opposing arms.',
        '<strong>Calculate Total Lost Time:</strong> Accumulate clearance, amber time, and acceleration delay $L$.',
        '<strong>Compute Optimal Cycle ($C_0$):</strong> Formula: $C_0 = \\frac{1.5L + 5}{1 - Y}$ for minimum overall vehicle delay.',
        '<strong>Split Green Phases:</strong> Pro-rate effective green times based on relative flow ratios.',
        '<strong>Limitation:</strong> Operates on static historical averages; fails during sudden micro-surges.',
      ],
      code: `def calculate_webster_cycle(lost_time_L, flow_ratios_sum_Y):
    # C0 = (1.5 * L + 5) / (1 - Y)
    if flow_ratios_sum_Y >= 1.0:
        return "ERROR: Over-saturated junction (Y >= 1.0)"
    
    c_opt = (1.5 * lost_time_L + 5.0) / (1.0 - flow_ratios_sum_Y)
    return round(c_opt, 1)  # Optimal cycle length in seconds`,
    },
    fuzzy: {
      tag: 'ALGORITHM 02 | HEURISTIC RULE INFERENCE',
      name: 'Fuzzy Logic Signal Controller',
      badgeHtml: '<span class="pill-neutral">Heuristic Linguistic Sets</span>',
      steps: [
        '<strong>Fuzzify Inputs:</strong> Map crisp vehicle counts into fuzzy sets [Low, Medium, High].',
        '<strong>Fuzzify Wait Times:</strong> Classify current red wait times into [Short, Medium, Long].',
        '<strong>Evaluate Inference Rules:</strong> Execute Mamdani IF-THEN matrix (e.g. IF North=High AND East=Low THEN Extend North).',
        '<strong>Fuzzy Aggregation:</strong> Apply Max-Min compositional inference across active rules.',
        '<strong>Defuzzification:</strong> Compute Centroid / Center of Gravity (COG) to yield crisp green extension seconds.',
        '<strong>Repeat Step:</strong> Re-evaluates every 5 seconds to determine whether to terminate or extend green phase.',
      ],
      code: `def fuzzy_signal_controller(queue_length, waiting_time_sec):
    # Rule Evaluation: Mamdani linguistic matrix
    if queue_length > 40 and waiting_time_sec > 60:
        green_extension = 25  # seconds
    elif queue_length > 20 or waiting_time_sec > 45:
        green_extension = 15
    else:
        green_extension = 5
    return f"EXTEND GREEN BY {green_extension}s"`,
    },
    rl: {
      tag: 'ALGORITHM 03 | REINFORCEMENT LEARNING',
      name: 'Deep Q-Network (DQN) Signal Control',
      badgeHtml: '<span class="pill-neutral">Autonomous Agent Policy</span>',
      steps: [
        '<strong>State Representation ($S$):</strong> Vector of queue lengths, waiting delays, and current light phase.',
        '<strong>Action Selection ($A$):</strong> Agent decides to either maintain current green phase or switch to next approach.',
        '<strong>Reward Calculation ($R$):</strong> Reward = Negative total intersection delay and emergency penalties.',
        '<strong>Q-Value Update:</strong> $Q(s, a) \\leftarrow Q(s, a) + \\alpha [r + \\gamma \\max Q(s\', a\') - Q(s, a)]$.',
        '<strong>Neural Network Training:</strong> Backpropagates experience replay buffer batches to optimize Bellman loss.',
        '<strong>Trade-off:</strong> High convergence time and unpredictable trial exploratory actions in live traffic.',
      ],
      code: `def select_dqn_action(state_vector, q_network, epsilon=0.05):
    # Epsilon-greedy action choice
    if random.random() < epsilon:
        return random.choice([0, 1])  # 0: Keep Phase, 1: Change Phase
        
    q_values = q_network.predict(state_vector)
    return np.argmax(q_values)  # Best policy action`,
    },
    maxpressure: {
      tag: 'ALGORITHM 04 | DECENTRALIZED CONTROL',
      name: 'Max-Pressure Control Algorithm',
      badgeHtml: '<span class="selected-pill">★ Final Chosen System Algorithm</span>',
      steps: [
        '<strong>Check all roads:</strong> System inspects how many vehicles are waiting on each approach lane.',
        '<strong>Check vehicles trying to leave:</strong> Checks downstream road capacity and departure rates.',
        '<strong>Calculate "Pressure":</strong> Computes $P = \\frac{\\text{Vehicles Waiting}}{\\text{Distance Monitored}}$ for each direction.',
        '<strong>Find highest pressure:</strong> The road with the biggest traffic buildup gets highest priority.',
        '<strong>Give green light:</strong> Allocates green light to the direction with maximum computed pressure.',
        '<strong>Repeat continuously:</strong> Re-evaluates continuously every 3 seconds for adaptive control.',
      ],
      code: `def calculate_max_pressure(road1_cars, road1_dist, road2_cars, road2_dist):
    p1 = road1_cars / road1_dist
    p2 = road2_cars / road2_dist
    
    if p1 > p2:
        return "ROAD 1 -> GREEN", p1, p2
    elif p2 > p1:
        return "ROAD 2 -> GREEN", p1, p2
    else:
        return "EQUAL PRESSURE -> NORMAL CYCLE", p1, p2`,
    },
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const algoKey = tab.getAttribute('data-algo');
      if (!algoKey || !algorithms[algoKey]) return;

      tabs.forEach((t) => {
        t.classList.remove('active', 'algo-tab-selected');
        const badge = t.querySelector('.badge-selected');
        if (badge && t.getAttribute('data-algo') !== 'maxpressure') badge.remove();
      });

      tab.classList.add('active');
      if (algoKey === 'maxpressure') {
        tab.classList.add('algo-tab-selected');
      }

      const data = algorithms[algoKey];
      if (contentCard) {
        contentCard.style.opacity = '0.4';
        setTimeout(() => {
          if (algoTag) algoTag.textContent = data.tag;
          if (algoName) algoName.textContent = data.name;
          if (algoBadgeBox) algoBadgeBox.innerHTML = data.badgeHtml;

          if (logicStepsList) {
            logicStepsList.innerHTML = data.steps.map((s) => `<li>${s}</li>`).join('');
          }

          if (algoCodeSnippet) {
            algoCodeSnippet.textContent = data.code;
          }

          contentCard.style.opacity = '1';
        }, 120);
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE MAX-PRESSURE SIMULATOR (CENTERPIECE)
   ========================================================================== */
function initMaxPressureSimulator() {
  // Sliders and Displays
  const r1CarsSlider = document.getElementById('r1-cars-slider');
  const r1DistSlider = document.getElementById('r1-dist-slider');
  const r2CarsSlider = document.getElementById('r2-cars-slider');
  const r2DistSlider = document.getElementById('r2-dist-slider');

  const r1CarsVal = document.getElementById('r1-cars-val');
  const r1DistVal = document.getElementById('r1-dist-val');
  const r2CarsVal = document.getElementById('r2-cars-val');
  const r2DistVal = document.getElementById('r2-dist-val');

  const r1PressureDisplay = document.getElementById('r1-pressure-display');
  const r2PressureDisplay = document.getElementById('r2-pressure-display');

  // Gauges
  const r1GaugeNum = document.getElementById('r1-gauge-num');
  const r1GaugeFill = document.getElementById('r1-gauge-fill');
  const r2GaugeNum = document.getElementById('r2-gauge-num');
  const r2GaugeFill = document.getElementById('r2-gauge-fill');

  // Traffic Lights & States
  const r1Red = document.getElementById('r1-red');
  const r1Yellow = document.getElementById('r1-yellow');
  const r1Green = document.getElementById('r1-green');
  const r1StateText = document.getElementById('r1-state-text');

  const r2Red = document.getElementById('r2-red');
  const r2Yellow = document.getElementById('r2-yellow');
  const r2Green = document.getElementById('r2-green');
  const r2StateText = document.getElementById('r2-state-text');

  // Adaptive Timing Banner
  const adaptiveTimingDesc = document.getElementById('adaptive-timing-desc');

  // Terminal Output & Sync
  const terminalLog = document.getElementById('terminal-log-output');

  // Presets
  const preset1Btn = document.getElementById('preset-1');
  const preset2Btn = document.getElementById('preset-2');
  const preset3Btn = document.getElementById('preset-3');
  const presetButtons = [preset1Btn, preset2Btn, preset3Btn];

  // Historical Telemetry Dashboard Elements
  const modeHybridBtn = document.getElementById('mode-hybrid');
  const modePureHistBtn = document.getElementById('mode-pure-hist');
  const modeLiveOnlyBtn = document.getElementById('mode-live-only');
  const modeButtons = [modeHybridBtn, modePureHistBtn, modeLiveOnlyBtn].filter(Boolean);

  const histWeightSlider = document.getElementById('hist-weight-slider');
  const histWeightVal = document.getElementById('hist-weight-val');
  const histWeightContainer = document.getElementById('hist-weight-container');
  const btnRefreshHistory = document.getElementById('btn-refresh-history');

  const histTotalRecords = document.getElementById('hist-total-records');
  const histDbStatus = document.getElementById('hist-db-status');
  const histR1Avg = document.getElementById('hist-r1-avg');
  const histR1Cars = document.getElementById('hist-r1-cars');
  const histR2Avg = document.getElementById('hist-r2-avg');
  const histR2Cars = document.getElementById('hist-r2-cars');
  const histGreenSplit = document.getElementById('hist-green-split');
  const histSkewRatio = document.getElementById('hist-skew-ratio');

  const toggleRecordsDrawer = document.getElementById('toggle-records-drawer');
  const recordsDrawerBody = document.getElementById('records-drawer-body');
  const drawerToggleIcon = document.getElementById('drawer-toggle-icon');
  const recentRecordsTbody = document.getElementById('recent-records-tbody');

  if (!r1CarsSlider || !r2CarsSlider) return;

  // Decision State
  let currentDecisionMode = 'hybrid'; // 'hybrid' | 'pure-hist' | 'live-only'
  let historicalWeight = 0.50; // 0.0 to 1.0 (default 50% history / 50% live)
  let cachedHistoricalMetrics = {
    count: 0,
    road1AvgPressure: 0,
    road2AvgPressure: 0,
    road1AvgCars: 0,
    road2AvgCars: 0,
    road1DemandRatio: 0.5,
    road2DemandRatio: 0.5,
    records: [],
  };

  const SUPABASE_REST_CONFIG = {
    url: (typeof window !== 'undefined' && window.ENV && window.ENV.SUPABASE_URL) || 'https://ibrtpfesjjerjyexdcyr.supabase.co',
    key: (typeof window !== 'undefined' && window.ENV && window.ENV.SUPABASE_PUBLISHABLE_KEY) || 'sb_publishable_IWXKP9PYiflQlIfGOVKktg_BDOBfHI3',
  };

  /**
   * Resilient historical records fetcher:
   * 1. Uses Supabase JS Client if available
   * 2. Automatically falls back to native REST API fetch (0 library dependencies)
   */
  async function fetchHistoricalRecordsFromDB(limit = 50) {
    // Attempt 1: Via Supabase JS Client instance
    try {
      let client = window.supabaseClient;
      if (!client && typeof window.getSupabaseClient === 'function') {
        client = await window.getSupabaseClient(1200);
      }

      if (client && typeof client.from === 'function') {
        const { data, error } = await client
          .from('traffic_simulation_logs')
          .select('*')
          .order('id', { ascending: false })
          .limit(limit);

        if (!error && Array.isArray(data)) {
          return computeMetricsFromRows(data);
        }
      }
    } catch (clientErr) {
      console.warn('[Supabase Client] SDK fetch deferred to REST API:', clientErr);
    }

    // Attempt 2: Native direct HTTPS fetch to Supabase REST endpoint
    try {
      const endpoint = `${SUPABASE_REST_CONFIG.url}/rest/v1/traffic_simulation_logs?select=*&order=id.desc&limit=${limit}`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_REST_CONFIG.key,
          'Authorization': `Bearer ${SUPABASE_REST_CONFIG.key}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errMsg = await res.text();
        return { success: false, error: errMsg };
      }

      const rows = await res.json();
      return computeMetricsFromRows(rows);
    } catch (fetchErr) {
      console.error('[Supabase REST] Connection error:', fetchErr);
      return { success: false, error: fetchErr.message };
    }
  }

  function computeMetricsFromRows(data) {
    if (!data || data.length === 0) {
      return {
        success: true,
        count: 0,
        records: [],
        road1AvgPressure: 0,
        road2AvgPressure: 0,
        road1AvgCars: 0,
        road2AvgCars: 0,
        road1DemandRatio: 0.5,
        road2DemandRatio: 0.5,
      };
    }

    const count = data.length;
    let r1P_sum = 0, r2P_sum = 0;
    let r1C_sum = 0, r2C_sum = 0;
    let r1Green = 0, r2Green = 0;

    data.forEach((row) => {
      r1P_sum += parseFloat(row.road1_pressure) || 0;
      r2P_sum += parseFloat(row.road2_pressure) || 0;
      r1C_sum += parseInt(row.road1_cars, 10) || 0;
      r2C_sum += parseInt(row.road2_cars, 10) || 0;
      if (row.road1_signal === 'GREEN') r1Green++;
      if (row.road2_signal === 'GREEN') r2Green++;
    });

    const r1AvgP = r1P_sum / count;
    const r2AvgP = r2P_sum / count;
    const totalAvgP = r1AvgP + r2AvgP;

    return {
      success: true,
      count,
      records: data,
      road1AvgPressure: r1AvgP,
      road2AvgPressure: r2AvgP,
      road1AvgCars: Math.round(r1C_sum / count),
      road2AvgCars: Math.round(r2C_sum / count),
      road1GreenCount: r1Green,
      road2GreenCount: r2Green,
      road1DemandRatio: totalAvgP > 0 ? (r1AvgP / totalAvgP) : 0.5,
      road2DemandRatio: totalAvgP > 0 ? (r2AvgP / totalAvgP) : 0.5,
    };
  }

  /**
   * Load and aggregate past records directly from Supabase
   */
  async function loadHistoricalData() {
    if (histDbStatus) histDbStatus.textContent = 'Querying Supabase...';

    const metrics = await fetchHistoricalRecordsFromDB(50);
    if (!metrics || !metrics.success) {
      if (histDbStatus) histDbStatus.textContent = 'Connecting to Supabase...';
      return;
    }

    cachedHistoricalMetrics = metrics;

    // Update UI Stats
    if (histTotalRecords) histTotalRecords.textContent = `${metrics.count} entries`;
    if (histDbStatus) histDbStatus.textContent = `${metrics.count} rows analyzed from DB`;

    if (histR1Avg) histR1Avg.textContent = `${metrics.road1AvgPressure.toFixed(2)} veh/m`;
    if (histR1Cars) histR1Cars.textContent = `~${metrics.road1AvgCars} cars avg`;

    if (histR2Avg) histR2Avg.textContent = `${metrics.road2AvgPressure.toFixed(2)} veh/m`;
    if (histR2Cars) histR2Cars.textContent = `~${metrics.road2AvgCars} cars avg`;

    // Dynamic green calculation from historical demand
    const minGreen = 15;
    const maxGreen = 60;
    const r1HistGreen = Math.round(minGreen + metrics.road1DemandRatio * (maxGreen - minGreen));
    const r2HistGreen = Math.round(minGreen + metrics.road2DemandRatio * (maxGreen - minGreen));

    if (histGreenSplit) {
      histGreenSplit.textContent = `R1: ${r1HistGreen}s | R2: ${r2HistGreen}s`;
    }
    if (histSkewRatio) {
      const r1Pct = (metrics.road1DemandRatio * 100).toFixed(0);
      const r2Pct = (metrics.road2DemandRatio * 100).toFixed(0);
      histSkewRatio.textContent = `Demand Skew: ${r1Pct}% R1 vs ${r2Pct}% R2`;
    }

    // Render Recent Records Table
    renderRecentRecordsTable();

    // Trigger update with fresh history
    updateSimulation('history');
  }

  function renderRecentRecordsTable() {
    if (!recentRecordsTbody) return;
    if (!cachedHistoricalMetrics.records || cachedHistoricalMetrics.records.length === 0) {
      recentRecordsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">No simulation records logged in Supabase yet.</td></tr>`;
      return;
    }
    const top5 = cachedHistoricalMetrics.records.slice(0, 5);
    recentRecordsTbody.innerHTML = top5.map((r) => {
      const timeFormatted = new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const isEV = r.isEmergency || (r.road1_signal && r.road1_signal.includes('EMERGENCY')) || (r.road2_signal && r.road2_signal.includes('EMERGENCY'));
      const isR1Green = r.road1_signal === 'GREEN' || r.road1_signal === 'EMERGENCY_GREEN';

      let badgeHtml = '';
      if (isEV) {
        badgeHtml = `<span style="background: rgba(239, 68, 68, 0.25); color: #EF4444; border: 1px solid #EF4444; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; font-weight: 800;">🚨 EV PRIORITY (${isR1Green ? 'R1' : 'R2'})</span>`;
      } else {
        badgeHtml = `<span class="${isR1Green ? 'green-tag' : 'red-tag'}" style="font-size: 0.72rem; padding: 2px 6px;">${isR1Green ? 'R1 GREEN' : 'R2 GREEN'}</span>`;
      }

      return `
        <tr ${isEV ? 'style="background: rgba(239, 68, 68, 0.1);"' : ''}>
          <td style="color: ${isEV ? '#EF4444' : 'var(--cyan)'}; font-weight: 700;">#${r.id}</td>
          <td style="color: var(--text-muted); font-size: 0.75rem;">${timeFormatted}</td>
          <td><strong>${r.road1_cars}</strong> @ ${parseFloat(r.road1_distance).toFixed(0)}m &rarr; <span class="cyan-text">${parseFloat(r.road1_pressure).toFixed(2)}</span></td>
          <td><strong>${r.road2_cars}</strong> @ ${parseFloat(r.road2_distance).toFixed(0)}m &rarr; <span style="color: #f87171;">${parseFloat(r.road2_pressure).toFixed(2)}</span></td>
          <td>${badgeHtml}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Main Simulation & Signal Decision Evaluator
   * Incorporates real-time sliders + historical database records
   */
  function updateSimulation(source = 'slider') {
    const c1 = parseInt(r1CarsSlider.value, 10);
    const d1 = parseFloat(r1DistSlider.value);
    const c2 = parseInt(r2CarsSlider.value, 10);
    const d2 = parseFloat(r2DistSlider.value);

    // Update labels
    if (r1CarsVal) r1CarsVal.textContent = `${c1} cars`;
    if (r1DistVal) r1DistVal.textContent = `${d1} m`;
    if (r2CarsVal) r2CarsVal.textContent = `${c2} cars`;
    if (r2DistVal) r2DistVal.textContent = `${d2} m`;

    // 1. Instantaneous Sensor Pressures: P = Cars / Distance
    const p1_live = c1 / d1;
    const p2_live = c2 / d2;

    // 2. Historical Averages from Supabase
    const p1_hist = cachedHistoricalMetrics.count > 0 ? cachedHistoricalMetrics.road1AvgPressure : p1_live;
    const p2_hist = cachedHistoricalMetrics.count > 0 ? cachedHistoricalMetrics.road2AvgPressure : p2_live;

    // 3. Compute Effective Pressure based on Active Mode
    let p1_eff = p1_live;
    let p2_eff = p2_live;
    let modeDescription = '';

    if (currentDecisionMode === 'hybrid') {
      const w_live = 1.0 - historicalWeight;
      const w_hist = historicalWeight;
      p1_eff = (w_live * p1_live) + (w_hist * p1_hist);
      p2_eff = (w_live * p2_live) + (w_hist * p2_hist);
      modeDescription = `Hybrid Adaptive (${Math.round(w_hist * 100)}% Past Records + ${Math.round(w_live * 100)}% Live Sensor)`;
    } else if (currentDecisionMode === 'pure-hist') {
      p1_eff = p1_hist;
      p2_eff = p2_hist;
      modeDescription = `Pure Historical Records Mode (100% Database Skew)`;
    } else {
      p1_eff = p1_live;
      p2_eff = p2_live;
      modeDescription = `Instant Live Sensor Only (0% Past Records)`;
    }

    const p1EffFormatted = p1_eff.toFixed(2);
    const p2EffFormatted = p2_eff.toFixed(2);

    if (r1PressureDisplay) {
      r1PressureDisplay.textContent = currentDecisionMode === 'hybrid'
        ? `P1_eff = ${p1EffFormatted} (live: ${p1_live.toFixed(2)})`
        : `P1 = ${p1EffFormatted} veh/m`;
    }
    if (r2PressureDisplay) {
      r2PressureDisplay.textContent = currentDecisionMode === 'hybrid'
        ? `P2_eff = ${p2EffFormatted} (live: ${p2_live.toFixed(2)})`
        : `P2 = ${p2EffFormatted} veh/m`;
    }

    if (r1GaugeNum) r1GaugeNum.textContent = `${p1EffFormatted} veh/m`;
    if (r2GaugeNum) r2GaugeNum.textContent = `${p2EffFormatted} veh/m`;

    // Dynamic scale for progress bars
    const maxVal = Math.max(p1_eff, p2_eff, 0.6);
    const pct1 = Math.min(100, (p1_eff / maxVal) * 100);
    const pct2 = Math.min(100, (p2_eff / maxVal) * 100);

    if (r1GaugeFill) r1GaugeFill.style.width = `${pct1}%`;
    if (r2GaugeFill) r2GaugeFill.style.width = `${pct2}%`;

    // 4. Dynamic Green Duration Allocation (15s to 60s proportional to demand)
    const minGreen = 15;
    const maxGreen = 60;
    const totalEff = p1_eff + p2_eff;
    const r1DemandShare = totalEff > 0 ? (p1_eff / totalEff) : 0.5;
    const r2DemandShare = totalEff > 0 ? (p2_eff / totalEff) : 0.5;

    const r1DurationSec = Math.max(minGreen, Math.min(maxGreen, Math.round(minGreen + r1DemandShare * (maxGreen - minGreen))));
    const r2DurationSec = Math.max(minGreen, Math.min(maxGreen, Math.round(minGreen + r2DemandShare * (maxGreen - minGreen))));

    // 5. Decision Logic
    // If an emergency preemption wave is currently active, preserve emergency light locks
    if (isEmergencyActive) {
      return;
    }

    let r1Status = 'RED';
    let r2Status = 'RED';

    // Clear all lights
    [r1Red, r1Yellow, r1Green, r2Red, r2Yellow, r2Green].forEach((el) => {
      if (el) el.classList.remove('active-red', 'active-yellow', 'active-green');
    });

    if (p1_eff > p2_eff) {
      // Road 1 Wins Green
      r1Status = 'GREEN';
      r2Status = 'RED';

      if (r1Green) r1Green.classList.add('active-green');
      if (r2Red) r2Red.classList.add('active-red');

      if (r1StateText) {
        r1StateText.textContent = `GREEN (${r1DurationSec}s PROCEED)`;
        r1StateText.className = 'light-state-tag green-tag';
      }
      if (r2StateText) {
        r2StateText.textContent = `RED (${r1DurationSec}s WAIT)`;
        r2StateText.className = 'light-state-tag red-tag';
      }

      if (adaptiveTimingDesc) {
        adaptiveTimingDesc.innerHTML = `Road 1 allocated <strong>${r1DurationSec}s</strong> green clearance [${(r1DemandShare * 100).toFixed(0)}% demand via ${modeDescription}]`;
      }
    } else if (p2_eff > p1_eff) {
      // Road 2 Wins Green
      r1Status = 'RED';
      r2Status = 'GREEN';

      if (r1Red) r1Red.classList.add('active-red');
      if (r2Green) r2Green.classList.add('active-green');

      if (r1StateText) {
        r1StateText.textContent = `RED (${r2DurationSec}s WAIT)`;
        r1StateText.className = 'light-state-tag red-tag';
      }
      if (r2StateText) {
        r2StateText.textContent = `GREEN (${r2DurationSec}s PROCEED)`;
        r2StateText.className = 'light-state-tag green-tag';
      }

      if (adaptiveTimingDesc) {
        adaptiveTimingDesc.innerHTML = `Road 2 allocated <strong>${r2DurationSec}s</strong> green clearance [${(r2DemandShare * 100).toFixed(0)}% demand via ${modeDescription}]`;
      }
    } else {
      // Balanced / Equal Pressure
      r1Status = 'EQUAL CYCLE';
      r2Status = 'EQUAL CYCLE';

      if (r1Yellow) r1Yellow.classList.add('active-yellow');
      if (r2Yellow) r2Yellow.classList.add('active-yellow');

      if (r1StateText) {
        r1StateText.textContent = 'YELLOW (BALANCED 25s)';
        r1StateText.className = 'light-state-tag yellow-tag';
      }
      if (r2StateText) {
        r2StateText.textContent = 'YELLOW (BALANCED 25s)';
        r2StateText.className = 'light-state-tag yellow-tag';
      }

      if (adaptiveTimingDesc) {
        adaptiveTimingDesc.innerHTML = `Equal demand across approaches: balanced 25s split allocated.`;
      }
    }

    // 6. Update ASCII Terminal Output with Historical Context
    if (terminalLog) {
      const activeDecision = p1_eff > p2_eff
        ? `ROAD 1  -> GREEN (Duration: ${r1DurationSec}s)\nROAD 2  -> RED   (Wait Time: ${r1DurationSec}s)`
        : p2_eff > p1_eff
        ? `ROAD 1  -> RED   (Wait Time: ${r2DurationSec}s)\nROAD 2  -> GREEN (Duration: ${r2DurationSec}s)`
        : 'EQUAL PRESSURE -> BALANCED 25s CYCLE';

      terminalLog.textContent = `---------- SUPABASE HISTORICAL DATA ----------
Records in DB   : ${cachedHistoricalMetrics.count} entries
Road 1 Hist Avg : ${p1_hist.toFixed(2)} veh/m (~${cachedHistoricalMetrics.road1AvgCars} cars)
Road 2 Hist Avg : ${p2_hist.toFixed(2)} veh/m (~${cachedHistoricalMetrics.road2AvgCars} cars)
Decision Mode   : ${modeDescription}

---------- REAL-TIME SENSORS (LIVE) ----------
Road 1: ${c1} cars @ ${d1.toFixed(1)}m -> P_live = ${p1_live.toFixed(2)} veh/m
Road 2: ${c2} cars @ ${d2.toFixed(1)}m -> P_live = ${p2_live.toFixed(2)} veh/m

---------- EFFECTIVE BLENDED PRESSURE ----------
P1_effective = ${p1EffFormatted} veh/m
P2_effective = ${p2EffFormatted} veh/m
Demand Skew  = ${(r1DemandShare * 100).toFixed(1)}% R1 vs ${(r2DemandShare * 100).toFixed(1)}% R2

---------- ADAPTIVE SIGNAL DECISION ----------
${activeDecision}
Basis: Prioritizes approach with highest sustained vehicle queue`;
    }

    // Trigger debounced Supabase Cloud synchronization (only when user actively modifies sliders/presets)
    if (source === 'slider' || source === 'preset') {
      const syncPayload = {
        road1_cars: c1,
        road1_distance: parseFloat(d1.toFixed(1)),
        road1_pressure: parseFloat(p1_live.toFixed(2)),
        road2_cars: c2,
        road2_distance: parseFloat(d2.toFixed(1)),
        road2_pressure: parseFloat(p2_live.toFixed(2)),
        road1_signal: r1Status,
        road2_signal: r2Status,
      };
      queueSupabaseSync(syncPayload);
    }

    // Reset preset active states if changed manually
    if (source === 'slider') {
      presetButtons.forEach((btn) => btn && btn.classList.remove('active'));
    }

    if (typeof updateDistanceGatedMetrics === 'function') {
      updateDistanceGatedMetrics();
    }
  }

  // Supabase Debounced Sync Engine
  let syncDebounceTimer = null;
  function queueSupabaseSync(payload) {
    updateSyncBadge('syncing', 'Syncing to Supabase...');

    clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(async () => {
      let client = window.supabaseClient;
      if (!client && typeof window.getSupabaseClient === 'function') {
        client = await window.getSupabaseClient(1200);
      }

      if (!client && window.supabase && typeof window.supabase.createClient === 'function') {
        const url = SUPABASE_REST_CONFIG.url;
        const key = SUPABASE_REST_CONFIG.key;
        client = window.supabaseClient = window.supabase.createClient(url, key);
      }

      // Try inserting via SDK client if available
      let insertSuccess = false;
      let newRecordId = null;

      if (client && typeof client.from === 'function') {
        try {
          const { data, error } = await client
            .from('traffic_simulation_logs')
            .insert([payload])
            .select();

          if (!error && data && data.length > 0) {
            insertSuccess = true;
            newRecordId = data[0].id;
          }
        } catch (e) {
          console.warn('[Supabase Sync] SDK insert fallback to REST API:', e);
        }
      }

      // If SDK insert did not succeed, use native REST API
      if (!insertSuccess) {
        try {
          const res = await fetch(`${SUPABASE_REST_CONFIG.url}/rest/v1/traffic_simulation_logs`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_REST_CONFIG.key,
              'Authorization': `Bearer ${SUPABASE_REST_CONFIG.key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation',
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const returned = await res.json();
            insertSuccess = true;
            newRecordId = (returned && returned[0]) ? returned[0].id : '✓';
          }
        } catch (fetchErr) {
          console.error('[Supabase Sync REST] Error:', fetchErr);
        }
      }

      if (insertSuccess) {
        const recordId = newRecordId || '✓';
        console.log('✅ Simulation state synced to Supabase! Record ID:', recordId);
        updateSyncBadge('synced', `Synced #${recordId}`);

        if (terminalLog) {
          const timeStr = new Date().toLocaleTimeString();
          terminalLog.textContent += `\n\n---------- SUPABASE CLOUD SYNC ----------\nStatus   : Synced to traffic_simulation_logs\nRecord   : #${recordId}\nTime     : ${timeStr}`;
        }

        // Automatically reload historical database stats after new sync
        setTimeout(() => loadHistoricalData(), 1200);
      } else {
        updateSyncBadge('error', 'Sync retry pending');
      }
    }, 600);
  }

  function updateSyncBadge(status, text) {
    const syncBadge = document.getElementById('supabase-sync-status');
    if (!syncBadge) return;
    syncBadge.className = `sync-status-badge ${status}`;
    const textSpan = syncBadge.querySelector('.sync-text');
    if (textSpan) textSpan.textContent = text;
  }

  // Bind Slider Events
  [r1CarsSlider, r1DistSlider, r2CarsSlider, r2DistSlider].forEach((slider) => {
    slider.addEventListener('input', () => updateSimulation('slider'));
  });

  // Bind Mode Buttons
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentDecisionMode = btn.getAttribute('data-mode') || 'hybrid';

      if (histWeightContainer) {
        histWeightContainer.style.display = currentDecisionMode === 'hybrid' ? 'block' : 'none';
      }

      updateSimulation('mode');
    });
  });

  // Bind Weight Slider
  if (histWeightSlider) {
    histWeightSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      historicalWeight = val / 100;
      if (histWeightVal) {
        histWeightVal.textContent = `${val}% Past / ${100 - val}% Live`;
      }
      updateSimulation('weight');
    });
  }

  // Bind Refresh Button
  if (btnRefreshHistory) {
    btnRefreshHistory.addEventListener('click', () => {
      btnRefreshHistory.disabled = true;
      btnRefreshHistory.innerHTML = `<span>Refreshing...</span>`;
      loadHistoricalData().finally(() => {
        setTimeout(() => {
          btnRefreshHistory.disabled = false;
          btnRefreshHistory.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            <span>Refresh DB Records</span>
          `;
        }, 500);
      });
    });
  }

  // Bind Drawer Toggle
  if (toggleRecordsDrawer && recordsDrawerBody) {
    toggleRecordsDrawer.addEventListener('click', () => {
      const isVisible = recordsDrawerBody.style.display === 'block';
      recordsDrawerBody.style.display = isVisible ? 'none' : 'block';
      if (drawerToggleIcon) {
        drawerToggleIcon.classList.toggle('rotated', !isVisible);
      }
    });
  }

  // Preset Handlers
  function applyPreset(c1, d1, c2, d2, activeBtn) {
    presetButtons.forEach((btn) => btn && btn.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');

    r1CarsSlider.value = c1;
    r1DistSlider.value = d1;
    r2CarsSlider.value = c2;
    r2DistSlider.value = d2;

    updateSimulation('preset');
  }

  if (preset1Btn) preset1Btn.addEventListener('click', () => applyPreset(50, 100, 50, 500, preset1Btn));
  if (preset2Btn) preset2Btn.addEventListener('click', () => applyPreset(100, 100, 50, 100, preset2Btn));
  if (preset3Btn) preset3Btn.addEventListener('click', () => applyPreset(50, 50, 50, 50, preset3Btn));

  /* --------------------------------------------------------------------------
     EMERGENCY VEHICLE PREEMPTION CONTROLLER (EV-WAVE OVERRIDE)
     -------------------------------------------------------------------------- */
  const evPreemptionCard = document.getElementById('ev-preemption-card');
  const evLatencyVal = document.getElementById('ev-latency-val');
  const btnSirenToggle = document.getElementById('btn-siren-toggle');
  const sirenIcon = document.getElementById('siren-icon');
  const sirenStatusText = document.getElementById('siren-status-text');

  const btnEvRoad1 = document.getElementById('btn-ev-road1');
  const btnEvRoad2 = document.getElementById('btn-ev-road2');
  const btnEvDual = document.getElementById('btn-ev-dual');
  const btnEvCancel = document.getElementById('btn-ev-cancel');
  const evDurationSelect = document.getElementById('ev-duration-select');

  const evLiveDot = document.getElementById('ev-live-dot');
  const evStatusPhaseText = document.getElementById('ev-status-phase-text');
  const evCountdownBadge = document.getElementById('ev-countdown-badge');
  const evCountdownVal = document.getElementById('ev-countdown-val');
  const evProgressContainer = document.getElementById('ev-progress-container');
  const evProgressBar = document.getElementById('ev-progress-bar');

  const evCorridorRunway = document.getElementById('ev-corridor-runway');
  const runwayRoadR1 = document.getElementById('runway-road-r1');
  const runwayRoadR2 = document.getElementById('runway-road-r2');
  const runwayTagR1 = document.getElementById('runway-tag-r1');
  const runwayTagR2 = document.getElementById('runway-tag-r2');
  const runwayVehR1 = document.getElementById('runway-veh-r1');
  const runwayVehR2 = document.getElementById('runway-veh-r2');

  const evActiveAlertStrip = document.getElementById('ev-active-alert-strip');
  const evStripTitle = document.getElementById('ev-strip-title');
  const evStripDesc = document.getElementById('ev-strip-desc');
  const evStripTimer = document.getElementById('ev-strip-timer');
  const evArbitrationPill = document.getElementById('ev-arbitration-pill');

  // Distance-Gated Clearance Protocol Elements (Sir's Tail-Truncation Model - Dual Approach Sliders)
  const evDistR1Slider = document.getElementById('ev-dist-r1-slider');
  const evDistR1Val = document.getElementById('ev-dist-r1-val');
  const r1ClearSubtext = document.getElementById('r1-clear-subtext');
  const r1GreenSubtext = document.getElementById('r1-green-subtext');

  const evDistR2Slider = document.getElementById('ev-dist-r2-slider');
  const evDistR2Val = document.getElementById('ev-dist-r2-val');
  const r2ClearSubtext = document.getElementById('r2-clear-subtext');
  const r2GreenSubtext = document.getElementById('r2-green-subtext');

  const evTargetClearanceText = document.getElementById('ev-target-clearance-text');
  const evWindowRuleVal = document.getElementById('ev-window-rule-val');

  // Kinematics Dual Breakdown Elements
  const kR1Dist = document.getElementById('k-r1-dist');
  const kR1Cleared = document.getElementById('k-r1-cleared');
  const kR1Green = document.getElementById('k-r1-green');
  const kR1Held = document.getElementById('k-r1-held');

  const kR2Dist = document.getElementById('k-r2-dist');
  const kR2Cleared = document.getElementById('k-r2-cleared');
  const kR2Green = document.getElementById('k-r2-green');
  const kR2Held = document.getElementById('k-r2-held');

  // Runway Distance Indicators
  const runwayEnvTagR1 = document.getElementById('runway-env-tag-r1');
  const runwayEnvTagR2 = document.getElementById('runway-env-tag-r2');
  const runwayHeldZoneR1 = document.getElementById('runway-held-zone-r1');
  const runwayHeldZoneR2 = document.getElementById('runway-held-zone-r2');
  const runwayClearedZoneR1 = document.getElementById('runway-cleared-zone-r1');
  const runwayClearedZoneR2 = document.getElementById('runway-cleared-zone-r2');
  const runwayCutoffR1 = document.getElementById('runway-cutoff-r1');
  const runwayCutoffR2 = document.getElementById('runway-cutoff-r2');
  const vehDistTagR1 = document.getElementById('veh-dist-tag-r1');
  const vehDistTagR2 = document.getElementById('veh-dist-tag-r2');
  const clearDistValR1 = document.getElementById('clear-dist-val-r1');
  const clearDistValR2 = document.getElementById('clear-dist-val-r2');
  const rfClearedR1 = document.getElementById('rf-cleared-r1');
  const rfClearedR2 = document.getElementById('rf-cleared-r2');
  const rfHeldR1 = document.getElementById('rf-held-r1');
  const rfHeldR2 = document.getElementById('rf-held-r2');

  let evDistanceR1Meters = 70; // Road 1 Ambulance distance (default 70m, Sir's example)
  let evDistanceR2Meters = 90; // Road 2 Fire Brigade distance (default 90m)
  const evTailBufferMeters = 10; // +10m tail buffer on both approaches

  const r1LightBox = document.getElementById('r1-light-box');
  const r2LightBox = document.getElementById('r2-light-box');

  let isEmergencyActive = false;
  let isDualEmergencyActive = false;
  let dualStage = 0; // 0=idle, 1=stage 1 corridor, 2=interlock buffer, 3=stage 2 corridor
  let dualPrimaryRoad = 1;
  let dualSecondaryRoad = 2;
  let dualVehiclePrimary = null;
  let dualVehicleSecondary = null;
  let dualArbitrationReason = '';
  let emergencyTargetRoad = null;
  let emergencyVehicleMeta = null;
  let emergencyPhase = 'IDLE';
  let emergencyRemainingMs = 0;
  let emergencyTotalMs = 15000;
  let emergencyCountdownInterval = null;
  let emergencyTimeouts = [];
  let sirenSoundEnabled = true;

  /* --------------------------------------------------------------------------
     DISTANCE-GATED CLEARANCE METRICS & RUNWAY GEOMETRY (SIR'S PROTOCOL - DUAL ROADS)
     -------------------------------------------------------------------------- */
  function updateDistanceGatedMetrics() {
    const clearDistR1 = evDistanceR1Meters + evTailBufferMeters;
    const clearDistR2 = evDistanceR2Meters + evTailBufferMeters;

    const r1Cars = parseInt(r1CarsSlider ? r1CarsSlider.value : 50, 10);
    const r1Dist = parseFloat(r1DistSlider ? r1DistSlider.value : 100);
    const p1 = r1Cars / r1Dist;
    const r1CarsClear = Math.min(r1Cars, Math.max(1, Math.round(p1 * clearDistR1)));
    const r1CarsHeld = Math.max(0, r1Cars - r1CarsClear);
    const r1DistHeld = Math.max(0, Math.round(r1Dist - clearDistR1));

    const r2Cars = parseInt(r2CarsSlider ? r2CarsSlider.value : 50, 10);
    const r2Dist = parseFloat(r2DistSlider ? r2DistSlider.value : 500);
    const p2 = r2Cars / r2Dist;
    const r2CarsClear = Math.min(r2Cars, Math.max(1, Math.round(p2 * clearDistR2)));
    const r2CarsHeld = Math.max(0, r2Cars - r2CarsClear);
    const r2DistHeld = Math.max(0, Math.round(r2Dist - clearDistR2));

    // Dynamic green duration: queue discharge velocity ~6.5 m/s + 2.0s startup loss
    const calcGreenR1 = Math.max(5, parseFloat(((clearDistR1 / 6.5) + 2.0).toFixed(1)));
    const calcGreenR2 = Math.max(5, parseFloat(((clearDistR2 / 6.5) + 2.0).toFixed(1)));

    if (evDistR1Val) evDistR1Val.textContent = `${evDistanceR1Meters} m`;
    if (evDistR2Val) evDistR2Val.textContent = `${evDistanceR2Meters} m`;

    if (r1ClearSubtext) r1ClearSubtext.textContent = `${clearDistR1} m (${evDistanceR1Meters}m + 10m buffer)`;
    if (r1GreenSubtext) r1GreenSubtext.textContent = `Green: ~${calcGreenR1}s`;
    if (r2ClearSubtext) r2ClearSubtext.textContent = `${clearDistR2} m (${evDistanceR2Meters}m + 10m buffer)`;
    if (r2GreenSubtext) r2GreenSubtext.textContent = `Green: ~${calcGreenR2}s`;

    if (evTargetClearanceText) {
      evTargetClearanceText.textContent = `R1 (Amb): ${clearDistR1}m | R2 (Fire): ${clearDistR2}m`;
    }
    if (evWindowRuleVal) {
      evWindowRuleVal.textContent = `R1 Amb: ${clearDistR1}m (${calcGreenR1}s) | R2 Fire: ${clearDistR2}m (${calcGreenR2}s) → Cut to RED (+10m buffer)`;
    }

    if (kR1Dist) kR1Dist.textContent = `${evDistanceR1Meters} m`;
    if (kR1Cleared) kR1Cleared.textContent = `Cleared: ${clearDistR1}m (~${r1CarsClear} cars)`;
    if (kR1Green) kR1Green.textContent = `Green: ${calcGreenR1} s`;
    if (kR1Held) kR1Held.textContent = `${r1DistHeld} m (${r1CarsHeld} cars)`;

    if (kR2Dist) kR2Dist.textContent = `${evDistanceR2Meters} m`;
    if (kR2Cleared) kR2Cleared.textContent = `Cleared: ${clearDistR2}m (~${r2CarsClear} cars)`;
    if (kR2Green) kR2Green.textContent = `Green: ${calcGreenR2} s`;
    if (kR2Held) kR2Held.textContent = `${r2DistHeld} m (${r2CarsHeld} cars)`;

    if (evDurationSelect) {
      evDurationSelect.value = String(Math.round(calcGreenR1));
    }

    updateRunwayGeometry(clearDistR1, clearDistR2, r1Dist, r2Dist, r1CarsClear, r1CarsHeld, r2CarsClear, r2CarsHeld, r1DistHeld, r2DistHeld);

    return {
      clearDistR1,
      clearDistR2,
      calcGreenR1,
      calcGreenR2,
      r1CarsClear,
      r1CarsHeld,
      r1DistHeld,
      r2CarsClear,
      r2CarsHeld,
      r2DistHeld,
    };
  }

  function updateRunwayGeometry(clearDistR1, clearDistR2, r1Dist, r2Dist, r1CarsClear, r1CarsHeld, r2CarsClear, r2CarsHeld, r1DistHeld, r2DistHeld) {
    const stoplinePct = 65; // stop line is at 65% of track width

    // Road 1 geometry calculation (Ambulance on Road 1)
    const dScale1 = Math.max(r1Dist, 180);
    const fEV1 = Math.min(0.95, Math.max(0.08, evDistanceR1Meters / dScale1));
    const fClear1 = Math.min(0.98, Math.max(0.12, clearDistR1 / dScale1));
    const xCutoff1 = Math.max(3, stoplinePct - (fClear1 * 55));
    const xEV1 = Math.max(6, stoplinePct - (fEV1 * 55));

    if (runwayClearedZoneR1) {
      runwayClearedZoneR1.style.left = `${xCutoff1}%`;
      runwayClearedZoneR1.style.width = `${stoplinePct - xCutoff1}%`;
    }
    if (runwayCutoffR1) {
      runwayCutoffR1.style.left = `${xCutoff1}%`;
    }
    if (runwayHeldZoneR1) {
      runwayHeldZoneR1.style.width = `${xCutoff1}%`;
    }
    if (runwayVehR1 && !runwayVehR1.classList.contains('veh-moving') && !runwayVehR1.classList.contains('veh-holding')) {
      runwayVehR1.style.left = `${xEV1}%`;
    }
    if (clearDistValR1) clearDistValR1.textContent = `${clearDistR1}m`;
    if (vehDistTagR1) vehDistTagR1.textContent = `@ ${evDistanceR1Meters}m`;
    if (runwayEnvTagR1) runwayEnvTagR1.textContent = `Clearance Target: ${clearDistR1}m (${evDistanceR1Meters}m EV + 10m buffer)`;
    if (rfClearedR1) rfClearedR1.textContent = `${clearDistR1}m (~${r1CarsClear} cars)`;
    if (rfHeldR1) rfHeldR1.textContent = `${r1DistHeld}m (${r1CarsHeld} cars)`;

    // Road 2 geometry calculation (Fire Brigade on Road 2)
    const dScale2 = Math.max(r2Dist, 250);
    const fEV2 = Math.min(0.95, Math.max(0.08, evDistanceR2Meters / dScale2));
    const fClear2 = Math.min(0.98, Math.max(0.12, clearDistR2 / dScale2));
    const xCutoff2 = Math.max(3, stoplinePct - (fClear2 * 55));
    const xEV2 = Math.max(6, stoplinePct - (fEV2 * 55));

    if (runwayClearedZoneR2) {
      runwayClearedZoneR2.style.left = `${xCutoff2}%`;
      runwayClearedZoneR2.style.width = `${stoplinePct - xCutoff2}%`;
    }
    if (runwayCutoffR2) {
      runwayCutoffR2.style.left = `${xCutoff2}%`;
    }
    if (runwayHeldZoneR2) {
      runwayHeldZoneR2.style.width = `${xCutoff2}%`;
    }
    if (runwayVehR2 && !runwayVehR2.classList.contains('veh-moving') && !runwayVehR2.classList.contains('veh-holding')) {
      runwayVehR2.style.left = `${xEV2}%`;
    }
    if (clearDistValR2) clearDistValR2.textContent = `${clearDistR2}m`;
    if (vehDistTagR2) vehDistTagR2.textContent = `@ ${evDistanceR2Meters}m`;
    if (runwayEnvTagR2) runwayEnvTagR2.textContent = `Clearance Target: ${clearDistR2}m (${evDistanceR2Meters}m EV + 10m buffer)`;
    if (rfClearedR2) rfClearedR2.textContent = `${clearDistR2}m (~${r2CarsClear} cars)`;
    if (rfHeldR2) rfHeldR2.textContent = `${r2DistHeld}m (${r2CarsHeld} cars)`;
  }

  // Web Audio API Emergency Siren Synthesizer
  let audioContext = null;
  let sirenOsc = null;
  let sirenGain = null;

  function initAudioSiren() {
    if (btnSirenToggle) {
      btnSirenToggle.addEventListener('click', () => {
        sirenSoundEnabled = !sirenSoundEnabled;
        if (sirenSoundEnabled) {
          if (sirenIcon) sirenIcon.textContent = '🔊';
          if (sirenStatusText) sirenStatusText.textContent = 'Siren Sound: ON';
          btnSirenToggle.classList.remove('muted');
          if (isEmergencyActive && emergencyPhase === 'GREEN_CORRIDOR') {
            playSirenTone();
          }
        } else {
          if (sirenIcon) sirenIcon.textContent = '🔇';
          if (sirenStatusText) sirenStatusText.textContent = 'Siren Sound: OFF';
          btnSirenToggle.classList.add('muted');
          stopSirenTone();
        }
      });
    }
  }

  function playSirenTone() {
    if (!sirenSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      stopSirenTone();

      sirenOsc = audioContext.createOscillator();
      sirenGain = audioContext.createGain();

      sirenOsc.type = 'sawtooth';
      sirenGain.gain.setValueAtTime(0.035, audioContext.currentTime);

      const now = audioContext.currentTime;
      for (let i = 0; i < 25; i++) {
        const cycle = i * 1.4;
        sirenOsc.frequency.setValueAtTime(650, now + cycle);
        sirenOsc.frequency.linearRampToValueAtTime(960, now + cycle + 0.7);
        sirenOsc.frequency.linearRampToValueAtTime(650, now + cycle + 1.4);
      }

      sirenOsc.connect(sirenGain);
      sirenGain.connect(audioContext.destination);
      sirenOsc.start();
    } catch (e) {
      console.warn('[Audio Siren] Web Audio API exception:', e);
    }
  }

  function stopSirenTone() {
    try {
      if (sirenOsc) {
        sirenOsc.stop();
        sirenOsc.disconnect();
        sirenOsc = null;
      }
    } catch (e) {}
  }

  function clearAllTrafficLights() {
    [r1Red, r1Yellow, r1Green, r2Red, r2Yellow, r2Green].forEach((el) => {
      if (el) el.classList.remove('active-red', 'active-yellow', 'active-green');
    });
  }

  function updateRunwayDisplay(road) {
    const metrics = updateDistanceGatedMetrics();
    if (road === 1) {
      if (runwayRoadR1) runwayRoadR1.className = 'runway-road runway-r1 runway-active';
      if (runwayRoadR2) runwayRoadR2.className = 'runway-road runway-r2 runway-blocked';
      if (runwayTagR1) { runwayTagR1.textContent = `CLEARANCE PACKET: ${metrics.clearDistR1}m (~${metrics.r1CarsClear} cars)`; runwayTagR1.className = 'runway-tag tag-green'; }
      if (runwayTagR2) { runwayTagR2.textContent = 'ALL-STOP (RED)'; runwayTagR2.className = 'runway-tag tag-red'; }
      if (runwayVehR1) runwayVehR1.style.display = 'flex';
      if (runwayVehR2) runwayVehR2.style.display = 'none';
    } else {
      if (runwayRoadR1) runwayRoadR1.className = 'runway-road runway-r1 runway-blocked';
      if (runwayRoadR2) runwayRoadR2.className = 'runway-road runway-r2 runway-active';
      if (runwayTagR1) { runwayTagR1.textContent = 'ALL-STOP (RED)'; runwayTagR1.className = 'runway-tag tag-red'; }
      if (runwayTagR2) { runwayTagR2.textContent = `CLEARANCE PACKET: ${metrics.clearDistR2}m (~${metrics.r2CarsClear} cars)`; runwayTagR2.className = 'runway-tag tag-green'; }
      if (runwayVehR1) runwayVehR1.style.display = 'none';
      if (runwayVehR2) runwayVehR2.style.display = 'flex';
    }
  }

  function triggerEmergencyPreemption(road, vehicleType) {
    cancelEmergencyTasks();

    isEmergencyActive = true;
    emergencyTargetRoad = road;

    const metrics = updateDistanceGatedMetrics();
    const durationSeconds = road === 1 ? metrics.calcGreenR1 : metrics.calcGreenR2;
    emergencyTotalMs = durationSeconds * 1000;

    emergencyVehicleMeta = vehicleType === 'ambulance' ? {
      name: 'Ambulance (Code 3)',
      icon: '🚑',
      code: 'AMB-911-R1',
      approach: 'Road 1',
      speed: '68 km/h',
      priority: 'CRITICAL ALS',
      distance: evDistanceR1Meters,
      clearanceEnvelope: metrics.clearDistR1,
      greenDuration: metrics.calcGreenR1,
      carsCleared: metrics.r1CarsClear,
      carsHeld: metrics.r1CarsHeld,
      distHeld: metrics.r1DistHeld,
    } : {
      name: 'Fire Rescue Ladder 33',
      icon: '🚒',
      code: 'FIRE-33-R2',
      approach: 'Road 2',
      speed: '58 km/h',
      priority: 'MAXIMUM ESCORT',
      distance: evDistanceR2Meters,
      clearanceEnvelope: metrics.clearDistR2,
      greenDuration: metrics.calcGreenR2,
      carsCleared: metrics.r2CarsClear,
      carsHeld: metrics.r2CarsHeld,
      distHeld: metrics.r2DistHeld,
    };

    const edgeLatency = (24 + Math.random() * 9).toFixed(1);
    if (evLatencyVal) evLatencyVal.textContent = `${edgeLatency}ms`;

    if (evPreemptionCard) evPreemptionCard.classList.add('card-ev-active');
    if (btnEvCancel) btnEvCancel.disabled = false;

    if (road === 1) {
      if (btnEvRoad1) btnEvRoad1.classList.add('active-dispatch');
      if (btnEvRoad2) btnEvRoad2.classList.remove('active-dispatch');
    } else {
      if (btnEvRoad2) btnEvRoad2.classList.add('active-dispatch');
      if (btnEvRoad1) btnEvRoad1.classList.remove('active-dispatch');
    }

    if (evLiveDot) {
      evLiveDot.className = 'ev-live-dot dot-active';
    }

    if (evCorridorRunway) evCorridorRunway.style.display = 'grid';
    if (evActiveAlertStrip) evActiveAlertStrip.style.display = 'flex';
    if (evCountdownBadge) evCountdownBadge.style.display = 'flex';
    if (evProgressContainer) evProgressContainer.style.display = 'block';

    if (evStripTitle) {
      evStripTitle.textContent = `🚨 ${emergencyVehicleMeta.priority} PREEMPTION ACTIVE`;
    }
    if (evStripDesc) {
      const cClear = emergencyVehicleMeta.carsCleared;
      const dClear = emergencyVehicleMeta.clearanceEnvelope;
      const dHeld = emergencyVehicleMeta.distHeld;
      const evDist = emergencyVehicleMeta.distance;
      evStripDesc.textContent = `Approaching Unit: ${emergencyVehicleMeta.icon} ${emergencyVehicleMeta.name} [${emergencyVehicleMeta.code}] @ ${evDist}m — Gated Clearance: ${dClear}m (~${cClear} cars) | Remainder ${dHeld}m Held at RED`;
    }

    updateRunwayDisplay(road);

    logEmergencyTerminalTrace(road, 'INIT', edgeLatency, durationSeconds);

    // PHASE 1: SAFE AMBER CLEARANCE (1.2s)
    emergencyPhase = 'AMBER_CLEARANCE';
    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text text-amber';
      evStatusPhaseText.textContent = `PHASE 1/3: AMBER FLUSH (1.2s) — Warning oncoming traffic on opposing arm`;
    }

    clearAllTrafficLights();
    if (road === 1) {
      if (r1Red) r1Red.classList.add('active-red');
      if (r2Yellow) r2Yellow.classList.add('active-yellow');
      if (r1StateText) { r1StateText.textContent = 'RED (HOLDING FOR FLUSH)'; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2StateText) { r2StateText.textContent = 'AMBER (SAFETY CLEARANCE)'; r2StateText.className = 'light-state-tag yellow-tag'; }
    } else {
      if (r2Red) r2Red.classList.add('active-red');
      if (r1Yellow) r1Yellow.classList.add('active-yellow');
      if (r1StateText) { r1StateText.textContent = 'AMBER (SAFETY CLEARANCE)'; r1StateText.className = 'light-state-tag yellow-tag'; }
      if (r2StateText) { r2StateText.textContent = 'RED (HOLDING FOR FLUSH)'; r2StateText.className = 'light-state-tag red-tag'; }
    }

    // PHASE 2: ALL-RED SAFETY BUFFER (0.8s)
    const timeout1 = setTimeout(() => {
      emergencyPhase = 'ALL_RED_BUFFER';
      if (evStatusPhaseText) {
        evStatusPhaseText.className = 'ev-status-phase-text text-alert';
        evStatusPhaseText.textContent = `PHASE 2/3: ALL-RED SAFETY BUFFER (0.8s) — Flushing intersection conflict zone`;
      }

      clearAllTrafficLights();
      if (r1Red) r1Red.classList.add('active-red');
      if (r2Red) r2Red.classList.add('active-red');
      if (r1StateText) { r1StateText.textContent = 'RED (ALL-STOP BUFFER)'; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2StateText) { r2StateText.textContent = 'RED (ALL-STOP BUFFER)'; r2StateText.className = 'light-state-tag red-tag'; }

      // PHASE 3: GREEN CORRIDOR PREEMPTION (durationSeconds)
      const timeout2 = setTimeout(() => {
        activateGreenCorridor(road, durationSeconds, edgeLatency);
      }, 800);
      emergencyTimeouts.push(timeout2);
    }, 1200);
    emergencyTimeouts.push(timeout1);
  }

  function activateGreenCorridor(road, durationSeconds, edgeLatency) {
    emergencyPhase = 'GREEN_CORRIDOR';
    emergencyRemainingMs = emergencyTotalMs;

    const metrics = updateDistanceGatedMetrics();
    const clearDist = road === 1 ? metrics.clearDistR1 : metrics.clearDistR2;
    const evDist = road === 1 ? evDistanceR1Meters : evDistanceR2Meters;
    const carsClear = road === 1 ? metrics.r1CarsClear : metrics.r2CarsClear;
    const carsHeld = road === 1 ? metrics.r1CarsHeld : metrics.r2CarsHeld;
    const distHeld = road === 1 ? metrics.r1DistHeld : metrics.r2DistHeld;

    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text text-green';
      evStatusPhaseText.textContent = `PHASE 3/3: TAIL-TRUNCATED GREEN — Clearing ${clearDist}m (${evDist}m EV + 10m buffer; ~${carsClear} cars) → Immediate Cut to RED (${distHeld}m held)`;
    }

    clearAllTrafficLights();
    if (road === 1) {
      if (r1Green) r1Green.classList.add('active-green');
      if (r2Red) r2Red.classList.add('active-red');

      if (r1StateText) {
        r1StateText.textContent = `🚨 EV GREEN (${clearDist}m / ${durationSeconds}s)`;
        r1StateText.className = 'light-state-tag green-tag';
      }
      if (r2StateText) {
        r2StateText.textContent = `🛑 OPPOSING HELD (ALL-RED)`;
        r2StateText.className = 'light-state-tag red-tag';
      }

      if (r1LightBox) r1LightBox.classList.add('emergency-corridor-box');
      if (r2LightBox) r2LightBox.classList.add('emergency-held-box');
    } else {
      if (r2Green) r2Green.classList.add('active-green');
      if (r1Red) r1Red.classList.add('active-red');

      if (r1StateText) {
        r1StateText.textContent = `🛑 OPPOSING HELD (ALL-RED)`;
        r1StateText.className = 'light-state-tag red-tag';
      }
      if (r2StateText) {
        r2StateText.textContent = `🚨 EV GREEN (${clearDist}m / ${durationSeconds}s)`;
        r2StateText.className = 'light-state-tag green-tag';
      }

      if (r2LightBox) r2LightBox.classList.add('emergency-corridor-box');
      if (r1LightBox) r1LightBox.classList.add('emergency-held-box');
    }

    if (adaptiveTimingDesc) {
      adaptiveTimingDesc.innerHTML = `<span style="color: #10b981; font-weight: 800;">🚨 DISTANCE-GATED GREEN WAVE:</span> ${emergencyVehicleMeta.name} given ${clearDist}m clearance (${evDist}m EV + 10m buffer). <span style="color:#ef4444;font-weight:700;">Remaining ${distHeld}m (${carsHeld} cars) strictly held at RED.</span>`;
    }

    playSirenTone();

    const activeVeh = road === 1 ? runwayVehR1 : runwayVehR2;
    if (activeVeh) activeVeh.classList.add('veh-moving');

    syncEmergencyToSupabase(road, durationSeconds, edgeLatency);

    clearInterval(emergencyCountdownInterval);
    const startTime = Date.now();
    emergencyCountdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      emergencyRemainingMs = Math.max(0, emergencyTotalMs - elapsed);

      const secRemaining = (emergencyRemainingMs / 1000).toFixed(1);
      if (evCountdownVal) evCountdownVal.textContent = `${secRemaining}s`;
      if (evStripTimer) evStripTimer.textContent = `${secRemaining}s`;

      const pct = (emergencyRemainingMs / emergencyTotalMs) * 100;
      if (evProgressBar) evProgressBar.style.width = `${pct}%`;

      if (emergencyRemainingMs <= 0) {
        clearInterval(emergencyCountdownInterval);
        restoreNormalCycle(true);
      }
    }, 100);
  }

  function syncEmergencyToSupabase(road, durationSeconds, edgeLatency) {
    const c1 = parseInt(r1CarsSlider.value, 10);
    const d1 = parseFloat(r1DistSlider.value);
    const c2 = parseInt(r2CarsSlider.value, 10);
    const d2 = parseFloat(r2DistSlider.value);

    const r1Sig = road === 1 ? 'EMERGENCY_GREEN' : 'EMERGENCY_RED';
    const r2Sig = road === 2 ? 'EMERGENCY_GREEN' : 'EMERGENCY_RED';
    const metrics = updateDistanceGatedMetrics();
    const targetClear = road === 1 ? metrics.clearDistR1 : metrics.clearDistR2;

    const evRecord = {
      id: cachedHistoricalMetrics.records.length > 0 ? (Number(cachedHistoricalMetrics.records[0].id) + 1) : Math.floor(Date.now() / 1000),
      created_at: new Date().toISOString(),
      road1_cars: road === 1 ? Math.max(c1, 15) : c1,
      road1_distance: d1,
      road1_pressure: road === 1 ? 9.99 : parseFloat((c1 / d1).toFixed(2)),
      road2_cars: road === 2 ? Math.max(c2, 15) : c2,
      road2_distance: d2,
      road2_pressure: road === 2 ? 9.99 : parseFloat((c2 / d2).toFixed(2)),
      road1_signal: r1Sig,
      road2_signal: r2Sig,
      isEmergency: true,
      vehicle: `${emergencyVehicleMeta.name} [Target ${targetClear}m]`,
    };

    cachedHistoricalMetrics.records.unshift(evRecord);
    cachedHistoricalMetrics.count = (cachedHistoricalMetrics.count || 0) + 1;
    renderRecentRecordsTable();

    const payload = {
      road1_cars: evRecord.road1_cars,
      road1_distance: parseFloat(evRecord.road1_distance.toFixed(1)),
      road1_pressure: parseFloat(evRecord.road1_pressure.toFixed(2)),
      road2_cars: evRecord.road2_cars,
      road2_distance: parseFloat(evRecord.road2_distance.toFixed(1)),
      road2_pressure: parseFloat(evRecord.road2_pressure.toFixed(2)),
      road1_signal: r1Sig,
      road2_signal: r2Sig,
    };

    queueSupabaseSync(payload);

    logEmergencyTerminalTrace(road, 'ACTIVE', edgeLatency, durationSeconds);
  }

  function restoreNormalCycle(isCompleted = false) {
    cancelEmergencyTasks();
    stopSirenTone();

    isEmergencyActive = false;
    isDualEmergencyActive = false;
    dualStage = 0;
    dualVehiclePrimary = null;
    dualVehicleSecondary = null;
    emergencyPhase = 'IDLE';
    emergencyTargetRoad = null;

    if (evPreemptionCard) evPreemptionCard.classList.remove('card-ev-active');
    if (btnEvRoad1) btnEvRoad1.classList.remove('active-dispatch');
    if (btnEvRoad2) btnEvRoad2.classList.remove('active-dispatch');
    if (btnEvDual) btnEvDual.classList.remove('active-dispatch');
    if (btnEvCancel) btnEvCancel.disabled = true;

    if (evArbitrationPill) evArbitrationPill.style.display = 'none';

    if (evLiveDot) evLiveDot.className = 'ev-live-dot';
    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text';
      evStatusPhaseText.textContent = isCompleted
        ? `STATUS: STANDBY — EV & +10M BUFFER CLEARED → RED CUTOFF EXECUTED (WHOLE ROAD NOT EMPTIED)`
        : `STATUS: STANDBY — EMERGENCY PREEMPTION CANCELLED BY OPERATOR`;
    }

    if (evCorridorRunway) evCorridorRunway.style.display = 'none';
    if (evActiveAlertStrip) evActiveAlertStrip.style.display = 'none';
    if (evCountdownBadge) evCountdownBadge.style.display = 'none';
    if (evProgressContainer) evProgressContainer.style.display = 'none';

    if (runwayVehR1) {
      runwayVehR1.classList.remove('veh-moving', 'veh-holding');
      runwayVehR1.style.left = '';
    }
    if (runwayVehR2) {
      runwayVehR2.classList.remove('veh-moving', 'veh-holding');
      runwayVehR2.style.left = '';
    }

    if (r1LightBox) r1LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');
    if (r2LightBox) r2LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');

    updateSimulation('resume');

    if (terminalLog) {
      const timeStr = new Date().toLocaleTimeString();
      const metrics = updateDistanceGatedMetrics();
      terminalLog.textContent += `\n\n================================================
✓ TAIL-TRUNCATION CUTOFF EXECUTED (${isCompleted ? 'COMPLETED' : 'OPERATOR OVERRIDE'})
Time: ${timeStr}
Protocol: EV + 10m Buffer Cleared [R1 Amb: ${metrics.clearDistR1}m | R2 Fire: ${metrics.clearDistR2}m].
Cutoff Action: Immediate RED Signal Enforced.
Held Queue: Entire road was NOT emptied; remaining upstream queue held.
Normal Max-Pressure Adaptive Control Resumed.
================================================`;
    }
  }

  function cancelEmergencyTasks() {
    emergencyTimeouts.forEach((t) => clearTimeout(t));
    emergencyTimeouts = [];
    clearInterval(emergencyCountdownInterval);
  }

  function logEmergencyTerminalTrace(road, phase, latency, duration = 15) {
    if (!terminalLog) return;
    const timeStr = new Date().toLocaleTimeString();
    const metrics = updateDistanceGatedMetrics();
    const evDist = road === 1 ? evDistanceR1Meters : evDistanceR2Meters;
    const clearMeters = road === 1 ? metrics.clearDistR1 : metrics.clearDistR2;
    const carsClear = road === 1 ? metrics.r1CarsClear : metrics.r2CarsClear;
    const carsHeld = road === 1 ? metrics.r1CarsHeld : metrics.r2CarsHeld;
    const distHeld = road === 1 ? metrics.r1DistHeld : metrics.r2DistHeld;

    if (phase === 'INIT') {
      terminalLog.textContent = `================================================
🚨 EMERGENCY PREEMPTION DETECTED (V2X / DSRC)
================================================
Vehicle Type     : ${emergencyVehicleMeta.name}
RFID Tag / DSRC  : ${emergencyVehicleMeta.code}
Priority Approach: ${emergencyVehicleMeta.approach} (${emergencyVehicleMeta.priority})
EV Distance      : ${evDist}m from Stop Line
Buffer Offset    : +${evTailBufferMeters}m Tail Buffer (Sir's Truncation Model)
Target Clearance : ${clearMeters}m Queue Envelope (~${carsClear} cars)
Held at Red      : ${distHeld}m Remaining (~${carsHeld} cars) — Whole road NOT emptied!
Edge Latency     : ${latency} ms [Raspberry Pi Interrupt Handler]
Timestamp        : ${timeStr}

PREEMPTION SEQUENCE:
  [00.0s] Interrupt received -> Normal Max-Pressure suspended
  [00.0s] Opposing arm forced to AMBER clearance (1.2s)
  [01.2s] All-Red junction buffer initiated (0.8s)
  [02.0s] Distance-Gated Green Corridor (${clearMeters}m packet / ${duration}s) locking...
================================================`;
    } else if (phase === 'ACTIVE') {
      terminalLog.textContent += `\n
[02.0s] >>> DISTANCE-GATED GREEN WAVE LOCKED <<<
Target Signal    : ${road === 1 ? 'ROAD 1 -> GREEN' : 'ROAD 2 -> GREEN'} (Only ${clearMeters}m moves)
Opposing Signal  : ${road === 1 ? 'ROAD 2 -> STOP (RED)' : 'ROAD 1 -> STOP (RED)'}
Cutoff Trigger   : At t = ${duration}s, immediately executes RED (Holding ${carsHeld} cars)
Siren Audio      : ${sirenSoundEnabled ? 'ACTIVE' : 'MUTED'}
Supabase Cloud   : Logged clearance window (${clearMeters}m = ${evDist}m + 10m)
Status           : TAIL-TRUNCATED CORRIDOR RUNNING`;
    }
  }

  /* --------------------------------------------------------------------------
     DUAL EMERGENCY VEHICLE CONTENTION RESOLUTION (ROAD 1 + ROAD 2 CONFLICT)
     -------------------------------------------------------------------------- */
  function triggerDualEmergencyConflict() {
    cancelEmergencyTasks();

    isEmergencyActive = true;
    isDualEmergencyActive = true;
    dualStage = 0;

    const metrics = updateDistanceGatedMetrics();
    const d1 = evDistanceR1Meters;
    const d2 = evDistanceR2Meters;
    const v1 = 18.9; // 68 km/h Ambulance
    const v2 = 15.0; // 54 km/h Fire Rescue
    const eta1 = parseFloat((d1 / v1).toFixed(1));
    const eta2 = parseFloat((d2 / v2).toFixed(1));

    const ambMeta = {
      road: 1,
      name: 'Ambulance (Code 3)',
      icon: '🚑',
      code: 'AMB-911-R1',
      approach: 'Road 1',
      speed: '68 km/h',
      priority: 'CRITICAL ALS',
      distance: d1,
      clearanceEnvelope: metrics.clearDistR1,
      greenDuration: metrics.calcGreenR1,
      eta: eta1,
    };

    const fireMeta = {
      road: 2,
      name: 'Fire Rescue Ladder 33',
      icon: '🚒',
      code: 'FIRE-33-R2',
      approach: 'Road 2',
      speed: '54 km/h',
      priority: 'MAXIMUM ESCORT',
      distance: d2,
      clearanceEnvelope: metrics.clearDistR2,
      greenDuration: metrics.calcGreenR2,
      eta: eta2,
    };

    // ARBITRATION LOGIC (Deterministic Conflict Resolution)
    // 1. If ETAs are close (within 1.5s), Fire Rescue receives heavy inertia/mass priority (24t vs 4.5t)
    // 2. Otherwise, vehicle closer to stopline (lower ETA) receives primary corridor (Zero-Stop Green Wave)
    if (Math.abs(eta1 - eta2) <= 1.5) {
      dualPrimaryRoad = 2;
      dualSecondaryRoad = 1;
      dualVehiclePrimary = fireMeta;
      dualVehicleSecondary = ambMeta;
      dualArbitrationReason = `MOMENTUM TIE-BREAKER: Fire Rescue (24t) receives primary corridor (ETA difference < 1.5s: Fire ${eta2}s vs Amb ${eta1}s).`;
    } else if (eta1 < eta2) {
      dualPrimaryRoad = 1;
      dualSecondaryRoad = 2;
      dualVehiclePrimary = ambMeta;
      dualVehicleSecondary = fireMeta;
      dualArbitrationReason = `ETA PROXIMITY: Ambulance is closer (ETA ${eta1}s [@ ${d1}m] vs Fire Rescue ${eta2}s [@ ${d2}m]). Zero-Stop Green Wave.`;
    } else {
      dualPrimaryRoad = 2;
      dualSecondaryRoad = 1;
      dualVehiclePrimary = fireMeta;
      dualVehicleSecondary = ambMeta;
      dualArbitrationReason = `ETA PROXIMITY: Fire Rescue is closer (ETA ${eta2}s [@ ${d2}m] vs Ambulance ${eta1}s [@ ${d1}m]). Zero-Stop Green Wave.`;
    }

    emergencyTargetRoad = dualPrimaryRoad;
    emergencyVehicleMeta = dualVehiclePrimary;

    const edgeLatency = (18 + Math.random() * 8).toFixed(1);
    if (evLatencyVal) evLatencyVal.textContent = `${edgeLatency}ms`;

    if (evPreemptionCard) evPreemptionCard.classList.add('card-ev-active');
    if (btnEvCancel) btnEvCancel.disabled = false;
    if (btnEvDual) btnEvDual.classList.add('active-dispatch');
    if (btnEvRoad1) btnEvRoad1.classList.remove('active-dispatch');
    if (btnEvRoad2) btnEvRoad2.classList.remove('active-dispatch');

    if (evLiveDot) evLiveDot.className = 'ev-live-dot dot-active';
    if (evCorridorRunway) evCorridorRunway.style.display = 'grid';
    if (evActiveAlertStrip) evActiveAlertStrip.style.display = 'flex';
    if (evCountdownBadge) evCountdownBadge.style.display = 'flex';
    if (evProgressContainer) evProgressContainer.style.display = 'block';

    if (evArbitrationPill) {
      evArbitrationPill.style.display = 'inline-block';
      evArbitrationPill.textContent = `⚡ ARBITRATION: STAGE 1 -> ${dualVehiclePrimary.name} [${dualVehiclePrimary.code}]`;
    }

    if (evStripTitle) {
      evStripTitle.textContent = `🚨 DUAL EMERGENCY CONFLICT RESOLUTION ACTIVE`;
    }
    if (evStripDesc) {
      evStripDesc.textContent = `Simultaneous Arrival! Stage 1: ${dualVehiclePrimary.icon} ${dualVehiclePrimary.name} (${dualVehiclePrimary.clearanceEnvelope}m clear / ${dualVehiclePrimary.greenDuration}s) | Stage 2: ${dualVehicleSecondary.icon} ${dualVehicleSecondary.name} (${dualVehicleSecondary.clearanceEnvelope}m clear / ${dualVehicleSecondary.greenDuration}s)`;
    }

    // Initialize Runway: Both roads active with visual queues
    if (runwayRoadR1) {
      runwayRoadR1.className = dualPrimaryRoad === 1 ? 'runway-road runway-r1 runway-active' : 'runway-road runway-r1 runway-blocked';
    }
    if (runwayRoadR2) {
      runwayRoadR2.className = dualPrimaryRoad === 2 ? 'runway-road runway-r2 runway-active' : 'runway-road runway-r2 runway-blocked';
    }
    if (runwayTagR1) {
      runwayTagR1.textContent = dualPrimaryRoad === 1 ? `STAGE 1: GREEN (${metrics.clearDistR1}m)` : 'STAGE 2: HELD AT STOPLINE';
      runwayTagR1.className = dualPrimaryRoad === 1 ? 'runway-tag tag-green' : 'runway-tag tag-amber';
    }
    if (runwayTagR2) {
      runwayTagR2.textContent = dualPrimaryRoad === 2 ? `STAGE 1: GREEN (${metrics.clearDistR2}m)` : 'STAGE 2: HELD AT STOPLINE';
      runwayTagR2.className = dualPrimaryRoad === 2 ? 'runway-tag tag-green' : 'runway-tag tag-amber';
    }
    if (runwayVehR1) {
      runwayVehR1.style.display = 'flex';
      runwayVehR1.style.left = '';
      runwayVehR1.className = dualPrimaryRoad === 1 ? 'runway-vehicle veh-moving' : 'runway-vehicle veh-holding';
    }
    if (runwayVehR2) {
      runwayVehR2.style.display = 'flex';
      runwayVehR2.style.left = '';
      runwayVehR2.className = dualPrimaryRoad === 2 ? 'runway-vehicle veh-moving' : 'runway-vehicle veh-holding';
    }

    const stage1Seconds = dualVehiclePrimary.greenDuration;
    const stage2Seconds = dualVehicleSecondary.greenDuration;

    logDualEmergencyTerminalTrace('INIT', ambMeta, fireMeta, edgeLatency, stage1Seconds, stage2Seconds);

    // Initial Clearance: 1.2s Amber Flush for opposing road + 0.8s All-Red buffer
    emergencyPhase = 'AMBER_CLEARANCE';
    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text text-amber';
      evStatusPhaseText.textContent = `PHASE 1/5: AMBER FLUSH (1.2s) — Warning cross-traffic for Dual Preemption`;
    }

    clearAllTrafficLights();
    if (dualPrimaryRoad === 1) {
      if (r1Red) r1Red.classList.add('active-red');
      if (r2Yellow) r2Yellow.classList.add('active-yellow');
      if (r1StateText) { r1StateText.textContent = 'RED (HOLDING FOR FLUSH)'; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2StateText) { r2StateText.textContent = 'AMBER (SAFETY CLEARANCE)'; r2StateText.className = 'light-state-tag yellow-tag'; }
    } else {
      if (r2Red) r2Red.classList.add('active-red');
      if (r1Yellow) r1Yellow.classList.add('active-yellow');
      if (r1StateText) { r1StateText.textContent = 'AMBER (SAFETY CLEARANCE)'; r1StateText.className = 'light-state-tag yellow-tag'; }
      if (r2StateText) { r2StateText.textContent = 'RED (HOLDING FOR FLUSH)'; r2StateText.className = 'light-state-tag red-tag'; }
    }

    const t1 = setTimeout(() => {
      emergencyPhase = 'ALL_RED_BUFFER';
      if (evStatusPhaseText) {
        evStatusPhaseText.className = 'ev-status-phase-text text-alert';
        evStatusPhaseText.textContent = `PHASE 2/5: ALL-RED SAFETY BUFFER (0.8s) — Conflict box fully cleared`;
      }
      clearAllTrafficLights();
      if (r1Red) r1Red.classList.add('active-red');
      if (r2Red) r2Red.classList.add('active-red');
      if (r1StateText) { r1StateText.textContent = 'RED (ALL-STOP BUFFER)'; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2StateText) { r2StateText.textContent = 'RED (ALL-STOP BUFFER)'; r2StateText.className = 'light-state-tag red-tag'; }

      const t2 = setTimeout(() => {
        executeDualStage1(stage1Seconds, stage2Seconds, edgeLatency);
      }, 800);
      emergencyTimeouts.push(t2);
    }, 1200);
    emergencyTimeouts.push(t1);
  }

  function executeDualStage1(stage1Seconds, stage2Seconds, edgeLatency) {
    dualStage = 1;
    emergencyPhase = 'GREEN_CORRIDOR';

    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text text-green';
      evStatusPhaseText.textContent = `STAGE 1/2: GREEN CORRIDOR ACTIVE — Passing Primary ${dualVehiclePrimary.name} (${dualVehiclePrimary.approach})`;
    }

    if (evArbitrationPill) {
      evArbitrationPill.textContent = `STAGE 1 ACTIVE: ${dualVehiclePrimary.name} [GREEN] | STAGE 2 QUEUED: ${dualVehicleSecondary.name} [HOLDING]`;
    }

    clearAllTrafficLights();
    if (r1LightBox) r1LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');
    if (r2LightBox) r2LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');

    if (dualPrimaryRoad === 1) {
      if (r1Green) r1Green.classList.add('active-green');
      if (r2Red) r2Red.classList.add('active-red');
      if (r1StateText) { r1StateText.textContent = `🚨 STAGE 1 GREEN (${stage1Seconds}s)`; r1StateText.className = 'light-state-tag green-tag'; }
      if (r2StateText) { r2StateText.textContent = `🛑 STAGE 2 QUEUED (HELD RED)`; r2StateText.className = 'light-state-tag red-tag'; }
      if (r1LightBox) r1LightBox.classList.add('emergency-corridor-box');
      if (r2LightBox) r2LightBox.classList.add('emergency-held-box');
    } else {
      if (r2Green) r2Green.classList.add('active-green');
      if (r1Red) r1Red.classList.add('active-red');
      if (r2StateText) { r2StateText.textContent = `🚨 STAGE 1 GREEN (${stage1Seconds}s)`; r2StateText.className = 'light-state-tag green-tag'; }
      if (r1StateText) { r1StateText.textContent = `🛑 STAGE 2 QUEUED (HELD RED)`; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2LightBox) r2LightBox.classList.add('emergency-corridor-box');
      if (r1LightBox) r1LightBox.classList.add('emergency-held-box');
    }

    playSirenTone();
    syncDualEmergencyToSupabase(1, dualVehiclePrimary, stage1Seconds, edgeLatency);

    const stage1Ms = stage1Seconds * 1000;
    const stage1Start = Date.now();
    clearInterval(emergencyCountdownInterval);
    emergencyCountdownInterval = setInterval(() => {
      const elapsed = Date.now() - stage1Start;
      const rem = Math.max(0, stage1Ms - elapsed);
      const secRem = (rem / 1000).toFixed(1);
      if (evCountdownVal) evCountdownVal.textContent = `${secRem}s (Stage 1)`;
      if (evStripTimer) evStripTimer.textContent = `${secRem}s`;
      if (evProgressBar) evProgressBar.style.width = `${(rem / stage1Ms) * 100}%`;

      if (rem <= 0) {
        clearInterval(emergencyCountdownInterval);
        executeDualInterlockTransition(stage2Seconds, edgeLatency);
      }
    }, 100);
  }

  function executeDualInterlockTransition(stage2Seconds, edgeLatency) {
    dualStage = 2;
    emergencyPhase = 'INTERLOCK_BUFFER';

    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text text-amber';
      evStatusPhaseText.textContent = `INTER-STAGE FLUSH (2.0s) — Primary EV cleared; preparing Stage 2 Green Wave`;
    }

    if (evArbitrationPill) {
      evArbitrationPill.textContent = `INTERLOCK BUFFER: Locking Stage 2 for ${dualVehicleSecondary.name}`;
    }

    clearAllTrafficLights();
    if (r1LightBox) r1LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');
    if (r2LightBox) r2LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');

    if (dualPrimaryRoad === 1) {
      if (r1Yellow) r1Yellow.classList.add('active-yellow');
      if (r2Red) r2Red.classList.add('active-red');
      if (r1StateText) { r1StateText.textContent = 'AMBER (STAGE 1 FLUSH)'; r1StateText.className = 'light-state-tag yellow-tag'; }
      if (r2StateText) { r2StateText.textContent = 'RED (HOLDING FOR STAGE 2)'; r2StateText.className = 'light-state-tag red-tag'; }
    } else {
      if (r2Yellow) r2Yellow.classList.add('active-yellow');
      if (r1Red) r1Red.classList.add('active-red');
      if (r2StateText) { r2StateText.textContent = 'AMBER (STAGE 1 FLUSH)'; r2StateText.className = 'light-state-tag yellow-tag'; }
      if (r1StateText) { r1StateText.textContent = 'RED (HOLDING FOR STAGE 2)'; r1StateText.className = 'light-state-tag red-tag'; }
    }

    const t1 = setTimeout(() => {
      clearAllTrafficLights();
      if (r1Red) r1Red.classList.add('active-red');
      if (r2Red) r2Red.classList.add('active-red');
      if (r1StateText) { r1StateText.textContent = 'RED (INTER-STAGE BUFFER)'; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2StateText) { r2StateText.textContent = 'RED (INTER-STAGE BUFFER)'; r2StateText.className = 'light-state-tag red-tag'; }

      const t2 = setTimeout(() => {
        executeDualStage2(stage2Seconds, edgeLatency);
      }, 800);
      emergencyTimeouts.push(t2);
    }, 1200);
    emergencyTimeouts.push(t1);
  }

  function executeDualStage2(stage2Seconds, edgeLatency) {
    dualStage = 3;
    emergencyPhase = 'GREEN_CORRIDOR';

    if (evStatusPhaseText) {
      evStatusPhaseText.className = 'ev-status-phase-text text-green';
      evStatusPhaseText.textContent = `STAGE 2/2: GREEN CORRIDOR ACTIVE — Passing Queued ${dualVehicleSecondary.name} (${dualVehicleSecondary.approach})`;
    }

    if (evArbitrationPill) {
      evArbitrationPill.textContent = `STAGE 2 ACTIVE: ${dualVehicleSecondary.name} [GREEN] | STAGE 1: ${dualVehiclePrimary.name} [PASSED]`;
    }

    // Runway transition: Secondary vehicle now moving through; Primary vehicle parked past stopline
    if (runwayRoadR1) {
      runwayRoadR1.className = dualSecondaryRoad === 1 ? 'runway-road runway-r1 runway-active' : 'runway-road runway-r1 runway-blocked';
    }
    if (runwayRoadR2) {
      runwayRoadR2.className = dualSecondaryRoad === 2 ? 'runway-road runway-r2 runway-active' : 'runway-road runway-r2 runway-blocked';
    }
    if (runwayTagR1) {
      runwayTagR1.textContent = dualSecondaryRoad === 1 ? 'STAGE 2: GREEN CORRIDOR' : 'STAGE 1: CLEARED (RED)';
      runwayTagR1.className = dualSecondaryRoad === 1 ? 'runway-tag tag-green' : 'runway-tag tag-red';
    }
    if (runwayTagR2) {
      runwayTagR2.textContent = dualSecondaryRoad === 2 ? 'STAGE 2: GREEN CORRIDOR' : 'STAGE 1: CLEARED (RED)';
      runwayTagR2.className = dualSecondaryRoad === 2 ? 'runway-tag tag-green' : 'runway-tag tag-red';
    }

    if (runwayVehR1) {
      if (dualSecondaryRoad === 1) {
        runwayVehR1.style.left = '';
        runwayVehR1.className = 'runway-vehicle veh-moving';
      } else {
        runwayVehR1.className = 'runway-vehicle';
        runwayVehR1.style.left = '92%';
      }
    }
    if (runwayVehR2) {
      if (dualSecondaryRoad === 2) {
        runwayVehR2.style.left = '';
        runwayVehR2.className = 'runway-vehicle veh-moving';
      } else {
        runwayVehR2.className = 'runway-vehicle';
        runwayVehR2.style.left = '92%';
      }
    }

    clearAllTrafficLights();
    if (r1LightBox) r1LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');
    if (r2LightBox) r2LightBox.classList.remove('emergency-corridor-box', 'emergency-held-box');

    if (dualSecondaryRoad === 1) {
      if (r1Green) r1Green.classList.add('active-green');
      if (r2Red) r2Red.classList.add('active-red');
      if (r1StateText) { r1StateText.textContent = `🚨 STAGE 2 GREEN (${stage2Seconds}s)`; r1StateText.className = 'light-state-tag green-tag'; }
      if (r2StateText) { r2StateText.textContent = `🛑 OPPOSING HELD (ALL-RED)`; r2StateText.className = 'light-state-tag red-tag'; }
      if (r1LightBox) r1LightBox.classList.add('emergency-corridor-box');
      if (r2LightBox) r2LightBox.classList.add('emergency-held-box');
    } else {
      if (r2Green) r2Green.classList.add('active-green');
      if (r1Red) r1Red.classList.add('active-red');
      if (r2StateText) { r2StateText.textContent = `🚨 STAGE 2 GREEN (${stage2Seconds}s)`; r2StateText.className = 'light-state-tag green-tag'; }
      if (r1StateText) { r1StateText.textContent = `🛑 OPPOSING HELD (ALL-RED)`; r1StateText.className = 'light-state-tag red-tag'; }
      if (r2LightBox) r2LightBox.classList.add('emergency-corridor-box');
      if (r1LightBox) r1LightBox.classList.add('emergency-held-box');
    }

    syncDualEmergencyToSupabase(2, dualVehicleSecondary, stage2Seconds, edgeLatency);

    const stage2Ms = stage2Seconds * 1000;
    const stage2Start = Date.now();
    clearInterval(emergencyCountdownInterval);
    emergencyCountdownInterval = setInterval(() => {
      const elapsed = Date.now() - stage2Start;
      const rem = Math.max(0, stage2Ms - elapsed);
      const secRem = (rem / 1000).toFixed(1);
      if (evCountdownVal) evCountdownVal.textContent = `${secRem}s (Stage 2)`;
      if (evStripTimer) evStripTimer.textContent = `${secRem}s`;
      if (evProgressBar) evProgressBar.style.width = `${(rem / stage2Ms) * 100}%`;

      if (rem <= 0) {
        clearInterval(emergencyCountdownInterval);
        restoreNormalCycle(true);
      }
    }, 100);
  }

  function syncDualEmergencyToSupabase(stage, vehicleMeta, durationSeconds, edgeLatency) {
    const c1 = parseInt(r1CarsSlider.value, 10);
    const d1 = parseFloat(r1DistSlider.value);
    const c2 = parseInt(r2CarsSlider.value, 10);
    const d2 = parseFloat(r2DistSlider.value);

    const r1Sig = vehicleMeta.road === 1 ? 'EMERGENCY_GREEN' : 'EMERGENCY_RED';
    const r2Sig = vehicleMeta.road === 2 ? 'EMERGENCY_GREEN' : 'EMERGENCY_RED';

    const evRecord = {
      id: cachedHistoricalMetrics.records.length > 0 ? (Number(cachedHistoricalMetrics.records[0].id) + 1) : Math.floor(Date.now() / 1000),
      created_at: new Date().toISOString(),
      road1_cars: vehicleMeta.road === 1 ? Math.max(c1, 15) : c1,
      road1_distance: d1,
      road1_pressure: vehicleMeta.road === 1 ? 9.99 : parseFloat((c1 / d1).toFixed(2)),
      road2_cars: vehicleMeta.road === 2 ? Math.max(c2, 15) : c2,
      road2_distance: d2,
      road2_pressure: vehicleMeta.road === 2 ? 9.99 : parseFloat((c2 / d2).toFixed(2)),
      road1_signal: r1Sig,
      road2_signal: r2Sig,
      isEmergency: true,
      vehicle: `DUAL_EV_STAGE_${stage}: ${vehicleMeta.name}`,
    };

    cachedHistoricalMetrics.records.unshift(evRecord);
    cachedHistoricalMetrics.count = (cachedHistoricalMetrics.count || 0) + 1;
    renderRecentRecordsTable();

    const payload = {
      road1_cars: evRecord.road1_cars,
      road1_distance: parseFloat(evRecord.road1_distance.toFixed(1)),
      road1_pressure: parseFloat(evRecord.road1_pressure.toFixed(2)),
      road2_cars: evRecord.road2_cars,
      road2_distance: parseFloat(evRecord.road2_distance.toFixed(1)),
      road2_pressure: parseFloat(evRecord.road2_pressure.toFixed(2)),
      road1_signal: r1Sig,
      road2_signal: r2Sig,
    };

    queueSupabaseSync(payload);

    if (terminalLog) {
      const timeStr = new Date().toLocaleTimeString();
      terminalLog.textContent += `\n[${timeStr}] >>> DUAL EV STAGE ${stage} ACTIVE <<<
Target Road     : Approach ${vehicleMeta.road === 1 ? 'A (Road 1)' : 'B (Road 2)'} [${vehicleMeta.name}]
Corridor Window : ${durationSeconds}s
Opposing Road   : Locked RED at Stopline
Supabase Log    : Priority Audit Record Queued`;
    }
  }

  function logDualEmergencyTerminalTrace(phase, ambMeta, fireMeta, latency, s1, s2) {
    if (!terminalLog) return;
    const timeStr = new Date().toLocaleTimeString();
    const metrics = updateDistanceGatedMetrics();
    terminalLog.textContent = `================================================
🚨 DUAL EMERGENCY V2X CONTENTION DETECTED!
================================================
Simultaneous Preemption Requests at Conflict Zone:
  • Approach 1: ${ambMeta.name} [${ambMeta.code}]
    Distance: ${ambMeta.distance}m | Speed: ${ambMeta.speed} | ETA: ${ambMeta.eta}s
    Clearance Envelope: ${metrics.clearDistR1}m (${ambMeta.distance}m EV + 10m buffer) -> Cutoff to RED
  • Approach 2: ${fireMeta.name} [${fireMeta.code}]
    Distance: ${fireMeta.distance}m | Speed: ${fireMeta.speed} | ETA: ${fireMeta.eta}s
    Clearance Envelope: ${metrics.clearDistR2}m (${fireMeta.distance}m EV + 10m buffer) -> Cutoff to RED

⚡ EDGE ARBITRATION RESOLUTION (<${latency}ms):
  ${dualArbitrationReason}

SIR'S TAIL-TRUNCATION RULE (WHOLE ROADS NOT EMPTIED):
  Road 1 Clearance: ${metrics.clearDistR1}m (${ambMeta.distance}m EV + 10m buffer) -> ${s1}s Green -> RED Cutoff
  Road 2 Clearance: ${metrics.clearDistR2}m (${fireMeta.distance}m EV + 10m buffer) -> ${s2}s Green -> RED Cutoff

SEQUENTIAL TWO-STAGE GREEN WAVE PLAN:
  [STAGE 1] -> ${dualVehiclePrimary.name} (${s1}s Green Corridor -> RED Cutoff)
  [BUFFER ] -> 2.0s Interlock Flush (Amber + All-Red)
  [STAGE 2] -> ${dualVehicleSecondary.name} (${s2}s Green Corridor -> RED Cutoff)
  [RECOVERY] -> Standard Adaptive Max-Pressure
================================================`;
  }

  // Bind Emergency Preemption Buttons
  if (btnEvRoad1) btnEvRoad1.addEventListener('click', () => triggerEmergencyPreemption(1, 'ambulance'));
  if (btnEvRoad2) btnEvRoad2.addEventListener('click', () => triggerEmergencyPreemption(2, 'fire'));
  if (btnEvDual) btnEvDual.addEventListener('click', () => triggerDualEmergencyConflict());
  if (btnEvCancel) btnEvCancel.addEventListener('click', () => restoreNormalCycle(false));

  // Dual Distance Sliders Event Listeners (Road 1 Ambulance & Road 2 Fire Brigade)
  if (evDistR1Slider) {
    evDistR1Slider.addEventListener('input', (e) => {
      evDistanceR1Meters = parseInt(e.target.value, 10);
      updateDistanceGatedMetrics();
    });
  }

  if (evDistR2Slider) {
    evDistR2Slider.addEventListener('input', (e) => {
      evDistanceR2Meters = parseInt(e.target.value, 10);
      updateDistanceGatedMetrics();
    });
  }

  initAudioSiren();

  // Initial Calculation & Historical Data Loading
  updateDistanceGatedMetrics();
  updateSimulation('init');
  setTimeout(() => loadHistoricalData(), 200);
}

/* ==========================================================================
   7. OPERATING CYCLE SIMULATION (STAGE-BY-STAGE SEQUENCE)
   ========================================================================== */
function initOperatingCycleSimulator() {
  const btnRunLoop = document.getElementById('btn-run-loop');
  const stageRows = document.querySelectorAll('.stages-list .stage-row');
  const totalTag = document.getElementById('total-latency-tag');
  if (!btnRunLoop || stageRows.length === 0) return;

  let isRunning = false;

  btnRunLoop.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;

    btnRunLoop.disabled = true;
    const originalText = btnRunLoop.innerHTML;
    btnRunLoop.innerHTML = `<span>Simulating Edge Loop...</span>`;

    let currentStage = 0;
    const stageDurations = [350, 320, 450, 120, 200, 150]; // Scaled for visible animation

    // Clear active states
    stageRows.forEach((row) => row.classList.remove('stage-active', 'stage-done'));

    function step() {
      if (currentStage < stageRows.length) {
        if (currentStage > 0) {
          stageRows[currentStage - 1].classList.remove('stage-active');
          stageRows[currentStage - 1].classList.add('stage-done');
        }

        stageRows[currentStage].classList.add('stage-active');
        stageRows[currentStage].scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        const delay = stageDurations[currentStage] || 300;
        currentStage++;
        setTimeout(step, delay);
      } else {
        // Complete
        if (stageRows[currentStage - 1]) {
          stageRows[currentStage - 1].classList.remove('stage-active');
          stageRows[currentStage - 1].classList.add('stage-done');
        }

        if (totalTag) {
          totalTag.style.transform = 'scale(1.08)';
          totalTag.style.backgroundColor = '#10B981';
          setTimeout(() => {
            totalTag.style.transform = 'scale(1)';
            totalTag.style.backgroundColor = '';
          }, 800);
        }

        btnRunLoop.innerHTML = `<span>✓ Completed Loop in 128.3ms</span>`;
        setTimeout(() => {
          btnRunLoop.disabled = false;
          btnRunLoop.innerHTML = originalText;
          isRunning = false;
          // Clear stage-done after a brief delay
          setTimeout(() => {
            stageRows.forEach((r) => r.classList.remove('stage-done'));
          }, 2500);
        }, 1200);
      }
    }

    step();
  });
}

/* ==========================================================================
   8. SENSING RANGE SVG INTERACTIVITY & TOOLTIPS
   ========================================================================== */
function initSensingDiagramInteractivity() {
  const svg = document.querySelector('.sensing-svg');
  if (!svg) return;

  const interactiveElements = svg.querySelectorAll('rect, polygon, circle');
  interactiveElements.forEach((elem) => {
    elem.style.transition = 'filter 0.2s ease, transform 0.2s ease';
    elem.addEventListener('mouseenter', () => {
      elem.style.filter = 'drop-shadow(0 0 6px rgba(38, 208, 232, 0.8))';
    });
    elem.addEventListener('mouseleave', () => {
      elem.style.filter = 'none';
    });
  });
}
