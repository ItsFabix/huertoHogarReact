// src/pages/OrderDetail.jsx
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../data/orders";

export default function OrderDetail() {
  const { id } = useParams();
  const orden = getOrder(id);

  if (!orden) {
    return (
      <main className="container main-content">
        <h1>Orden no encontrada</h1>
        <p>La orden #{id} no existe o fue eliminada.</p>
        <Link className="btn" to="/ordenes">Ver mis órdenes</Link>
      </main>
    );
  }

  const fmt = new Date(orden.fecha).toLocaleString("es-CL");
  const total = Number(orden.total || 0);

  return (
    <main className="container main-content">
      <h1>Orden #{orden.id}</h1>
      <p className="text-muted">Fecha: {fmt}</p>

      <section className="panel" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0 }}>Datos del cliente</h2>
        <p><b>Nombre:</b> {orden.cliente?.nombre || "Invitado"}</p>
        <p><b>Correo:</b> {orden.cliente?.correo || "—"}</p>
      </section>

      <section className="panel" style={{ marginTop: 12 }}>
        <h2 style={{ marginTop: 0 }}>Resumen de la compra</h2>
        <div className="table">
          <div className="thead" style={{display:"grid",gridTemplateColumns:"1fr 120px 100px 140px",gap:8}}>
            <div>Producto</div>
            <div>Precio</div>
            <div>Cant.</div>
            <div>Subtotal</div>
          </div>
          {orden.items?.map((it, idx) => {
            const precio = Number(it.precio) || 0;
            const cant = Number(it.cantidad) || 0;
            const sub = precio * cant;
            return (
              <div key={idx} className="trow" style={{display:"grid",gridTemplateColumns:"1fr 120px 100px 140px",gap:8, alignItems:"center"}}>
                <div>{it.nombre} <span className="text-muted">({it.codigo})</span></div>
                <div>${precio.toLocaleString("es-CL")}</div>
                <div>{cant}</div>
                <div>${sub.toLocaleString("es-CL")}</div>
              </div>
            );
          })}
          <div className="trow" style={{display:"grid",gridTemplateColumns:"1fr 120px 100px 140px",gap:8,fontWeight:700}}>
            <div>Total</div><div></div><div></div>
            <div>${total.toLocaleString("es-CL")}</div>
          </div>
        </div>
      </section>

      <div className="actions" style={{ marginTop: 12 }}>
        <Link className="btn" to="/ordenes">Ver mis órdenes</Link>
        <Link className="btn-outline" to="/productos">Seguir comprando</Link>
      </div>
    </main>
  );
}
