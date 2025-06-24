import { Outlet, Link } from 'react-router';
import { useAuth } from '../../lib/hooks/useAuth';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import CartWidget from './CartWidget';

export default function Layout() {
  const { logout } = useAuth();
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">Catálogo</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/articles" className="text-gray-700 hover:text-gray-900">
                  Artículos
                </Link>
                {user && (
                  <Link to="/cart" className="text-gray-700 hover:text-gray-900">
                    Mi Carrito
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <CartWidget />
              </div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user.fullName}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
} 