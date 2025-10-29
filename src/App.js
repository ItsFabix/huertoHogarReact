// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Blog from "./pages/Blog";
import BlogDetalle from "./pages/BlogDetalle";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import Ofertas from "./pages/Ofertas";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import DetalleProducto from "./pages/DetalleProducto";

import "./index.css";

// ==================== COMPONENTE PRINCIPAL ==================== //
function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:codigo" element={<DetalleProducto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/ordenes" element={<Orders />} />
          <Route path="/orden/:id" element={<OrderDetail />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
