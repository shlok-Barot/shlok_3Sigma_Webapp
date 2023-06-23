import React, { PropsWithChildren } from "react";
import { Drawer, Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { ModalSize } from "rsuite/esm/Modal/Modal";

interface DrawerI {
  openWithHeader: boolean;
  setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>;
  drawerTitle: string;
  size: ModalSize;
}
const ActionDrawerComponent: React.FC<PropsWithChildren<DrawerI>> = ({
  openWithHeader,
  setOpenWithHeader,
  drawerTitle,
  children,
  size,
}) => {
  return (
    <>
      <Drawer
        className="auto_action_from"
        size={size}
        enforceFocus={false}
        open={openWithHeader}
        onClose={() => setOpenWithHeader(false)}
      >
        <Drawer.Header>
          <Drawer.Title className="modal-title">
            {drawerTitle === "Send notification" ? (
              <label className="action_lbl">
                {drawerTitle}
                <span>
                  We will send a mobile notification <br /> when triggered
                </span>
              </label>
            ) : drawerTitle === "Delay" ? (
              <label className="action_lbl">
                {drawerTitle}
                <span>
                  You can introduce delays between <br /> various action
                </span>
              </label>
            ) : (
              <label className="action_lbl">{drawerTitle}</label>
            )}
          </Drawer.Title>
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
  );
};

export default ActionDrawerComponent;
