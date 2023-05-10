import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Segment,
  Header,
  Statistic,
  Grid,
  Message,
  Divider,
  Button,
  Input,
} from "semantic-ui-react";
import sha256 from "crypto-js/sha256";
import { useQuery } from "react-query";
import QueueService from "../../services/QueueService";
import Loading from "../../components/Loading";
import QRCode from "react-qr-code";

export default function QueueDisplay() {
  const { id } = useParams();
  const [passcode, setPasscode] = useState("");
  const deviceId = navigator.userAgent;
  const deviceHash = sha256(deviceId).toString();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   
  const {
    data: existingData,
    isLoading: existLoading,
    isError: isExistError,
    error: existError,
    refetch: refetchExisting,
  } = useQuery("getMetrics", async () => {
    const { data } = await QueueService.getDisplay(id, deviceHash);
    return data;
  });

  if (existLoading) {
    return <Loading />;
  }

  if (isExistError) {
    return <Message negative>{existError + ""}</Message>;
  }

  const enrollDisplay = () => {
    setLoading(true);
    QueueService.enrollDisplay(id, deviceHash, passcode)
      .then((e) => {
        setLoading(false);
        refetchExisting();
      })
      .catch((e) => {
        setLoading(false);
        setError(e + "");
      });
  };

  if (existingData.status === "not_enrolled") {
    return (
      <Grid columns={4} centered padded>
        <Grid.Column textAlign="center">
          <Segment>
            <Header as="h2">Enter Passcode</Header>
            <Divider />
            <p>This passcode is provided when creating the queue</p>
            <Input
              fluid
              type="password"
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Please enter passcode"
            ></Input>
            <br />
            {error && <Message negative>{"Incorrect passcode"}</Message>}
            <Button
              color="green"
              onClick={enrollDisplay}
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }

  const { currently_serving, estimated_wait_time, groups_in_queue,queue_hash } =
    existingData;

     const qrURL =
    `${window.location.protocol}//${window.location.hostname}/join/` +
    id +
    "/" +
    queue_hash;

  return (
    <Segment padded textAlign="center" basic >
      <Segment >
        <Statistic size="huge" >
          <Statistic.Label>Currently Serving</Statistic.Label>
          <Statistic.Value>
            {currently_serving ? "#" + currently_serving : "-"}
          </Statistic.Value>
        </Statistic>
        <Header as="h2"> Number might not be called in sequence</Header>
      </Segment>
      <Grid columns={2}>
        <Grid.Column phone={16} tablet={8} computer={8}>
          <Segment inverted color="yellow">
            <Statistic size="huge">
              <Statistic.Label>Estimated wait time</Statistic.Label>
              <Statistic.Value>{estimated_wait_time} MINS</Statistic.Value>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column phone={16} tablet={8} computer={8}>
          <Segment inverted color="black">
            <Statistic size="huge" inverted>
              <Statistic.Label>Groups in Queue</Statistic.Label>
              <Statistic.Value>{groups_in_queue}</Statistic.Value>
            </Statistic>
          </Segment>
        </Grid.Column>
      </Grid>
      <Segment padded>
        <Header as="h2">Scan QR to join the queue</Header>
    
        <QRCode value={qrURL}/>
      </Segment>
    </Segment>
  );
}
