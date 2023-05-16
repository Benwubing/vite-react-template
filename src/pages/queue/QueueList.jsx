import {
  Divider,
  Header,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Segment,
  Table,
} from "semantic-ui-react";

import { useQuery } from "react-query";
import QueueService from "../../services/QueueService";
import Loading from "../../components/Loading";
import QueueActions from "./QueueActions";
import React from "react";
import AddQueueModal from "./AddQueueModal";
import { Link } from "react-router-dom";
import TopNavBar from "../../components/TopNavBar";

export default function QueueList() {
    if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  const { data, isLoading, refetch } = useQuery(
    "getQueues",
    () =>
      QueueService.getQueues().then((res) => {
        const { data } = res;
        if (data.data) {
          return data.data;
        } else {
          return [];
        }
      }),
    {
      refetchInterval: 5000, // Fetch every 5 seconds
      enabled: true, // Start fetching immediately
    }
  );

  const refetchQueues = () => {
    refetch();
  };

  const queues =
    data && data.length > 0
      ? data.map((r) => {
          if (r && r.attributes) {
            const attr = r.attributes;
            return (
              <TableRow key={r.id}>
                <TableCell>
                  <Link to={"/view/"+r.id}><b>{attr.name}</b></Link>
                </TableCell>
                <TableCell>{attr.groups.length}</TableCell>
                <TableCell>{attr.next_in_line}</TableCell>
                <TableCell>{attr.estimated_wait_mins}</TableCell>
                <TableCell>{attr.start_time}</TableCell>
                <TableCell>{attr.end_time}</TableCell>
                {/* <TableCell>
                  {attr.group_queue ? (
                    <Icon name="check" color="green"></Icon>
                  ) : (
                    <Icon name="delete" color="red"></Icon>
                  )}
                </TableCell> */}
                <TableCell>
                  <QueueActions queue={r} refreshList={refetchQueues} />
                </TableCell>
              </TableRow>
            );
          } else {
            return (
              <TableRow>
                <TableCell colSpan={7}>Empty</TableCell>
              </TableRow>
            );
          }
        })
      : [];
  return (
    <div>
      <Header as="h1">My Queues</Header>
      <Divider />

      {isLoading && (
        <Segment textAlign="center">
          <Loading />
        </Segment>
      )}

      {!isLoading && (
        <React.Fragment>
          <AddQueueModal refresh={refetchQueues} />
          <Table celled padded>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>In Queue</TableHeaderCell>
                <TableHeaderCell>Next-in-Queue</TableHeaderCell>
                <TableHeaderCell>Est. waiting time</TableHeaderCell>
                <TableHeaderCell>Start Time</TableHeaderCell>
                <TableHeaderCell>End Time</TableHeaderCell>
                {/* <TableHeaderCell>Allow Groups</TableHeaderCell> */}
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} textAlign="center">
                    <b>No queues right now</b>
                  </TableCell>
                </TableRow>
              )}

              {queues}
            </TableBody>
          </Table>
        </React.Fragment>
      )}
    </div>
  );
}
