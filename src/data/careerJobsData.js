export const COMPANY_INFO = {
  name: 'Anthropic',
  tagline: 'Frontier AI safety and research. Building reliable, interpretable, and steerable AI systems.',
  description: 'Anthropic is an AI safety and research company that builds reliable, beneficial, and steerable AI systems like Claude. Join our team in San Francisco, London, and remote to ensure transformative AI has a safe, positive impact on the world.',
  headquarters: 'San Francisco, CA & London, UK',
  founded: '2021',
  teamSize: '650+ Team Members across 14 countries',
  glassdoorRating: '4.9 ★★★★★ (98% recommend)',
  funding: 'Series D ($7.3B raised)',
  benefitsSummary: [
    'Comprehensive Healthcare & Dental (100% covered)',
    'Competitive Base + Meaningful Equity Packages',
    'Flexible Work: Remote-first culture with global hub access',
    '$3,000 Annual Learning & Conference Stipend',
    'Unlimited Flexible Paid Time Off + Global Wellness Days',
    'Home Office Setup Budget ($1,500 once-off + $100/mo internet)'
  ]
};

export const CAREER_JOBS = [
  {
    id: 'anthropic-job-1',
    title: 'Senior AI Research Scientist',
    department: 'Engineering',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '5-8 yrs',
    salary: '₹38,00,000 - ₹54,00,000 / yr + Equity',
    postedDate: '2 days ago',
    featured: true,
    skills: ['PyTorch', 'Transformers', 'LLMs', 'CUDA', 'Python', 'NLP'],
    overview: 'We are seeking an experienced AI Research Scientist to spearhead our fundamental research and production deployment of proprietary reasoning models. You will work alongside world-class scientists to scale multimodal transformer models that automate mission-critical enterprise workflows.',
    responsibilities: [
      'Architect, fine-tune, and evaluate state-of-the-art Large Language Models and retrieval-augmented generation systems.',
      'Optimize model training throughput and inference latency using PyTorch, vLLM, and TensorRT on distributed GPU clusters.',
      'Collaborate with product and infrastructure teams to deploy experimental generative AI features into live customer workflows.',
      'Conduct rigorous bench-marking, safety alignments (RLHF/DPO), and domain-specific knowledge injection.',
      'Publish research findings in top-tier conferences (NeurIPS, ICML, ACL) and file patents.'
    ],
    qualifications: [
      'MS or PhD in Computer Science, Machine Learning, Computational Linguistics, or equivalent practical experience.',
      '5+ years of hands-on experience training, optimizing, and evaluating transformer models.',
      'Proficiency in Python, PyTorch, DeepSpeed/Megatron-LM, and distributed model training paradigms.',
      'Demonstrated track record of delivering machine learning models to production at scale.',
      'Strong mathematical foundations in linear algebra, probability, and optimization theory.'
    ],
    niceToHave: [
      'Experience with custom CUDA kernel development (Triton / CUDA C++).',
      'Contributions to prominent open-source AI frameworks or published research papers.',
      'Familiarity with enterprise compliance, AI safety benchmarks, and low-latency quantization techniques.'
    ],
    teamSize: '18 Research Scientists & ML Engineers',
    hiringManager: 'Dr. Vikram Malhotra (VP of Applied AI)'
  },
  {
    id: 'anthropic-job-2',
    title: 'Principal Cloud Infrastructure Architect',
    department: 'Engineering',
    location: 'San Francisco, CA',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '8-12 yrs',
    salary: '$190,000 - $245,000 / yr + Equity',
    postedDate: '3 days ago',
    featured: true,
    skills: ['AWS Cloud', 'Kubernetes', 'Terraform', 'Golang', 'Zero Trust', 'Microservices'],
    overview: 'As our Principal Cloud Infrastructure Architect, you will own the overarching architectural roadmap for our multi-region Kubernetes infrastructure spanning AWS and GCP, ensuring 99.999% availability and unmatched security for Tier-1 enterprise clients.',
    responsibilities: [
      'Define multi-cloud architecture standards, disaster recovery blueprints, and automated infrastructure as code.',
      'Scale global Kubernetes clusters supporting tens of thousands of compute instances and petabytes of telemetry data.',
      'Design zero-trust networking topology, mTLS service meshes (Istio/Envoy), and automated vulnerability gating.',
      'Partner with FinOps to optimize multi-million dollar cloud expenditure through automated cluster autoscaling.',
      'Mentor and guide senior DevOps and SRE staff across global timezones.'
    ],
    qualifications: [
      '8+ years in cloud infrastructure design, reliability engineering, and system architecture.',
      'Deep expertise in AWS/GCP, Kubernetes internals, Terraform, and containerized networking.',
      'Expertise in Golang, Python, or Rust for systems tooling development.',
      'Experience managing multi-region Active-Active distributed cloud architectures.',
      'Strong grasp of SOC2, ISO27001, and HIPAA compliance enforcement.'
    ],
    niceToHave: [
      'Certified Kubernetes Administrator (CKA) or AWS Solutions Architect Professional.',
      'Experience with high-throughput event streaming (Kafka, Redpanda, Apache Flink).'
    ],
    teamSize: '24 Platform Engineers & SREs',
    hiringManager: 'Elena Rostova (Head of Platform Engineering)'
  },
  {
    id: 'anthropic-job-3',
    title: 'Staff Frontend Engineer (Design Systems)',
    department: 'Engineering',
    location: 'Remote - US',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '6-9 yrs',
    salary: '$165,000 - $205,000 / yr + Equity',
    postedDate: '1 day ago',
    featured: true,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Design Systems', 'Web Performance', 'Accessibility'],
    overview: 'Anthropic is looking for a Staff Frontend Engineer to lead the evolution of our unified component architecture and design system. You will bridge product design and web engineering, ensuring our enterprise applications achieve flawless aesthetic fidelity, accessibility (WCAG AAA), and blazing-fast performance.',
    responsibilities: [
      'Architect and maintain our cross-application UI design system tokens, headless component primitives, and Figma code generators.',
      'Optimize core web vitals, bundle sizes, and tree-shaking across our multi-tenant SPA applications.',
      'Establish frontend testing standards with Playwright, Storybook, and Vitest.',
      'Partner closely with Product Designers and Product Managers to define elegant micro-interactions and motion guidelines.',
      'Champion inclusive design and full screen-reader accessibility compliance.'
    ],
    qualifications: [
      '6+ years of specialized frontend development experience building enterprise SaaS interfaces in React and TypeScript.',
      'Deep architectural knowledge of modern CSS, Tailwind, design tokens, and composable component patterns.',
      'Passionate about typography, micro-interactions, layout physics, and pixel precision.',
      'Extensive experience with Storybook, visual regression testing, and CI/CD automated npm package publishing.'
    ],
    niceToHave: [
      'Experience with WebGL, Canvas data visualizations, or Web Workers for heavy data processing.',
      'Active contributions to popular UI open-source repositories.'
    ],
    teamSize: '12 Frontend Specialists',
    hiringManager: 'Marcus Vance (Director of Frontend Engineering)'
  },
  {
    id: 'anthropic-job-4',
    title: 'Senior Product Manager - Autonomous Agents',
    department: 'Product',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '5-8 yrs',
    salary: '$175,000 - $220,000 / yr + Equity',
    postedDate: '4 days ago',
    featured: false,
    skills: ['AI Product Management', 'LLM Workflows', 'Roadmapping', 'User Research', 'Metrics & KPIs'],
    overview: 'Join as Senior PM for our Autonomous Agents squad. You will define the roadmap for AI-driven collaborative agents that handle multi-step reasoning, tool invocations, and complex enterprise knowledge retrieval.',
    responsibilities: [
      'Conduct customer interviews with Fortune 500 HR, recruiting, and operations leaders to identify high-value agentic use cases.',
      'Define quarterly OKRs, write detailed PRDs, and prioritize sprint backlogs with ML researchers and frontend engineers.',
      'Establish qualitative evaluation frameworks and quantitative success metrics (task completion rate, latency, user trust).',
      'Lead go-to-market collaboration with Product Marketing, Sales, and Customer Success.'
    ],
    qualifications: [
      '5+ years in product management with at least 2 years focused on AI, ML, or data-intensive SaaS products.',
      'Proven ability to translate ambiguous ML breakthroughs into intuitive, lovable customer experiences.',
      'Exceptional analytical mindset with fluency in SQL, product analytics (Amplitude/Mixpanel), and user experimentation.'
    ],
    niceToHave: [
      'Technical background in CS, software engineering, or data science.',
      'Experience launching conversational AI or robotic process automation systems.'
    ],
    teamSize: 'Cross-functional Pod (PM, 6 Engineers, 1 Designer, 1 Data Scientist)',
    hiringManager: 'Priya Nambiar (VP of Product)'
  },
  {
    id: 'anthropic-job-5',
    title: 'Lead Product Designer (UI/UX)',
    department: 'Design',
    location: 'New York, NY',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '6-10 yrs',
    salary: '$160,000 - $195,000 / yr + Equity',
    postedDate: '5 days ago',
    featured: false,
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Information Architecture'],
    overview: 'We are seeking an exceptional Lead Product Designer to guide the user experience of our flagship recruiter workbench and candidate evaluation flows. You will turn intricate enterprise recruiting workflows into elegant, joy-inducing digital tools.',
    responsibilities: [
      'Lead end-to-end UX architecture from concept discovery, sketches, user journeys, to high-fidelity clickable prototypes.',
      'Synthesize customer feedback and telemetry data into iterative interface enhancements.',
      'Contribute new component patterns and dark-mode guidelines to our Figma design system.',
      'Evangelize design excellence across the engineering and executive teams.'
    ],
    qualifications: [
      '6+ years designing complex B2B SaaS desktop web applications.',
      'Mastery of Figma (auto-layout, components, variables, interactive prototyping).',
      'Strong portfolio showcasing problem solving, elegant visual hierarchy, and high customer empathy.',
      'Excellent verbal and visual storytelling abilities.'
    ],
    niceToHave: [
      'Basic knowledge of HTML/CSS/React capabilities and constraints.',
      'Experience designing AI-assisted or conversational software interfaces.'
    ],
    teamSize: '7 Product Designers & User Researchers',
    hiringManager: 'Chloe Deschanel (Head of Design)'
  },
  {
    id: 'anthropic-job-6',
    title: 'Senior Data Platform Engineer',
    department: 'Data Science',
    location: 'London, UK',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '4-7 yrs',
    salary: '£85,000 - £115,000 / yr + Equity',
    postedDate: '4 days ago',
    featured: false,
    skills: ['Python', 'Apache Spark', 'Snowflake', 'dbt', 'Airflow', 'Kafka'],
    overview: 'Anthropic processes billions of tokens, multimodal context vectors, and developer requests daily. As a Senior Data Platform Engineer, you will build resilient data pipelines and real-time streaming architectures that power our frontier AI systems.',
    responsibilities: [
      'Design and operate scalable batch and streaming pipelines using Spark, Kafka, and dbt.',
      'Maintain reliable data lakehouse storage on Snowflake and AWS S3 with fine-grained access control.',
      'Implement data quality observability, schema validations, and automated lineage tracking.',
      'Collaborate with analytics and ML teams to provide clean, low-latency feature stores.'
    ],
    qualifications: [
      '4+ years building high-throughput data platforms in production.',
      'Proficiency in Python, SQL, Apache Spark, and orchestration engines like Airflow or Dagster.',
      'Solid understanding of data modeling, dimensional schemas, and query optimization.'
    ],
    niceToHave: [
      'Experience with Vector Databases (Milvus, Pinecone, Qdrant).',
      'Hands-on expertise with Apache Iceberg or Delta Lake formats.'
    ],
    teamSize: '11 Data Platform Engineers',
    hiringManager: 'Arthur Kingsley (Data Engineering Director)'
  },
  {
    id: 'anthropic-job-7',
    title: 'Enterprise Account Executive (FinTech & Healthcare)',
    department: 'Sales',
    location: 'New York, NY',
    workMode: 'On-site',
    employmentType: 'Full-time',
    experience: '5-9 yrs',
    salary: '$140,000 Base / $280,000 OTE + Equity',
    postedDate: '1 week ago',
    featured: false,
    skills: ['Enterprise SaaS', 'MEDDPICC', 'C-Level Selling', 'Outbound Prospecting', 'Salesforce CRM'],
    overview: 'Drive enterprise net-new revenue by partnering with Fortune 1000 enterprises to deploy Anthropic\'s Claude AI platform across mission-critical workflows.',
    responsibilities: [
      'Execute full sales cycles from discovery, technical demo orchestrations, to procurement and contract close.',
      'Consistently achieve or exceed quarterly and annual quota targets ($1.5M+ ARR quota).',
      'Build strategic territory plans and partner with Sales Engineering on complex RFP responses.',
      'Maintain clean CRM hygiene in Salesforce and deliver predictable revenue forecasts.'
    ],
    qualifications: [
      '5+ years of enterprise B2B SaaS closing experience with ACVs exceeding $100k+.',
      'Proven track record in MEDDPICC qualification and navigating multi-stakeholder enterprise deals.',
      'History of president’s club / top 10% quota attainment.'
    ],
    niceToHave: [
      'Experience selling HR tech, recruiting software, or enterprise AI infrastructure.',
      'Existing network of HR / Talent leaders in North America.'
    ],
    teamSize: '16 Account Executives',
    hiringManager: 'Bradley Cooper (VP of Global Enterprise Sales)'
  },
  {
    id: 'anthropic-job-8',
    title: 'Director of Growth Marketing',
    department: 'Marketing',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '8-12 yrs',
    salary: '$180,000 - $225,000 / yr + Equity',
    postedDate: '6 days ago',
    featured: false,
    skills: ['Demand Gen', 'Paid Acquisition', 'SEO / Organic', 'HubSpot / Marketo', 'ABM', 'Funnel Analytics'],
    overview: 'We are seeking a strategic, highly quantitative Director of Growth Marketing to own our demand generation engine, inbound pipeline, and account-based marketing programs globally.',
    responsibilities: [
      'Lead our global performance marketing budget across search, social, display, and account-targeted advertising.',
      'Partner closely with Sales and SDR leadership to hit monthly qualified pipeline (MQL/SQL) targets.',
      'Spearhead technical SEO, content syndication, and high-converting landing page optimization.',
      'Manage marketing analytics, multi-touch attribution models, and marketing automation workflows.'
    ],
    qualifications: [
      '8+ years in growth marketing at B2B enterprise SaaS scale-ups.',
      'Deep quantitative rigor with proficiency in SQL, Google Analytics 4, and attribution tools.',
      'Demonstrated experience managing $5M+ annual paid media budgets with proven ROI.'
    ],
    niceToHave: [
      'Experience running product-led growth (PLG) trial conversion funnels.',
      'Background in HR / recruiting software category.'
    ],
    teamSize: '8 Growth & Demand Gen Specialists',
    hiringManager: 'Jessica Alba-Ward (Chief Marketing Officer)'
  },
  {
    id: 'anthropic-job-9',
    title: 'Senior Site Reliability Engineer (Kubernetes & Telemetry)',
    department: 'Engineering',
    location: 'Berlin, Germany',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '5-8 yrs',
    salary: '€90,000 - €120,000 / yr + Equity',
    postedDate: '3 days ago',
    featured: false,
    skills: ['Kubernetes', 'Prometheus', 'Grafana', 'Terraform', 'Incident Response', 'Linux'],
    overview: 'Keep our mission-critical distributed systems performant, observable, and unbreakable. You will champion chaos engineering, automated remediation, and zero-downtime deployment pipelines.',
    responsibilities: [
      'Own observability, alerting, and telemetry pipelines using Prometheus, Grafana, OpenTelemetry, and Jaeger.',
      'Conduct blameless post-mortems and automate preventive reliability fixes.',
      'Participate in a humane, well-compensated 24/7 on-call rotation with follow-the-sun coverage.',
      'Standardize service level indicators (SLIs) and service level objectives (SLOs) with product engineering teams.'
    ],
    qualifications: [
      '5+ years in SRE or DevOps roles supporting customer-facing distributed web services.',
      'Strong expertise in Linux internals, networking protocols (TCP/IP, HTTP/2, gRPC), and container runtimes.',
      'Proficiency in scripting / automation with Python or Golang.'
    ],
    niceToHave: [
      'Experience with eBPF-based networking and monitoring (Cilium).',
      'Knowledge of multi-region database failover (CockroachDB, Aurora Global).'
    ],
    teamSize: '10 Global SREs',
    hiringManager: 'Hans Becker (Director of Site Reliability)'
  },
  {
    id: 'anthropic-job-10',
    title: 'Customer Success Team Lead',
    department: 'Customer Success',
    location: 'London, UK',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '5-8 yrs',
    salary: '£75,000 - £95,000 / yr + Bonus',
    postedDate: '1 week ago',
    featured: false,
    skills: ['SaaS Retention', 'Executive QBRs', 'Churn Prevention', 'Gainsight', 'Team Leadership'],
    overview: 'Lead and mentor a high-performing team of Enterprise Customer Success Managers responsible for driving adoption, customer health, and net revenue retention (NRR) across EMEA clients.',
    responsibilities: [
      'Manage portfolio health across $25M+ in ARR, ensuring customer satisfaction (CSAT 95%+).',
      'Establish repeatable onboarding playbooks, executive business review frameworks, and expansion signals.',
      'Act as executive escalation point for strategic client accounts.',
      'Coach and mentor junior and mid-level CSMs to foster professional growth.'
    ],
    qualifications: [
      '5+ years in B2B SaaS Customer Success or Account Management with 2+ years in team leadership.',
      'Track record of maintaining gross retention above 90% and driving account expansion.',
      'Strong empathy, executive presence, and problem-solving diplomacy.'
    ],
    niceToHave: [
      'Experience with Gainsight, Salesforce, and Zendesk administration.',
      'Multilingual capabilities (English + German/French).'
    ],
    teamSize: '6 Enterprise CSMs',
    hiringManager: 'Claire Fontaine (VP of Customer Success)'
  },
  {
    id: 'anthropic-job-11',
    title: 'Senior Backend Engineer (Golang & Distributed Systems)',
    department: 'Engineering',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '5-8 yrs',
    salary: '₹30,00,000 - ₹45,00,000 / yr + Equity',
    postedDate: '2 days ago',
    featured: false,
    skills: ['Golang', 'PostgreSQL', 'Microservices', 'Kafka', 'Redis', 'Docker'],
    overview: 'Design and implement high-performance, concurrent backend microservices that orchestrate enterprise recruiting automation, candidate matching, and real-time messaging.',
    responsibilities: [
      'Build resilient microservices in Golang handling thousands of requests per second with sub-50ms p99 latency.',
      'Design clean relational and document schemas on PostgreSQL and Redis.',
      'Implement reliable async event streaming using Apache Kafka.',
      'Author comprehensive unit, integration, and load tests.'
    ],
    qualifications: [
      '5+ years of server-side software engineering experience, with strong proficiency in Go.',
      'Deep understanding of concurrency, memory management, and distributed systems design patterns.',
      'Solid experience with relational databases, SQL tuning, and database connection pooling.'
    ],
    niceToHave: [
      'Experience with gRPC and Protobuf service definitions.',
      'Knowledge of Elasticsearch / OpenSearch indexing and query tuning.'
    ],
    teamSize: '15 Backend Engineers',
    hiringManager: 'Rajesh Iyer (Staff Engineering Manager)'
  },
  {
    id: 'anthropic-job-12',
    title: 'Talent Acquisition Partner (Technical Sourcing)',
    department: 'HR',
    location: 'San Francisco, CA',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '3-6 yrs',
    salary: '$110,000 - $140,000 / yr + Bonus',
    postedDate: '5 days ago',
    featured: false,
    skills: ['Technical Recruiting', 'LinkedIn Recruiter', 'Candidate Pipeline', 'Boolean Search', 'Diversity Sourcing'],
    overview: 'Help scale our global engineering and AI research teams! You will partner directly with our CTO and VP of Engineering to source, engage, and hire elite technical talent.',
    responsibilities: [
      'Source, engage, and screen candidates for niche roles in ML research, systems architecture, and product leadership.',
      'Champion diversity, equity, and inclusion recruiting initiatives across all talent pipelines.',
      'Deliver an exceptional candidate experience with fast turnaround times and high touch communication.',
      'Leverage contemporary talent intelligence and recruiting platforms to evaluate sourcing channels and conversion rates.'
    ],
    qualifications: [
      '3+ years of full-cycle technical recruiting or senior sourcing experience in high-growth tech.',
      'Proficiency in LinkedIn Recruiter, Boolean search operators, and contemporary ATS workflows.',
      'Proven ability to build trust with technical leadership and candidates.'
    ],
    niceToHave: [
      'Prior experience sourcing AI / ML research scientists or distributed systems engineers.',
      'Familiarity with immigration and international sponsorship processes.'
    ],
    teamSize: '8 People & Talent Team Members',
    hiringManager: 'Sarah Jenkins (Director of Global Talent)'
  },
  {
    id: 'anthropic-job-13',
    title: 'Senior Cyber Security Analyst (SecOps & Threat Intel)',
    department: 'Engineering',
    location: 'Austin, TX',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '4-7 yrs',
    salary: '$145,000 - $180,000 / yr + Equity',
    postedDate: '1 week ago',
    featured: false,
    skills: ['SIEM / Splunk', 'Incident Response', 'Threat Hunting', 'Cloud Security', 'Vulnerability Management'],
    overview: 'Protect Anthropic data, models, and infrastructure from emerging cyber threats. You will lead proactive threat hunting, incident investigations, and automated vulnerability management.',
    responsibilities: [
      'Monitor and respond to security alerts across AWS cloud, endpoint detection (CrowdStrike), and SIEM.',
      'Conduct regular internal penetration testing, code security reviews (SAST/DAST), and dependency audits.',
      'Collaborate with external auditors for SOC2 Type II, ISO27001, and GDPR compliance certifications.',
      'Lead red team / blue team simulation drills to test organizational readiness.'
    ],
    qualifications: [
      '4+ years in security operations, threat analysis, or incident response.',
      'Hold recognized certifications such as CISSP, CEH, or AWS Certified Security Specialty.',
      'Hands-on experience with SIEM platforms, endpoint protection, and cloud security posture management (CSPM).'
    ],
    niceToHave: [
      'Experience in reverse engineering malware or security forensics.',
      'Familiarity with bug bounty program management (HackerOne/Bugcrowd).'
    ],
    teamSize: '6 Information Security Engineers',
    hiringManager: 'Tariq Al-Mansoor (Chief Information Security Officer)'
  },
  {
    id: 'anthropic-job-14',
    title: 'Technical Content & Developer Relations Lead',
    department: 'Marketing',
    location: 'Remote',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '4-8 yrs',
    salary: '$135,000 - $170,000 / yr + Equity',
    postedDate: '3 days ago',
    featured: false,
    skills: ['Developer Advocacy', 'Technical Writing', 'API Documentation', 'Conference Speaking', 'Open Source'],
    overview: 'We are seeking a technical storyteller and community builder to lead Developer Relations. You will write deep-dive engineering blogs, create open-source demo projects, and speak at major developer events.',
    responsibilities: [
      'Write authoritative technical articles, tutorials, and architectural breakdown guides for software engineers and ML practitioners.',
      'Build open-source starter kits, SDK documentation, and video walkthroughs showcasing the Anthropic Claude platform APIs.',
      'Represent Anthropic at conferences, hackathons, and virtual developer webinars.',
      'Gather developer feedback and advocate for user experience improvements directly with product managers.'
    ],
    qualifications: [
      '4+ years in developer advocacy, technical writing, or software engineering with a strong public portfolio.',
      'Ability to code functional applications in Python, JavaScript/TypeScript, or Go.',
      'Engaging writing style capable of breaking down complex distributed systems concepts clearly.'
    ],
    niceToHave: [
      'Existing following on GitHub, Substack, YouTube, or X / Twitter.',
      'Experience producing video tutorials or hosting developer podcasts.'
    ],
    teamSize: '5 Developer Relations & Community Managers',
    hiringManager: 'Jessica Alba-Ward (Chief Marketing Officer)'
  },
  {
    id: 'anthropic-job-15',
    title: 'Financial Planning & Strategy Manager',
    department: 'Finance',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '5-8 yrs',
    salary: '$150,000 - $190,000 / yr + Equity',
    postedDate: '1 week ago',
    featured: false,
    skills: ['Financial Modeling', 'SaaS Metrics (LTV/CAC)', 'Budget Planning', 'Board Presentations', 'Excel / SQL'],
    overview: 'Partner directly with our CFO and executive leadership to steer long-term financial strategy, headcount planning, fundraising narratives, and SaaS unit economic performance.',
    responsibilities: [
      'Build and maintain dynamic multi-year operating and cash flow forecast models.',
      'Analyze key SaaS metrics including Net Retention Rate, CAC payback, pipeline velocity, and gross margins.',
      'Prepare quarterly Board of Directors presentations, investor updates, and departmental budget reviews.',
      'Collaborate with department heads to evaluate hiring plans and ROI on cloud/vendor investments.'
    ],
    qualifications: [
      '5+ years of experience in corporate FP&A, investment banking, or management consulting, ideally with high-growth SaaS exposure.',
      'Advanced financial modeling skills in Excel and Google Sheets.',
      'Ability to translate raw financial data into actionable strategic insights for executive stakeholders.'
    ],
    niceToHave: [
      'Proficiency in SQL, NetSuite, and modern planning platforms (Adaptive, Pigment, Anaplan).',
      'CPA or CFA credentials.'
    ],
    teamSize: '5 Finance & Accounting Professionals',
    hiringManager: 'Nathaniel Sterling (Chief Financial Officer)'
  },
  {
    id: 'anthropic-job-16',
    title: 'iOS & Mobile Experience Engineer',
    department: 'Engineering',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '4-7 yrs',
    salary: '₹26,00,000 - ₹38,00,000 / yr + Equity',
    postedDate: '4 days ago',
    featured: false,
    skills: ['Swift', 'SwiftUI', 'Combine', 'iOS Architecture', 'REST APIs', 'Unit Testing'],
    overview: 'Build our companion mobile app for hiring managers and recruiters, empowering executives to review candidate evaluations, listen to interview summaries, and approve offers on the go.',
    responsibilities: [
      'Develop native iOS application features using Swift and SwiftUI with modern unidirectional architecture.',
      'Implement real-time push notifications, offline data synchronization, and biometric authentication.',
      'Ensure 60fps animations, smooth scrolling, and strict battery / memory performance.',
      'Collaborate with backend engineers to define mobile-optimized GraphQL / REST endpoints.'
    ],
    qualifications: [
      '4+ years building high-quality native iOS applications published on the Apple App Store.',
      'Proficiency in Swift, SwiftUI, Combine, and Apple HIG design principles.',
      'Experience with automated iOS deployment pipelines (Fastlane, GitHub Actions, TestFlight).'
    ],
    niceToHave: [
      'Experience with cross-platform frameworks (React Native or Flutter).',
      'Knowledge of audio streaming and on-device machine learning (CoreML).'
    ],
    teamSize: '8 Mobile Engineers (iOS & Android)',
    hiringManager: 'Marcus Vance (Director of Frontend Engineering)'
  },
  {
    id: 'anthropic-job-17',
    title: 'Full Stack Software Engineering Intern (Summer 2027)',
    department: 'Engineering',
    location: 'San Francisco, CA',
    workMode: 'On-site',
    employmentType: 'Internship',
    experience: 'Internship / Student',
    salary: '$50 - $60 / hour ($8,500/mo stipend)',
    postedDate: '2 days ago',
    featured: false,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Git', 'Data Structures'],
    overview: 'Spend an impactful 12-week summer internship shipping production features directly into Anthropic products. You will be paired with a dedicated senior mentor and work on real user-facing AI and web features.',
    responsibilities: [
      'Design, build, and deploy full stack web features in React, TypeScript, and Node.js.',
      'Participate in agile sprint ceremonies, code reviews, and architectural brainstorming.',
      'Present your end-of-summer capstone project to company leadership.'
    ],
    qualifications: [
      'Currently pursuing a BS, MS, or equivalent in Computer Science or related STEM field with graduating year 2027 or 2028.',
      'Proficiency in at least one modern programming language (TypeScript, Python, Java, or C++).',
      'Solid grasp of data structures, algorithms, and web fundamentals.'
    ],
    niceToHave: [
      'Personal coding projects, hackathon wins, or open source contributions on GitHub.',
      'Familiarity with relational databases and RESTful APIs.'
    ],
    teamSize: 'Mentored within Core Engineering',
    hiringManager: 'Elena Rostova (Head of Platform Engineering)'
  },
  {
    id: 'anthropic-job-18',
    title: 'Solutions Consultant (Technical Pre-Sales)',
    department: 'Sales',
    location: 'London, UK',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '4-7 yrs',
    salary: '£75,000 - £95,000 Base / £125,000 OTE',
    postedDate: '1 week ago',
    featured: false,
    skills: ['Pre-Sales Engineering', 'System Demos', 'API Integrations', 'RFP Responses', 'Client Workshops'],
    overview: 'Partner with Enterprise Account Executives as the technical authority during enterprise sales evaluations. You will lead architectural deep-dives, deliver custom POC demos, and map enterprise HRIS workflows.',
    responsibilities: [
      'Deliver persuasive technical product demonstrations to Chief People Officers and IT Directors.',
      'Scope and configure custom Proof-of-Concepts (POCs) demonstrating AI evaluation accuracy and security posture.',
      'Lead technical discovery, security questionnaires, and compliance reviews.',
      'Provide voice-of-the-customer technical feedback to product and engineering teams.'
    ],
    qualifications: [
      '4+ years in pre-sales engineering, solutions architecture, or technical consulting for SaaS products.',
      'Comfortable discussing web security, API webhooks, SSO (SAML/Okta), and data encryption standards.',
      'Strong presentation skills and ability to articulate complex technology simply.'
    ],
    niceToHave: [
      'Hands-on experience integrating with enterprise ATS/HRIS (Workday, Greenhouse, SAP SuccessFactors).',
      'Basic scripting ability (Python or JavaScript) for custom API mockups.'
    ],
    teamSize: '7 Global Solutions Consultants',
    hiringManager: 'Bradley Cooper (VP of Global Enterprise Sales)'
  }
];

export const DEPARTMENTS = [
  'All',
  'Engineering',
  'Product',
  'Design',
  'Data Science',
  'Marketing',
  'Sales',
  'Customer Success',
  'HR',
  'Finance'
];

export const LOCATIONS = [
  'All',
  'San Francisco, CA',
  'Bangalore, India',
  'New York, NY',
  'London, UK',
  'Berlin, Germany',
  'Austin, TX',
  'Remote'
];

export const EMPLOYMENT_TYPES = [
  'All',
  'Full-time',
  'Contract',
  'Internship',
  'Part-time'
];

export const WORK_MODES = [
  'All',
  'Remote',
  'Hybrid',
  'On-site'
];
