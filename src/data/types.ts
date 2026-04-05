export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface Technology {
  name: string;
  level: 'Expert' | 'Proficient' | 'Familiar';
}

export interface TechnologyCategory {
  name: string;
  icon?: string;
  techs: Technology[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  description: string;
  achievements: string[];
  tech: string[];
}

export interface Project {
  title: string;
  role: string;
  summary: string;
  tech: string[];
  impact?: string;
  featured?: boolean;
  repoUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface Talk {
  title: string;
  event: string;
  year: string;
  description: string;
  topics: string[];
}

export interface ContactMethod {
  name: string;
  value: string;
  href: string;
  icon: string;
}

export interface SiteMetadata {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  locale: string;
}

export interface Highlight {
  label: string;
  numericValue: number;
  suffix?: string;
  displayValue: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: 'completed' | 'in-progress' | 'incomplete';
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface CVMetadata {
  title: string;
  summary: string;
  lastUpdated: string;
}
