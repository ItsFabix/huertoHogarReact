// src/pages/Productos.jsx
import { useMemo, useState } from "react";
import { PRODUCTS } from "../data/products";
import { addToCartByCode } from "../utils/cart";

const LS_KEY_CART = "carrito";

// ===== helpers mínimos (temporal, luego usaremos Context) =====
function getCarrito(){
  try {
    const raw = localStorage.getItem(LS_KEY_CART);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function setCarrito(arr){
  localStorage.setItem(LS_KEY_CART, JSON.stringify(Array.isArray(arr) ? arr : []));
}
function addToCartByCode(codigo){
  const p = PRODUCTS.find(x => x.codigo === codigo);
  if(!p) return;
  const cart = getCarrito();
  const i = cart.findIndex(x => x.codigo === codigo);
  if (i >= 0) cart[i].cantidad += 1;
  else cart.push({ codigo: p.codigo, nombre: p.nombre, precio: p.precio, cantidad: 1 });
  setCarrito(cart);
  // mini feedback (podemos cambiar por toast luego)
  alert(`Añadido: ${p.nombre}`);
}

export default function Productos(){
  const [categoria, setCategoria] = useState("");
  const [q, setQ] = useState("");

  // categorías únicas desde PRODUCTS
  const categorias = useMemo(()=>{
    const set = new Set(PRODUCTS.map(p => p.categoria).filter(Boolean));
    return ["", ...Array.from(set)];
  }, []);

  // aplica filtros (categoría + texto)
  const lista = useMemo(()=>{
    let data = [...PRODUCTS];
    if (categoria) data = data.filter(p => p.categoria === categoria);
    if (q.trim()) {
      const k = q.toLowerCase();
      data = data.filter(p => p.nombre.toLowerCase().includes(k));
    }
    return data;
  }, [categoria, q]);

  return (
    <main className="container">
      <h1>Nuestros productos</h1>

      <div style={{ marginBottom: 12 }}>
        <select id="fCategoria" value={categoria} onChange={e=>setCategoria(e.target.value)}>
          {categorias.map((c,i)=>(
            <option key={i} value={c}>
              {c || "Todas las categorías"}
            </option>
          ))}
        </select>
        <input
          id="fBuscar"
          placeholder="Buscar..."
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </div>

      <div id="lista-productos" className="grid">
        {lista.map(p=>(
          <article className="card" key={p.codigo}>
            <img className="card-img" src={`/${p.imagen}`} alt={p.nombre}/>
            <h3>{p.nombre}</h3>
            <p className="precio">${Number(p.precio).toLocaleString("es-CL")}</p>
            <p className="cat">{p.categoria}</p>
            <div className="acciones">
              <a className="btn" href={`/detalle-producto.html?id=${encodeURIComponent(p.codigo)}`}>
                Ver detalle
              </a>
              <button className="btn" onClick={()=>addToCartByCode(p.codigo)}>Añadir</button>
            </div>
          </article>
        ))}
      </div>

      {!lista.length && <p>No hay productos para los filtros seleccionados.</p>}
    </main>
  );
}
