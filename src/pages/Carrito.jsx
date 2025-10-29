// src/pages/Carrito.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, setCart, inc, dec, removeFromCart, clearCart, getCartCount } from "../utils/cart";
import { addOrder } from "../data/orders";

// Regex permitidos (ajusta si usaste otros dominios)
const EMAIL_ALLOWED = /^[^@\s]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export default function Carrito() {
  const nav = useNavigate();
  const [cart, setLocal] = useState(getCart());
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const onChange = () => setLocal(getCart());
    window.addEventListener("cart:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cart:change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const total = useMemo(
    () => cart.reduce((s, p) => s + (Number(p.precio) || 0) * (Number(p.cantidad) || 0), 0),
    [cart]
  );

  const handleInc = (codigo) => { inc(codigo); setLocal(getCart()); };
  const handleDec = (codigo) => { dec(codigo); setLocal(getCart()); };
  const handleDel = (codigo) => { removeFromCart(codigo); setLocal(getCart()); };

  const finalizarCompra = (e) => {
    e.preventDefault();

    if (!cart.length) return;

    // Validación simple (puedes endurecer si quieres)
    const cliente = {
      nombre: nombre.trim() || "Invitado",
      correo: correo.trim()
    };
    if (cliente.correo && !EMAIL_ALLOWED.test(cliente.correo)) {
      alert("Correo no permitido. Usa duoc.cl, profesor.duoc.cl o gmail.com");
      return;
    }

    const orden = addOrder({
      cliente,
      items: cart.map(({ codigo, nombre, precio, cantidad }) => ({
        codigo, nombre, precio, cantidad
      })),
      total
    });

    clearCart();
    setLocal(getCart());
    // Redirige al detalle de la orden
    nav(`/orden/${orden.id}`);
  };

  if (!cart.length) {
    return (
      <main className="container main-content">
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
      </main>
    );
  }

  return (
    <main className="container main-content">
      <h1>Carrito</h1>

      <section className="panel">
        {cart.map(p => {
          const sub = (Number(p.precio)||0) * (Number(p.cantidad)||0);
          return (
            <div key={p.codigo} className="row-cart">
              <span>{p.nombre}</span>
              <span>${Number(p.precio).toLocaleString("es-CL")}</span>
              <div className="qty">
                <button onClick={() => handleDec(p.codigo)}>–</button>
                <b>{p.cantidad}</b>
                <button onClick={() => handleInc(p.codigo)}>+</button>
              </div>
              <span>${sub.toLocaleString("es-CL")}</span>
              <button onClick={() => handleDel(p.codigo)}>Eliminar</button>
            </div>
          );
        })}
        <p className="precio" style={{ marginTop: 12 }}>
          Total: ${total.toLocaleString("es-CL")}
        </p>
      </section>

      <section className="panel" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0 }}>Datos para la orden</h2>
        <form onSubmit={finalizarCompra} className="grid2">
          <label>
            Nombre
            <input value={nombre} onChange={e=>setNombre(e.target.value)} maxLength={100} placeholder="Opcional" />
          </label>
          <label>
            Correo
            <input value={correo} onChange={e=>setCorreo(e.target.value)} maxLength={100} placeholder="Opcional (duoc.cl / profesor.duoc.cl / gmail.com)" />
          </label>

          <div className="full actions" style={{ marginTop: 8 }}>
            <button type="submit" className="btn">Finalizar compra</button>
            <button type="button" className="btn-outline" onClick={()=>{ clearCart(); setLocal(getCart()); }}>
              Vaciar carrito
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
