import React, { PropsWithChildren, SyntheticEvent } from 'react';

interface Props {
    checked: boolean,
    onChange: React.EventHandler<SyntheticEvent>,
    name: string,
    offstyle: string,
    onstyle: string,
    value: any
}

const Switch: React.FC<PropsWithChildren<Props>> = (props) => {
    const {
        checked,
        onChange,
        name,
        value,
        offstyle = "btn-secondary",
        onstyle = "btn-info"
    } = props;

    let displayStyle = checked ? onstyle : offstyle;

    return (
        <>
            <label>
                <span className='default switch-wrapper'>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => onChange(e)}
                        name={name}
                        value={value}
                    />
                    <span className={`${displayStyle} switch`}>
                        <span className="switch-handle" />
                    </span>
                </span>
            </label>
        </>
    )
}

export default Switch;
