'use client';

import { useState } from 'react';

interface RoadmapStage {
  level: string;
  title: string;
  duration: string;
  description: string;
  skills: string[];
  milestones: string[];
}

interface CareerRoadmapProps {
  careerSlug: string;
  careerTitle: string;
  difficulty: string;
}

const roadmaps: Record<string, RoadmapStage[]> = {
  'frontend-developer': [
    {
      level: 'Beginner',
      title: 'Foundation',
      duration: '3-4 months',
      description: 'Master the core technologies that power every website',
      skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git & GitHub'],
      milestones: ['Build 5 static websites', 'Create responsive layouts', 'Deploy to GitHub Pages']
    },
    {
      level: 'Intermediate',
      title: 'Frameworks & Libraries',
      duration: '4-6 months',
      description: 'Learn modern frameworks and build dynamic applications',
      skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'State Management'],
      milestones: ['Build a Todo app with React', 'Create an e-commerce UI', 'Implement authentication']
    },
    {
      level: 'Advanced',
      title: 'Professional Skills',
      duration: '6+ months',
      description: 'Master performance, testing, and production-ready development',
      skills: ['Next.js', 'Testing (Jest/Cypress)', 'Performance Optimization', 'Accessibility'],
      milestones: ['Build a full-stack app', 'Achieve 90+ Lighthouse score', 'Contribute to open source']
    },
    {
      level: 'Expert',
      title: 'Architecture & Leadership',
      duration: '2+ years',
      description: 'Lead frontend architecture and mentor junior developers',
      skills: ['System Design', 'Micro-frontends', 'CI/CD', 'Team Leadership'],
      milestones: ['Design scalable architecture', 'Lead a team project', 'Speak at tech events']
    }
  ],
  'backend-developer': [
    {
      level: 'Beginner',
      title: 'Programming Fundamentals',
      duration: '3-4 months',
      description: 'Learn programming basics and HTTP fundamentals',
      skills: ['JavaScript/Node.js or Python', 'HTTP/REST Basics', 'JSON', 'Command Line'],
      milestones: ['Build CLI tools', 'Create simple APIs', 'Understand HTTP methods']
    },
    {
      level: 'Intermediate',
      title: 'Databases & APIs',
      duration: '4-6 months',
      description: 'Master data persistence and API design',
      skills: ['SQL & NoSQL', 'Express.js/Django', 'Authentication', 'API Design'],
      milestones: ['Build RESTful API', 'Implement JWT auth', 'Database optimization']
    },
    {
      level: 'Advanced',
      title: 'Scalable Systems',
      duration: '6+ months',
      description: 'Build production-ready, scalable backend systems',
      skills: ['Caching (Redis)', 'Message Queues', 'Docker', 'Cloud Services'],
      milestones: ['Microservices architecture', 'Handle 10k+ req/sec', 'Zero-downtime deployments']
    },
    {
      level: 'Expert',
      title: 'System Architecture',
      duration: '2+ years',
      description: 'Design distributed systems and lead technical decisions',
      skills: ['Distributed Systems', 'System Design', 'DevOps', 'Technical Leadership'],
      milestones: ['Design at-scale systems', 'Lead backend team', 'Drive technical strategy']
    }
  ],
  'data-analyst': [
    {
      level: 'Beginner',
      title: 'Data Foundations',
      duration: '2-3 months',
      description: 'Learn to work with data using spreadsheets and basic SQL',
      skills: ['Excel/Google Sheets', 'Basic SQL', 'Statistics Basics', 'Data Cleaning'],
      milestones: ['Clean messy datasets', 'Create pivot tables', 'Basic visualizations']
    },
    {
      level: 'Intermediate',
      title: 'Analysis Tools',
      duration: '3-4 months',
      description: 'Master SQL and visualization tools for deeper insights',
      skills: ['Advanced SQL', 'Tableau/Power BI', 'Python (Pandas)', 'Statistical Analysis'],
      milestones: ['Complex SQL queries', 'Interactive dashboards', 'Automated reports']
    },
    {
      level: 'Advanced',
      title: 'Advanced Analytics',
      duration: '6+ months',
      description: 'Perform predictive analysis and statistical modeling',
      skills: ['Python/R', 'Machine Learning Basics', 'A/B Testing', 'Data Pipelines'],
      milestones: ['Predictive models', 'Statistical experiments', 'ETL processes']
    },
    {
      level: 'Expert',
      title: 'Data Strategy',
      duration: '2+ years',
      description: 'Lead data initiatives and drive business decisions',
      skills: ['Data Strategy', 'Team Leadership', 'Stakeholder Management', 'Advanced ML'],
      milestones: ['Build data team', 'Create data strategy', 'Executive presentations']
    }
  ],
  'cybersecurity-analyst': [
    {
      level: 'Beginner',
      title: 'Security Foundations',
      duration: '3-4 months',
      description: 'Understand networking, operating systems, and security basics',
      skills: ['Networking (TCP/IP)', 'Linux Basics', 'Security Fundamentals', 'Python Scripting'],
      milestones: ['Set up home lab', 'Linux administration', 'Basic networking configs']
    },
    {
      level: 'Intermediate',
      title: 'Security Operations',
      duration: '4-6 months',
      description: 'Learn to monitor, detect, and respond to security incidents',
      skills: ['SIEM Tools', 'Incident Response', 'Vulnerability Assessment', 'Threat Intelligence'],
      milestones: ['SIEM configuration', 'Incident handling', 'Vulnerability reports']
    },
    {
      level: 'Advanced',
      title: 'Specialized Security',
      duration: '6+ months',
      description: 'Specialize in cloud security, forensics, or penetration testing',
      skills: ['Cloud Security', 'Digital Forensics', 'Penetration Testing', 'Compliance'],
      milestones: ['Security certifications', 'Penetration tests', 'Compliance audits']
    },
    {
      level: 'Expert',
      title: 'Security Leadership',
      duration: '2+ years',
      description: 'Lead security programs and architect enterprise defenses',
      skills: ['Security Architecture', 'Risk Management', 'Team Leadership', 'CISO Skills'],
      milestones: ['Design security program', 'Lead SOC team', 'Board presentations']
    }
  ],
  'devops-engineer': [
    {
      level: 'Beginner',
      title: 'Infrastructure Basics',
      duration: '3-4 months',
      description: 'Learn Linux, scripting, and basic cloud concepts',
      skills: ['Linux Administration', 'Bash/Python Scripting', 'Git', 'Basic Networking'],
      milestones: ['Linux server setup', 'Automation scripts', 'Git workflows']
    },
    {
      level: 'Intermediate',
      title: 'Containers & CI/CD',
      duration: '4-6 months',
      description: 'Master Docker, Kubernetes, and CI/CD pipelines',
      skills: ['Docker', 'Kubernetes', 'CI/CD Tools', 'Infrastructure as Code'],
      milestones: ['Containerized apps', 'K8s deployments', 'Automated pipelines']
    },
    {
      level: 'Advanced',
      title: 'Cloud & Observability',
      duration: '6+ months',
      description: 'Build scalable cloud infrastructure and monitoring',
      skills: ['AWS/Azure/GCP', 'Monitoring (Prometheus/Grafana)', 'Site Reliability', 'Security'],
      milestones: ['Multi-cloud setups', 'Observability stacks', 'SLO definitions']
    },
    {
      level: 'Expert',
      title: 'Platform Engineering',
      duration: '2+ years',
      description: 'Design developer platforms and drive engineering culture',
      skills: ['Platform Architecture', 'Developer Experience', 'Team Leadership', 'Cost Optimization'],
      milestones: ['Internal developer platform', 'Platform team leadership', 'Cloud cost optimization']
    }
  ],
  'default': [
    {
      level: 'Beginner',
      title: 'Foundations',
      duration: '3-4 months',
      description: 'Learn core concepts and tools for this career path',
      skills: ['Fundamental concepts', 'Basic tools', 'Industry terminology'],
      milestones: ['Complete online courses', 'Build simple projects', 'Join community forums']
    },
    {
      level: 'Intermediate',
      title: 'Skill Building',
      duration: '4-6 months',
      description: 'Develop practical skills through projects and practice',
      skills: ['Core technologies', 'Problem-solving', 'Best practices'],
      milestones: ['Build portfolio projects', 'Contribute to team efforts', 'Obtain certifications']
    },
    {
      level: 'Advanced',
      title: 'Professional Development',
      duration: '6+ months',
      description: 'Master advanced techniques and specialization areas',
      skills: ['Advanced tools', 'System design', 'Optimization'],
      milestones: ['Lead complex projects', 'Mentor junior colleagues', 'Speak at events']
    },
    {
      level: 'Expert',
      title: 'Leadership',
      duration: '2+ years',
      description: 'Lead teams and drive strategic technical decisions',
      skills: ['Architecture', 'Leadership', 'Strategy'],
      milestones: ['Technical leadership roles', 'Strategic planning', 'Industry recognition']
    }
  ]
};

