import {
  Segment,
  Header,
  Statistic,
  Grid
} from "semantic-ui-react";
import QRCode from "react-qr-code";
import { useSearchParams } from "react-router-dom";
export default function PreviewQueueDisplay(props) {
const [searchParams, setSearchParams] = useSearchParams();

  const qrURL =`${window.location.protocol}//${window.location.hostname}/join/`
  const colors = searchParams.get("colors")? searchParams.get("colors").split(","):props.colors
  const {compact} = props;

  if(!colors){return <div></div>}
  return (
    <Segment padded textAlign="center" style={{background:colors[0]}} basic>
      <Segment style={{background:colors[8]}}>
        <Statistic size={compact?"small":"huge"} >
          <Statistic.Label style={{fontSize:compact?"1em":"2em",color:colors[1]}}>Currently Serving</Statistic.Label>
          <Statistic.Value style={{color:colors[1]}}>
            <Header style={{fontSize:compact?"1em":"2em",color:colors[1]}}>#101 </Header>
          </Statistic.Value>
        </Statistic>
        <Header as="h4" style={{color:colors[1]}}> Number might not be called in sequence</Header>
      </Segment>
      <Grid columns={2} centered>
        <Grid.Column phone={16} tablet={16} computer={8}>
          <Segment style={{background:colors[2]}} textAlign="center">
            <Statistic size={compact?"mini":"large"} >
              <Statistic.Label style={{color:colors[3]}}>Estimated wait time</Statistic.Label>
              <Statistic.Value style={{color:colors[3]}}>10 MINS</Statistic.Value>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column phone={16} tablet={16} computer={8} >
          <Segment style={{background:colors[4]}} textAlign="center">
            <Statistic size={compact?"mini":"large"} >
              <Statistic.Label style={{color:colors[5]}}>Groups in Queue</Statistic.Label>
              <Statistic.Value style={{color:colors[5]}}>5</Statistic.Value>
            </Statistic>
          </Segment>
        </Grid.Column>
        <Grid.Column phone={16} tablet={16} computer={8}>
            <Segment style={{background:colors[6]}} textAlign="center">
              <Header as={compact?"h4":"h2"} style={{color:colors[7]}}>Scan QR to join the queue</Header>
              <QRCode value={qrURL} size={compact?100:256}/>
            </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
