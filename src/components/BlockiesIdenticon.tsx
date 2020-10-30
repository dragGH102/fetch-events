/*
 * @source https://github.com/ethereum/blockies/blob/master/react-component.js
 * refactored as FC with hooks
 */

import React, { useEffect, useRef } from 'react'
import '../lib/blockies'

interface PropTypes {
    opts?: {[key: string]: number | string}
}

// @ts-ignore
const BlockiesIdenticon: React.FC = ({ opts }: PropTypes) => {

    const canvasRef: React.MutableRefObject<undefined> = useRef()

    useEffect(() => {
        draw()
    })

    const getOpts = () => {
        return {
            seed: opts?.seed || "foo",
            color: opts?.color || "#dfe",
            bgcolor: opts?.bgcolor || "#a71",
            size: opts?.size || 15,
            scale: opts?.scale || 3,
            spotcolor: opts?.spotcolor || "#000"
        }
    }

    const draw = () => {
        // @ts-ignore
        blockies.render(getOpts(), canvasRef.current)
    }

    {/* @ts-ignore */}
    return (<canvas ref={canvasRef} />)
}

export default BlockiesIdenticon
