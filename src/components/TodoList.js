import React, {Fragment, useEffect, useState} from 'react'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import NewTodoForm from "./NewTodoForm";
import DialogForm from "./DialogForm";
import {API, graphqlOperation} from "aws-amplify";
import {listTodos} from "../graphql/queries";
import {createTodo, deleteTodo as _deleteTodo, updateTodo as _updateTodo} from "../graphql/mutations";
import orderBy from "lodash/orderBy";
import {KeyboardArrowDown, KeyboardArrowUp} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  tab: {
    minWidth: '10.5em'
  },
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  accordion: {
    width: '100%',
  }
}));

function TabPanel({index, value, children}) {
  return (
      <Fragment>
        {value === index && children}
      </Fragment>
  )
};

const INITIAL_STATE = {tilte: '', description: '', dueDate: '', status: 0};
const STATUS = ['Progress', 'Completed'];
const TAB = {
  all: 0,
  completed: 1,
  progress: 2
};

const CustomChip = ({onClick, label, name, isActive}) => {
  const [order, setOrder] = useState('desc')
  return (
      <Chip
          avatar={order === "asc" ?
              <KeyboardArrowDown style={{backgroundColor: 'transparent'}}/> :
              <KeyboardArrowUp style={{backgroundColor: 'transparent'}}/>}
          label={label}
          color={isActive ? 'primary' : 'default'}
          onClick={() => {
            const _order = order === 'asc' ? 'desc' : 'asc';
            setOrder(_order)
            onClick(name, _order)
          }}
      />
  )
}

const TodoList = () => {
  const classes = useStyles();

  useEffect(() => {
    fetchTodos();
  }, [])

  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState(INITIAL_STATE);
  const [filteringBy, setFilteringBy] = useState({field: '', order: ''})
  const [tabIndex, setTabIndex] = useState(0);
  const [expanded, setExpanded] = useState(null)
  const [dialogOpen, setDialog] = useState(false);
  const [isLoading, setLoading] = useState(true);


  const filteredTodo = orderBy(todos, [filteringBy.field], [filteringBy.order]);


  const filterTodo = (todo) => {
    const status = parseInt(todo.status);
    if (tabIndex === TAB.completed) {
      return status === 1;
    } else if (tabIndex === TAB.progress)
      return status === 0
    else
      return true;
  };
  const fetchTodos = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos);
      setLoading(false);
    } catch (err) {
      console.log('error fetching todos')
    }
  };
  const addTodo = async (newTodo) => {
    try {
      const input = newTodo;
      setTodos([...todos, newTodo])
      setTodo(INITIAL_STATE);
      await API.graphql(graphqlOperation(createTodo, {input}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }
  const updateTodo = async (newTodo) => {
    try {
      const {createdAt, updatedAt, ...updatedTodo} = newTodo;
      const input = updatedTodo;
      const updatedTodos = todos.map(todo => {
        if (todo.id === newTodo.id) return newTodo;
        else return todo;
      });
      setTodos(updatedTodos);
      setTodo(INITIAL_STATE);
      await API.graphql(graphqlOperation(_updateTodo, {input}));
    } catch (err) {
      console.log('error updating todo:', err)
    }
  };
  const deleteTodo = async (id) => {
    try {
      const input = {id};
      if (window.confirm('Are you sure you want to delete this?')) {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        await API.graphql(graphqlOperation(_deleteTodo, {input}));
      }
    } catch (err) {
      console.log('error deleting todo:', err)
    }
  };


  const handleTabChange = (event, index) => setTabIndex(index);
  const handleTaskExpand = (panel) => (event, isExpanded) => setExpanded(isExpanded ? panel : false);
  const handleChange = (event) => setTodo({...todo, [event.target.name]: event.target.value});

  const closeDialog = () => setDialog(false);
  const openDialog = (todo) => {
    setTodo(todo);
    setDialog(true);
  };

  return (
      <Grid container justifyContent='space-around' style={{height: '100vh'}}>
        <Grid item container md={5} alignItems='center' direction='column'
              style={{borderRight: '1px solid #DDD', padding: '0 2em', marginTop: '1em'}}>
          <Grid item>
            <Typography variant='h4'> Things To Do </Typography>
          </Grid>
          <NewTodoForm handleCreate={addTodo} todo={todo} setTodo={setTodo} handleChange={handleChange}/>
        </Grid>
        <Grid item container md={6} direction='column' style={{marginTop: '1em'}}>
          <Grid item>
            <Typography variant='h4' align='center'> TASKS </Typography>
          </Grid>
          <Grid container item style={{marginTop: '2em'}}>
            <Paper className={classes.root}>
              <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
              >
                <Tab className={classes.tab} label="All"/>
                <Tab className={classes.tab} label="Completed"/>
                <Tab className={classes.tab} label="IN-Progress"/>
              </Tabs>
            </Paper>
          </Grid>
          <Grid item container style={{marginTop: '1em'}} justifyContent='center'>
            <TabPanel value={tabIndex} index={tabIndex}>
              <Grid item container alignItems='center' style={{padding: '1em'}}>
                <Grid item>
                  <Typography>FILTER BY: </Typography>
                </Grid>
                <Grid item style={{marginLeft: '1em'}}>
                  <CustomChip
                      label={'Title'}
                      isActive={filteringBy.field === 'tilte'}
                      name={'tilte'}
                      onClick={(name, order) => {
                        setFilteringBy({field: name, order})
                      }}
                  />
                </Grid>
                <Grid item style={{marginLeft: '1em'}}>
                  <CustomChip
                      label={'Due Date'}
                      isActive={filteringBy.field === 'dueDate'}
                      name={'dueDate'}
                      onClick={(name, order) => {
                        setFilteringBy({field: name, order})
                      }}
                  />
                </Grid>
              </Grid>
              {todos.length
                  ? filteredTodo
                      .filter(filterTodo)
                      .map((todo, index) => (
                          <Accordion key={index}
                                     expanded={expanded === todo.id}
                                     TransitionProps={{unmountOnExit: true}}
                                     onChange={handleTaskExpand(todo.id)}
                                     style={{width: '100%'}}>

                            <AccordionSummary id="panel1bh-header"
                                              aria-controls="panel1a-content"
                                              expandIcon={<span
                                                  className="material-icons"> {expanded ? 'expand_less' : 'expand_more'} </span>}
                            >
                              <Typography className={classes.heading}>{todo.tilte}</Typography>
                              <Typography className={classes.secondaryHeading}>{todo.description}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid item container justifyContent='space-between'>
                                <Grid item>
                                  <Typography>Due Date: {todo.dueDate}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography> Status: {STATUS[todo.status]} </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                            <AccordionActions>
                              <Grid item>
                                <Button onClick={() => deleteTodo(todo.id)} color='secondary'> Delete </Button>
                              </Grid>
                              <Grid item>
                                <Button onClick={() => openDialog(todo)}> Edit </Button>
                              </Grid>
                            </AccordionActions>
                          </Accordion>
                      ))
                  : isLoading
                      ? <CircularProgress style={{marginTop: '1em'}}/>
                      : <Typography align='center'> No Task Found </Typography>
              }
            </TabPanel>
          </Grid>
        </Grid>
        <DialogForm open={dialogOpen}
                    close={closeDialog}
                    handleChange={handleChange}
                    handleUpdate={updateTodo}
                    todo={todo}/>
      </Grid>
  )
}

export default TodoList;
