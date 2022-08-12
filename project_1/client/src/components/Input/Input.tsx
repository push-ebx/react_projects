import React from 'react';
import styles from './index.module.scss'

interface IInputProps {
  onKeyDownHandler?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder?: string,
  type?: "text" | "password",
  inputRef?: React.Ref<HTMLInputElement>,
  classes?: string,
  value?: string,
  onBlurHandler?: React.FocusEventHandler<HTMLInputElement>,
  onFocusHandler?: React.FocusEventHandler<HTMLInputElement>
}

const Input = ({value,
                 onKeyDownHandler,
                 onChangeHandler,
                 placeholder='',
                 type='text',
                 inputRef,
                 classes='',
                 onBlurHandler,
                 onFocusHandler}: IInputProps) => {
  return (
    <>
      <input
        value={value}
        ref={inputRef}
        className={`${styles.input} ${classes}`}
        type={type}
        placeholder={placeholder}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        onKeyDown={onKeyDownHandler}
        onChange={onChangeHandler}
      />
      <div className={styles.hr}/>
    </>
  );
};

export {Input};