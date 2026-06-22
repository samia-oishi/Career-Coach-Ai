import {
  connectDatabase,
  closeDatabase,
  getCollection,
} from "../config/database.js";
import type { Blog, Career } from "../types.js";
import { logger } from "../utils/logger.js";

const now = new Date();

const careerTemplates = [
  [
    "frontend-developer",
    "Frontend Developer",
    "Software Engineering",
    "Creates polished, accessible web interfaces with React, TypeScript, and modern UI systems. Frontend developers translate product requirements into fast, responsive experiences that feel intuitive across desktop and mobile devices.",
    ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Accessibility"],
  ],
  [
    "backend-developer",
    "Backend Developer",
    "Software Engineering",
    "Builds the APIs, authentication flows, database logic, and server-side systems that power digital products. Backend developers focus on reliability, secure data access, clean architecture, and maintainable business logic.",
    ["Node.js", "Express", "MongoDB", "REST APIs", "Authentication", "Testing"],
  ],
  [
    "full-stack-developer",
    "Full-Stack Developer",
    "Software Engineering",
    "Works across the user interface, API layer, and database to ship complete product features. Full-stack developers are valuable in SaaS teams because they can connect user needs to production-ready implementation.",
    ["React", "Node.js", "TypeScript", "MongoDB", "API Design", "Deployment"],
  ],
  [
    "mobile-app-developer",
    "Mobile App Developer",
    "Software Engineering",
    "Creates mobile applications for iOS and Android using native or cross-platform tools. This career combines product thinking, performance awareness, offline behavior, device APIs, and mobile-first user experience design.",
    ["React Native", "Swift", "Kotlin", "APIs", "Mobile UX", "Testing"],
  ],
  [
    "software-architect",
    "Software Architect",
    "Software Engineering",
    "Defines the technical direction for complex software systems. Software architects make decisions about system boundaries, integration patterns, scalability, maintainability, and long-term engineering standards.",
    [
      "System Design",
      "Architecture",
      "Cloud",
      "Security",
      "Mentoring",
      "Documentation",
    ],
  ],
  [
    "data-analyst",
    "Data Analyst",
    "Data & AI",
    "Turns raw data into reports, dashboards, and practical business insights. Data analysts help teams understand performance, discover trends, and make evidence-based decisions using clear visual storytelling.",
    ["SQL", "Excel", "Python", "Tableau", "Statistics", "Storytelling"],
  ],
  [
    "data-scientist",
    "Data Scientist",
    "Data & AI",
    "Builds statistical and machine learning models to explain behavior, forecast outcomes, and support experimentation. Data scientists combine programming, statistics, business understanding, and communication.",
    [
      "Python",
      "Statistics",
      "Machine Learning",
      "SQL",
      "Experimentation",
      "Visualization",
    ],
  ],
  [
    "machine-learning-engineer",
    "M/L Engineer",
    "Data & AI",
    "Turns machine learning models into production-ready systems with APIs, pipelines, monitoring, and deployment workflows. This role bridges data science prototypes and reliable software engineering.",
    ["Python", "ML Ops", "TensorFlow", "APIs", "Docker", "Model Monitoring"],
  ],
  [
    "ai-product-engineer",
    "AI Product Engineer",
    "Data & AI",
    "Builds user-facing AI features by combining full-stack engineering, prompt design, evaluation, and product judgment. AI product engineers focus on making language model features useful, safe, and measurable.",
    [
      "TypeScript",
      "Prompt Engineering",
      "LLM APIs",
      "UX",
      "Evaluation",
      "Security",
    ],
  ],
  [
    "business-intelligence-developer",
    "Business Intelligence Developer",
    "Data & AI",
    "Creates trusted reporting systems, semantic models, and executive dashboards. BI developers help organizations define metrics consistently and make analytics accessible to non-technical teams.",
    ["SQL", "Power BI", "Data Modeling", "ETL", "DAX", "Analytics"],
  ],
  [
    "cybersecurity-analyst",
    "Cybersecurity Analyst",
    "Cybersecurity",
    "Monitors threats, investigates security alerts, and helps protect systems and data. Cybersecurity analysts combine technical troubleshooting with risk awareness and clear incident documentation.",
    [
      "Networking",
      "SIEM",
      "Incident Response",
      "Linux",
      "Risk Analysis",
      "Security Tools",
    ],
  ],
  [
    "security-engineer",
    "Security Engineer",
    "Cybersecurity",
    "Builds secure infrastructure and application controls that reduce risk across production systems. Security engineers automate safeguards, improve identity access, and support secure development practices.",
    [
      "Cloud Security",
      "Scripting",
      "IAM",
      "Threat Modeling",
      "DevSecOps",
      "Vulnerability Management",
    ],
  ],
  [
    "cloud-security-specialist",
    "Cloud Security Specialist",
    "Cybersecurity",
    "Focuses on securing cloud environments, identities, data storage, and deployed workloads. Cloud security specialists help teams use cloud platforms safely without slowing delivery.",
    ["AWS", "Azure", "IAM", "Encryption", "Monitoring", "Compliance"],
  ],
  [
    "devops-engineer",
    "DevOps Engineer",
    "Cloud & DevOps",
    "Improves software delivery through CI/CD, infrastructure automation, observability, release practices, and cloud operations. DevOps engineers help teams ship faster with fewer production surprises.",
    ["CI/CD", "Docker", "Kubernetes", "Linux", "Cloud", "Monitoring"],
  ],
  [
    "cloud-engineer",
    "Cloud Engineer",
    "Cloud & DevOps",
    "Designs and operates cloud infrastructure for applications, data services, networking, and security. Cloud engineers balance reliability, cost, performance, and operational simplicity.",
    [
      "AWS",
      "Networking",
      "Terraform",
      "Linux",
      "Cost Optimization",
      "Reliability",
    ],
  ],
  [
    "site-reliability-engineer",
    "Site Reliability Engineer",
    "Cloud & DevOps",
    "Keeps critical systems reliable by improving monitoring, incident response, capacity planning, and automation. SREs measure reliability with service-level indicators and reduce repeated operational work.",
    [
      "Observability",
      "Kubernetes",
      "Linux",
      "Scripting",
      "Incident Response",
      "SLIs",
    ],
  ],
  [
    "platform-engineer",
    "Platform Engineer",
    "Cloud & DevOps",
    "Creates internal developer platforms that make software delivery safer and more consistent. Platform engineers improve tooling, deployment workflows, infrastructure templates, and developer experience.",
    [
      "Kubernetes",
      "CI/CD",
      "Developer Experience",
      "Terraform",
      "APIs",
      "Security",
    ],
  ],
  [
    "ui-ux-designer",
    "UI/UX Designer",
    "Product & Design",
    "Designs user-centered interfaces through research, wireframes, prototypes, accessibility practices, and usability testing. UI/UX designers help products feel clear, consistent, and easy to use.",
    [
      "Figma",
      "User Research",
      "Prototyping",
      "Accessibility",
      "Design Systems",
      "Usability Testing",
    ],
  ],
  [
    "product-manager",
    "Product Manager",
    "Product & Design",
    "Owns product strategy, discovery, prioritization, and delivery coordination. Product managers connect customer problems, business goals, analytics, and engineering trade-offs into a practical roadmap.",
    [
      "Roadmapping",
      "Analytics",
      "User Research",
      "Prioritization",
      "Communication",
      "Agile",
    ],
  ],
  [
    "technical-product-manager",
    "Technical Product Manager",
    "Product & Design",
    "Leads technically complex products such as APIs, platforms, AI tools, or infrastructure features. Technical product managers translate system constraints into clear product decisions and delivery plans.",
    [
      "APIs",
      "System Design",
      "Roadmapping",
      "Stakeholder Management",
      "Analytics",
      "Documentation",
    ],
  ],
  [
    "qa-automation-engineer",
    "QA Automation Engineer",
    "Quality & Operations",
    "Builds automated test suites and quality processes that prevent regressions. QA automation engineers improve release confidence through UI tests, API tests, CI checks, and clear bug reporting.",
    [
      "Test Automation",
      "Playwright",
      "API Testing",
      "JavaScript",
      "CI/CD",
      "Bug Reporting",
    ],
  ],
  [
    "technical-support-engineer",
    "Technical Support Engineer",
    "Quality & Operations",
    "Solves customer technical issues, troubleshoots integrations, and turns repeated problems into product improvements. This role blends customer empathy, technical debugging, and documentation.",
    [
      "Troubleshooting",
      "APIs",
      "SQL",
      "Communication",
      "Documentation",
      "Customer Empathy",
    ],
  ],
  [
    "database-administrator",
    "Database Administrator",
    "Quality & Operations",
    "Maintains reliable databases through backups, access controls, performance tuning, monitoring, and recovery planning. DBAs protect one of the most important assets in any software business: data.",
    [
      "SQL",
      "MongoDB",
      "Backups",
      "Performance Tuning",
      "Security",
      "Monitoring",
    ],
  ],
  [
    "solutions-architect",
    "Solutions Architect",
    "Cloud & DevOps",
    "Designs technical solutions for customers or internal teams, often across cloud, data, integration, and application systems. Solutions architects combine communication skills with practical implementation depth.",
    [
      "Cloud",
      "Architecture",
      "Communication",
      "APIs",
      "Security",
      "Cost Planning",
    ],
  ],
  [
    "technical-writer",
    "Technical Writer",
    "Quality & Operations",
    "Creates documentation, tutorials, release notes, and API references that help users adopt technology successfully. Technical writers make complex systems easier to understand and support.",
    [
      "Writing",
      "APIs",
      "Information Architecture",
      "Markdown",
      "Research",
      "Editing",
    ],
  ],
  [
    "blockchain-developer",
    "Blockchain Developer",
    "Software Engineering",
    "Builds decentralized applications, smart contracts, wallets, and blockchain integrations. Blockchain developers need strong security awareness because small mistakes can create serious financial and trust risks.",
    [
      "Solidity",
      "Smart Contracts",
      "Web3.js",
      "Security",
      "TypeScript",
      "Testing",
    ],
  ],
  [
    "game-developer",
    "Game Developer",
    "Software Engineering",
    "Creates interactive games and simulations using engines, gameplay systems, physics, UI, and performance optimization. Game developers combine programming fundamentals with creative problem solving.",
    ["Unity", "C#", "Unreal Engine", "Game Physics", "3D Math", "Optimization"],
  ],
  [
    "ar-vr-developer",
    "AR/VR Developer",
    "Software Engineering",
    "Builds immersive augmented and virtual reality experiences for training, entertainment, education, and product visualization. This career blends spatial design, performance tuning, and interactive programming.",
    [
      "Unity",
      "C#",
      "3D Modeling",
      "XR SDKs",
      "Interaction Design",
      "Performance",
    ],
  ],
  [
    "data-engineer",
    "Data Engineer",
    "Data & AI",
    "Builds pipelines, warehouses, and data platforms that make analytics and AI possible. Data engineers focus on reliable ingestion, transformation, quality checks, and scalable data access.",
    ["Python", "SQL", "ETL", "Data Warehousing", "Spark", "Airflow"],
  ],
  [
    "prompt-engineer",
    "Prompt Engineer",
    "Data & AI",
    "Designs, tests, and improves prompts and workflows for AI systems. Prompt engineers evaluate outputs, reduce failure cases, and help teams turn language models into dependable product features.",
    [
      "Prompt Design",
      "Evaluation",
      "AI Safety",
      "Writing",
      "APIs",
      "Experimentation",
    ],
  ],
  [
    "it-systems-administrator",
    "IT Systems Administrator",
    "Quality & Operations",
    "Manages workplace systems, devices, accounts, networks, and internal tools. IT systems administrators keep organizations productive, secure, and supported as teams grow.",
    [
      "Windows",
      "Linux",
      "Networking",
      "Identity Management",
      "Scripting",
      "Support",
    ],
  ],
  [
    "network-engineer",
    "Network Engineer",
    "Cloud & DevOps",
    "Designs and maintains networks that connect users, applications, offices, and cloud environments. Network engineers focus on routing, switching, security, availability, and troubleshooting.",
    ["TCP/IP", "Routing", "Switching", "Firewalls", "VPNs", "Monitoring"],
  ],
  [
    "scrum-master",
    "Scrum Master",
    "Product & Design",
    "Helps teams improve delivery practices, remove blockers, and run healthy agile ceremonies. Scrum masters support team communication, planning discipline, and continuous improvement.",
    [
      "Agile",
      "Facilitation",
      "Coaching",
      "Planning",
      "Communication",
      "Metrics",
    ],
  ],
  [
    "crm-developer",
    "CRM Developer",
    "Software Engineering",
    "Customizes CRM platforms, automates workflows, and integrates customer data with sales, marketing, and support systems. CRM developers help businesses operationalize customer relationships.",
    [
      "Salesforce",
      "Automation",
      "APIs",
      "JavaScript",
      "Data Modeling",
      "Integrations",
    ],
  ],
  [
    "marketing-technology-specialist",
    "Marketing Technology Specialist",
    "Product & Design",
    "Connects analytics, automation, CRM, landing pages, and campaign tooling so marketing teams can measure and improve customer acquisition.",
    [
      "Analytics",
      "CRM",
      "Automation",
      "A/B Testing",
      "Tag Management",
      "Reporting",
    ],
  ],
] as const;

