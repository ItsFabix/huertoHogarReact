/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import { Link, NavLink, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { list as listP, create as createP, update as updateP, remove as removeP, getByCode } from "../data/products";
import { listOrders, getOrder, cancelOrder } from "../data/orders";
import { getSession } from "../utils/session";

// ========= Layout =========
export default function Admin(){
  const navigate = useNavigate();
  useEffect(()=>{
    const u = getSession();
    if(!u){ alert("Inicia sesión para acceder al panel"); navigate("/login"); }
  },[navigate]);

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sb-brand">HuertoHogar · Admin</div>
        <nav className="sb-nav">
          <NavLink to="" end>Dashboard</NavLink>

          <div className="sb-section">Órdenes</div>
          <NavLink to="ordenes" end>Listado</NavLink>

          <div className="sb-section">Productos</div>
          <NavLink to="productos" end>Listado</NavLink>
          <NavLink to="productos/nuevo">Nuevo</NavLink>
          <NavLink to="productos/criticos">Críticos</NavLink>

          <div className="sb-section">Reportes</div>
          <NavLink to="reportes">Indicadores</NavLink>

          <div className="sb-section">Cuenta</div>
          <NavLink to="perfil">Perfil</NavLink>
          <Link to="/">Ver tienda</Link>
        </nav>
      </aside>

      <section className="admin-content">
        <header className="content-header"><h1>Panel de administración</h1></header>
        <div className="content-body">
          <Routes>
            <Route index element={<Dashboard/>} />
            <Route path="ordenes" element={<Ordenes/>} />
            <Route path="ordenes/:id" element={<OrdenDetalle/>} />

            <Route path="productos" element={<Productos/>} />
            <Route path="productos/nuevo" element={<ProductoNuevo/>} />
            <Route path="productos/editar/:codigo" element={<ProductoEditar/>} />
            <Route path="productos/criticos" element={<ProductosCriticos/>} />

            <Route path="reportes" element={<Reportes/>} />
            <Route path="perfil" element={<Perfil/>} />
          </Routes>
        </div>
      </section>
    </div>
  );
}

// ========= Dashboard =========
function Dashboard(){
  const prods = listP();
  const ords = listOrders();
  const ingresos = ords.filter(o=>o.status==="CONFIRMADA")
                       .reduce((s,o)=>s+o.total,0);
  const crit = prods.filter(p=>p.stock<50).length;

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi"><h3>Productos</h3><p className="kpi-value">{prods.length}</p></div>
        <div className="kpi"><h3>Órdenes</h3><p className="kpi-value">{ords.length}</p></div>
        <div className="kpi"><h3>Ingresos</h3><p className="kpi-value">${ingresos.toLocaleString("es-CL")}</p></div>
        <div className="kpi"><h3>Críticos</h3><p className="kpi-value">{crit}</p></div>
      </div>
      <div className="panel"><h2>Resumen</h2><p>Usa el menú lateral para gestionar productos y órdenes.</p></div>
    </>
  );
}

