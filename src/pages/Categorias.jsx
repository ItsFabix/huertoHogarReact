// src/pages/Categorias.jsx
import { useEffect, useMemo, useState } from "react";
import { list, listCategories } from "../data/catalog";
import { addToCart } from "../utils/cart";

export default function Categorias() {
  const [cat, setCat] = useState("");   // categoría activa
  const [q, setQ] = useState("");       // búsqueda
  const [data, setData] = useState([]);

  // carga inicial + escuchar cambios en localStorage
  useEffect(() => {
    const load = () => setData(list());
    load();
    const onStorage = e => { if (e.key === "productosAdmin") load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const categorias = useMemo(() => listCategories(), [data]);

  const filtrados = useMemo(() => {
    let arr = [...data];
    if (cat) arr = arr.filter(p => String(p.categoria).trim() === cat);
    const qq = q.trim().toLowerCase();
    if (qq) {
      arr = arr.filter(p =>
        (p.nombre || "").toLowerCase().includes(qq) ||
        (p.categoria || "").toLowerCase().includes(qq) ||
        String(p.codigo || "").toLowerCase().includes(qq)
      );
    }
    return arr;
  }, [data, cat, q]);

  return (
    <main className="container main-content">
      <h1>Categorías</h1>

      <section className="panel">
        <div className="actions wrap">
          <label style={{ minWidth: 220 }}>
            <span style={{ display:"block", fontSize:12, color:"#666" }}>Categoría</span>
            <select value={cat} onChange={e=>setCat(e.target.value)}>
              <option value="">Todas</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="input-grow">
            <span style={{ display:"block", fontSize:12, color:"#666" }}>Buscar</span>
            <input
              placeholder="Nombre, código o categoría…"
              value={q}
              onChange={e=>setQ(e.target.value)}
            />
          </label>
        </div>
      </section>

      {!data.length ? (
        <p className="text-muted">Aún no hay productos cargados. Prueba recargar o crear productos en el panel de administración.</p>
      ) : !filtrados.length ? (
        <p className="text-muted">No hay productos que coincidan con el filtro.</p>
      ) : (
        <section className="grid">
          {filtrados.map(p => (
            <article key={p.codigo} className="card">
              <img className="card-img" src={p.imagen || "img/productos/placeholder.jpg"} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p className="cat">{p.categoria || "—"}</p>
              <p className="precio">${Number(p.precio).toLocaleString("es-CL")}</p>
              <div className="acciones">
                <a className="btn" href={`/producto/${encodeURIComponent(p.codigo)}`}>Ver</a>
                <button className="btn" onClick={()=>addToCart(p)}>Añadir</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
