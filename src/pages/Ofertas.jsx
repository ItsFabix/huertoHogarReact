// src/pages/Ofertas.jsx
import { useEffect, useMemo, useState } from "react";
import { listOffers } from "../data/catalog";
import { addToCart } from "../utils/cart";

function precioConDescuento(p) {
  const base = Number(p.precio) || 0;
  if (p.precioOferta && Number(p.precioOferta) > 0) return Number(p.precioOferta);
  if (p.descuento && Number(p.descuento) > 0) {
    const d = Number(p.descuento);
    return Math.max(0, Math.round(base * (1 - d / 100)));
  }
  return base;
}

export default function Ofertas() {
  const [q, setQ] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => { setData(listOffers()); }, []);

  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let arr = [...data];
    if (qq) {
      arr = arr.filter(p =>
        (p.nombre || "").toLowerCase().includes(qq) ||
        (p.categoria || "").toLowerCase().includes(qq)
      );
    }
    return arr;
  }, [data, q]);

  return (
    <main className="container main-content">
      <h1>Ofertas</h1>

      <section className="panel">
        <div className="actions wrap">
          <label className="input-grow">
            <span style={{ display:"block", fontSize:12, color:"#666" }}>Buscar</span>
            <input
              placeholder="Nombre o categoría…"
              value={q}
              onChange={e=>setQ(e.target.value)}
            />
          </label>
        </div>
      </section>

      {!filtrados.length ? (
        <p className="text-muted">Por ahora no tenemos ofertas activas.</p>
      ) : (
        <section className="grid">
          {filtrados.map(p => {
            const base = Number(p.precio) || 0;
            const oferta = precioConDescuento(p);
            const tieneOferta = oferta < base;

            return (
              <article key={p.codigo} className="card card-offer">
                {tieneOferta && <div className="ribbon-offer">OFERTA</div>}

                <img className="card-img" src={p.imagen || "img/productos/placeholder.jpg"} alt={p.nombre} />
                <h3>{p.nombre}</h3>
                <p className="cat">{p.categoria || "—"}</p>

                {tieneOferta ? (
                  <p className="precio">
                    <s style={{ color:"#888", marginRight:8 }}>${base.toLocaleString("es-CL")}</s>
                    ${oferta.toLocaleString("es-CL")}
                  </p>
                ) : (
                  <p className="precio">${base.toLocaleString("es-CL")}</p>
                )}

                <div className="acciones">
                  <a className="btn" href={`/producto/${encodeURIComponent(p.codigo)}`}>Ver</a>
                  <button className="btn" onClick={()=>addToCart({ ...p, precio: oferta })}>
                    Añadir
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
