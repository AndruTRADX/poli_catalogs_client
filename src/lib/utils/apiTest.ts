import agent from '../api/agents';
import type { RegisterFormType, LoginFormType } from '../types/AuthForms';

export const testAPIConnection = async () => {
  try {
    console.log('🔍 Probando conexión con la API...');
    
    await agent.get('/docs');
    console.log('✅ API está respondiendo en:', agent.defaults.baseURL);
    
    return {
      success: true,
      message: 'API conectada correctamente',
      baseURL: agent.defaults.baseURL
    };
  } catch (error) {
    console.error('❌ Error conectando con la API:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'No se puede conectar con la API. Verifica que esté ejecutándose en http://localhost:8000',
          error: error.message
        };
      }
    }
    
    return {
      success: false,
      message: 'Error desconocido al conectar con la API',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const testRegistration = async (testData: RegisterFormType) => {
  try {
    console.log('🧪 Probando registro con datos:', testData);
    
    const response = await agent.post('/auth/register', testData);
    console.log('✅ Registro exitoso:', response.data);
    
    return {
      success: true,
      message: 'Registro de prueba exitoso',
      data: response.data
    };
  } catch (error: unknown) {
    console.error('❌ Error en registro de prueba:', error);
    
    const axiosError = error as { response?: { data?: { detail?: string }, status?: number } };
    
    return {
      success: false,
      message: axiosError.response?.data?.detail || (error instanceof Error ? error.message : 'Error desconocido'),
      status: axiosError.response?.status,
      data: axiosError.response?.data
    };
  }
};

export const testLogin = async (testData: LoginFormType) => {
  try {
    console.log('🧪 Probando login con datos:', testData);
    
    const response = await agent.post('/auth/login', testData);
    console.log('✅ Login exitoso:', response.data);
    
    return {
      success: true,
      message: 'Login de prueba exitoso',
      data: response.data
    };
  } catch (error: unknown) {
    console.error('❌ Error en login de prueba:', error);
    
    const axiosError = error as { response?: { data?: { detail?: string }, status?: number } };
    
    return {
      success: false,
      message: axiosError.response?.data?.detail || (error instanceof Error ? error.message : 'Error desconocido'),
      status: axiosError.response?.status,
      data: axiosError.response?.data
    };
  }
}; 