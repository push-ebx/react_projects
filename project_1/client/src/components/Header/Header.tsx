import React, {useContext} from 'react';
import styles from './index.module.scss'
import {Button, Grid} from "@mui/material";
import {ThemeContext} from "../../ThemeProvider";
import Moon from '../../assets/moon.svg';
import Sun from '../../assets/sun.svg';
import {AuthContext} from "../../context/auth-context";
import {useNavigate} from "react-router-dom";

const Header = () => {
  const logout_style = {
    color: 'var(--text-color)',
    borderColor: 'var(--text-color)'
  }
  const {theme, toggleTheme} = useContext(ThemeContext);
  const {isAuth, setIsAuth} = useContext(AuthContext)
  const navigate = useNavigate()

  const logout = () => {
    let cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setIsAuth(false)
    navigate('/login')
  }

  return (
    <Grid className={styles.header} container>
      <Grid item onClick={toggleTheme} className={styles.toggle}>
        <img src={theme === 'light' ? Moon : Sun} alt=""/>
      </Grid>
      <Grid item>
        <span className={styles.todo}>ToDo</span>
      </Grid>
      {
        isAuth
          &&
        <Grid item className={styles.logout_grid}>
          <Button style={logout_style} onClick={logout} variant="outlined">LOGOUT</Button>
        </Grid>
      }
    </Grid>
  );
};

export {Header};