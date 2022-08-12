import React, {useContext, useState} from 'react';
import styles from './index.module.scss'
import {Card} from "../Card";
import {Input} from "../Input";
import {Button, Snackbar} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {registration} from "../../API/auth";
import {AuthContext} from "../../context/auth-context";

const RegistrationPage = () => {
  const sign_up_style = {
    color: 'var(--text-color)',
    borderColor: 'var(--text-color)',
    marginTop: '10%'
  }
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [mesSnackbar, setMesSnackbar] = useState('')
  const {isAuth, setIsAuth} = useContext(AuthContext)
  const navigate = useNavigate()

  const showSnackbar = (mes: string) => {
    setMesSnackbar(mes)
    setIsSnackbar(true)
  }

  const checkValidation = (validations: { cond: boolean, mes: string }[]): boolean => {
    for (let v of validations) {
      if (v.cond) {
        showSnackbar(v.mes)
        return true
      }
    }
    return false
  }

  const signUpHandler = () => {
    const check = checkValidation(
      [
        {cond: !(username && password && repeatPassword), mes: "All fields should be filled"},
        {cond: password !== repeatPassword, mes: "Passwords must match"},
        {cond: username.length > 15, mes: "The username should be out of 1-15 symbols"},
        {cond: password.length < 4 || password.length > 15, mes: "Password should be out of 4-10 symbols"}
      ]
    )
    if (check) return

    registration(username, password).then(res => {
      const error_code = res?.data.error?.code;
      if (error_code) {
        error_code === 421 && showSnackbar("The user has already been created");
        error_code === 422 && console.log(res.data.error);
      } else {
        document.cookie = `access_token=${res?.data.token}; expires=Tue, 19 Jan 2038 03:14:07 UTC;`;
        setIsAuth(true)
        navigate('/list')
      }
    }).catch(err => err.response.status === 400 && showSnackbar("Registration error"));
  }

  const handleDownKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    (e.key === 'Enter' || e.code === 'NumpadEnter') && signUpHandler()
  }

  return (
    <div className={styles.main}>
      <Card customClass={styles.form}>
        <h2>Sign up</h2>
        <Input placeholder='Username' onChangeHandler={e => setUsername(e.target.value)} classes={styles.input}/>
        <Input
          placeholder='Password'
          onChangeHandler={e => setPassword(e.target.value)}
          type="password"
          classes={styles.input}
        />
        <Input
          placeholder='Repeat password'
          type="password"
          onKeyDownHandler={handleDownKey}
          onChangeHandler={e => setRepeatPassword(e.target.value)}
          classes={styles.input}
        />
        <Button style={sign_up_style} variant="outlined" onClick={signUpHandler}>Sign up</Button>
        <Link to='/login' className={styles.link}>Sing in</Link>
      </Card>
      <Snackbar
        open={isSnackbar}
        autoHideDuration={3000}
        onClose={() => setIsSnackbar(false)}
        message={mesSnackbar}
      />
    </div>
  );
};

export {RegistrationPage};