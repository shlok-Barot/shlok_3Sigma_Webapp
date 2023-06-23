import React, { PropsWithChildren } from "react";
import { Drawer, Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { ModalSize } from "rsuite/esm/Modal/Modal";

interface DrawerI {
    openWithHeader: boolean,
    setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>,
    drawerTitle: string,
    size: ModalSize
}
const DrawerComponent: React.FC<PropsWithChildren<DrawerI>> = ({ openWithHeader, setOpenWithHeader, drawerTitle, children, size }) => {
    return (
        <>
            <Drawer size={size} enforceFocus={false} open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
                <Drawer.Header>
                    <Drawer.Title className="modal-title">{drawerTitle}</Drawer.Title>
                    <Drawer.Actions>
                        <Button onClick={() => setOpenWithHeader(false)}>Cancel</Button>
                    </Drawer.Actions>
                </Drawer.Header>
                <Drawer.Body>
                    {/* <Placeholder.Paragraph /> */}
                    {children}
                </Drawer.Body>
            </Drawer>
        </>
    )
}

export default DrawerComponent;
