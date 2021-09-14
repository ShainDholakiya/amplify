import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid, makeStyles,
  MenuItem,
  TextField
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formInput: {
    marginTop: '1em'
  }
}))


const DialogForm = ({open, close, todo, handleChange, handleUpdate}) => {
  const classes = useStyles();

  const textFieldProps = {
    className: classes.formInput,
    fullWidth: true,
    variant: "outlined",
    margin: 'dense'
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdate(todo);
    close()
  }

  return (
      <Dialog open={open} onClose={close}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            Edit Task
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dolorem eos hic iusto magni,
            </DialogContentText>
            <Grid container direction='column'>
              <Grid item sm>
                <TextField name='tilte' label='Title' value={todo.tilte} onChange={handleChange}
                           required {...textFieldProps} />
              </Grid>
              <Grid item sm>
                <TextField name='description' label='Description' value={todo.description}
                           onChange={handleChange} {...textFieldProps} />
              </Grid>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="secondary">
              Cancel
            </Button>
            <Button color="primary" type='submit'> Save </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
}

export default DialogForm;
