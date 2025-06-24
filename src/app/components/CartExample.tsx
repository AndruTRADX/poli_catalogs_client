import { useCart } from '../../lib/hooks/useCart';
import { useArticles } from '../../lib/hooks/useArticles';
import type { CartItem, CartItemResponse } from '../../lib/types/Cart';
import type { Article } from '../../lib/types/Article';

export default function CartExample() {
  const { cart, isPendingCart, addToCart, removeFromCart, clearCart, purchaseCart } = useCart();
  const { articles } = useArticles();

  const handleAddToCart = (articleId: string) => {
    const item: CartItem = {
      article_id: articleId,
      quantity: 1,
    };
    addToCart.mutate(item);
  };

  const handlePurchase = async () => {
    try {
      const result = await purchaseCart.mutateAsync();
      alert(`Compra exitosa! Total: $${result.precio_total}`);
    } catch (error) {
      console.error('Error al realizar la compra:', error);
    }
  };

  if (isPendingCart) {
    return <div className="text-center">Cargando carrito...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de artículos disponibles */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Artículos Disponibles</h2>
          <div className="space-y-4">
            {articles?.slice(0, 5).map((article: Article) => (
              <div key={article.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{article.name}</h3>
                <p className="text-gray-600">${article.price}</p>
                <p className="text-sm text-gray-500">Stock: {article.stock}</p>
                <button
                  onClick={() => handleAddToCart(article.id)}
                  disabled={addToCart.isPending}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {addToCart.isPending ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Carrito</h2>
            {cart?.items && cart.items.length > 0 && (
              <button
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {clearCart.isPending ? 'Vaciando...' : 'Vaciar carrito'}
              </button>
            )}
          </div>

          {cart?.items && cart.items.length > 0 ? (
            <div className="space-y-4">
              {cart.items.map((item: CartItemResponse) => (
                <div key={item.article_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        ${item.price} x {item.quantity} = ${item.total}
                      </p>
                    </div>
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
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold">${cart.total_price}</span>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={purchaseCart.isPending}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {purchaseCart.isPending ? 'Procesando compra...' : 'Realizar compra'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Tu carrito está vacío</p>
              <p className="text-sm">Agrega algunos artículos para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 