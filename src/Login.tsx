import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login: React.FC = () => {
  return (
    <Container>
      <Row className="w-75 text-center bg-info position-absolute top-50 start-50 translate-middle mx-auto">
        <Row className="text-center">
          <Col className="h2">Welcome to the Restaurant menu editor</Col>
        </Row>
        <Col className="border">
          Please log in via your identity provider
          <Row>
            <Col xs={12} md={6} className="border">
              <select>
                <option value="someOption">Some option</option>
                <option value="otherOption">Other option</option>
              </select>
            </Col>
            <Col xs={12} md={6} className="border">
              <button>Login</button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="bg-warning position-absolute bottom-0 start-0">
        <Col className="border">
          <select>
            <option value="selectLanguage">Select language</option>
            <option value="option">Option</option>
          </select>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;