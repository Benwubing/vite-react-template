import React, { useState } from "react";
import { Button, Header, Modal } from "semantic-ui-react";

function MessageModal(props) {
  const [open, setOpen] = useState(false);
  const {
    button,
    message,
    title,
    subtitle,
    onConfirm,
    confirmText,
    cancelText,
    size,
    color,
  } = props;

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Modal
      size={size}
      dimmer={"blurring"}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={button}
    >
      <Modal.Header ><b>{title}</b></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>{subtitle}</Header>
          {message}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        {onConfirm && (
          <Button
            content={confirmText ? confirmText : "Confirm"}
            onClick={handleConfirm}
            color={color ? color : "green"}
          />
        )}

        {cancelText && (
          <Button color="black" onClick={() => setOpen(false)}>
                    {cancelText ? cancelText : "Close"}
                  </Button>
        )}
       
      </Modal.Actions>
    </Modal>
  );
}

export default MessageModal;
