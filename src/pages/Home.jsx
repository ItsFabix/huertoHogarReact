import React from "react";
import { Link } from "react-router-dom";
import { list } from "../data/catalog";
import { addToCart } from "../utils/cart";

function Home() {
  // Tomamos los primeros 4 como destacados
  const data = list();
  const destacados = Array.isArray(data) ? data.slice(0, 4) : [];

  return (
    <>
      {/* HERO (texto + mapa) */}
      <section className="hero container">
        <div className="hero-text">
          <h1>Productos frescos, saludables y sostenibles 🌱</h1>
          <p>Compra frutas, verduras y orgánicos de calidad, directo a tu mesa.</p>
          <Link to="/productos" className="btn">Ver catálogo</Link>

          <ul className="hero-bullets">
            <li>🚚 Entrega en RM</li>
            <li>🛒 Despacho desde $2.000</li>
            <li>🌿 Productores locales</li>
          </ul>
        </div>

        <div className="hero-map">
          <iframe
            title="Mapa HuertoHogar"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13320.882563756389!2d-70.653!3d-33.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59bc0f6d6a1%3A0x4f5fcd2c3d9e7b5f!2sSantiago%20de%20Chile!5e0!3m2!1ses!2scl!4v1699999999999"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <Link to="/nosotros" className="map-btn">Ver sedes</Link>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="container">
        <h2>Destacados</h2>

        <div className="grid">
          {destacados.map((p) => (
            <article key={p.codigo} className="card">
              <img
                className="card-img"
                src={p.imagen || "/img/productos/placeholder.jpg"}
                alt={p.nombre}
              />
              <h3>{p.nombre}</h3>
              <p className="precio">
                ${Number(p.precio).toLocaleString("es-CL")}
              </p>
              <div className="acciones">
                <Link className="btn" to={`/producto/${encodeURIComponent(p.codigo)}`}>
                  Ver
                </Link>
                <button className="btn" onClick={() => addToCart(p)}>
                  Añadir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
