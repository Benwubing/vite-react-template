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
        {m.contact_value && m.contact_value!=="none" ? m.contact_value : "Guest"}
      </Label>
    );
  });

  return (

    <Card fluid color="green">
      <Card.Content>
        <Card.Header>
          {!alt && (
            <Grid columns={2}>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                {" "}
                <Header as="h2">#{group.position_in_queue}</Header>
              </Grid.Column>
              <Grid.Column textAlign="right" mobile={16} tablet={8} computer={8}>
                <Button
                  color="green"
                  onClick={() => moveQueue(group.position_in_queue, false)}
                >
                  {" "}
                  <Icon name="arrow right" />
                  To out queue
                </Button>
              </Grid.Column>
            </Grid>
          )}
          {alt && (
            <Grid columns={2}>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Button
                  color="grey"
                  icon
                  onClick={() => moveQueue(group.position_in_queue, true)}
                >
                  {" "}
                  <Icon name="arrow left" />
                   To in queue
                </Button>
              </Grid.Column>
              <Grid.Column textAlign="right" mobile={16} tablet={8} computer={8}>
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
