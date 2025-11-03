import { useEffect, useState } from "react";
import { listOrders } from "../data/orders";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState(listOrders());

  useEffect(()=>{
    const refresh = ()=> setOrders(listOrders());
    window.addEventListener("orders:change", refresh);
    window.addEventListener("storage", refresh);
    return ()=> {
      window.removeEventListener("orders:change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <section>
      <h1>Órdenes</h1>
      {!orders.length && <p>No hay órdenes todavía.</p>}
      {orders.length > 0 && (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Folio</th><th>Fecha</th><th>Cliente</th><th>Items</th><th>Total</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id}>
                  <td>{o.folio}</td>
                  <td>{new Date(o.date).toLocaleString()}</td>
                  <td>{o.buyer?.nombre || o.buyer?.email}</td>
                  <td>{o.items?.length || 0}</td>
                  <td>${Number(o.total).toLocaleString("es-CL")}</td>
                  <td>{o.status}</td>
                  <td><Link className="btn-outline" to={`/orden/${o.id}`}>Ver</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
