/* eslint-disable no-alert */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart, setCart, inc, dec, removeFromCart, clearCart, itemsCount
} from "../utils/cart";
import { addOrder, buildOrderFromCart } from "../data/orders";

// Acepta 12345678-9 o 12.345.678-9
const RUT_RE = /^(\d{1,2}\.?\d{3}\.?\d{3})-[0-9kK]$/;
const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Carrito() {
  const [cart, setState] = useState(getCart());
  const [totales, setTotales] = useState({ sub: 0, iva: 0, total: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: { calle: "", numero: "", comuna: "", region: "" },
    pago: { metodo: "Débito/Crédito" },
    notas: ""
  });

  const nav = useNavigate();

  function recompute(next = getCart()) {
    const sub = next.reduce(
      (s, p) => s + (Number(p.precio) || 0) * (Number(p.cantidad) || 0),
      0
    );
    const iva = Math.round(sub * 0.19);
    setTotales({ sub, iva, total: sub + iva });
  }

  useEffect(() => {
    function refresh() {
      const c = getCart();
      setState(c);
      recompute(c);
    }
    refresh();
    const onChange = () => refresh();
    window.addEventListener("cart:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cart:change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  function handleInc(codigo) { inc(codigo); const c = getCart(); setState(c); recompute(c); }
  function handleDec(codigo) { dec(codigo); const c = getCart(); setState(c); recompute(c); }
  function handleDel(codigo) { removeFromCart(codigo); const c = getCart(); setState(c); recompute(c); }

  function validarFormulario() {
    if (!form.nombre.trim()) return "Nombre es requerido";
    if (!RUT_RE.test(form.rut.trim())) return "RUT inválido (formato: 12345678-9)";
    if (!MAIL_RE.test(form.email.trim())) return "Correo inválido";
    if (!form.direccion.calle.trim() || !form.direccion.comuna.trim() || !form.direccion.region.trim())
      return "Dirección incompleta (calle, comuna y región son obligatorias)";
    return "";
  }

  function confirmarCompra(e) {
    e.preventDefault();
    if (!itemsCount()) { alert("Tu carrito está vacío."); return; }
    const err = validarFormulario();
    if (err) { alert(err); return; }

    const order = buildOrderFromCart(getCart(), form);
    const saved = addOrder(order);
    clearCart();
    setShowForm(false);
    nav(`/orden/${saved.id}`);
  }

  return (
    <section>
      <h1>Carrito</h1>

      {!cart.length && <p>Tu carrito está vacío.</p>}

      {cart.length > 0 && (
        <>
          <div className="panel">
            {cart.map((p) => (
              <div key={p.codigo} className="row-cart">
                <span className="row-cart__name">{p.nombre}</span>
                <span className="row-cart__price">
                  ${Number(p.precio).toLocaleString("es-CL")}
                </span>
                <div className="qty">
                  <button aria-label="Disminuir" onClick={() => handleDec(p.codigo)}>-</button>
                  <b>{p.cantidad}</b>
                  <button aria-label="Aumentar" onClick={() => handleInc(p.codigo)}>+</button>
                </div>
                <span className="row-cart__line">
                  ${(p.precio * p.cantidad).toLocaleString("es-CL")}
                </span>
                <button className="btn-outline" onClick={() => handleDel(p.codigo)}>Eliminar</button>
              </div>
            ))}
          </div>

          <div className="panel totals">
            <div className="totals__line"><span>Subtotal</span><b>${totales.sub.toLocaleString("es-CL")}</b></div>
            <div className="totals__line"><span>IVA (19%)</span><b>${totales.iva.toLocaleString("es-CL")}</b></div>
            <div className="totals__line totals__total"><span>Total</span><b>${totales.total.toLocaleString("es-CL")}</b></div>
            <div className="actions wrap">
              <button className="btn" onClick={() => setShowForm(true)}>Continuar</button>
              <button
                className="btn-outline"
                onClick={() => { clearCart(); setState([]); recompute([]); }}
              >
                Vaciar
              </button>
            </div>
          </div>

          {showForm && (
            <div className="panel form-card">
              <h2>Datos de facturación</h2>

              <form onSubmit={confirmarCompra} className="form-grid">

                <div className="form-row two">
                  <label>
                    <span className="lbl">Nombre completo</span>
                    <input
                      className="input"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Ej: María Pérez"
                    />
                  </label>
                  <label>
                    <span className="lbl">RUT</span>
                    <input
                      className="input"
                      value={form.rut}
                      onChange={(e) => setForm({ ...form, rut: e.target.value })}
                      placeholder="12345678-9"
                    />
                  </label>
                </div>

                <div className="form-row two">
                  <label>
                    <span className="lbl">Correo</span>
                    <input
                      className="input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="correo@ejemplo.cl"
                    />
                  </label>
                  <label>
                    <span className="lbl">Teléfono</span>
                    <input
                      className="input"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                    />
                  </label>
                </div>

                <div className="form-row three">
                  <label>
                    <span className="lbl">Calle</span>
                    <input
                      className="input"
                      value={form.direccion.calle}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          direccion: { ...form.direccion, calle: e.target.value },
                        })
                      }
                      placeholder="Av. Siempre Viva"
                    />
                  </label>
                  <label>
                    <span className="lbl">Número</span>
                    <input
                      className="input"
                      value={form.direccion.numero}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          direccion: { ...form.direccion, numero: e.target.value },
                        })
                      }
                      placeholder="742"
                    />
                  </label>
                  <label>
                    <span className="lbl">Comuna</span>
                    <input
                      className="input"
                      value={form.direccion.comuna}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          direccion: { ...form.direccion, comuna: e.target.value },
                        })
                      }
                      placeholder="Ñuñoa"
                    />
                  </label>
                </div>

                <div className="form-row two">
                  <label>
                    <span className="lbl">Región</span>
                    <input
                      className="input"
                      value={form.direccion.region}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          direccion: { ...form.direccion, region: e.target.value },
                        })
                      }
                      placeholder="Región Metropolitana"
                    />
                  </label>

                  <label>
                    <span className="lbl">Método de pago</span>
                    <select
                      className="input"
                      value={form.pago.metodo}
                      onChange={(e) => setForm({ ...form, pago: { metodo: e.target.value } })}
                    >
                      <option>Débito/Crédito</option>
                      <option>Transferencia</option>
                      <option>Efectivo</option>
                    </select>
                  </label>
                </div>

                <div className="form-row one">
                  <label>
                    <span className="lbl">Notas (opcional)</span>
                    <textarea
                      className="input"
                      rows={3}
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                      placeholder="Indicaciones para la entrega…"
                    />
                  </label>
                </div>

                <div className="actions wrap">
                  <button className="btn">Confirmar compra</button>
                  <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
}
