import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartCount } from "../utils/cart";

export default function Header() {
  const [count, setCount] = useState(getCartCount());

  useEffect(() => {
    const onChange = () => setCount(getCartCount());
    window.addEventListener("cart:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cart:change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <header className="topbar">
      <nav className="nav container">
        <Link to="/" className="logo" title="HuertoHogar">
          <img src="/img/logo.jpg" alt="HuertoHogar" style={{ height: 56 }} />
        </Link>

        <ul className="menu">
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/ofertas">Ofertas</NavLink></li>
          <li><NavLink to="/categorias">Categorias</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
        </ul>

        <div className="nav-actions">
          <Link to="/carrito" className="cart-link">
            🛒 <span className="badge">{count}</span>
          </Link>
          <div className="user-menu">👤
            <div className="user-dropdown">
              <Link to="/login">Iniciar sesion</Link>
              <Link to="/registro">Registrarse</Link>
              <Link to="/ordenes">Mis Ordenes</Link>
              <Link to="/admin">Admin</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
