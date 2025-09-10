import { SafeAreaView, StatusBar, Platform, View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="flex flex-1 bg-[#FFF7D3]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? '#FFF7D3' : undefined}
      />
      <View className="flex flex-1">{children}</View>
    </SafeAreaView>
  );
};
