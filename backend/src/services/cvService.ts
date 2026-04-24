import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is missing");
  }
  return new Groq({ apiKey });
}

export async function generateCvWithAi(cvData: {
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
}): Promise<string> {
  const prompt = `
Gere um currículo profissional em português brasileiro, formatado em Markdown, com base nas seguintes informações:

**DADOS PESSOAIS**
- Nome: ${cvData.fullName}
- Email: ${cvData.email}
- Telefone: ${cvData.phone}
- Localização: ${cvData.location}
- LinkedIn: ${cvData.linkedin}
- Portfolio: ${cvData.portfolio}

**RESUMO PROFISSIONAL**
${cvData.summary}

**EXPERIÊNCIA PROFISSIONAL**
${cvData.experience
  .filter((e) => e.company || e.role)
  .map(
    (e) => `
**${e.role}**${e.company ? ` - ${e.company}` : ""}
${e.startDate ? `${e.startDate} - ${e.current ? "Atual" : e.endDate}` : ""}
${e.description}
`
  )
  .join("\n")}

**FORMAÇÃO ACADÊMICA**
${cvData.education
  .filter((e) => e.institution)
  .map((e) => `**${e.degree}** em ${e.field} - ${e.institution} (${e.year})`)
  .join("\n")}

**HABILIDADES**
${cvData.skills.join(", ")}

**IDIOMAS**
${cvData.languages.join(", ")}

**CERTIFICAÇÕES**
${cvData.certifications.join("\n") || "Nenhuma certificação informada"}

O currículo deve ser:
1. Profissional e objetivo
2. Em formato limpo e legível
3. Com frases de impacto usando verbos de ação
4. Focado em conquistas e resultados
5. Otimizado para ATS (Applicant Tracking Systems)
`;

  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em criação de currículos profissionais. Gere currículos em português brasileiro, formato markdown, profissionais e otimizados para ATS.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content || "";
}