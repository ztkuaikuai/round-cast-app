import { Container } from 'components/Container'
import React from 'react'
import { StatusBar, View, Platform } from 'react-native'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={Platform.OS === 'android' ? '#FFF7D3' : undefined}
        />
        <View className='flex flex-1'>
          {children}
        </View>
    </Container>
  )
}

export default Layout