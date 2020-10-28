import { Container } from 'react-bootstrap';
import Login from './login/index'
export default function Home() {

  return (
    <React.Fragment>
      <Container fluid>
      <Login />
      </Container>
    </React.Fragment>
  )
}
