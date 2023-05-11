import {
  Divider,
  Header,
  Segment,
  Card,
  Message,
  Grid,
  Breadcrumb,
  Button,
  Icon
} from "semantic-ui-react";
import QueueService from "../../services/QueueService";
import { useQuery } from "react-query";
import Loading from "../../components/Loading";
import QueueGroup from "./QueueGroup";
import { useState } from "react";
import QueueActions from "./QueueActions";
import { useNavigate, useParams } from "react-router-dom";
import MessageModal from "../../components/MessageModal";
import AddUserForm from "./AddUserForm";

export default function ViewQueue(props) {
  const { id } = useParams();
  const [errors, setErrors] = useState();
  const navigate=useNavigate();

  const { data, isLoading, refetch } = useQuery("getDetails", async () => {
    const { data } = await QueueService.getQueue(id);
    if (data.data && data.data.queue) {
      return data.data.queue;
    } else {
      return undefined;
    }
  });

  const handleMoveQueue = (position, status) => {
    QueueService.updateQueue(id, position, status)
      .then((res) => {
        refetch();
      })
      .catch((error) => {
        setErrors(error + "'");
      });
  };

  if (isLoading) {
    return (
      <Segment textAlign="center">
        <Loading />
      </Segment>
    );
  }

  const inQueue =
    data.groups && data.groups.active && data.groups.active.length > 0
      ? data.groups.active.map((a) => {
          return (
            <QueueGroup
              alt={false}
              key={a.id}
              group={a}
              serving={data.next_in_line === a.position_in_queue}
              moveQueue={handleMoveQueue}
            />
          );
        })
      : [
          <Segment textAlign="center" key="0">
            <Header as="h3">No groups yet</Header>
          </Segment>,
        ];

  const outQueue =
    data.groups && data.groups.inactive && data.groups.inactive.length > 0
      ? data.groups.inactive.sort((a,b)=>b.position_in_queue - a.position_in_queue).map((a) => {
          return (
            <QueueGroup
              alt={true}
              key={a.id}
              group={a}
              serving={data.next_in_line === a.position_in_queue}
              moveQueue={handleMoveQueue}
            />
          );
        })
      : [
          <Segment textAlign="center" key="0">
            <Header as="h3">No groups yet</Header>
          </Segment>,
        ];

  return (
    <Segment basic >
      <Breadcrumb>
        <Breadcrumb.Section onClick={()=>navigate("/home")} link>
          My Queues
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>{data.name}</Breadcrumb.Section>
      </Breadcrumb>
      <br />
      <br />
      <Grid columns={2}>
        <Grid.Column mobile={16} tablet={8} computer={8}>
          <Header as="h1">{data.name}</Header>
        </Grid.Column>
        <Grid.Column  mobile={16} tablet={8} computer={8} textAlign="right">
          <QueueActions queue={data} refreshList={refetch} />
        </Grid.Column>
      </Grid>

      <Divider />
      <br />

      <Grid columns={12}>
        <Grid.Column mobile={6} tablet={4} computer={2}>
          <Card color="red">
            <Card.Content>
              <Card.Description>Wait per group</Card.Description>
              <Card.Header>{data.estimated_wait_mins} mins</Card.Header>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column mobile={6} tablet={4} computer={2}>
          <Card color="teal">
            <Card.Content>
              <Card.Description>Operating hours</Card.Description>
              <Card.Header>
                {" "}
                {data.start_time} - {data.end_time}
              </Card.Header>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column mobile={4} tablet={4} computer={2}>
          <Card color="yellow">
            <Card.Content>
              <Card.Description>Group Queue</Card.Description>
              <Card.Header> {data.group_queue ? "Yes" : "No"}</Card.Header>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>

      {errors && (
        <Message negative>
          <Message.Header>We're sorry, something happened</Message.Header>
          <p> {errors}</p>
        </Message>
      )}

      <Grid columns={2}>
        <Grid.Column mobile={16} computer={8} tablet={8}>
          <Segment>
            <Grid columns={2}>
              <Grid.Column> <Header as="h2">In Queue</Header></Grid.Column>
              <Grid.Column textAlign="right"> 
                  <AddUserForm id={id} hash={data.queue_hash} group={undefined} afterAdd={refetch} />
              </Grid.Column>
            </Grid>
            <Divider />
            {inQueue}
          </Segment>
        </Grid.Column>
        <Grid.Column mobile={16} computer={8} tablet={8}>
          <Segment >
            <Header as="h2">Out Queue</Header>
            <Divider />
            {outQueue}
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
