import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  makeStyles,
  Container,
  Button,
  Typography,
} from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import {Link, useHistory} from "react-router-dom";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  buttonSpacing: {
    marginLeft: theme.spacing(1),
  },
  errorGrid: {
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderRadius: "5px"
  }
}));

function Login() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const history = useHistory();
  const [serverError, setServerError] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError(null)

      let reqData = {
        data: {
          type: "users",
          attributes: {
            email: data.email,
            password: data.password
          }
        }
      }

      setIsLoading(true);
      const { data: loginData } = await api.auth.login(reqData);

      auth.setToken(loginData.data.attributes.token);
      auth.setUser(loginData);
      history.push("/requests");
    } catch (e) {
      switch (e.response.status) {
        case 500:
          setServerError("Invalid login or email")
          break
        case 400:
          let errors = e.response.data.errors.map(err => err.title).join(". ")
          setServerError(errors)
          break
      }
    } finally {
      setIsLoading(false);
    }
  };

  const serverErrorGrid = () => {
    if(serverError) {
      return (
          <Grid container spacing={3}>
            <Grid item className={classes.errorGrid} xs={12}>
              <Typography variant="h6">{serverError}</Typography>
            </Grid>
          </Grid>
      )
    } else {
      return (
          <></>
      )
    }
  }

  return (
    <Container maxWidth="xs" className={classes.root}>
      {serverErrorGrid()}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Login</Typography>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.email?.message)}
                  fullWidth={true}
                  type="email"
                  label="Email"
                  variant="filled"
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.password?.message)}
                  type="password"
                  fullWidth={true}
                  label="Password"
                  variant="filled"
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              Login
            </Button>
            <Button
              color="inherit"
              type="submit"
              className={classes.buttonSpacing}
              component={Link}
              to="/registration"
            >
              Create an account
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Login;