export function CareerRoadmap({ careerSlug, careerTitle, difficulty }: CareerRoadmapProps) {
  const [expandedStage, setExpandedStage] = useState<number | null>(0);
  
  const stages = roadmaps[careerSlug] || roadmaps['default'];
  
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#3b82f6';
      case 'advanced': return '#8b5cf6';
      case 'expert': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="card-surface p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Career Roadmap</h2>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>
          Your path to becoming a {careerTitle}. Estimated timeline varies based on dedication and prior experience.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div 
          className="absolute left-6 top-0 bottom-0 w-0.5 hidden md:block"
          style={{ background: 'linear-gradient(to bottom, #10b981, #3b82f6, #8b5cf6, #f59e0b)' }}
        />

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.level} className="relative">
              {/* Timeline dot */}
              <div 
                className="absolute left-4 top-6 h-4 w-4 rounded-full border-2 border-white hidden md:block"
                style={{ backgroundColor: getDifficultyColor(stage.level) }}
              />

              <div 
                className={`ml-0 md:ml-12 rounded-2xl border transition-all cursor-pointer ${
                  expandedStage === index ? 'shadow-lg' : 'hover:shadow-md'
                }`}
                style={{ 
                  borderColor: expandedStage === index ? getDifficultyColor(stage.level) : 'var(--border)',
                  background: 'var(--background)'
                }}
                onClick={() => setExpandedStage(expandedStage === index ? null : index)}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg"
                      style={{ backgroundColor: getDifficultyColor(stage.level) }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{stage.title}</h3>
                        <span 
                          className="rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{ 
                            backgroundColor: `${getDifficultyColor(stage.level)}20`,
                            color: getDifficultyColor(stage.level)
                          }}
                        >
                          {stage.level}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>{stage.duration}</p>
                    </div>
                  </div>
                  <svg 
                    className={`h-5 w-5 transition-transform ${expandedStage === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Content */}
                {expandedStage === index && (
                  <div className="border-t px-4 pb-4" style={{ borderColor: 'var(--border)' }}>
                    <p className="mt-4" style={{ color: 'var(--muted)' }}>{stage.description}</p>
                    
                    {/* Skills */}
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.map((skill) => (
                          <span 
                            key={skill}
                            className="rounded-full px-3 py-1 text-sm font-medium"
                            style={{ 
                              background: 'var(--card)',
                              border: '1px solid var(--border)'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Milestones</h4>
                      <ul className="space-y-2">
                        {stage.milestones.map((milestone, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm" style={{ color: 'var(--muted)' }}>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Starting difficulty: <span className="capitalize">{difficulty}</span></span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Click stages to expand details</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: difficulty === 'beginner' ? '25%' : difficulty === 'intermediate' ? '50%' : '75%',
              background: `linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
