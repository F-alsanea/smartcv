
export enum UserRole {
  SEEKER = 'SEEKER',
  EMPLOYER = 'EMPLOYER'
}

export enum TemplateType {
  CLASSICAL = 'CLASSICAL',
  MODERN = 'MODERN',
  TECH = 'TECH',
  EXECUTIVE = 'EXECUTIVE',
  NEOM = 'NEOM'
}

export enum Language {
  AR = 'AR',
  EN = 'EN'
}

export enum ThemeMode {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export enum WizardStep {
  HUB = 'HUB',
  CHAT = 'CHAT',
  PERSONAL = 'PERSONAL',
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PREVIEW = 'PREVIEW',
  ARCHIVE = 'ARCHIVE'
}

export interface ArchiveItem {
  id: string;
  date: string;
  cv: CVData;
  otp: string;
  job: string;
}

export interface ThemeConfig {
  primaryColor: string;
  sectionOrder: string[];
  fontSize: 'sm' | 'base' | 'lg';
  showQR?: boolean;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface CVData {
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    target_job: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  ats_score: number;
  quality_alert?: string;
  is_verified?: boolean;
  is_ghost_mode?: boolean;
  cover_letter?: string;
  linkedin_bio?: string;
}

export interface RewriteAlternatives {
  alternatives: string[];
}

export interface CandidateProfile extends CVData {
  id: string;
  top_achievements: string[];
  ai_fit_score: number;
  expected_salary: string;
  languages: string[];
  personality_eval?: string;
  geo_proximity?: string;
}

export interface CareerPathData {
  suggested_jobs: string[];
  skill_gap: {
    skills: string[];
    potential_salary_increase: string;
  };
  elevator_pitch: string;
}

export interface SmartHelperData {
  emails: {
    formal: string;
    follow_up: string;
    direct: string;
  };
  linkedin_message: string;
  reference_request_sample: string;
}

export interface MarketInsights {
  city: string;
  trending_skills: string[];
  region_analysis: string;
}

export interface InvoiceData {
  id: string;
  date: string;
  amount: string;
  userName: string;
  service: string;
  status: 'PAID' | 'PENDING';
}

export interface ApiResponse {
  cv: CVData;
  career_path: CareerPathData;
  smart_helper: SmartHelperData;
  market_insights: MarketInsights;
}

export interface JobMatchResult {
  match_score: number;
  missing_keywords: string[];
  recommendations: string;
}

export interface InterviewAnalysis {
  confidence_score: number;
  keywords_score: number;
  eq_score: number;
  feedback: string;
  suggested_phrases: string[];
}

export interface VerificationResult {
  is_verified: boolean;
  message: string;
  details?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
}

export interface InterviewReport {
  honesty: number;
  technical_depth: number;
  tact: number;
  summary: string;
}

export interface SocialBrand {
  linkedin_post: string;
  x_post: string;
}

export interface SalaryNegotiation {
  range: {
    min: string;
    max: string;
  };
  script: string;
}

export interface CareerTimelineStep {
  year: string;
  salary: string;
  title: string;
  focus_skill: string;
}

export interface CareerTimeline {
  steps: CareerTimelineStep[];
}

export interface PortfolioSection {
  section_name: string;
  key_projects_count: number;
  description: string;
  recommended_tech: string[];
}

export interface PortfolioLayout {
  structure: PortfolioSection[];
}

export interface SearchFilters {
  city: string;
  experience_years: string;
  skills: string;
  language: string;
  expected_salary: string;
}

export interface ScorecardData {
  recommendation: 'HIRE' | 'FUTURE' | 'REJECT';
  ats_score: number;
  interview_score: number;
  reliability_score: number;
  summary_text: string;
}

export interface TitleComparison {
  old: string;
  new: string;
}

export interface EnhancementReport {
  old_score: number;
  new_score: number;
  modernized_titles: TitleComparison[];
  detected_gaps: string[];
}

export interface SuggestedAchievement {
  position_idx: number;
  achievements: string[];
}