const careers: Career[] = careerTemplates.map(
  ([slug, title, category, description, skills], index) => ({
    slug,
    title,
    category,
    description,
    overview: `${description} A strong candidate for ${title} can explain their decisions, show practical projects, and demonstrate consistent improvement. This path rewards people who enjoy ${skills.slice(0, 3).join(", ")} and want to solve real business or user problems with technology.`,
    imageUrl: `https://images.unsplash.com/photo-${
      [
        "1497366754035-f200968a6e72",
        "1516321318423-f06f85e504b3",
        "1551288049-bebda4e38f71",
        "1519389950473-47ba0277781c",
        "1552664730-d307ca884978",
        "1504384308090-c894fdcc538d",
        "1551434678-e076c223a692",
      ][index % 7]
    }?auto=format&fit=crop&w=1200&q=80`,
    averageSalaryMin: 65000 + index * 1600,
    averageSalaryMax: 105000 + index * 2300,
    difficulty:
      index % 3 === 0
        ? "beginner"
        : index % 3 === 1
          ? "intermediate"
          : "advanced",
    demandScore: Math.min(98, 72 + (index % 9) * 3),
    requiredSkills: [...skills],
    responsibilities: [
      `Plan and deliver ${title.toLowerCase()} work aligned with business goals.`,
      "Collaborate with cross-functional teammates and communicate trade-offs clearly.",
      "Improve quality, reliability, accessibility, and maintainability over time.",
    ],
    salaryInformation: `${title} compensation varies by location, portfolio strength, company size, and depth of specialization. Candidates who show measurable outcomes, strong communication, and relevant project work usually command stronger offers.`,
    careerGrowth: [
      "Associate role",
      title,
      `Senior ${title}`,
      "Lead or specialist path",
    ],
    tools: skills.slice(0, 4),
    learningPath: [
      `Learn the fundamentals of ${skills[0]}.`,
      `Build two portfolio projects using ${skills[1]}.`,
      "Document outcomes and practice interview stories.",
    ],
    relatedCareerSlugs: careerTemplates
      .filter((item) => item[2] === category && item[0] !== slug)
      .slice(0, 3)
      .map((item) => item[0]),
    isFeatured: index < 8,
    status: "published",
    createdAt: now,
    updatedAt: now,
  }),
);

