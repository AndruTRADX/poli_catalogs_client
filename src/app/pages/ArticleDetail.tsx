import { useParams, useNavigate } from 'react-router';
import { useArticles } from '../../lib/hooks/useArticles';
import { useAuth } from '../../lib/hooks/useAuth';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, isPendingArticle, deleteArticle } = useArticles(id);
  const { isAdmin } = useAuth();

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

          <div className="flex justify-between items-center">
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
        </div>
      </div>
    </div>
  );
} 