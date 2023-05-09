import { Grid, GridColumn, Button } from "semantic-ui-react";

export default function TopNavBar(props) {
  const { openMenu } = props;
  return (
    <Grid padded>
      <GridColumn floated="left" width={6} textAlign="left">
        <Button color="black" onClick={openMenu} icon="list" basic></Button>
      </GridColumn>
    </Grid>
  );
}
