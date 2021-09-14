import React from 'react';
import {AppBar, Button, Grid, IconButton, Toolbar, Typography} from "@material-ui/core";
import {AmplifySignOut} from "@aws-amplify/ui-react";

export default function Navbar({theme, setTheme}) {
  return (
      <AppBar position='static'>
        <Toolbar style={{minHeight: '2,5em'}}>
          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item>
              <Typography variant='h6' style={{fontWeight: 'bold', color: '#FFF'}}> Todo App </Typography>
            </Grid>
            <Grid item>
              <Grid item container alignItems='center'>
                <Grid item>
                  <IconButton onClick={() => setTheme(prevState => prevState === 'light' ? 'dark' : 'light')}>
                    {theme
                        ? <i className="material-icons" style={{color: '#FFF'}}>light_mode</i>
                        : <i className="material-icons" style={{color: '#FFF'}}>dark_mode</i>
                    }
                  </IconButton>
                </Grid>
                <Grid item component={AmplifySignOut}>
                  <Button>
                    Sign out
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
  )
}
