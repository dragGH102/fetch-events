import React from 'react'
import styles from '../app-assets/Button.module.sass';

const Button = ({ onClick, labelText, disabled }:
    {  onClick: Function, labelText: string, disabled?: boolean }
) => (<div
    className={`${styles['btn']} ${disabled && styles['disabled']}`} onClick = {() => onClick()}>
    {labelText}
</div>)

export default Button
