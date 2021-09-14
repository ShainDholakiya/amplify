import React from 'react'
import {Button, Grid, makeStyles, MenuItem, TextField} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formInput: {
    marginTop: '1em'
  }
}))

const NewTodoForm = ({handleCreate, handleChange, todo, setTodo}) => {
  const classes = useStyles();

  const textFieldProps = {
    className: classes.formInput,
    fullWidth: true,
    variant: "outlined",
    margin: 'dense'
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCreate(todo);
    setTodo({tilte: '', description: '', dueDate: '', status: 0});
  };

  return (
      <Grid container alignItems='center' direction='column' component={'form'} onSubmit={handleSubmit}>
        <TextField name='tilte' label='Title' value={todo.tilte} onChange={handleChange} required {...textFieldProps} />
        <TextField name='description' label='Description' value={todo.description}
                   onChange={handleChange} {...textFieldProps} />
        <Grid item container>
          <Grid item xs={6}>
            <TextField name="dueDate" label="Due Date" type="date" value={todo.dueDate} onChange={handleChange}
                       InputLabelProps={{shrink: true}} {...textFieldProps}/>
          </Grid>
          <Grid item xs={1}/>
          <Grid item xs={5}>
            <TextField name='status' label="Status" select {...textFieldProps} value={todo.status}
                       onChange={handleChange}>
              <MenuItem value={0}> in-Progress </MenuItem>
              <MenuItem value={1}> Completed </MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Button className={classes.formInput} type='submit' variant="outlined" color='primary'
                fullWidth> SUBMIT </Button>
      </Grid>
  )
}

export default NewTodoForm;
