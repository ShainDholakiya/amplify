import React, {useState} from 'react';
import {withAuthenticator} from "@aws-amplify/ui-react";
import Navbar from "./components/Navbar";
import TodoList from "./components/TodoList";
import {createTheme, Paper, ThemeProvider} from "@material-ui/core";
import {orange} from "@material-ui/core/colors";


function App() {
  const [theme, setTheme] = useState('light');
  const themes = createTheme({
    palette: {
      primary: {
        main: orange[500]
      },
      type: theme
    }
  })
  return (
      <ThemeProvider theme={themes}>
        <Paper>
          <Navbar theme={theme} setTheme={setTheme}/>
          <TodoList/>
        </Paper>
      </ThemeProvider>

  );
}

export default withAuthenticator(App);
