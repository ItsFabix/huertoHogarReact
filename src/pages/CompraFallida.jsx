// src/pages/CompraFallida.jsx
import { Link } from "react-router-dom";
export default function CompraFallida(){
  return (
    <main className="container">
      <h1>Pago rechazado ❌</h1>
      <p>Ocurrió un problema al procesar el pago. Inténtalo nuevamente.</p>
      <Link className="btn" to="/checkout">Reintentar</Link>
    </main>
  );
}
