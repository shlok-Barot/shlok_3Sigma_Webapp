import React, { PropsWithChildren } from "react";

interface Props {
    message: string
}

const NoContentDiv: React.FC<PropsWithChildren<Props>> = ({ message }) => {
    return (
        <div className='no-content'>
            {message || 'No Content'}
        </div>
    );
}

export default NoContentDiv;
