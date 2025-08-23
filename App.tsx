import { StatusBar } from 'expo-status-bar';

import './global.css';
import Hero from 'components/Hero';
import Layout from 'app/layout';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Layout>
        <Hero />
      </Layout>
    </>
  );
}
