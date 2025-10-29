// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { EMAIL_ALLOWED, required, betweenLen } from "../utils/validators";
import { findUserByEmail, setSession } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ correo: "", pass: "" });
  const [err, setErr] = useState({});
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validar = () => {
    const e = {};
    if (!required(form.correo) || !EMAIL_ALLOWED.test(form.correo)) e.correo = "Correo inválido o no permitido.";
    if (!required(form.pass) || !betweenLen(form.pass, 4, 10)) e.pass = "Contraseña 4 a 10 caracteres.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    if (!validar()) return;

    const u = findUserByEmail(form.correo);
    if (!u || u.pass !== form.pass) {
      setMsg("Credenciales incorrectas.");
      return;
    }
    setSession({ correo: u.correo, nombre: u.nombre });
    nav("/"); // redirige al home (o /admin si tienes panel)
  };

  return (
    <section className="container">
      <h1>Iniciar sesión</h1>
      {msg && <div className="alert">{msg}</div>}

      <form className="panel form" onSubmit={onSubmit} noValidate>
        <label>
          Correo
          <input name="correo" type="email" value={form.correo} onChange={onChange} />
          <small className="error">{err.correo || ""}</small>
        </label>
        <label>
          Contraseña
          <input name="pass" type="password" value={form.pass} onChange={onChange} />
          <small className="error">{err.pass || ""}</small>
        </label>
        <div className="actions">
          <button className="btn" type="submit">Entrar</button>
          <Link className="btn-outline" to="/registro">Crear cuenta</Link>
        </div>
      </form>
    </section>
  );
}