// ========= Órdenes =========
function Ordenes(){
  const [data, setData] = useState(listOrders());
  useEffect(()=>{
    const sync = ()=> setData(listOrders());
    window.addEventListener("orders:changed", sync);
    return ()=> window.removeEventListener("orders:changed", sync);
  },[]);

  return (
    <div className="panel">
      <h2>Órdenes</h2>
      <table className="table">
        <thead><tr><th>ID</th><th>Fecha</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {data.map(o=>(
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>${o.total.toLocaleString("es-CL")}</td>
              <td>{o.status}</td>
              <td><Link className="btn" to={`../ordenes/${o.id}`}>Ver</Link></td>
            </tr>
          ))}
          {!data.length && <tr><td colSpan="5">Sin órdenes</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function OrdenDetalle(){
  const { id } = useParams();
  const o = getOrder(id);
  if (!o) return <div className="panel"><h2>Orden no encontrada</h2></div>;

  return (
    <div className="panel">
      <h2>Orden {o.id}</h2>
      <p><b>Estado:</b> {o.status}</p>
      <p><b>Cliente:</b> {o.comprador?.nombre} ({o.comprador?.correo})</p>
      <ul>
        {o.items.map((it,i)=>(<li key={i}>{it.nombre} x{it.cantidad} — ${ (it.precio*it.cantidad).toLocaleString("es-CL") }</li>))}
      </ul>
      <p className="precio"><b>Total:</b> ${o.total.toLocaleString("es-CL")}</p>
      {o.status !== "ANULADA" && (
        <button className="btn-outline" onClick={()=>{ cancelOrder(o.id); alert("Orden anulada"); window.history.back(); }}>Anular</button>
      )}
    </div>
  );
}

// ========= Productos =========
function Productos(){
  const [rows, setRows] = useState(listP());
  useEffect(()=>{
    const sync=()=>setRows(listP());
    window.addEventListener("products:changed", sync);
    return ()=> window.removeEventListener("products:changed", sync);
  },[]);

  const del = (c)=>{
    if(confirm("¿Eliminar producto?")) removeP(c);
  };

  return (
    <div className="panel">
      <h2>Productos</h2>
      <Link to="../productos/nuevo" className="btn">+ Nuevo</Link>
      <table className="table mt-12">
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {rows.map(p=>(
            <tr key={p.codigo}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio.toLocaleString("es-CL")}</td>
              <td>{p.stock}</td>
              <td>
                <Link className="btn" to={`../productos/editar/${p.codigo}`}>Editar</Link>
                <button className="btn-outline" onClick={()=>del(p.codigo)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="6">Sin productos</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function ProductoNuevo(){
  const navigate = useNavigate();
  const [p, setP] = useState({codigo:"",nombre:"",categoria:"",precio:"",stock:"",descripcion:"",imagen:""});
  const ch = e => setP({...p,[e.target.name]:e.target.value});
  const submit = e => {
    e.preventDefault();
    createP({...p, precio:Number(p.precio), stock:Number(p.stock)});
    alert("Creado"); navigate("/admin/productos");
  };
  return (
    <div className="panel">
      <h2>Nuevo producto</h2>
      <form onSubmit={submit} className="form">
        <label>Código<input name="codigo" required onChange={ch}/></label>
        <label>Nombre<input name="nombre" required onChange={ch}/></label>
        <label>Categoría<input name="categoria" required onChange={ch}/></label>
        <label>Precio<input type="number" name="precio" required onChange={ch}/></label>
        <label>Stock<input type="number" name="stock" required onChange={ch}/></label>
        <label>Descripción<textarea name="descripcion" onChange={ch}/></label>
        <label>Imagen<input name="imagen" onChange={ch}/></label>
        <button className="btn">Guardar</button>
      </form>
    </div>
  );
}

function ProductoEditar(){
  const { codigo } = useParams();
  const navigate = useNavigate();
  const base = getByCode(codigo);
  const [p, setP] = useState(base);
  useEffect(()=>{ if(!base){ alert("No encontrado"); navigate("/admin/productos"); }},[]);
  if(!p) return null;
  const ch = e => setP({...p,[e.target.name]:e.target.value});
  const submit = e => { e.preventDefault(); updateP({...p, precio:Number(p.precio), stock:Number(p.stock)}); alert("Actualizado"); navigate("/admin/productos"); };
  return (
    <div className="panel">
      <h2>Editar {p.codigo}</h2>
      <form onSubmit={submit} className="form">
        <label>Código<input value={p.codigo} disabled/></label>
        <label>Nombre<input name="nombre" value={p.nombre} onChange={ch}/></label>
        <label>Categoría<input name="categoria" value={p.categoria} onChange={ch}/></label>
        <label>Precio<input type="number" name="precio" value={p.precio} onChange={ch}/></label>
        <label>Stock<input type="number" name="stock" value={p.stock} onChange={ch}/></label>
        <label>Descripción<textarea name="descripcion" value={p.descripcion} onChange={ch}/></label>
        <label>Imagen<input name="imagen" value={p.imagen} onChange={ch}/></label>
        <button className="btn">Actualizar</button>
      </form>
    </div>
  );
}

function ProductosCriticos(){
  const rows = listP().filter(p=> Number(p.stock||0) < 50);
  return (
    <div className="panel">
      <h2>Productos críticos</h2>
      {!rows.length && <p>No hay críticos.</p>}
      <ul>{rows.map(p => <li key={p.codigo}>{p.nombre} — stock {p.stock}</li>)}</ul>
    </div>
  );
}

// ========= Reportes / Perfil =========
function Reportes(){
  const ords = listOrders();
  const ventas = ords.filter(o=>o.status==="CONFIRMADA").length;
  const ingresos = ords.filter(o=>o.status==="CONFIRMADA").reduce((s,o)=>s+o.total,0);
  return (
    <div className="panel">
      <h2>Reportes</h2>
      <p>Total ventas: <b>{ventas}</b></p>
      <p>Ingresos acumulados: <b>${ingresos.toLocaleString("es-CL")}</b></p>
    </div>
  );
}

function Perfil(){
  const u = getSession();
  return (
    <div className="panel">
      <h2>Perfil</h2>
      {u ? <p>Usuario: <b>{u.nombre}</b> — {u.correo}</p> : <p>Sin sesión</p>}
    </div>
  );
}
