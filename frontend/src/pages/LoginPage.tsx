import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";
import { toast } from "../components/Toast";
import "./LoginPage.css";

interface Props {
  onAuth: (token: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

export default function LoginPage({ onAuth }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate(): boolean {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = "Obrigatório";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Obrigatório";
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`;
    }

    if (tab === "signup" && !name.trim()) {
      newErrors.name = "Obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleContinue() {
    setTouched({ email: true, password: true, name: true });
    if (!validate()) return;

    setLoading(true);
    try {
      if (tab === "login") {
        const response = await login(email, password);
        onAuth(response.token);
        navigate("/dashboard");
      } else {
        const response = await register(email, password, name);
        onAuth(response.token);
        navigate("/dashboard");
      }
    } catch {
      toast("Erro ao conectar com servidor", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleContinue();
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">
          <span>C</span>
        </div>
        <h1 className="login-title">
          Ferramenta ATS<br />
          <span className="login-title-accent">para currículos</span>
        </h1>
        <p className="login-subtitle-text">
          Analise a compatibilidade do seu currículo com vagas de emprego.
        </p>
      </div>

      <div className="login-right">
        <div className="login-form">
          <div className="tab-container">
            <button
              className={`tab-btn ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-btn ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Cadastro
            </button>
          </div>

          <div className="form-fields">
            {tab === "signup" && (
              <div>
                <input
                  className={`input-field ${touched.name && errors.name ? "error" : ""}`}
                  type="text"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                />
                {touched.name && errors.name && (
                  <p className="field-error">{errors.name}</p>
                )}
              </div>
            )}
            <div>
              <input
                className={`input-field ${touched.email && errors.email ? "error" : ""}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                onKeyDown={handleKeyDown}
              />
              {touched.email && errors.email && (
                <p className="field-error">{errors.email}</p>
              )}
            </div>
            <div className="password-wrapper">
              <input
                className={`input-field ${touched.password && errors.password ? "error" : ""}`}
                type={showPass ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                onKeyDown={handleKeyDown}
                style={{ paddingRight: 56 }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                type="button"
                className="password-toggle"
              >
                {showPass ? "ocultar" : "ver"}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
            <button
              className="btn-primary"
              type="button"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}