import React, { PropsWithChildren } from 'react';
import spinnerImg from '../assets/images/spinner1.gif';

interface Props {
    height: number,
    width: number,
}

const Loader: React.FC<PropsWithChildren<Props>> = ({ height, width }) => {
    return (
        <img src={spinnerImg} height={height} width={width} alt="spinnner" />
    )
}

Loader.defaultProps = {
    height: 50,
    width: 50,
}

export default Loader;