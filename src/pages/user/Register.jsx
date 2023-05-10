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

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const pwRegx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{13,}$/;

  function isStringValid(str) {
    return str && str.trim().length !== 0;
  }

  const isValidEmail = (email) => {
    // Regular expression to match email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const register = () => {
    const err = {};
    let verdict = true;
    if (!isStringValid(firstName)) {
      verdict = false;
      err.firstName = "First name is empty";
    }
    if (!isStringValid(lastName)) {
      verdict = false;
      err.lastName = "Last name is empty";
    }
    if (!isStringValid(email)) {
      verdict = false;
      err.email = "Email is empty";
    }

    if (!isValidEmail(email)) {
      verdict = false;
      err.email = "Email is invalid";
    }

    if (!isStringValid(username)) {
      verdict = false;
      err.username = "Username is empty";
    }

    if (!isStringValid(password)) {
      verdict = false;
      err.password = "Password is empty";
    }

    if (!isStringValid(confirm)) {
      verdict = false;
      err.confirm = "Confirm password is empty";
    }

    if (!pwRegx.test(password)) {
      verdict = false;
      err.password =
        "Please make sure that password contains at least one lowercase letter, one uppercase letter, one digit, one special character, and is at least 13 characters long";
    }

    if (confirm !== password) {
      verdict = false;
      err.confirm = "Confirm password does not match with password";
    }

    if (verdict) {
      setLoading(true);
      setErrors({});
      // call register and login
      QueueService.register(username, password, firstName, lastName, email)
        .then((response) => {
          setLoading(false);
          const { data } = response;
          console.log(data);
          if (data && data.data && data.data.token) {
            localStorage.setItem("token", data.data.token);
            navigate("/home", { replace: true });
            navigate(0);
          }
        })
        .catch((e) => {
          setLoading(false);

          if (e.response && e.response.data && e.response.data.errors) {
            setErrors(e.response.data.errors);
          }
        });
    } else {
      setErrors(err);
    }
  };

  return (
    <Segment padded basic>
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="green" textAlign="center">
            Register for an account
          </Header>
          <Segment padded>
            <Form size="large">
              <Form.Input
                fluid
                onChange={(event) => setFirstName(event.target.value)}
                error={errors.firstName}
                value={firstName}
                iconPosition="left"
                placeholder="First Name"
              />
              <Form.Input
                fluid
                onChange={(event) => setLastName(event.target.value)}
                error={errors.lastName}
                value={lastName}
                iconPosition="left"
                placeholder="Last Name"
              />
              <Form.Input
                fluid
                onChange={(event) => setEmail(event.target.value)}
                error={errors.email}
                value={email}
                iconPosition="left"
                placeholder="Email"
              />
              <Form.Input
                fluid
                onChange={(event) => setUsername(event.target.value)}
                error={errors.username}
                value={username}
                iconPosition="left"
                placeholder="Username"
              />
              <Form.Input
                fluid
                onChange={(event) => setPassword(event.target.value)}
                error={errors.password}
                value={password}
                iconPosition="left"
                placeholder="Password"
                type="password"
              />
              <Form.Input
                fluid
                onChange={(event) => setConfirm(event.target.value)}
                error={errors.confirm}
                value={confirm}
                iconPosition="left"
                placeholder="Confirm Password"
                type="password"
              />

              <Button
                color="green"
                fluid
                size="large"
                onClick={register}
                disabled={loading}
                loading={loading}
              >
                Sign up
              </Button>
              <br />
              <Button
                color="grey"
                fluid
                size="large"
                onClick={() => navigate("/")}
                disabled={loading}
                loading={loading}
              >
                Back to Login
              </Button>

              {errors.main && (
                <Message error header="Error Occurred" content={errors.main} />
              )}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
