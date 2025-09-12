import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL base de tu backend (puedes moverla a un .env o a constants.ts)
const BASE_URL = 'http://localhost:15050'; // ⚡ cámbialo por tu backend real

const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('my-key', value);
    console.log('✅ Data guardada en AsyncStorage:', value);
  } catch (e) {
    console.error('❌ Error guardando en AsyncStorage:', e);
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('my-key');
    if (value !== null) {
      console.log('📦 Data obtenida de AsyncStorage:', value);
      return value;
    }
  } catch (e) {
    console.error('❌ Error leyendo AsyncStorage:', e);
  }
};


export interface ConcatenateRequest {
  parametro1: string;
  parametro2: string;
  parametro3: string;
  parametro4: string;
  parametro5: string;
}

export interface ConcatenateResponse {
  result: string;
}

/**
 * Acción POST para concatenar strings
 */
export const postConcatenate = async (
  data: ConcatenateRequest
): Promise<string> => {
  try {

    
    const response = await axios.post<string>(
      `${BASE_URL}/api/v1/test?parametro1=${data.parametro1}&parametro2=${data.parametro2}&parametro3=${data.parametro3}&parametro4=${data.parametro4}&parametro5=${data.parametro5}`
    );
  

    const result = response.data;

    // Guardar en AsyncStorage
    await storeData(result);

    return response.data;
  } catch (error: any) {
    console.error('❌ Error en postConcatenate:', error);
    throw error;
  }
};
