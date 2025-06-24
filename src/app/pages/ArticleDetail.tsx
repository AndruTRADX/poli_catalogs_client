import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useArticles } from '../../lib/hooks/useArticles';
import { useAuth } from '../../lib/hooks/useAuth';
import { useCart } from '../../lib/hooks/useCart';
import type { CartItem } from '../../lib/types/Cart';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, isPendingArticle, deleteArticle } = useArticles(id);
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isPendingArticle) {
    return <div className="text-center">Cargando artículo...</div>;
  }

  if (!article) {
    return <div className="text-center">Artículo no encontrado</div>;
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      try {
        await deleteArticle.mutateAsync(id!);
        navigate('/articles');
      } catch (error) {
        console.error('Error al eliminar el artículo:', error);
      }
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    if (quantity > article.stock) {
      alert('No hay suficiente stock disponible');
      return;
    }

    const cartItem: CartItem = {
      article_id: article.id,
      quantity: quantity
    };

    addToCart.mutate(cartItem);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.name}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{article.name}</h1>
            <span className="text-2xl font-bold text-blue-600">
              ${article.price}
            </span>
          </div>

          <div className="mb-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {article.category}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{article.description}</p>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                Stock disponible: {article.stock}
              </p>
            </div>
            {isAdmin() && (
              <div className="space-x-4">
                <button
                  onClick={() => navigate(`/articles/edit/${id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {/* Sección de compra */}
          {user && article.stock > 0 && (
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Cantidad:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={article.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(article.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  de {article.stock} disponibles
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending || quantity > article.stock}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
                >
                  {addToCart.isPending ? 'Agregando...' : 'Agregar al Carrito'}
                </button>
                <span className="text-lg font-semibold">
                  Total: ${(article.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {!user && (
            <div className="border-t pt-6 text-center">
              <p className="text-gray-600 mb-4">Inicia sesión para agregar este producto al carrito</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Iniciar Sesión
              </button>
            </div>
          )}

          {article.stock === 0 && (
            <div className="border-t pt-6 text-center">
              <p className="text-red-600 font-semibold">Producto agotado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 