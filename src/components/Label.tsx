import React from 'react'
import styles from '../app-assets/Label.module.sass';

const Label = ({ labelText }: { labelText: string }) => (<div className={styles['Label']}>
    {labelText}
</div>)

export default Label
