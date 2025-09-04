import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


interface Move {
  name: string;
  url: string;
}

interface MoveDetails {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  type: {
    name: string;
  };
  damage_class: {
    name: string;
  };
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
    };
  }>;
}

interface MovesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Move[];
}

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function MovementsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedMove, setSelectedMove] = useState<MoveDetails | null>(null);
  const [page, setPage] = useState(0);
  const limit = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [movesData, setMovesData] = useState<MoveDetails[] | null>(null);


  /*const {
    data: movesData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['pokemon-moves', page],
    queryFn: async () => {
      try {
        const offset = page * limit;
        const response = await axios.get<MovesResponse>(
          `https://pokeapi.co/api/v2/move?limit=${limit}&offset=${offset}`
        );

        // Obtener detalles de cada movimiento
        const moveDetailsPromises = response.data.results.map(async (move) => {
          const moveResponse = await axios.get<MoveDetails>(move.url);
          return moveResponse.data;
        });

        const moveDetails = await Promise.all(moveDetailsPromises);

        // Guardar en cache offline
        await offlineStorage.setItem(`pokemon-moves-${page}`, {
          data: moveDetails,
          timestamp: new Date().toISOString(),
        });

        return moveDetails;
      } catch (error) {
        // Intentar cargar desde cache offline
        const cachedData = await offlineStorage.getItem(`pokemon-moves-${page}`);
        if (cachedData) {
          Alert.alert('Sin conexión', 'Mostrando datos guardados offline');
          return cachedData.data;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });*/


  const refetch = async () => {
    setIsLoading(true);
    setError(null); 
  }

  const handleLoadMoves = () => {
    //refetch();
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };

  const renderMoveItem = ({ item }: { item: MoveDetails }) => (
    <TouchableOpacity
      style={[
        styles.moveItem,
        {
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colors.text + '20'
        }
      ]}
      onPress={() => setSelectedMove(item)}
    >
      <View style={styles.moveHeader}>
        <ThemedText style={styles.moveName}>{item.name}</ThemedText>
        <View style={[styles.typeTag, { backgroundColor: getTypeColor(item.type.name) }]}>
          <Text style={styles.typeText}>{item.type.name}</Text>
        </View>
      </View>

      <View style={styles.moveStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.text }]}>Poder</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.power || 'N/A'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.text }]}>Precisión</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.accuracy || 'N/A'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.text }]}>PP</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.pp}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return typeColors[type] || '#68A090';
  };

  if (error && !movesData) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>
            Error al cargar movimientos
          </ThemedText>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={() => console.log('regresd')}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Movimientos Pokémon</ThemedText>
        <TouchableOpacity
          style={[styles.loadButton, { backgroundColor: colors.tint }]}
          onPress={handleLoadMoves}
          disabled={isLoading}
        >
          {isLoading  ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loadButtonText}>Cargar Movimientos</Text>
          )}
        </TouchableOpacity>
      </View>

      {movesData && (
        <>
          <FlatList
            data={movesData}
            renderItem={renderMoveItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={refetch}
                tintColor={colors.tint}
              />
            }
            numColumns={isTablet ? 2 : 1}
            columnWrapperStyle={isTablet ? styles.row : undefined}
          />

          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                {
                  backgroundColor: page > 0 ? colors.tint : colors.text + '30',
                }
              ]}
              onPress={handlePreviousPage}
              disabled={page === 0}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>

            <ThemedText style={styles.pageIndicator}>
              Página {page + 1}
            </ThemedText>

            <TouchableOpacity
              style={[styles.paginationButton, { backgroundColor: colors.tint }]}
              onPress={handleNextPage}
            >
              <Text style={styles.paginationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal de detalles (simplificado para este ejemplo) */}
      {selectedMove && (
        <View style={styles.modal}>
          <View style={[styles.modalContent, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
            <ThemedText style={styles.modalTitle}>{selectedMove.name}</ThemedText>
            <ThemedText style={styles.modalDescription}>
              {selectedMove.effect_entries.find(entry => entry.language.name === 'en')?.effect || 'Sin descripción disponible'}
            </ThemedText>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => setSelectedMove(null)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loadButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  moveItem: {
    margin: 5,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    flex: isTablet ? 0.48 : 1,
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  moveName: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  moveStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-around',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
