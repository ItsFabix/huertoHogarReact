import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { list } from "../data/catalog";
import { addToCart } from "../utils/cart";

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [cat, setCat] = useState(searchParams.get("cat") || "");

  useEffect(() => {
    const n = {};
    if (q) n.q = q;
    if (cat) n.cat = cat;
    setSearchParams(n, { replace: true });
  }, [q, cat, setSearchParams]);

  const productos = useMemo(() => {
    let arr = list();
    if (cat) arr = arr.filter(p => p.categoria === cat);
    if (q) {
      const t = q.toLowerCase();
      arr = arr.filter(p =>
        (p.nombre || "").toLowerCase().includes(t) ||
        (p.descripcion || "").toLowerCase().includes(t) ||
        (p.categoria || "").toLowerCase().includes(t)
      );
    }
    return arr;
  }, [q, cat]);

  const categorias = useMemo(
    () => Array.from(new Set(list().map(p => p.categoria))).sort(),
    []
  );

  return (
    <section>
      <h1 className="title">Productos</h1>

      <div className="panel" style={{marginBottom:12}}>
        <div className="actions wrap">
          <input
            className="input"
            placeholder="Buscar por nombre o descripción…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select
            className="input"
            value={cat}
            onChange={e => setCat(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(q || cat) && (
            <button className="btn-outline" onClick={()=>{setQ("");setCat("");}}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="text-muted">No hay productos para los filtros seleccionados.</p>
      ) : (
        <div className="grid">
          {productos.map(p => {
            const enOferta = p.oferta === true || typeof p.precioOferta === "number";
            const precioMostrar = enOferta ? (p.precioOferta ?? p.precio) : p.precio;

            return (
              <article key={p.codigo} className="card">
                <div className="img-wrap">
                  {enOferta && <span className="badge-offer">Oferta</span>}
                  <img src={p.imagen} alt={p.nombre} />
                </div>
                <div className="card-body">
                  <h3>{p.nombre}</h3>
                  <p className="text-muted">{p.categoria}</p>

                  <div className="price">
                    {enOferta && <span className="old">${Number(p.precio).toLocaleString("es-CL")}</span>}
                    <b>${Number(precioMostrar).toLocaleString("es-CL")}</b>
                  </div>

                  <div className="actions">
                    <button className="btn" onClick={()=>addToCart(p)}>Añadir</button>
                    <Link className="btn-outline" to={`/producto/${p.codigo}`}>Detalle</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
