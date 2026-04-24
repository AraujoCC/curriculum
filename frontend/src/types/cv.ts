export interface CvData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  
  summary: string;
  
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  
  skills: string[];
  
  languages: string[];
  
  certifications: string[];
}

export interface GeneratedCv {
  id: number;
  user_id: number;
  cv_data: string;
  generated_text: string;
  created_at: string;
}