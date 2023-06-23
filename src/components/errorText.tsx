import React, { PropsWithChildren } from "react";

interface Props {
    message: string,
}

const ErrorText: React.FC<PropsWithChildren<Props>> = ({ message }) => {
    return (
        <span style={{ color: 'red' }}>{message}</span>
    );
}

export default ErrorText;
