import {
  Header,
  Label,
  Grid,
  Button,
  Icon,
  Card,
  Divider,
} from "semantic-ui-react";

export default function QueueGroup(props) {
  const { group, alt, moveQueue } = props;

  const groupMembers = group.group_members.map((m, index) => {
    return (
      <Label as="a" image key={index} color="blue">
        <img
          src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg"
          alt="default"
        />
        {m.contact_value ? m.contact_value : "Guest"}
      </Label>
    );
  });

  return (
    <Card fluid color="green">
      <Card.Content>
        <Card.Header>
          {!alt && (
            <Grid columns={2}>
              <Grid.Column>
                {" "}
                <Header as="h2">#{group.position_in_queue}</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {/* <Button color="blue" icon>
                  {" "}
                  <Icon name="phone volume" />
                </Button> */}
                <Button
                  color="green"
                  icon
                  onClick={() => moveQueue(group.position_in_queue, false)}
                >
                  {" "}
                  <Icon name="arrow right" />
                </Button>
              </Grid.Column>
            </Grid>
          )}
          {alt && (
            <Grid columns={2}>
              <Grid.Column>
                {/* <Button color="blue" icon>
                  {" "}
                  <Icon name="phone volume" />
                </Button> */}
                <Button
                  color="grey"
                  icon
                  onClick={() => moveQueue(group.position_in_queue, true)}
                >
                  {" "}
                  <Icon name="arrow left" />
                </Button>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {" "}
                <Header as="h2">#{group.position_in_queue}</Header>
              </Grid.Column>
            </Grid>
          )}

          <Divider />
        </Card.Header>
        <Card.Description textAlign={alt ? "right" : "left"}>
          {" "}
          <b>{groupMembers.length} Member(s):</b>
          <br />
          {groupMembers}
        </Card.Description>
      </Card.Content>
    </Card>
  );
}
