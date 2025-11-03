/* eslint-disable no-alert */
import { useEffect, useMemo, useState } from "react";
import { list as listCatalog } from "../data/catalog"; // tus productos
import { listOrders, revenue, ordersCount, cancelOrder } from "../data/orders";
import { listUsers, createUser, updateUser, removeUser } from "../data/users";

function Card({title, value, hint, color}) {
  return (
    <div className="panel" style={{borderLeft:`6px solid ${color||"#2a7"}`}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <div style={{fontSize:12, opacity:.7}}>{title}</div>
          <div style={{fontSize:28, fontWeight:700}}>{value}</div>
          {hint && <div style={{fontSize:12, opacity:.6}}>{hint}</div>}
        </div>
      </div>
    </div>
  );
}

function OrdersTable() {
  const [orders, setOrders] = useState(listOrders());
  useEffect(()=>{
    const r = ()=> setOrders(listOrders());
    window.addEventListener("orders:change", r);
    window.addEventListener("storage", r);
    return ()=>{ window.removeEventListener("orders:change", r); window.removeEventListener("storage", r); };
  }, []);
  return (
    <div className="panel mt-12">
      <h3>Órdenes</h3>
      {!orders.length ? <p>No hay órdenes.</p> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Fecha</th><th>Items</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{new Date(o.date).toLocaleString()}</td>
                <td>{o.items.length}</td>
                <td>${o.total.toLocaleString("es-CL")}</td>
                <td>{o.status}</td>
                <td>
                  {o.status !== "cancelada" &&
                    <button className="btn-outline" onClick={()=>cancelOrder(o.id)}>Cancelar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState(listUsers());
  const [form, setForm] = useState({ nombre:"", email:"", rol:"cliente" });

  useEffect(()=>{
    const r = ()=> setUsers(listUsers());
    window.addEventListener("users:change", r);
    window.addEventListener("storage", r);
    return ()=>{ window.removeEventListener("users:change", r); window.removeEventListener("storage", r); };
  }, []);

  function onSubmit(e){
    e.preventDefault();
    try {
      createUser(form);
      setForm({ nombre:"", email:"", rol:"cliente" });
    } catch(err){ alert(err.message); }
  }

  return (
    <div className="panel mt-12">
      <h3>Usuarios</h3>

      <form onSubmit={onSubmit} className="actions wrap" style={{gap:8, marginBottom:12}}>
        <input className="input" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})}/>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <select className="input" value={form.rol} onChange={e=>setForm({...form, rol:e.target.value})}>
          <option value="cliente">cliente</option>
          <option value="admin">admin</option>
        </select>
        <button className="btn">Crear</button>
      </form>

      {!users.length ? <p>Sin usuarios.</p> : (
        <table className="table">
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.email}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.rol} onChange={e=>updateUser(u.email, {rol:e.target.value})}>
                    <option value="cliente">cliente</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td><button className="btn-outline" onClick={()=>removeUser(u.email)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function Admin(){
  const productos = useMemo(()=> listCatalog(), []);
  const ingresos = revenue();
  const ords = ordersCount();
  const usuarios = listUsers().length;

  return (
    <section>
      <h1>Panel Administrativo</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12}}>
        <Card title="Ingresos" value={`$${ingresos.toLocaleString("es-CL")}`} hint="Acumulado (órdenes pagadas)" color="#2a7"/>
        <Card title="Órdenes" value={ords} hint="Totales" color="#267bd3"/>
        <Card title="Productos" value={productos.length} hint="Inventario" color="#16a34a"/>
        <Card title="Usuarios" value={usuarios} hint="Registrados" color="#f59e0b"/>
      </div>

      <OrdersTable />
      <UsersPanel />
    </section>
  );
}
