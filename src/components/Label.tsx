import React from 'react'
import styles from '../app-assets/Label.module.sass';

const Label = ({ labelText, type }: { labelText: null | string, type: 'info' | 'error' }) => (<div
    className={`${styles['Label']} ${styles[type]}`}>
    {labelText}
</div>)

export default Label
