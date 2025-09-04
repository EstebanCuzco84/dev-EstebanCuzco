import { Formik } from 'formik';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as yup from 'yup';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ConcatenateRequest, postConcatenate } from '../service/consumoService';

const validationSchema = yup.object().shape({
  parametro1: yup.string().required('Campo 1 es requerido').trim().min(1, 'No puede estar vacío'),
  parametro2: yup.string().required('Campo 2 es requerido').trim().min(1, 'No puede estar vacío'),
  parametro3: yup.string().required('Campo 3 es requerido').trim().min(1, 'No puede estar vacío'),
  parametro4: yup.string().required('Campo 4 es requerido').trim().min(1, 'No puede estar vacío'),
  parametro5: yup.string().required('Campo 5 es requerido').trim().min(1, 'No puede estar vacío'),
});

export default function ConsumeScreen() {
    const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Mutation para enviar datos al backend
/*  const concatenateMutation = useMutation({
    mutationFn: async (data: ConcatenateRequest) => {
      const response = await axios.post(`${BACKEND_URL}/api/v1/test`, data);
      return response.data;
    },
    onSuccess: (data) => {
      setResult(data.result || JSON.stringify(data));
      // Guardar resultado offline
      offlineStorage.setItem('last_concatenation', {
        data,
        timestamp: new Date().toISOString(),
      });
    },
    onError: async (error) => {
      console.error('Error:', error);
      // Intentar cargar desde cache offline
      const cachedData = await offlineStorage.getItem('last_concatenation');
      if (cachedData) {
        Alert.alert(
          'Sin conexión',
          `No se pudo conectar al servidor. Mostrando último resultado guardado del ${new Date(cachedData.timestamp).toLocaleDateString()}`,
          [{ text: 'OK', onPress: () => setResult(cachedData.data.result || JSON.stringify(cachedData.data)) }]
        );
      } else {
        Alert.alert('Error', 'No se pudo conectar al servidor y no hay datos offline disponibles.');
      }
    },
  });
*/
  const handleSubmit = async (values: ConcatenateRequest) => {
//    concatenateMutation.mutate(values);
console.log('Submitting', values);
    try {
      setLoading(true);
      const response = await postConcatenate(values);
      console.log('Response', response);
    setModalVisible(true); 
      setResult(response);
    } catch (err) {
      console.log('Error', 'No se pudo conectar con el servidor');
    setModalVisible(false); 
    } finally {
      setLoading(false);

    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>Concatenador de Strings</ThemedText>

        <Formik
          initialValues={{
            parametro1: '',
            parametro2: '',
            parametro3: '',
            parametro4: '',
            parametro5: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {[1, 2, 3, 4, 5].map((num) => {
                const fieldName = `parametro${num}` as keyof ConcatenateRequest;
                return (
                  <View key={num} style={styles.inputContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      Campo {num}:
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          borderColor: colors.text,
                          color: colors.text,
                          backgroundColor: colorScheme === 'dark' ? '#333' : '#fff'
                        }
                      ]}
                      onChangeText={handleChange(fieldName)}
                      onBlur={handleBlur(fieldName)}
                      value={values[fieldName]}
                      placeholder={`Ingresa el valor ${num}`}
                      placeholderTextColor={colors.text + '80'}
                    />
                    {touched[fieldName] && errors[fieldName] && (
                      <Text style={styles.errorText}>{errors[fieldName]}</Text>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint }]}
                onPress={() => handleSubmit()}
                disabled={false}
              >
                {loading  ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Concatenar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {result ? (
          <View style={[styles.resultContainer, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
            <ThemedText style={styles.resultTitle}>Resultado:</ThemedText>
            <ThemedText style={styles.resultText}>{result}</ThemedText>
          </View>
        ) : null}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resultado</Text>
            <Text style={styles.modalText}>{result}</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.tint, marginTop: 20 }]}
                onPress={() => setModalVisible(false)}
            >
                <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  width: '80%',
  padding: 20,
  borderRadius: 10,
  backgroundColor: '#fff',
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalText: {
  fontSize: 16,
  textAlign: 'center',
},

});