import axios from 'axios';

// URL base de tu backend (puedes moverla a un .env o a constants.ts)
const BASE_URL = 'http://localhost:15050'; // ⚡ cámbialo por tu backend real

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
    return response.data;
  } catch (error: any) {
    console.error('❌ Error en postConcatenate:', error);
    throw error;
  }
};
