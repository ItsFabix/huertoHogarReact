import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrder, cancelOrder } from "../data/orders";

export default function OrderDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const o = getOrder(id);

  if (!o) return <section><p>Orden no encontrada.</p></section>;

  function onCancel(){
    if (window.confirm("¿Cancelar esta orden?")) {
      cancelOrder(o.id);
      nav("/ordenes");
    }
  }

  const b = o.buyer || {};
  const d = b.direccion || {};
  const pago = b.pago || {};

  return (
    <section className="detail">
      <h1>Boleta #{o.folio}</h1>
      <div className="panel detail-box">
        <div>
          <p><b>Fecha:</b> {new Date(o.date).toLocaleString()}</p>
          <p><b>Estado:</b> {o.status}</p>
        </div>
        <div>
          <p><b>RUT:</b> {b.rut}</p>
          <p><b>Cliente:</b> {b.nombre}</p>
          <p><b>Email:</b> {b.email}</p>
          <p><b>Teléfono:</b> {b.telefono}</p>
          <p><b>Dirección:</b> {`${d.calle} ${d.numero || ""}, ${d.comuna}, ${d.region}`}</p>
          <p><b>Método de pago:</b> {pago.metodo}</p>
          {b.notas && <p><b>Notas:</b> {b.notas}</p>}
        </div>
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr><th>Código</th><th>Producto</th><th>Cant.</th><th>Precio</th><th>Total</th></tr>
          </thead>
        </table>
        <table className="table">
          <tbody>
            {o.items.map(it=>(
              <tr key={it.codigo}>
                <td>{it.codigo}</td>
                <td>{it.nombre}</td>
                <td>{it.cantidad}</td>
                <td>${it.precio.toLocaleString("es-CL")}</td>
                <td>${(it.precio*it.cantidad).toLocaleString("es-CL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>Subtotal: ${o.subtotal.toLocaleString("es-CL")} | IVA: ${o.iva.toLocaleString("es-CL")} | <b>Total: ${o.total.toLocaleString("es-CL")}</b></p>
      <div className="actions wrap">
        <Link className="btn-outline" to="/ordenes">← Volver</Link>
        {o.status !== "cancelada" && <button className="btn" onClick={onCancel}>Cancelar orden</button>}
      </div>
    </section>
  );
}
