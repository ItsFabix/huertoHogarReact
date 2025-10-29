// src/components/AdminForm.jsx
import { useEffect, useState } from "react";

export default function AdminForm({ producto, onSave, onClose }) {
  const [form, setForm] = useState({
    codigo: "", nombre: "", categoria: "", precio: "", stock: "",
    descripcion: "", imagen: "", oferta: false
  });

  useEffect(() => {
    if (producto) setForm(producto);
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.codigo || !form.nombre) return alert("Faltan campos obligatorios");
    onSave({
      ...form,
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0
    });
  };

  return (
    <div className="modal-backdrop show" style={{ background:"rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-3">
          <h5>{producto ? "Editar producto" : "Nuevo producto"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-4">
                <label>Código</label>
                <input className="form-control" name="codigo" value={form.codigo} onChange={handleChange} disabled={!!producto}/>
              </div>
              <div className="col-md-8">
                <label>Nombre</label>
                <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange}/>
              </div>
              <div className="col-md-6">
                <label>Categoría</label>
                <input className="form-control" name="categoria" value={form.categoria} onChange={handleChange}/>
              </div>
              <div className="col-md-3">
                <label>Precio</label>
                <input className="form-control" name="precio" type="number" value={form.precio} onChange={handleChange}/>
              </div>
              <div className="col-md-3">
                <label>Stock</label>
                <input className="form-control" name="stock" type="number" value={form.stock} onChange={handleChange}/>
              </div>
              <div className="col-12">
                <label>Descripción</label>
                <textarea className="form-control" name="descripcion" rows={2} value={form.descripcion} onChange={handleChange}/>
              </div>
              <div className="col-md-9">
                <label>URL Imagen</label>
                <input className="form-control" name="imagen" value={form.imagen} onChange={handleChange}/>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="oferta" name="oferta" checked={form.oferta} onChange={handleChange}/>
                  <label className="form-check-label" htmlFor="oferta">Oferta</label>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-success">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
