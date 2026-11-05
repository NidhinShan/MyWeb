/* ===== EDIT ONLY THIS FILE TO UPDATE YOUR SITE ===== */
const DATA = {
  profile: {
    name: "Nidhin Shan",
    role: "B.Tech CSE Student · Full-Stack Developer",
    bio: "Computer Science student at NSS College of Engineering, Palakkad (APJAKTU). Passionate about full-stack web development, network architecture, and open-source tools. Active campus leader bridging student governance, tech community building, and large-scale festival operations.",
    email: "nidhinshan7@gmail.com",
    github: "https://github.com/NidhinShan",
    linkedin: "https://www.linkedin.com/in/Nidhin-Shan",
    resume: "static/assets/resume.pdf",
    // Optional: Get a free Web3Forms access key at https://web3forms.com for instant in-app email delivery without activation redirects
    web3forms_key: ""
  },

  // Animated numbers on the home page (value counts up from 0)
  stats: [
    { value: 5,   suffix: "+", label: "Hackathons tackled" },
    { value: 1500, suffix: "+", label: "Fest attendees coordinated" },
    { value: 4,   suffix: "+", label: "Leadership roles held" }
  ],

  // "Right now" tile on the home page
  now: {
    building: "LocalHaul & GoPal systems",
    learning: "Network protocols, security & full-stack scaling",
    status: "Open to technical internships & collaborations"
  },

  projects: [
    {
      title: "LocalHaul",
      description: "Logistics and local transport coordination system built for streamlined delivery routes.",
      tags: ["Full-Stack", "Node.js", "PostgreSQL"],
      demo: "https://github.com/NidhinShan",
      github: "https://github.com/NidhinShan"
    },
    {
      title: "GoPal Systems",
      description: "Smart campus navigation and utility tracking utility suite for institutional events.",
      tags: ["JavaScript", "APIs", "Tailwind"],
      demo: "https://github.com/NidhinShan",
      github: "https://github.com/NidhinShan"
    }
  ],

  // Beyond The Code · Hobbies & Interests (Clean, concise, authentic)
  hobbies: [
    {
      id: "football",
      icon: "⚽",
      title: "Playing Football",
      category: "Sports",
      tagline: "Turf matches & weekend games",
      description: "Plays left winger in 5s and 7s on local and campus turfs. Love quick passing, high pressing, and competitive weekend games with friends.",
      tags: ["Turf Matches", "Midfield", "Weekend 7s"]
    },
    {
      id: "cinema",
      icon: "🎬",
      title: "Movies & Series",
      category: "Entertainment",
      tagline: "Sci-fi, thrillers & good writing",
      description: "Big fan of mind-bending thrillers, sci-fi, and well-written series. Favorites include Dark, Severance, and films directed by Nolan or Fincher.",
      tags: ["Sci-Fi", "Thrillers", "Dark & Severance"]
    },
    {
      id: "reading",
      icon: "📚",
      title: "Reading Books",
      category: "Learning",
      tagline: "Tech history & personal growth",
      description: "Enjoy reading non-fiction, biographies of builders, and books on how complex systems and human habits work.",
      tags: ["Non-Fiction", "Biographies", "Systems"]
    },
    {
      id: "geopolitics",
      icon: "🌍",
      title: "Geopolitics",
      category: "Interests",
      tagline: "Global affairs & foreign policy",
      description: "Casually tracking international diplomacy, global power dynamics, trade corridors, and how tech supply chains shape the world.",
      tags: ["Global Affairs", "Diplomacy", "Supply Chains"]
    }
  ],

  roles: [
    {
      title: "University Union Councillor (UUC)",
      organization: "College Union, NSS College of Engineering (APJAKTU)",
      tenure: "2026 – Present",
      impact: [
        "Elected to represent the student body of NSSCE at the university council level under APJAKTU.",
        "Advocating for student welfare, academic policies, and university-level youth initiatives.",
        "Collaborating across student leadership committees to drive campus-wide governance decisions."
      ],
      skills: ["Student Governance", "Public Speaking", "Diplomacy", "Strategic Leadership"]
    },
    {
      title: "Event Head & Coordinator — AGAM '26",
      organization: "College Union, NSSCE",
      tenure: "2026",
      impact: [
        "Led central coordination for AGAM '26, the annual flagship arts festival of NSSCE.",
        "Managed stage operations, volunteer crews, inter-department logistics, and event schedules for college-wide crowds.",
        "Handled resource allocations, stage setups, and multi-team coordination under tight timelines."
      ],
      skills: ["Event Direction", "Crowd Management", "Operations", "Team Coordination"]
    },
    {
      title: "Class Representative",
      organization: "Department of Computer Science & Engineering, NSSCE",
      tenure: "2026 – 2027",
      impact: [
        "Serving as the official communication bridge between CSE faculty and students for academics and schedules.",
        "Facilitating student feedback, coordinating elective preferences, and resolving batch-level administrative matters."
      ],
      skills: ["Coordination", "Communication", "Conflict Resolution", "Batch Leadership"]
    },
    {
      title: "Treasurer",
      organization: "STACS (Students Association of Computer Science), NSSCE",
      tenure: "2025 – 2026",
      impact: [
        "Oversaw all association accounts, budgeting, and expenditure verification for department technical fests.",
        "Maintained transparent financial ledgers, sponsorship receivables, and prize disbursement records."
      ],
      skills: ["Financial Management", "Budgeting", "Auditing", "Resource Planning"]
    },
    {
      title: "Joint Treasurer",
      organization: "STACS (Students Association of Computer Science), NSSCE",
      tenure: "2024 – 2025",
      impact: [
        "Assisted in managing registration desk collections, cash flows, and bill authentications for tech events.",
        "Maintained organized physical receipts and supported financial reporting for student workshops."
      ],
      skills: ["Financial Record Keeping", "Logistics", "Teamwork", "Account Reconciliation"]
    },
    {
      title: "Active Union Volunteer",
      organization: "College Union, NSSCE",
      tenure: "2026 – Present",
      impact: [
        "Volunteering across major campus drives, cultural celebrations, student inductions, and union campaigns.",
        "Assisting executive committees with venue setup, crowd control, and on-ground logistics."
      ],
      skills: ["Volunteering", "On-Ground Management", "Team Support"]
    }
  ],

  // Timeline ordered from 2026 down to 2024
  timeline: [
    { 
      year: 2026, 
      title: "University Union Councillor (2026–2027)", 
      category: "Academic",
      description: "Appointed as student liaison between the college and the university." 
    },
    { 
      year: 2026, 
      title: "Class Representative (2026–2027)", 
      category: "Academic",
      description: "Appointed as student liaison between the CSE department faculty and the student body." 
    },
    { 
      year: 2026, 
      title: "Treasurer — STACS", 
      category: "Academic",
      description: "Department leadership by handling association funds, registrations, and event accounts." 
    },
    { 
      year: 2026, 
      title: "DEDSEC CTF Competition", 
      category: "Competition",
      description: "Competed in cybersecurity Capture The Flag challenges focusing on web exploits, cryptography, and log analysis." 
    },
    { 
      year: 2025, 
      title: "Participated in 5+ Hackathons", 
      category: "Hackathon",
      description: "Collaborated in high-energy sprint environments developing functional software and web application prototypes." 
    },
    { 
      year: 2025, 
      title: "TinkerHub Useless Projects 3.0", 
      category: "Hackathon",
      description: "Engineered and showcased unconventional, creative tech concepts during a fast-paced sprint." 
    },
    { 
      year: 2025, 
      title: "Joint Treasurer — STACS", 
      category: "Academic",
      description: "Started department leadership by handling association funds, registrations, and event accounts." 
    },
    { 
      year: 2024, 
      title: "Joined B.Tech in CSE at NSSCE", 
      category: "Academic",
      description: "Began undergraduate journey in Computer Science & Engineering at NSS College of Engineering, Palakkad (APJAKTU)." 
    }
  ]
};
