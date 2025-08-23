import { StatusBar } from 'expo-status-bar';
import { Container } from 'components/Container';

import './global.css';
import Hero from 'components/Hero';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Container>
        <Hero />
      </Container>
    </>
  );
}
