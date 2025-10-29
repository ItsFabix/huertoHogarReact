import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getCartCount } from "../utils/cart";

function Header() {
  const [count, setCount] = useState(0);
  const refreshCount = () => setCount(getCartCount());

  useEffect(() => {
    refreshCount();

    const onStorage = (e) => { if (e.key === "carrito") refreshCount(); };
    const onCartChange = () => refreshCount();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:change", onCartChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:change", onCartChange);
    };
  }, []);

  return (
    <header className="topbar">
      <nav className="nav container">
        {/* Logo */}
        <Link to="/" className="logo" title="HuertoHogar">
          <img src="/img/logo.jpg" alt="HuertoHogar" />
        </Link>

        {/* Menú principal */}
        <ul className="menu">
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/ofertas">Ofertas</NavLink></li>
          <li><NavLink to="/categoria">Categorías</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
        </ul>

        {/* Acciones a la derecha */}
        <div className="nav-actions">
          <Link to="/carrito" className="cart-link" title="Carrito">
            🛒 <span id="cart-count" className="badge">{count}</span>
          </Link>
          <div className="user-menu" title="Cuenta">
            👤
            <div className="user-dropdown">
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
              <a href="/ordenes">Mis órdenes</a>
              <Link to="/admin">Admin</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
