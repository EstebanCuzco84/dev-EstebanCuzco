import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export interface Pelicula{
    name: string;
    url: string;
}

export interface PokeRequest {
  contador: string;
  siguiente: string;
  anterior: string;
  arrayPeliculas: Pelicula[];
}

export default function App() {
    const [peliuculas, setMoves] = useState<Pelicula[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
    // ⚠️ IMPORTANTE:
    // Si tu API está en local, cambia la URL:
    // Android emulator: http://10.0.2.2:3000/...
    // iOS simulator: http://localhost:3000/...
    // Dispositivo real: http://TU-IP:3000/...
    fetch("http://localhost:15050/api/v2/move")
      .then((res) => res.json())
      .then((data: PokeRequest) => {
        setMoves(data.arrayPeliculas);
        console.log('DATOS DE PRUEBAS: '+data);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <ActivityIndicator size="large" color="blue" />;
  }

    return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={peliuculas}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            {item.name.toUpperCase()}
          </Text>
        )}
      />
    </View>
  );
}