import { useEffect, useState } from "react";
import { getCarrito, incAt, decAt, delAt } from "../utils/cart";

export default function Carrito(){
  const [items, setItems] = useState([]);

  const refresh = () => setItems(getCarrito());

  useEffect(()=>{
    refresh();
    const h = () => refresh();
    window.addEventListener("cart:change", h);
    return () => window.removeEventListener("cart:change", h);
  }, []);

  const total = items.reduce((s,p)=> s + (Number(p.precio)||0)*(Number(p.cantidad)||0), 0);

  if (!items.length){
    return (
      <main className="container">
        <h1>Tu Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <a className="btn" href="/productos">Seguir comprando</a>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Tu Carrito</h1>

      {items.map((item, idx)=>(
        <div className="row-cart" key={item.codigo}>
          <span>{item.nombre}</span>
          <span>${Number(item.precio).toLocaleString("es-CL")}</span>

          <div className="qty">
            <button onClick={()=>{ decAt(idx); }}>–</button>
            <b>{item.cantidad}</b>
            <button onClick={()=>{ incAt(idx); }}>+</button>
          </div>

          <span>${Number(item.precio*item.cantidad).toLocaleString("es-CL")}</span>
          <button onClick={()=>{ delAt(idx); }}>Eliminar</button>
        </div>
      ))}

      <p className="precio" style={{marginTop:12}}>
        <b>Total: ${total.toLocaleString("es-CL")}</b>
      </p>

      <div className="actions">
        <a className="btn" href="/productos">Seguir comprando</a>
        <button className="btn">Pagar (demo)</button>
      </div>
    </main>
  );
}
