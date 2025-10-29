import { Link, useNavigate, useParams } from "react-router-dom";
import { getByCode, list } from "../data/catalog";
import { addToCart } from "../utils/cart";

export default function DetalleProducto(){
  const { codigo } = useParams();
  const nav = useNavigate();

  const prod = getByCode(codigo);

  if(!prod){
    return (
      <main className="container">
        <h1>Producto no encontrado</h1>
        <p>El cÃ³digo solicitado no existe en el catÃ¡logo.</p>
        <Link className="btn" to="/productos">Volver a productos</Link>
      </main>
    );
  }

  const handleAdd = ()=>{
    addToCart(prod);
  };

  return (
    <main className="container detail">
      <button className="btn-outline btn-volver" onClick={()=> nav(-1)}>â† Volver</button>

      <section className="detail-box">
        <div className="detail-img">
          <img className="detail-img-el" src={prod.imagen || "/img/productos/placeholder.jpg"} alt={prod.nombre} />
        </div>
        <div className="detail-info">
          <h1>{prod.nombre}</h1>
          <p className="precio">${Number(prod.precio).toLocaleString("es-CL")}</p>
          <p className="cat">{prod.categoria}</p>
          {prod.descripcion && <p className="mt-8">{prod.descripcion}</p>}
          {typeof prod.stock === "number" && <p className="text-muted">Stock disponible: {prod.stock}</p>}
          <div className="acciones mt-12">
            <button className="btn" onClick={handleAdd}>Añadir al carrito</button>
            <Link className="btn-outline" to="/productos">Ver más productos</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

