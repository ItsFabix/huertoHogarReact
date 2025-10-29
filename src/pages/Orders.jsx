// src/pages/Orders.jsx
import { Link } from "react-router-dom";
import { listOrders } from "../data/orders";

export default function Orders() {
  const ordenes = listOrders();

  return (
    <main className="container main-content">
      <h1>Mis órdenes</h1>

      {!ordenes.length ? (
        <>
          <p>No tienes órdenes registradas todavía.</p>
          <Link className="btn" to="/productos">Ir a comprar</Link>
        </>
      ) : (
        <section className="panel" style={{ marginTop: 12 }}>
          <div className="table">
            <div className="thead" style={{display:"grid",gridTemplateColumns:"80px 1fr 200px 160px",gap:8}}>
              <div>ID</div><div>Cliente</div><div>Fecha</div><div>Total</div>
            </div>
            {ordenes.map(o => (
              <Link
                key={o.id}
                className="trow"
                to={`/orden/${o.id}`}
                style={{display:"grid",gridTemplateColumns:"80px 1fr 200px 160px",gap:8, textDecoration:"none", color:"inherit"}}
              >
                <div>#{o.id}</div>
                <div>{o.cliente?.nombre || "Invitado"} <span className="text-muted">({o.cliente?.correo || "—"})</span></div>
                <div>{new Date(o.fecha).toLocaleString("es-CL")}</div>
                <div>${Number(o.total||0).toLocaleString("es-CL")}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
