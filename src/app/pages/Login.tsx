import { useForm } from '../../lib/hooks/useForm';
import { useAuth } from '../../lib/hooks/useAuth';
import { LoginForm } from '../../lib/types/AuthForms';
import { Link } from 'react-router';

export default function Login() {
  const { login, isLoggingIn, authError } = useAuth();
  const form = useForm(LoginForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.validate()) {
      login(form.values);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="username"
            value={form.values.username || ''}
            onChange={(e) => form.handleChange('username', e.target.value)}
            onBlur={() => form.handleBlur('username')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.username && form.errors.username && (
            <p className="mt-1 text-sm text-red-600">{form.errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={form.values.password || ''}
            onChange={(e) => form.handleChange('password', e.target.value)}
            onBlur={() => form.handleBlur('password')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.password && form.errors.password && (
            <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>
          )}
        </div>

        {authError && (
          <p className="text-sm text-red-600">
            {authError instanceof Error ? authError.message : 'Error al iniciar sesión'}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="text-blue-500 hover:text-blue-600">
          Regístrate
        </Link>
      </p>
    </div>
  );
} 