import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface UserData {
  userId: number;
  email: string;
  name: string;
  credits: number;
}

export interface Analysis {
  id: number;
  user_id: number;
  resume_text: string | null;
  job_description: string | null;
  ats_score: number;
  matched_keywords: string;
  missing_keywords: string;
  suggestions: string;
  created_at: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await authApi.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

export async function register(email: string, password: string, name: string): Promise<LoginResponse> {
  const { data } = await authApi.post<LoginResponse>("/auth/register", { email, password, name });
  return data;
}

export async function getMe(): Promise<UserData> {
  const { data } = await authApi.get<UserData>("/auth/me");
  return data;
}

export async function getAnalyses(): Promise<Analysis[]> {
  const { data } = await authApi.get<Analysis[]>("/auth/analyses");
  return data;
}

export async function createAnalysis(
  resumeText: string,
  jobDescription: string,
  atsScore: number,
  matchedKeywords: string[],
  missingKeywords: string[],
  suggestions: string[]
): Promise<{ id: number }> {
  const { data } = await authApi.post<{ id: number }>("/auth/analyses", {
    resumeText,
    jobDescription,
    atsScore,
    matchedKeywords,
    missingKeywords,
    suggestions,
  });
  return data;
}

export async function analyzeResume(
  file: File,
  jobDescription: string
): Promise<{
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobDescription", jobDescription);

  const { data } = await authApi.post<{
    atsScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  }>("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

export default authApi;