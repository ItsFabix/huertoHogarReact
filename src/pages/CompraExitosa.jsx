import { Link } from "react-router-dom";
export default function CompraExitosa(){
  return (
    <main className="container">
      <h1>¡Compra exitosa! ✅</h1>
      <p>Gracias por tu compra. Te enviaremos un correo con el detalle.</p>
      <Link className="btn" to="/productos">Seguir comprando</Link>
    </main>
  );
}
