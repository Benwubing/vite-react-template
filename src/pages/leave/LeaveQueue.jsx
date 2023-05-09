import { Card, Grid } from "semantic-ui-react";

export default function LeaveQueue() {
  return (
    <Grid columns={4} centered padded>
      <Grid.Column textAlign="center" width={8}>
        <Card fluid>
          <Card.Content>
            <Card.Header>You have left the queue</Card.Header>
            <Card.Description>
              Sorry to see you leave, come back again next time!
            </Card.Description>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  );
}
