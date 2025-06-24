import { useState } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { testAPIConnection, testRegistration, testLogin } from '../../lib/utils/apiTest';

interface TestResult {
  success: boolean;
  message: string;
  status?: number;
  data?: unknown;
  error?: string;
}

export default function AuthTest() {
  const { user, isLoading, authError } = useAuth();
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    const result = await testAPIConnection();
    setTestResults(result);
    setIsTesting(false);
  };

  const handleTestRegistration = async () => {
    setIsTesting(true);
    const testData = {
      full_name: "Usuario de Prueba",
      email: `test${Date.now()}@example.com`,
      cell_phone: 3001234567,
      password: "testpassword123",
      password_2: "testpassword123",
      role: "shopper"
    };
    const result = await testRegistration(testData);
    setTestResults(result);
    setIsTesting(false);
  };

  const handleTestLogin = async () => {
    setIsTesting(true);
    const testData = {
      username: "test@example.com", // Usa un email que hayas registrado
      password: "testpassword123"
    };
    const result = await testLogin(testData);
    setTestResults(result);
    setIsTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Estado de Autenticación</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Información de Debug:</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Loading:</strong> {isLoading ? 'Sí' : 'No'}</p>
          <p><strong>Usuario autenticado:</strong> {user ? 'Sí' : 'No'}</p>
          {user && (
            <>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              <p><strong>Nombre:</strong> {user.fullName}</p>
            </>
          )}
          {authError && (
            <div className="bg-red-100 p-2 rounded">
              <p><strong>Error:</strong> {authError instanceof Error ? authError.message : 'Error desconocido'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">Pruebas de API:</h3>
        <div className="space-x-4">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isTesting ? 'Probando...' : 'Probar Conexión'}
          </button>
          <button
            onClick={handleTestRegistration}
            disabled={isTesting}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isTesting ? 'Probando...' : 'Probar Registro'}
          </button>
          <button
            onClick={handleTestLogin}
            disabled={isTesting}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isTesting ? 'Probando...' : 'Probar Login'}
          </button>
        </div>
        
        {testResults && (
          <div className={`mt-4 p-3 rounded ${testResults.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-semibold">{testResults.success ? '✅' : '❌'} {testResults.message}</p>
            {testResults.status && <p><strong>Status:</strong> {testResults.status}</p>}
            {testResults.data !== undefined && (
              <details className="mt-2">
                <summary className="cursor-pointer">Ver detalles</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Instrucciones de Prueba:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Asegúrate de que tu API de Python esté ejecutándose en <code>http://localhost:8000</code></li>
          <li>Usa el botón "Probar Conexión" para verificar que la API responde</li>
          <li>Usa el botón "Probar Registro" para crear un usuario de prueba</li>
          <li>Usa el botón "Probar Login" para verificar el login (usa las credenciales del registro)</li>
          <li>Ve a la página de registro e intenta crear una cuenta</li>
          <li>Verifica en la consola del navegador los logs de debug</li>
        </ol>
      </div>
    </div>
  );
} 