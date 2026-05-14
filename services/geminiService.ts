
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ApiResponse, 
  CVData, 
  Language, 
  CandidateProfile, 
  VerificationResult, 
  InterviewAnalysis, 
  JobMatchResult,
  InterviewQuestion,
  InterviewReport,
  RewriteAlternatives
} from "../types";

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY || 'DUMMY_KEY' });

const CV_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personal_info: {
      type: Type.OBJECT,
      properties: {
        full_name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        target_job: { type: Type.STRING },
      },
      required: ["full_name", "email", "phone", "location", "target_job"]
    },
    summary: { type: Type.STRING },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          duration: { type: Type.STRING },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["company", "position", "duration", "achievements"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING }
        },
        required: ["institution", "degree", "year"]
      }
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    ats_score: { type: Type.NUMBER }
  },
  required: ["personal_info", "summary", "experience", "education", "skills", "ats_score"]
};

export const suggestFieldContent = async (fieldName: string, currentData: CVData, lang: Language): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Professional resume writer for Sira-AI Platform by Faisal Al-Sunni. Field: ${fieldName}. Target: ${currentData?.personal_info?.target_job || 'General'}. Lang: ${lang}. Impactful, metrics-driven sentences for 2026 market standards.`,
  });
  return response.text.trim();
};

export const rewriteContent = async (text: string, context: string, lang: Language): Promise<RewriteAlternatives> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As the Sira-AI sovereign engine by Faisal Al-Sunni, rewrite the following professional content in exactly 3 different, highly professional, and impactful ways. Content type: ${context}. Lang: ${lang}. Content: "${text}". Use power verbs and metric-oriented language.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Exactly 3 highly professional alternatives"
          }
        },
        required: ["alternatives"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const translateCV = async (cv: CVData, targetLang: Language): Promise<CVData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Perform a professional recruitment-grade neural translation of this CV to ${targetLang}. Mirror all fields exactly. Preserve all metric-driven achievements and technical terms. Ensure cultural professional relevance for ${targetLang}. Data: ${JSON.stringify(cv)}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: CV_SCHEMA
    }
  });
  return JSON.parse(response.text);
};

export const generateMockCandidates = async (filters: any): Promise<CandidateProfile[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 diverse professional candidate profiles matching these filters: ${JSON.stringify(filters)}. Each candidate MUST have 'id', 'personal_info', 'top_achievements', 'ai_fit_score', 'expected_salary', and 'personality_eval'.`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                personal_info: {
                  type: Type.OBJECT,
                  properties: {
                    full_name: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    location: { type: Type.STRING },
                    target_job: { type: Type.STRING },
                  },
                  required: ["full_name", "email", "phone", "location", "target_job"]
                },
                top_achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
                ai_fit_score: { type: Type.NUMBER },
                expected_salary: { type: Type.STRING },
                languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                personality_eval: { type: Type.STRING }
              },
              required: ["id", "personal_info", "ai_fit_score", "top_achievements", "expected_salary", "personality_eval"]
            }
          }
        },
        required: ["candidates"]
      }
    }
  });
  const data = JSON.parse(response.text);
  return data.candidates || [];
};

export const processCVInput = async (input: string, targetJob: string, lang: Language): Promise<ApiResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Sovereignty Engine Sira-AI by Faisal Al-Sunni. Transform user input into a world-class, metrics-driven professional career package for 2026.
    Include: CV, Career Roadmap, Application Helpers, Regional Insights, 5-Year Growth Timeline, Portfolio Structure, Social Brand posts, and Salary Negotiation data.
    Input: ${input}, Target: ${targetJob}, Lang: ${lang}`,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cv: CV_SCHEMA,
          career_path: {
            type: Type.OBJECT,
            properties: {
              suggested_jobs: { type: Type.ARRAY, items: { type: Type.STRING } },
              skill_gap: {
                type: Type.OBJECT,
                properties: {
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  potential_salary_increase: { type: Type.STRING }
                }
              },
              elevator_pitch: { type: Type.STRING }
            }
          },
          smart_helper: {
            type: Type.OBJECT,
            properties: {
              emails: {
                type: Type.OBJECT,
                properties: {
                  formal: { type: Type.STRING },
                  follow_up: { type: Type.STRING },
                  direct: { type: Type.STRING }
                }
              },
              linkedin_message: { type: Type.STRING },
              reference_request_sample: { type: Type.STRING }
            }
          },
          market_insights: {
            type: Type.OBJECT,
            properties: {
              city: { type: Type.STRING },
              trending_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              region_analysis: { type: Type.STRING }
            }
          },
          timeline: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    year: { type: Type.STRING },
                    title: { type: Type.STRING },
                    salary: { type: Type.STRING },
                    focus_skill: { type: Type.STRING }
                  }
                }
              }
            }
          },
          portfolio: {
            type: Type.OBJECT,
            properties: {
              structure: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section_name: { type: Type.STRING },
                    key_projects_count: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                    recommended_tech: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            }
          },
          social_brand: {
            type: Type.OBJECT,
            properties: {
              linkedin_post: { type: Type.STRING },
              x_post: { type: Type.STRING }
            }
          },
          salary_negotiation: {
            type: Type.OBJECT,
            properties: {
              range: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.STRING },
                  max: { type: Type.STRING }
                }
              },
              script: { type: Type.STRING }
            }
          }
        },
        required: ["cv", "career_path", "smart_helper", "market_insights", "timeline", "portfolio", "social_brand", "salary_negotiation"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateCoverLetter = async (cv: CVData, lang: Language): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a high-impact cover letter for ${cv?.personal_info?.full_name || 'Candidate'} targeting ${cv?.personal_info?.target_job || 'this role'}. Lang: ${lang}. Data: ${JSON.stringify(cv)}`,
  });
  return response.text.trim();
};

export const magicExtractCV = async (base64File: string, lang: Language): Promise<CVData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: base64File.split(';')[0].split(':')[1], data: base64File.split(',')[1] } },
        { text: `Extract resume data into JSON following the CV_SCHEMA. Lang: ${lang}` }
      ]
    },
    config: { 
      responseMimeType: "application/json",
      responseSchema: CV_SCHEMA
    }
  });
  return JSON.parse(response.text);
};

export const analyzeJobMatch = async (cv: CVData, jobDescription: string): Promise<JobMatchResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare this CV to the Job Description: ${jobDescription}. Calculate match score and missing keywords.`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
};

export const verifyCertificate = async (base64Data: string, cvData: CVData): Promise<VerificationResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: base64Data.split(';')[0].split(':')[1],
            data: base64Data.split(',')[1],
          },
        },
        { text: `Verify this certificate for ${cvData?.personal_info?.full_name || 'Candidate'}.` }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
};

// Fix for missing analyzeSelfIntro in VirtualCoach.tsx
export const analyzeSelfIntro = async (text: string, targetJob: string): Promise<InterviewAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As an expert interview coach for Sira-AI by Faisal Al-Sunni, analyze this self-introduction for the role: ${targetJob}.
    Evaluate confidence, keyword relevance, and emotional intelligence (EQ).
    Self-introduction text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          confidence_score: { type: Type.NUMBER },
          keywords_score: { type: Type.NUMBER },
          eq_score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          suggested_phrases: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["confidence_score", "keywords_score", "eq_score", "feedback", "suggested_phrases"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeInterviewAnswers = async (questions: InterviewQuestion[], answers: string[]): Promise<InterviewReport> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate these interview responses. Questions: ${JSON.stringify(questions)}, Answers: ${JSON.stringify(answers)}.`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
};
