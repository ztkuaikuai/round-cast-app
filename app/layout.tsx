import { Container } from 'components/Container'
import React from 'react'
import { StatusBar, View } from 'react-native'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF7D3" />
        <View className='flex flex-1 bg-[#FFF7D3]'>
          {children}
        </View>
    </Container>
  )
}

export default Layout