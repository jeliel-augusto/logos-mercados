import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

interface ViaCEPResponse {
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function UserEntry() {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const handleCepChange = (text: string) => {
    const formatted = formatCEP(text);
    setCep(formatted);
    setError('');
  };

  const searchCEP = async () => {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setError('CEP inválido. Digite 8 números.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        setError('CEP não encontrado.');
        return;
      }

      if (!data.localidade || !data.uf) {
        setError('Não foi possível obter a localização.');
        return;
      }

      // Salvar no AsyncStorage
      await AsyncStorage.setItem('user_city', data.localidade);
      await AsyncStorage.setItem('user_uf', data.uf);

      // Navegar para a tela Home
      router.replace('/home');
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <View className="w-full max-w-sm gap-6">
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-foreground">Bem-vindo!</Text>
          <Text className="text-center text-muted-foreground">Digite seu CEP para começarmos</Text>
        </View>

        <View className="gap-4">
          <View className="gap-4">
            <Text className="text-sm font-medium text-foreground">CEP</Text>
            <Input
              value={cep}
              onChangeText={handleCepChange}
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={9}
              className="text-center text-lg"
              editable={!loading}
            />
          </View>

          {error.length > 0 ? (
            <Text className="text-center text-sm text-destructive">{error}</Text>
          ) : null}

          <Button
            onPress={searchCEP}
            disabled={loading || cep.replace(/\D/g, '').length !== 8}
            className="my-6 w-full">
            <Text className="font-semibold">{loading ? 'Buscando...' : 'Iniciar'}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
