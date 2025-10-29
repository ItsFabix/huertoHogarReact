import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { list } from "../data/catalog";
import { addToCart } from "../utils/cart";

export default function Productos() {
  const [categoria, setCategoria] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const sync = () => setData(list());
    sync();
    window.addEventListener("products:changed", sync);
    return () => window.removeEventListener("products:changed", sync);
  }, []);

  const categorias = useMemo(() => {
    const set = new Set();
    (data || []).forEach((p) => p.categoria && set.add(p.categoria));
    return ["", ...Array.from(set)];
  }, [data]);

  const filtrados = useMemo(() => {
    let lista = Array.isArray(data) ? [...data] : [];
    if (categoria) lista = lista.filter((p) => p.categoria === categoria);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion || "").toLowerCase().includes(q) ||
          (p.codigo || "").toLowerCase().includes(q)
      );
    }
    return lista;
  }, [categoria, query, data]);

  return (
    <main className="container">
      <h1>Nuestros productos</h1>

      <div className="panel">
        <div className="actions wrap">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c ? c : "Todas las categorías"}
              </option>
            ))}
          </select>

          <input
            className="input-grow"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid">
        {filtrados.map((p) => (
          <article key={p.codigo} className="card">
            <img
              className="card-img"
              src={p.imagen || "/img/productos/placeholder.jpg"}
              alt={p.nombre}
            />
            <h3>{p.nombre}</h3>
            <p className="precio">${Number(p.precio).toLocaleString("es-CL")}</p>
            <p className="cat">{p.categoria || ""}</p>

            <div className="acciones">
              <Link className="btn" to={`/producto/${encodeURIComponent(p.codigo)}`}>
                Ver detalle
              </Link>
              <button className="btn" onClick={() => addToCart(p)}>
                Añadir
              </button>
            </div>
          </article>
        ))}
      </div>

      {!filtrados.length && (
        <p className="mt-12">No encontramos productos con ese filtro.</p>
      )}
    </main>
  );
}
