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
      register(form.values);
    }
  };

  const handleCellPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    form.handleChange('cell_phone', value);
  };

  const handleFieldChange = (field: keyof typeof form.values, value: string) => {
    form.handleChange(field, value);
  };

  const handleFieldBlur = (field: keyof typeof form.values) => {
    form.handleBlur(field);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="full_name"
            value={form.values.full_name || ''}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
            onBlur={() => handleFieldBlur('full_name')}
            placeholder="Tu nombre completo"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 ${
              form.touched.full_name && form.errors.full_name 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.full_name && form.errors.full_name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.errors.full_name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={form.values.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            placeholder="tu@email.com"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 ${
              form.touched.email && form.errors.email 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.email && form.errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cell_phone" className="block text-sm font-medium text-gray-700">
            Teléfono *
          </label>
          <input
            type="tel"
            id="cell_phone"
            value={form.values.cell_phone || ''}
            onChange={handleCellPhoneChange}
            onBlur={() => handleFieldBlur('cell_phone')}
            placeholder="Ej: 3001234567"
            maxLength={15}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 ${
              form.touched.cell_phone && form.errors.cell_phone 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.cell_phone && form.errors.cell_phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.errors.cell_phone}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Solo números, sin espacios ni caracteres especiales
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña *
          </label>
          <input
            type="password"
            id="password"
            value={form.values.password || ''}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            onBlur={() => handleFieldBlur('password')}
            placeholder="Mínimo 6 caracteres"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 ${
              form.touched.password && form.errors.password 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.password && form.errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password_2" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            id="password_2"
            value={form.values.password_2 || ''}
            onChange={(e) => handleFieldChange('password_2', e.target.value)}
            onBlur={() => handleFieldBlur('password_2')}
            placeholder="Repite tu contraseña"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 ${
              form.touched.password_2 && form.errors.password_2 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.password_2 && form.errors.password_2 && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.errors.password_2}
            </p>
          )}
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 flex items-center">
              <span className="mr-1">❌</span>
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
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 font-medium"
        >
          {isRegistering ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Registrando...</span>
            </span>
          ) : (
            'Registrarse'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
          Inicia Sesión
        </Link>
      </p>
    </div>
  );
} 