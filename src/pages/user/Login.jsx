import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import QueueService from "../../services/QueueService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = () => {
    if (username.length > 0 && password.length > 0) {
      setLoading(true);
      QueueService.login(username, password)
        .then((response) => {
          setLoading(false);
          const { data } = response;
          localStorage.setItem("token", data.token);
          navigate("/home");
        })
        .catch((error) => {
          setLoading(false);
          let msg = "";
          if (error && error.response && error.response.data) {
            const er = Object.keys(error.response.data).reduce((arr, key) => {
              arr = arr.concat(error.response.data[key]);
              return arr;
            }, []);
            msg = er.join("\n");
          } else {
            msg = "Unable to login user";
          }
          setErrors(msg);
        });
    }
  };
  return (
    <Segment padded>
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            Login to your account
          </Header>
          <Form size="large">
            <Form.Input
              fluid
              icon="user"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              iconPosition="left"
              placeholder="Username"
            />
            <Form.Input
              fluid
              onChange={(e) => setPassword(e.target.value)}
              icon="lock"
              value={password}
              iconPosition="left"
              placeholder="Password"
              type="password"
            />

            <Button
              color="blue"
              fluid
              size="large"
              onClick={login}
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>
          </Form>
          {errors && <Message error>{errors}</Message>}
          <Message success>
            New to us? <a href="/register">Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
