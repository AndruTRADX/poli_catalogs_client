import { useForm } from '../../lib/hooks/useForm';
import { RegisterForm } from '../../lib/types/AuthForms';

export default function FormValidationTest() {
  const form = useForm(RegisterForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form values:', form.values);
    console.log('Form errors:', form.errors);
    console.log('Form touched:', form.touched);
    
    if (form.validate()) {
      alert('Formulario válido!');
    } else {
      alert('Formulario inválido!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Prueba de Validación</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input
            type="text"
            value={form.values.full_name || ''}
            onChange={(e) => form.handleChange('full_name', e.target.value)}
            onBlur={() => form.handleBlur('full_name')}
            className={`mt-1 block w-full rounded-md px-3 py-2 ${
              form.touched.full_name && form.errors.full_name 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.full_name && form.errors.full_name && (
            <p className="mt-1 text-sm text-red-600">⚠️ {form.errors.full_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={form.values.email || ''}
            onChange={(e) => form.handleChange('email', e.target.value)}
            onBlur={() => form.handleBlur('email')}
            className={`mt-1 block w-full rounded-md px-3 py-2 ${
              form.touched.email && form.errors.email 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.email && form.errors.email && (
            <p className="mt-1 text-sm text-red-600">⚠️ {form.errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            value={form.values.cell_phone || ''}
            onChange={(e) => form.handleChange('cell_phone', e.target.value.replace(/\D/g, ''))}
            onBlur={() => form.handleBlur('cell_phone')}
            className={`mt-1 block w-full rounded-md px-3 py-2 ${
              form.touched.cell_phone && form.errors.cell_phone 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.cell_phone && form.errors.cell_phone && (
            <p className="mt-1 text-sm text-red-600">⚠️ {form.errors.cell_phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={form.values.password || ''}
            onChange={(e) => form.handleChange('password', e.target.value)}
            onBlur={() => form.handleBlur('password')}
            className={`mt-1 block w-full rounded-md px-3 py-2 ${
              form.touched.password && form.errors.password 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.password && form.errors.password && (
            <p className="mt-1 text-sm text-red-600">⚠️ {form.errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={form.values.password_2 || ''}
            onChange={(e) => form.handleChange('password_2', e.target.value)}
            onBlur={() => form.handleBlur('password_2')}
            className={`mt-1 block w-full rounded-md px-3 py-2 ${
              form.touched.password_2 && form.errors.password_2 
                ? 'border-red-300' 
                : 'border-gray-300'
            }`}
          />
          {form.touched.password_2 && form.errors.password_2 && (
            <p className="mt-1 text-sm text-red-600">⚠️ {form.errors.password_2}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Probar Validación
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h4 className="font-medium mb-2">Estado del Formulario:</h4>
        <div className="text-xs space-y-1">
          <p><strong>Valores:</strong> {JSON.stringify(form.values, null, 2)}</p>
          <p><strong>Errores:</strong> {JSON.stringify(form.errors, null, 2)}</p>
          <p><strong>Touched:</strong> {JSON.stringify(form.touched, null, 2)}</p>
        </div>
      </div>
    </div>
  );
} 