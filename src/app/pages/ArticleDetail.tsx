import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useArticles } from '../../lib/hooks/useArticles';
import { useAuth } from '../../lib/hooks/useAuth';
import { useCart } from '../../lib/hooks/useCart';
import ProductImage from '../components/ProductImage';
import type { CartItem } from '../../lib/types/Cart';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, isPendingArticle, deleteArticle } = useArticles(id);
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (isPendingArticle) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Artículo no encontrado</h2>
        <p className="text-gray-600 mb-4">El artículo que buscas no existe o ha sido eliminado</p>
        <button
          onClick={() => navigate('/articles')}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Volver a Artículos
        </button>
      </div>
    );
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Imagen del artículo */}
        <div className="relative">
          <ProductImage
            src={article.imageUrl}
            alt={article.name}
            fallbackId={article.id}
            className="w-full h-96 object-cover"
            width={800}
            height={400}
          />
          {article.stock === 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
              Sin Stock
            </div>
          )}
          {article.stock > 0 && article.stock <= 5 && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
              Últimas {article.stock}
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Header con título y precio */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{article.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-semibold">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {article.id}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-blue-600">
                ${article.price}
              </span>
              <div className="text-sm text-gray-500 mt-1">
                Stock: {article.stock} unidades
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{article.description}</p>
          </div>

          {/* Botones de administrador */}
          {isAdmin() && (
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => navigate(`/articles/edit/${id}`)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
              >
                ✏️ Editar Artículo
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold"
              >
                🗑️ Eliminar Artículo
              </button>
            </div>
          )}

          {/* Sección de compra */}
          {user && article.stock > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Agregar al Carrito</h3>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-4">
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
                    className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                  />
                  <span className="text-sm text-gray-500">
                    de {article.stock} disponibles
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending || quantity > article.stock}
                    className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold text-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    {addToCart.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Agregando...</span>
                      </>
                    ) : (
                      <>
                        <span>🛒</span>
                        <span>Agregar al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total:</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${(article.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!user && (
            <div className="border-t pt-8 text-center">
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="text-blue-500 text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Inicia sesión para comprar</h3>
                <p className="text-gray-600 mb-6">Necesitas una cuenta para agregar productos al carrito</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )}

          {article.stock === 0 && (
            <div className="border-t pt-8 text-center">
              <div className="bg-red-50 p-8 rounded-lg">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Producto Agotado</h3>
                <p className="text-red-600">Este producto no está disponible actualmente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 