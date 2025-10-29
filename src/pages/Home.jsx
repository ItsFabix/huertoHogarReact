// src/pages/Home.jsx
import { PRODUCTS } from "../data/products";

export default function Home(){
  const destacados = PRODUCTS.slice(0, 4); // muestra 4 destacados

  return (
    <main>
      {/* HERO con texto a la izquierda y mapa a la derecha */}
      <section className="hero container">
        <div className="hero-text">
          <h1>Productos frescos, saludables y sostenibles 🍎🥬</h1>
          <p>Compra frutas, verduras y orgánicos de calidad, directo a tu mesa.</p>
          <a className="btn" href="/productos">Ver catálogo</a>
          <ul className="hero-bullets">
            <li>🏍️ Entrega en RM</li>
            <li>📦 Despacho desde $2.000</li>
            <li>🧑‍🌾 Productores locales</li>
          </ul>
        </div>

        <div className="hero-map">
          <iframe
            title="Mapa HuertoHogar"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6657130.713296989!2d-74.6!3d-33.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59c9a3a93%3A0x7!2sSantiago%2C%20Chile!5e0!3m2!1ses-419!2scl!4v1700000000000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="map-btn" href="/nosotros#sedes">Ver sedes</a>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="container">
        <h2>Destacados</h2>
        <div className="grid">
          {destacados.map(p => (
            <article className="card" key={p.codigo}>
              <img className="card-img" src={`/${p.imagen}`} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p className="precio">
                ${Number(p.precio).toLocaleString("es-CL")}
              </p>
              <div className="acciones">
                <a className="btn" href={`/productos?focus=${encodeURIComponent(p.codigo)}`}>Ver</a>
                <button
                  className="btn"
                  onClick={() => alert(`(demo) Añadido: ${p.nombre}`)}
                >
                  Añadir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
