import { useCart } from '../../lib/hooks/useCart';
import { useAuth } from '../../lib/hooks/useAuth';
import { useNavigate } from 'react-router';
import type { CartItemResponse } from '../../lib/types/Cart';

export default function Cart() {
  const { cart, isPendingCart, removeFromCart, clearCart, purchaseCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      const result = await purchaseCart.mutateAsync();
      alert(`¡Compra exitosa! Total: $${result.precio_total}`);
      navigate('/articles');
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      alert('Error al realizar la compra. Verifica el stock de los productos.');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
        <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tu carrito.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (isPendingCart) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando carrito...</p>
      </div>
    );
  }

  const itemCount = cart?.items?.length || 0;
  const totalPrice = cart?.total_price || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Carrito</h1>
        {itemCount > 0 && (
          <button
            onClick={() => clearCart.mutate()}
            disabled={clearCart.isPending}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {clearCart.isPending ? 'Vaciando...' : 'Vaciar Carrito'}
          </button>
        )}
      </div>

      {itemCount === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega algunos productos para comenzar a comprar.</p>
          <button
            onClick={() => navigate('/articles')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Ver Productos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Lista de productos */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Productos ({itemCount})</h2>
              <div className="space-y-4">
                {cart?.items?.map((item: CartItemResponse) => (
                  <div key={item.article_id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Cantidad: {item.quantity} | Precio unitario: ${item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">${item.total}</span>
                      <button
                        onClick={() => removeFromCart.mutate(item.article_id)}
                        disabled={removeFromCart.isPending}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {removeFromCart.isPending ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Resumen de Compra</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePurchase}
                  disabled={purchaseCart.isPending}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
                >
                  {purchaseCart.isPending ? 'Procesando Compra...' : 'Realizar Compra'}
                </button>
                <button
                  onClick={() => navigate('/articles')}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 