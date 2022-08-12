import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from './index.module.scss'
import {Card} from "../Card";
import {Input} from "../Input";
import {Button, Snackbar} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {login} from "../../API/auth";
import {AuthContext} from "../../context/auth-context";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const LoginPage = () => {
  const sign_up_style = {
    color: 'var(--text-color)',
    borderColor: 'var(--text-color)',
    marginTop: '10%'
  }
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [mesSnackbar, setMesSnackbar] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const {setIsAuth} = useContext(AuthContext)
  const navigate = useNavigate()
  const usernameInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameInput && usernameInput.current?.focus()
  }, [])

  const showSnackbar = (mes: string) => {
    setMesSnackbar(mes)
    setIsSnackbar(true)
  }

  const signInHandler = async () => {
    if (!(username && password)) {
      showSnackbar("All fields should be filled")
      return
    }
    setIsLoading(true)
    await login(username, password).then(res => {
      const error_code = res?.data.error?.code;
      if (error_code) {
        error_code === 404 && showSnackbar("User not found");
        error_code === 422 && showSnackbar("Entered invalid password");
      } else {
        console.log(res?.data)
        document.cookie = `access_token=${res?.data.token}; expires=Tue, 19 Jan 2038 03:14:07 UTC;`;
        setIsAuth(true)
        setIsLoading(false)
        navigate('/list')
      }
      setIsLoading(false)
    }).catch(err => err.response.status === 400 && showSnackbar("Login error"));
  }

  const handleDownKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    (e.key === 'Enter' || e.code === 'NumpadEnter') && signInHandler()
  }

  return (
    <div className={styles.main}>
      {
        !isLoading
          ?
        <Card customClass={styles.form}>
          <h2>Sign in</h2>
          <Input placeholder='Username' inputRef={usernameInput} onChangeHandler={e => setUsername(e.target.value)}
                 classes={styles.input}/>
          <Input
            placeholder='Password'
            onChangeHandler={e => setPassword(e.target.value)}
            type="password" classes={styles.input}
            onKeyDownHandler={handleDownKey}
          />
          <Button
            style={sign_up_style}
            onClick={signInHandler}
            className={styles.sign_up}
            variant="outlined"
          >
            Sign in
          </Button>
          <Link to='/registration' className={styles.link}>Sing up</Link>
          <Snackbar
            open={isSnackbar}
            autoHideDuration={3000}
            onClose={() => setIsSnackbar(false)}
            message={mesSnackbar}
          />
        </Card>
          :
        <Backdrop
          sx={{color: 'var(--text-color)', zIndex: (theme) => theme.zIndex.drawer + 1}}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    </div>
  );
};

export {LoginPage};