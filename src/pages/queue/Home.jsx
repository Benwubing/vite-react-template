import { Navigate, useNavigate } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";
import {
  Segment,
  GridColumn,
  SidebarPushable,
  Sidebar,
  Menu,
  MenuItem,
  Icon,
  Grid,
  SidebarPusher,
} from "semantic-ui-react";
import React, { useState } from "react";
import QueueList from "./QueueList";
import ViewQueue from "./ViewQueue";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [activeQueue, setActiveQueue] = useState();
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  const handleMenuClick = (pg) => {
    setActivePage(pg);
    setMenuOpen(false);
  };

  const handleSelectQueue = (id) => {
    setActiveQueue(id);
    handleMenuClick(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <React.Fragment>
      <TopNavBar openMenu={() => setMenuOpen(!menuOpen)} />
      <Grid columns={1}>
        <GridColumn>
          <SidebarPushable as={Segment}>
            <Sidebar
              as={Menu}
              animation="overlay"
              icon="labeled"
              onHidden={() => setMenuOpen(false)}
              inverted
              vertical
              visible={menuOpen}
              width="thin"
            >
              <MenuItem as="a" onClick={() => handleMenuClick(0)}>
                <Icon name="list"></Icon>
                My Queues
              </MenuItem>
              <MenuItem as="a" onClick={handleLogout}>
                <Icon name="share square"></Icon>
                Logout
              </MenuItem>
            </Sidebar>

            <SidebarPusher dimmed={menuOpen}>
              <Segment basic className="max-height">
                {activePage === 0 && (
                  <QueueList onSelectQueue={handleSelectQueue} />
                )}

                {activePage === 1 && (
                  <ViewQueue
                    id={activeQueue}
                    onBack={() => handleMenuClick(0)}
                  />
                )}
              </Segment>
            </SidebarPusher>
          </SidebarPushable>
        </GridColumn>
      </Grid>
    </React.Fragment>
  );
}
