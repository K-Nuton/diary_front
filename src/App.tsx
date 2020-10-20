import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Button className={`${classes.button} ${classes.red}`} variant="contained" color="primary">
        Hello World
      </Button>
    </MuiPickersUtilsProvider>
  );
}

export default App;
