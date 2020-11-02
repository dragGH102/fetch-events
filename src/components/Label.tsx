import React from 'react'
import styles from '../app-assets/Label.module.sass';

const Label = ({ labelText, type }: { labelText: string, type: 'info' | 'error' }) => (<div
    className={`${styles['Label']} ${styles[type]}`}
>
    <span dangerouslySetInnerHTML={{ __html: labelText }} />
</div>)

export default Label
