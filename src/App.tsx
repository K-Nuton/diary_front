import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    margin: "1%"
  },
  red: {
    backgroundColor: "#aa0022"
  }
});

function App() {
  const classes = useStyles();
  return (
    <Button className={`${classes.button} ${classes.red}`} variant="contained" color="primary">
      Hello World
    </Button>
  );
}

export default App;
