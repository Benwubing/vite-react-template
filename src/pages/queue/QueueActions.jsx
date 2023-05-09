import QRCode from "react-qr-code";
import { Button, Segment, Input, Icon } from "semantic-ui-react";
import MessageModal from "../../components/MessageModal";
import QueueService from "../../services/QueueService";
import { useRef, useState } from "react";

export default function QueueActions(props) {
  const { queue, refreshList } = props;
  const [loading, setLoading] = useState(false);
  const qrInput = useRef(null);

  let queue_hash = "";
  if (queue.attributes) {
    queue_hash = queue.attributes.queue_hash;
  } else {
    queue_hash = queue.queue_hash;
  }

  const qrURL =
    `${window.location.protocol}//${window.location.hostname}/join/` +
    queue.id +
    "/" +
    queue_hash;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrURL);
    qrInput.current.select();
    document.execCommand("copy");
  };

  const QRdisplay = (
    <Segment padded textAlign="center">
      <QRCode value={qrURL}></QRCode>
      <Input
        fluid
        ref={qrInput}
        icon={<Icon name="copy" link />}
        placeholder="QR code"
        onClick={handleCopy}
        value={qrURL}
      />
    </Segment>
  );

  const onDelete = () => {
    setLoading(true);
    QueueService.deleteQueue(queue.id)
      .then((res) => {
        setLoading(false);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const onRefresh = () => {
    setLoading(true);
    QueueService.refreshQueueHash(queue.id)
      .then((res) => {
        setLoading(false);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <div>
      <MessageModal
        size="mini"
        button={
          <Button
            icon="qrcode"
            size="small"
            color="blue"
            disabled={loading}
          ></Button>
        }
        message={QRdisplay}
        title="Join Queue"
        subtitle="Scan this QR code to join queue"
        cancelText="Close"
      />

      <MessageModal
        size="mini"
        button={
          <Button
            icon="refresh"
            size="small"
            color="green"
            disabled={loading}
          ></Button>
        }
        message={""}
        title="Refresh QR"
        subtitle="Are you sure you want to refresh the QR?"
        onConfirm={onRefresh}
        confirmText={"Refresh"}
        cancelText="Close"
      />

      <MessageModal
        size="mini"
        button={
          <Button
            icon="delete"
            size="small"
            color="red"
            disabled={loading}
          ></Button>
        }
        message={""}
        title="Delete Queue"
        subtitle="Are you sure you want to delete this queue?"
        cancelText="Close"
        color="red"
        onConfirm={onDelete}
        confirmText={"Delete"}
      />
    </div>
  );
}