const blogs: Blog[] = [
  [
    "how-to-choose-your-first-tech-career",
    "How to Choose Your First Tech Career",
    "A practical framework for comparing skills, interests, salary expectations, and learning timelines before choosing a path.",
  ],
  [
    "resume-summary-examples-for-tech-roles",
    "Resume Summary Examples for Modern Tech Roles",
    "Learn how to write concise resume summaries that highlight strengths without exaggerating experience.",
  ],
  [
    "skills-that-make-junior-developers-stand-out",
    "Skills That Make Junior Developers Stand Out",
    "Technical fundamentals matter, but communication, debugging, and project ownership often separate strong candidates.",
  ],
  [
    "data-careers-compared-analyst-scientist-engineer",
    "Data Careers Compared: Analyst, Scientist, and Engineer",
    "Understand how the most popular data careers differ in daily work, tools, and hiring expectations.",
  ],
  [
    "cybersecurity-career-roadmap",
    "A Practical Cybersecurity Career Roadmap",
    "Explore entry points into cybersecurity, from support and networking to security operations and cloud security.",
  ],
  [
    "how-to-build-a-career-change-portfolio",
    "How to Build a Career-Change Portfolio",
    "Create portfolio projects that prove your skills, show your thinking, and help recruiters understand your transition.",
  ],
  [
    "ai-skills-for-every-technology-career",
    "AI Skills Every Technology Professional Should Learn",
    "Prompting, evaluation, automation, and responsible AI use are becoming baseline skills across tech roles.",
  ],
  [
    "interview-preparation-plan-for-tech-candidates",
    "A Four-Week Interview Preparation Plan for Tech Candidates",
    "Use a structured weekly plan to practice fundamentals, projects, behavioral stories, and mock interviews.",
  ],
].map(([slug, title, excerpt], index) => ({
  slug,
  title,
  excerpt,
  content: `${excerpt}\n\nCareer growth is easier when you connect your learning plan to real job expectations. Start by reading role descriptions, identifying repeated skills, and choosing one portfolio project that proves those skills in context. Keep notes on what you built, why you made decisions, and what you improved after feedback. CareerCoach Ai helps you turn those details into clearer career decisions and stronger application materials.`,
  coverImageUrl: `https://images.unsplash.com/photo-${["1519389950473-47ba0277781c", "1499750310107-5fef28a66643", "1504384308090-c894fdcc538d", "1516321497487-e288fb19713f"][index % 4]}?auto=format&fit=crop&w=1200&q=80`,
  category: ["Career Planning", "Resume", "Skills", "Interview"][index % 4],
  tags: ["career", "technology", "growth"],
  authorName: "CareerCoach Ai Editorial Team",
  readTimeMinutes: 4 + (index % 4),
  status: "published",
  publishedAt: now,
  createdAt: now,
  updatedAt: now,
}));

const seed = async () => {
  await connectDatabase();
  await getCollection<Career>("careers").deleteMany({});
  await getCollection<Blog>("blogs").deleteMany({});
  await getCollection<Career>("careers").insertMany(careers);
  await getCollection<Blog>("blogs").insertMany(blogs);
  logger.info(`Seeded ${careers.length} careers and ${blogs.length} blogs.`);
  await closeDatabase();
};

seed().catch(async (error) => {
  logger.error("Seed failed", error);
  await closeDatabase();
  process.exit(1);
});
