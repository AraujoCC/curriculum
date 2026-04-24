import { authApi } from "./auth";
import type { CvData } from "../types/cv";

export interface GeneratedCv {
  id: number;
  user_id: number;
  cv_data: string;
  generated_text: string;
  created_at: string;
}

export async function createCv(data: CvData): Promise<{ id: number }> {
  const { data: response } = await authApi.post<{ id: number }>("/cv", data);
  return response;
}

export async function getCvs(): Promise<GeneratedCv[]> {
  const { data } = await authApi.get<GeneratedCv[]>("/cv");
  return data;
}

export async function getCv(id: number): Promise<GeneratedCv> {
  const { data } = await authApi.get<GeneratedCv>(`/cv/${id}`);
  return data;
}