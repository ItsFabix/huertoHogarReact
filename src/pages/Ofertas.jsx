import { useEffect, useState } from "react";
import { addToCart } from "../utils/cart";
import { list as listCatalog } from "../data/catalog";

export default function Ofertas() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Cargamos catálogo y filtramos por productos con oferta
    const all = listCatalog();
    const offers = all.filter(p => p.oferta === true || Number(p.descuento) > 0);
    setItems(offers);
  }, []);

  return (
    <section>
      <h1>Ofertas</h1>
      {!items.length && (
        <div className="panel">
          <p className="text-muted">No hay ofertas activas por ahora. Vuelve pronto ✨</p>
        </div>
      )}

      <div className="grid-prods">
        {items.map(p => (
          <article key={p.codigo} className="prod-card">
            <div className="offer-flag">Oferta</div>
            <img
              className="prod-img"
              src={p.imagen}
              alt={p.nombre}
              loading="lazy"
            />
            <h3 className="prod-name">{p.nombre}</h3>

            <div className="prod-price">
              {p.descuento
                ? <>
                    <span className="old">${Number(p.precio).toLocaleString("es-CL")}</span>
                    <b>${Number(p.precio - p.descuento).toLocaleString("es-CL")}</b>
                  </>
                : <b>${Number(p.precio).toLocaleString("es-CL")}</b>
              }
            </div>

            <div className="actions">
              <button
                className="btn"
                onClick={() => addToCart(p)}
                disabled={p.stock <= 0}
                title={p.stock <= 0 ? "Sin stock" : "Añadir al carrito"}
              >
                Añadir
              </button>
              <span className="stock">
                {p.stock > 0 ? `Stock: ${p.stock}` : "Sin stock"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
