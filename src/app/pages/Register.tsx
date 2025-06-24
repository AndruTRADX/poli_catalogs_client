import { useForm } from '../../lib/hooks/useForm';
import { useAuth } from '../../lib/hooks/useAuth';
import { RegisterForm } from '../../lib/types/AuthForms';
import { Link } from 'react-router';

export default function Register() {
  const { register, isRegistering, authError } = useAuth();
  const form = useForm(RegisterForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.validate()) {
      const formData = {
        ...form.values,
        cell_phone: parseInt(String(form.values.cell_phone), 10)
      };
      register(formData);
    }
  };

  const handleCellPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    form.handleChange('cell_phone', value);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            type="text"
            id="full_name"
            value={form.values.full_name || ''}
            onChange={(e) => form.handleChange('full_name', e.target.value)}
            onBlur={() => form.handleBlur('full_name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.full_name && form.errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{form.errors.full_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={form.values.email || ''}
            onChange={(e) => form.handleChange('email', e.target.value)}
            onBlur={() => form.handleBlur('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.email && form.errors.email && (
            <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="cell_phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            id="cell_phone"
            value={form.values.cell_phone || ''}
            onChange={handleCellPhoneChange}
            onBlur={() => form.handleBlur('cell_phone')}
            placeholder="Ej: 3001234567"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.cell_phone && form.errors.cell_phone && (
            <p className="mt-1 text-sm text-red-600">{form.errors.cell_phone}</p>
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

        <div>
          <label htmlFor="password_2" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="password_2"
            value={form.values.password_2 || ''}
            onChange={(e) => form.handleChange('password_2', e.target.value)}
            onBlur={() => form.handleBlur('password_2')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.password_2 && form.errors.password_2 && (
            <p className="mt-1 text-sm text-red-600">{form.errors.password_2}</p>
          )}
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {authError instanceof Error 
                ? authError.message 
                : 'Error al registrarse. Verifica que todos los campos sean correctos.'
              }
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isRegistering ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-blue-500 hover:text-blue-600">
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
} 