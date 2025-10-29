import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
// import Blog from "./pages/Blog";
// import Nosotros from "./pages/Nosotros";
// import Contacto from "./pages/Contacto";
// import Carrito from "./pages/Carrito";
// import Login from "./pages/Login";
// import Registro from "./pages/Registro";

// Muestra y mantiene actualizado el número del carrito
function CartCounter(){
  const [n, setN] = useState(getCartCount());
  useEffect(()=>{
    const refresh = () => setN(getCartCount());
    refresh();
    window.addEventListener("cart:change", refresh);
    return () => window.removeEventListener("cart:change", refresh);
  }, []);
  return <span id="cart-count" className="badge">{n}</span>;
}

// ====== COMPONENTE HEADER ======
function Header() {
  return (
    <header className="topbar">
      <nav className="nav container">
        {/* Logo */}
        <Link to="/" className="logo" title="HuertoHogar">
          <img src="/img/logo.jpg" alt="HuertoHogar" style={{ height: 70 }} />
        </Link>

        {/* Menú principal */}
        <ul className="menu">
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
        </ul>

        {/* Acciones a la derecha */}
        <div className="nav-actions">
          {/* Carrito */}
          <Link to="/carrito" className="cart-link" title="Carrito">
            🛒 <CartCounter />
          </Link>


          {/* Usuario con dropdown */}
          <div className="user-menu">
            👤
            <div className="user-dropdown">
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

// ====== COMPONENTE FOOTER ======
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© 2025 HuertoHogar · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

// ====== COMPONENTE PRINCIPAL (APP) ======
function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container" style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/blog" element={<h1>Blog</h1>} />
          <Route path="/nosotros" element={<h1>Nosotros</h1>} />
          <Route path="/contacto" element={<h1>Contacto</h1>} />
          <Route path="/carrito" element={<h1>Carrito</h1>} />
          <Route path="/login" element={<h1>Iniciar Sesión</h1>} />
          <Route path="/registro" element={<h1>Registro</h1>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

