// ============================
// src/data/orders.js
// ============================
// Gestión de órdenes de compra en LocalStorage

const LS_KEY_ORDERS = "ORDERS";

/** Lee todas las órdenes guardadas */
export function listOrders() {
  try {
    const raw = localStorage.getItem(LS_KEY_ORDERS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Guarda todas las órdenes */
export function saveOrders(arr) {
  localStorage.setItem(LS_KEY_ORDERS, JSON.stringify(Array.isArray(arr) ? arr : []));
}

/** Genera ID incremental simple */
function nextId() {
  const list = listOrders();
  const last = list.length ? Math.max(...list.map(o => Number(o.id) || 0)) : 0;
  return String(last + 1);
}

/** Agrega nueva orden */
export function addOrder({ cliente, items, total }) {
  const orden = {
    id: nextId(),
    fecha: new Date().toISOString(),
    cliente,
    items,
    total
  };
  const list = listOrders();
  list.push(orden);
  saveOrders(list);
  return orden;
}

/** Obtiene una orden específica por ID */
export function getOrder(id) {
  return listOrders().find(o => o.id === String(id)) || null;
}

/** Cancela (elimina) una orden por ID */
export function cancelOrder(id) {
  const list = listOrders().filter(o => o.id !== String(id));
  saveOrders(list);
}
