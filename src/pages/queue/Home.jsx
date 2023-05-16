import { Navigate } from "react-router-dom";
import {
  Grid,
  Sidebar,
  Icon,Segment, Button
} from "semantic-ui-react";
import React, { useState } from "react";
import QueueList from "./QueueList";
import SideNav from "../../components/SideNav";
import TopNavBar from "../../components/TopNavBar";

export default function Home() {
   const [visible, setVisible] = useState(false)
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Grid columns={1} padded>
      <Grid.Column>
        <TopNavBar visible={visible} setVisible={setVisible}/>
      </Grid.Column>
      <Grid.Column>
        <Sidebar.Pushable as={Segment}>
          <SideNav visible={visible} setVisible={setVisible}/>
          <Sidebar.Pusher className="content-container" dimmed={visible}>
            <Segment basic>
                <QueueList  />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
      </Grid>
    </div>
  );
}
