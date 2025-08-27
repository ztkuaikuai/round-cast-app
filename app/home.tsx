import { Container } from "components/Container"
import { Link } from "expo-router"

const Home = () => {
  return (
    <Container>
        <Link href="/home">Go to home screen</Link>
        <Link href="/sidebar">Go to sidebar screen</Link>
        <Link href="/user-info">Go to user info screen</Link>
        <Link href="/task/666">Go to task screen</Link>
    </Container>
  )
}

export default Home