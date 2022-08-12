import React, {useContext, useEffect, useRef, useState} from 'react';
import {Checkbox, FormControlLabel, FormGroup, Snackbar} from "@mui/material";
import styles from './index.module.scss'
import {Card} from "../Card";
import {Input} from "../Input";
import {addTask, createList, editTask, editTitleList} from "../../API/user";
import {ThemeContext} from "../../ThemeProvider";
import remove_light from '../../assets/remove_light.svg'
import remove_dark from '../../assets/remove_dark.svg'

interface ITask {
  task_id: number,
  title: string,
  completed: boolean
}

interface IListProps {
  list_id: number,
  title: string,
  tasks?: ITask[],
  isNew?: boolean,
  removeListHandler: (list_id: number) => void
}

const List = (props: IListProps) => {
  const [tasks, setTasks] = useState(props.tasks)
  const [isNew, setIsNew] = useState(props.isNew)
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [prevTitle, setPrevTitle] = useState(props.title)
  const taskInput = useRef<HTMLInputElement>(null)
  const titleInput = useRef<HTMLInputElement>(null)
  const {theme} = useContext(ThemeContext);

  const handleDownKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    (e.key === 'Enter' || e.code === 'NumpadEnter') && newTask()
  }

  useEffect(() => {
    (titleInput as React.RefObject<any>).current.value = props.title
    titleInput && props.isNew && titleInput.current?.focus()
    tasks && setTasks(prev => [...tasks.filter(task => !task.completed), ...tasks.filter(task => task.completed)])
  }, [])


  const onBlurTitleHandler = (e: React.FocusEvent<HTMLInputElement>) => { // add enter
    if (isNew) {
      createList(titleInput.current?.value ?? '')
      setIsNew(false)
      return
    }
    if (titleInput.current?.value !== prevTitle) {
      editTitleList(titleInput.current?.value ?? '', props.list_id)
    }
  }

  const onFocusTitleHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    setPrevTitle(titleInput.current?.value ?? '')
  }

  const newTask = async () => {
    const title = (taskInput as React.RefObject<any>).current?.value?.trim()
    if (!title) {
      setIsSnackbar(true)
      return;
    } else if (isSnackbar) setIsSnackbar(false)
    await setTasks(prev => [...prev ?? [], {title, task_id: (tasks?.length ?? 0) + 1, completed: false}]);
    setTasks(prev => prev && [...prev.filter(task => !task.completed), ...prev.filter(task => task.completed)]);
    (taskInput as React.RefObject<any>).current.value = '';
    addTask(title, props.list_id);
  }

  const onClickTask = (task_id: number) => {
    let task: ITask = {title: '', task_id: 0, completed: false}
    if (tasks) setTasks(prev => tasks.map(_task => {
      if (_task.task_id === task_id) {
        _task.completed = !_task.completed
        task = _task
      }
      return _task
    }))
    tasks && setTasks(prev => [...tasks.filter(task => !task.completed), ...tasks.filter(task => task.completed)])
    tasks && editTask({
      list_id: props.list_id,
      task_id: task.task_id,
      title: task.title,
      completed: task.completed
    })
  }

  return (
    <Card>
      <Input
        placeholder="Title"
        inputRef={titleInput}
        classes={styles.input_title}
        onBlurHandler={onBlurTitleHandler}
        onFocusHandler={onFocusTitleHandler}
      />
      <FormGroup className={styles.form_group}>
        {
          tasks && tasks.length !== 0
          &&
          tasks.map(({task_id, title, completed}) =>
            <FormControlLabel
              key={task_id}
              control={
                <Checkbox
                  checked={completed}
                  onClick={() => onClickTask(task_id)}
                  sx={{color: 'var(--text-color)'}}
                />}
              label={<span style={{textDecoration: completed ? "line-through" : "none"}}>{title}</span>}/>)
        }
        <Input
          placeholder="Task"
          onKeyDownHandler={handleDownKey}
          inputRef={taskInput}
          classes={styles.input_task}
        />
        <img
          src={theme === 'light' ? remove_dark : remove_light}
          alt="remove"
          className={styles.remove}
          onClick={() => props.removeListHandler(props.list_id)}
        />
      </FormGroup>
      <Snackbar
        open={isSnackbar}
        autoHideDuration={3000}
        onClose={() => setIsSnackbar(false)}
        message={"The field should not be empty"}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      />
    </Card>
  );
};

export {List};