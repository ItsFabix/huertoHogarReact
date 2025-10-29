import { PRODUCTS } from "../data/products";

const LS_KEY_CART = "carrito";

// ---- helpers de storage ----
export function getCarrito(){
  try {
    const raw = localStorage.getItem(LS_KEY_CART);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
export function setCarrito(arr){
  localStorage.setItem(LS_KEY_CART, JSON.stringify(Array.isArray(arr) ? arr : []));
  // avisa al header y otras vistas
  window.dispatchEvent(new Event("cart:change"));
}
export function getCartCount(){
  return getCarrito().reduce((s,i)=> s + (i.cantidad||0), 0);
}

// ---- acciones ----
export function addToCartByCode(codigo){
  const p = PRODUCTS.find(x => x.codigo === codigo);
  if(!p) return;
  const cart = getCarrito();
  const i = cart.findIndex(x => x.codigo === codigo);
  if (i >= 0) cart[i].cantidad += 1;
  else cart.push({ codigo: p.codigo, nombre: p.nombre, precio: p.precio, cantidad: 1 });
  setCarrito(cart);
}

export function incAt(index){
  const c = getCarrito();
  if (!c[index]) return;
  c[index].cantidad += 1;
  setCarrito(c);
}
export function decAt(index){
  const c = getCarrito();
  if (!c[index]) return;
  c[index].cantidad -= 1;
  if (c[index].cantidad <= 0) c.splice(index,1);
  setCarrito(c);
}
export function delAt(index){
  const c = getCarrito();
  c.splice(index,1);
  setCarrito(c);
}
