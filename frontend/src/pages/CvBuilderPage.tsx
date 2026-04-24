import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CvData } from "../types/cv";
import { createCv } from "../api/cv";
import { toast } from "../components/Toast";
import "./CvBuilderPage.css";

interface Props {
  onLogout: () => void;
}

const emptyExperience = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

const emptyEducation = {
  institution: "",
  degree: "",
  field: "",
  year: "",
};

export default function CvBuilderPage({ onLogout }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CvData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    experience: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: [],
    languages: [],
    certifications: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [certInput, setCertInput] = useState("");

  function updateForm<K extends keyof CvData>(field: K, value: CvData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateExperience(index: number, field: string, value: string | boolean) {
    const updated = [...form.experience];
    (updated[index] as Record<string, string | boolean>)[field] = value;
    updateForm("experience", updated);
  }

  function addExperience() {
    updateForm("experience", [...form.experience, { ...emptyExperience }]);
  }

  function removeExperience(index: number) {
    if (form.experience.length > 1) {
      updateForm(
        "experience",
        form.experience.filter((_, i) => i !== index)
      );
    }
  }

  function updateEducation(index: number, field: string, value: string) {
    const updated = [...form.education];
    (updated[index] as Record<string, string>)[field] = value;
    updateForm("education", updated);
  }

  function addEducation() {
    updateForm("education", [...form.education, { ...emptyEducation }]);
  }

  function removeEducation(index: number) {
    if (form.education.length > 1) {
      updateForm(
        "education",
        form.education.filter((_, i) => i !== index)
      );
    }
  }

  function addSkill() {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      updateForm("skills", [...form.skills, skillInput.trim()]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    updateForm("skills", form.skills.filter((s) => s !== skill));
  }

  function addLanguage() {
    if (langInput.trim() && !form.languages.includes(langInput.trim())) {
      updateForm("languages", [...form.languages, langInput.trim()]);
      setLangInput("");
    }
  }

  function removeLanguage(lang: string) {
    updateForm("languages", form.languages.filter((l) => l !== lang));
  }

  function addCertification() {
    if (certInput.trim() && !form.certifications.includes(certInput.trim())) {
      updateForm("certifications", [...form.certifications, certInput.trim()]);
      setCertInput("");
    }
  }

  function removeCertification(cert: string) {
    updateForm("certifications", form.certifications.filter((c) => c !== cert));
  }

  async function handleSubmit() {
    if (!form.fullName || !form.email) {
      toast("Nome e email são obrigatórios", "error");
      return;
    }

    setLoading(true);
    try {
      await createCv(form);
      toast("Currículo gerado com sucesso!", "success");
      navigate("/dashboard");
    } catch (error) {
      toast("Erro ao gerar currículo", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cv-builder-page">
      <nav className="cv-nav">
        <button className="nav-back" onClick={() => navigate("/dashboard")}>
          &lt; Voltar
        </button>
        <h1 className="nav-title">Criar Currículo</h1>
        <button className="nav-logout" onClick={onLogout}>
          Sair
        </button>
      </nav>

      <div className="cv-steps">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`step-indicator ${step >= s ? "active" : ""} ${step === s ? "current" : ""}`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="cv-form">
        {step === 1 && (
          <div className="form-section">
            <h2>Informações Pessoais</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateForm("fullName", e.target.value)}
                  placeholder="João Silva"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="joao@email.com"
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="form-group">
                <label>Localização</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  placeholder="São Paulo, SP"
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={(e) => updateForm("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/joaosilva"
                />
              </div>
              <div className="form-group">
                <label>Portfolio</label>
                <input
                  type="url"
                  value={form.portfolio}
                  onChange={(e) => updateForm("portfolio", e.target.value)}
                  placeholder="https://meusite.com"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Resumo Profissional</label>
              <textarea
                value={form.summary}
                onChange={(e) => updateForm("summary", e.target.value)}
                placeholder="Descreva sua trajetória profissional em 2-3 frases..."
                rows={4}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2>Experiência Profissional</h2>
            {form.experience.map((exp, idx) => (
              <div key={idx} className="experience-block">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Empresa</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(idx, "company", e.target.value)
                      }
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cargo</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, "role", e.target.value)}
                      placeholder="Seu cargo"
                    />
                  </div>
                  <div className="form-group">
                    <label>Data Início</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(idx, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Data Fim</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(idx, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) =>
                          updateExperience(idx, "current", e.target.checked)
                        }
                      />
                      Atual
                    </label>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Descrição</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(idx, "description", e.target.value)
                    }
                    placeholder="Suas principais responsabilidades e conquistas..."
                    rows={3}
                  />
                </div>
                {form.experience.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExperience(idx)}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addExperience}>
              + Adicionar Experiência
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h2>Formação Acadêmica</h2>
            {form.education.map((edu, idx) => (
              <div key={idx} className="education-block">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Instituição</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(idx, "institution", e.target.value)
                      }
                      placeholder="Universidade/Faculdade"
                    />
                  </div>
                  <div className="form-group">
                    <label>Grau</label>
                    <select
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(idx, "degree", e.target.value)
                      }
                    >
                      <option value="">Selecione...</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Graduação">Graduação</option>
                      <option value="Pós-graduação">Pós-graduação</option>
                      <option value="Mestrado">Mestrado</option>
                      <option value="Doutorado">Doutorado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Curso</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(idx, "field", e.target.value)}
                      placeholder="Curso/Área"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ano de Conclusão</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, "year", e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                </div>
                {form.education.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeEducation(idx)}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addEducation}>
              + Adicionar Formação
            </button>

            <h2 style={{ marginTop: "32px" }}>Habilidades</h2>
            <div className="tag-input">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Digite e pressione Enter"
              />
              <button type="button" onClick={addSkill}>
                Adicionar
              </button>
            </div>
            <div className="tags-list">
              {form.skills.map((skill) => (
                <span key={skill} className="tag" onClick={() => removeSkill(skill)}>
                  {skill} ×
                </span>
              ))}
            </div>

            <h2 style={{ marginTop: "24px" }}>Idiomas</h2>
            <div className="tag-input">
              <input
                type="text"
                value={langInput}
                onChange={(e) => setLangInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                placeholder="Ex: Inglês (Avançado)"
              />
              <button type="button" onClick={addLanguage}>
                Adicionar
              </button>
            </div>
            <div className="tags-list">
              {form.languages.map((lang) => (
                <span key={lang} className="tag" onClick={() => removeLanguage(lang)}>
                  {lang} ×
                </span>
              ))}
            </div>

            <h2 style={{ marginTop: "24px" }}>Certificações</h2>
            <div className="tag-input">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCertification()}
                placeholder="Nome da certificação"
              />
              <button type="button" onClick={addCertification}>
                Adicionar
              </button>
            </div>
            <div className="tags-list">
              {form.certifications.map((cert) => (
                <span
                  key={cert}
                  className="tag"
                  onClick={() => removeCertification(cert)}
                >
                  {cert} ×
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-section">
            <h2>Revisão</h2>
            <div className="review-block">
              <h3>Dados Pessoais</h3>
              <p><strong>Nome:</strong> {form.fullName}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Telefone:</strong> {form.phone || "Não informado"}</p>
              <p><strong>Local:</strong> {form.location || "Não informado"}</p>
            </div>

            <div className="review-block">
              <h3>Resumo</h3>
              <p>{form.summary || "Não informado"}</p>
            </div>

            <div className="review-block">
              <h3>Experiência ({form.experience.length})</h3>
              {form.experience.map((exp, idx) => (
                <p key={idx}>
                  • {exp.role} {exp.company && `em ${exp.company}`}
                </p>
              ))}
            </div>

            <div className="review-block">
              <h3>Formação ({form.education.length})</h3>
              {form.education.map((edu, idx) => (
                <p key={idx}>
                  • {edu.degree} em {edu.field} - {edu.institution}
                </p>
              ))}
            </div>

            {form.skills.length > 0 && (
              <div className="review-block">
                <h3>Habilidades</h3>
                <p>{form.skills.join(", ")}</p>
              </div>
            )}

            <p className="review-note">
              Nosso AI irá gerar um currículo profissional baseado nestas informações.
            </p>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep(step - 1)}
            >
              Anterior
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep(step + 1)}
            >
              Próximo
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Gerando..." : "Gerar Currículo"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}