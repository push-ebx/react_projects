import React, {useContext, useEffect, useState} from 'react';
import {Masonry} from "@mui/lab";
import {List} from "../List";
import {Fab} from "@mui/material";
import {Card} from "../Card";
import styles from './index.module.scss'
import {deleteListById, getUser} from "../../API/user";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {AuthContext} from "../../context/auth-context";

interface ITask { // global
  task_id: number;
  title: string;
  completed: boolean
}

interface IList {
  list_id: number,
  title: string,
  tasks?: ITask[],
  isNew?: boolean
}

const Lists = (props: { lists?: IList[] }) => {
  const [lists, setLists] = useState<IList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {isAuth} = useContext(AuthContext)

  useEffect(() => {
    getUser().then((res) => {
      setLists(res?.data.lists ?? [])
      setIsLoading(false)
    })
  },[])

  const removeListHandler = (list_id: number) => {
    setLists(prev => prev.filter((list: IList) => list.list_id !== list_id))
    deleteListById(list_id)
  }

  return (
    <div className={styles.wrapper}>
      {
        !isLoading && isAuth
          ?
        <Masonry columns={{xl: 5, lg: 4, md: 3, sm: 2, xs: 1}} spacing={3} sx={{margin: 0}}>
          <Card customClass={styles.card_fab}>
            <Fab onClick={() => setLists(prev => [{list_id: lists.length + 1, title: '', isNew: true}, ...prev])}
                 sx={{color: 'var(--card-background-color)', backgroundColor: 'var(--text-color)'}}
                 aria-label="add"
                 style={{fontSize: 20}}
            >
              +
            </Fab>
          </Card>
          {
            lists.length !== 0
            &&
            lists.map(({list_id, title, tasks, isNew}) =>
              <List
                key={list_id}
                list_id={list_id}
                title={title}
                tasks={tasks}
                isNew={isNew}
                removeListHandler={removeListHandler}
              />)
          }
        </Masonry>
          :
        <Backdrop
          sx={{ color: 'var(--text-color)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </div>
  );
};

export {Lists};