import React, { useCallback, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Takanori Kusumoto
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type Login = {
  onLogin: (userId: string) => void;
}
export default function Login({ onLogin }: Login) {
  const classes = useStyles();

  const idRef = useRef<HTMLTextAreaElement>(null);

  const handleOnLogin = useCallback(() => {
    const userId = idRef.current ? idRef.current.value : '';

    onLogin(userId);
  }, [onLogin]);

  const handleInputEnter = useCallback((event: React.KeyboardEvent<HTMLDivElement>): void => {
    if ('Enter' !== event.key) return;

    const userId = idRef.current ? idRef.current.value : '';

    onLogin(userId);
  }, [onLogin]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <div className={classes.form}>
          <TextField
            inputRef={idRef}
            onKeyPress={handleInputEnter}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="user-id"
            label="User ID"
            name="user-id"
            autoFocus
          />
          <Button
            onClick={handleOnLogin}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}