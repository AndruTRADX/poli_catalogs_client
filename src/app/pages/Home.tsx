import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Bienvenido al Catálogo
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Explora nuestra colección de artículos
      </p>
      <Link
        to="/articles"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Ver Artículos
      </Link>
    </div>
  );
} 