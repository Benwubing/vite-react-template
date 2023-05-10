import QRCode from "react-qr-code";
import { Button, Segment, Input, Icon,Grid } from "semantic-ui-react";
import MessageModal from "../../components/MessageModal";
import QueueService from "../../services/QueueService";
import { useState } from "react";
import { TelegramShareButton,TelegramIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from "react-share";

export default function QueueActions(props) {
  const { queue, refreshList } = props;
  const [loading, setLoading] = useState(false);

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

  const QRdisplay = (
    <Segment padded textAlign="center">
      <QRCode value={qrURL}></QRCode>
      <Grid padded centered>
        <Grid.Column width={3}>
          <TelegramShareButton url={qrURL} title="Join the queue :">
            <TelegramIcon size={32} round/>
          </TelegramShareButton>
        </Grid.Column>
        <Grid.Column width={3}>
          <WhatsappShareButton url={qrURL} title="Join the queue :">
            <WhatsappIcon size={32} round/>
          </WhatsappShareButton>
        </Grid.Column>
          <Grid.Column width={3}>
          <EmailShareButton url={qrURL} title="Join the queue :">
            <EmailIcon size={32} round/>
          </EmailShareButton>
        </Grid.Column>
      </Grid>
     
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

  const handleDisplay = ()=>{
    var win = window.open("/display/"+queue.id, '_blank');
    win.focus();

  }

  return (
    <div>
      <MessageModal
        size="mini"
        button={
          <Button
            size="small"
            color="blue"
            disabled={loading}
          ><Icon name="qrcode"/>QR</Button>
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
            size="small"
            color="green"
            disabled={loading}
          ><Icon name="refresh"/>Refresh QR</Button>
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
            size="small"
            color="red"
            disabled={loading}
          >
            <Icon name="delete"/> Delete
          </Button>
        }
        message={""}
        title="Delete Queue"
        subtitle="Are you sure you want to delete this queue?"
        cancelText="Close"
        color="red"
        onConfirm={onDelete}
        confirmText={"Delete"}
      />
      <Button color="purple" size={"small"} onClick={handleDisplay}>
       <Icon name="tv"/> Queue 
      </Button>
    </div>
  );
}
