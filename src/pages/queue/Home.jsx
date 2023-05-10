import { Navigate } from "react-router-dom";
import {
  Grid,
} from "semantic-ui-react";
import React from "react";
import QueueList from "./QueueList";

export default function Home() {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  return (
    <React.Fragment>
      <Grid columns={1} padded>
        <Grid.Column>
            <QueueList  />
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
}
