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

  const { currently_serving, estimated_wait_time, groups_in_queue,queue_hash,color_settings,prefix } =
    existingData;

     const qrURL =
    `${window.location.protocol}//${window.location.hostname}/join/` +
    id +
    "/" +
    queue_hash;

  return (
    <Segment padded textAlign="center" basic style={{background:color_settings[0]}}>
      <Segment style={{background:color_settings[8]}}>
        <Statistic size="huge" >
          <Statistic.Label style={{fontSize:"2em",color:color_settings[1]}}>Currently Serving</Statistic.Label>
          <Statistic.Value style={{color:color_settings[1]}}>
            <Header style={{fontSize:"2em",color:color_settings[1]}}>{prefix?prefix:"#"}{currently_serving ? "#" + currently_serving : "-"} </Header>
          </Statistic.Value>
        </Statistic>
        <Header as="h2" style={{color:color_settings[1]}}> Number might not be called in sequence</Header>
      </Segment>
      <Grid columns={2} centered>
        <Grid.Column phone={16} tablet={16} computer={8}>
          <Segment style={{background:color_settings[2]}} textAlign="center">
            <Statistic size="huge">
              <Statistic.Label style={{color:color_settings[3]}}>Estimated wait time</Statistic.Label>
              <Statistic.Value style={{color:color_settings[3]}}>{estimated_wait_time} MINS</Statistic.Value>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column phone={16} tablet={16} computer={8}>
          <Segment style={{background:color_settings[4]}} textAlign="center">
            <Statistic size="huge" inverted>
              <Statistic.Label style={{color:color_settings[5]}}>Groups in Queue</Statistic.Label>
              <Statistic.Value style={{color:color_settings[5]}}>{groups_in_queue}</Statistic.Value>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column phone={16} tablet={16} computer={8} textAlign="center">
           <Segment padded style={{background:color_settings[6]}}>
              <Header as="h2" style={{color:color_settings[7]}}>Scan QR to join the queue</Header>
              <QRCode value={qrURL}/>
            </Segment>
        </Grid.Column>
      </Grid>
     
    </Segment>
  );
}
