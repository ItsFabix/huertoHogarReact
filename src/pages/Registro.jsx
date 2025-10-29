// src/pages/Registro.jsx
import { useState, useEffect } from "react";
import { EMAIL_ALLOWED, required, betweenLen, maxLen, validarRut } from "../utils/validators";
import { addUser, findUserByEmail } from "../utils/auth";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "", apellidos: "", correo: "", pass: "", pass2: "", rut: ""
  });
  const [err, setErr] = useState({});
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validar = () => {
    const e = {};
    if (!required(form.nombre) || !maxLen(form.nombre, 50)) e.nombre = "Nombre requerido (máx 50).";
    if (!required(form.apellidos) || !maxLen(form.apellidos, 100)) e.apellidos = "Apellidos requeridos (máx 100).";
    if (!required(form.correo) || !EMAIL_ALLOWED.test(form.correo) || !maxLen(form.correo, 100)) e.correo = "Correo inválido (duoc.cl, profesor.duoc.cl, gmail.com).";
    if (!required(form.pass) || !betweenLen(form.pass, 4, 10)) e.pass = "Contraseña de 4 a 10 caracteres.";
    if (form.pass !== form.pass2) e.pass2 = "Las contraseñas no coinciden.";
    if (form.rut && !validarRut(form.rut)) e.rut = "RUT inválido (formato ej. 12.345.678-5).";
    if (findUserByEmail(form.correo)) e.correo = "Este correo ya está registrado.";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setOkMsg("");
    if (!validar()) return;

    addUser({
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      pass: form.pass,
      rut: form.rut.trim()
    });
    setOkMsg("Registro exitoso. Ahora puedes iniciar sesión.");
    setForm({ nombre:"", apellidos:"", correo:"", pass:"", pass2:"", rut:"" });
    setErr({});
  };

  return (
    <section className="container">
      <h1>Registro</h1>
      {okMsg && <div className="alert success">{okMsg}</div>}

      <form className="panel form" onSubmit={onSubmit} noValidate>
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={onChange} />
          <small className="error">{err.nombre || ""}</small>
        </label>
        <label>
          Apellidos
          <input name="apellidos" value={form.apellidos} onChange={onChange} />
          <small className="error">{err.apellidos || ""}</small>
        </label>
        <label>
          Correo (duoc.cl / profesor.duoc.cl / gmail.com)
          <input name="correo" type="email" value={form.correo} onChange={onChange} />
          <small className="error">{err.correo || ""}</small>
        </label>
        <label>
          RUT (opcional)
          <input name="rut" placeholder="12.345.678-5" value={form.rut} onChange={onChange} />
          <small className="error">{err.rut || ""}</small>
        </label>
        <div className="grid2">
          <label>
            Contraseña
            <input name="pass" type="password" value={form.pass} onChange={onChange} />
            <small className="error">{err.pass || ""}</small>
          </label>
          <label>
            Repetir contraseña
            <input name="pass2" type="password" value={form.pass2} onChange={onChange} />
            <small className="error">{err.pass2 || ""}</small>
          </label>
        </div>
        <div className="actions">
          <button className="btn" type="submit">Crear cuenta</button>
        </div>
      </form>
    </section>
  );
}
