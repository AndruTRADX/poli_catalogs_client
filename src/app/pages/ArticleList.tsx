import { Link } from 'react-router';
import { useArticles } from '../../lib/hooks/useArticles';
import { useAuth } from '../../lib/hooks/useAuth';
import type { Article } from '../../lib/types/Article';

export default function ArticleList() {
  const { articles, isPendingArticles } = useArticles();
  const { isAdmin } = useAuth();

  if (isPendingArticles) {
    return <div className="text-center">Cargando artículos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Artículos</h2>
        {isAdmin() && (
          <Link
            to="/articles/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Nuevo Artículo
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map((article: Article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{article.name}</h3>
              <p className="text-gray-600 mb-2">{article.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${article.price}</span>
                <Link
                  to={`/articles/${article.id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles?.length === 0 && (
        <p className="text-center text-gray-600">No hay artículos disponibles</p>
      )}
    </div>
  );
} 