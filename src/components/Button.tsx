import React from 'react'
import styles from '../app-assets/Button.module.sass';

const Button = ({ onClick, labelText }: {  onClick: Function, labelText: string }) => (<div
    className={`${styles['btn']}`} onClick = {() => onClick()}>
    {labelText}
</div>)

export default Button
