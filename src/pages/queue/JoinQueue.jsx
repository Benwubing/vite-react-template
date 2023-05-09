import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  List,
  Message,
  Button,
  Grid,
  Statistic,
  Divider,
  Form,
  Segment,
  Icon,
  Input,
} from "semantic-ui-react";
import QueueService from "../../services/QueueService";
import sha256 from "crypto-js/sha256";
import Loading from "../../components/Loading";
import MessageModal from "../../components/MessageModal";
import QRCode from "react-qr-code";

export default function JoinQueue() {
  const { id, hash, group } = useParams();
  const [errors, setErrors] = useState("");
  const [contactType, setContactType] = useState("phone");
  const [contactValue, setContactValue] = useState("");
  const navigate = useNavigate();
  const phoneRegex = /^(\+65|65) \d{4}\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const deviceId = navigator.userAgent;
  const deviceHash = sha256(deviceId).toString();

  const contactOptions = [
    { key: "phone", text: "Phone", value: "phone" },
    { key: "email", text: "Email", value: "email" },
  ];

  const onLeave = () => {
    QueueService.leaveQueue(id, deviceHash).then((res) => {
      navigate("/leave");
    });
  };

  const {
    data: existingData,
    isLoading: existLoading,
    refetch,
  } = useQuery("getExistingParticipant", async () => {
    const { data } = await QueueService.existInQueue(id, deviceHash);
    return data;
  });

  const onJoin = () => {
    setErrors();
    let verdict = true;
    const err = {};
    if (contactType === "phone" && !phoneRegex.test(contactValue)) {
      verdict = false;
      err.contactValue =
        "Please enter a valid phone number (e.g. +65 12345678 OR 65 12345678)";
    }

    if (contactType === "email" && !emailRegex.test(contactValue)) {
      verdict = false;
      err.contactValue = "Please enter a valid email";
    }

    if (!verdict) {
      setErrors(err);
    } else {
      QueueService.joinQueue(
        id,
        deviceHash,
        hash,
        contactType,
        contactValue,
        group
      )
        .then((res) => {
          refetch();
        })
        .catch((error) => {
          setErrors({ general: "Unable to join queue:" + error });
        });
    }
  };

  const onJoinAsGuest = () => {
    QueueService.joinQueue(id, deviceHash, hash, undefined, undefined, group)
      .then((res) => {
        refetch();
      })
      .catch((error) => {
        setErrors({ general: "Unable to join queue:" + error });
      });
  };

  const onRefresh = () => {
    refetch();
  };

  const onContactTypeChange = (e, data) => {
    console.log(data.value);
    setContactType(data.value);
  };

  const onContactValueChange = (e) => {
    setContactValue(e.target.value);
  };

  if (existLoading) {
    return <Loading />;
  }

  if (existingData === undefined || existingData.result === "new") {
    return (
      <Grid columns={4} centered padded>
        <Grid.Column textAlign="center" mobile={12} table={12} computer={4}>
          <Card>
            <Card.Content>
              <Card.Header>Join the queue!</Card.Header>
              <Card.Description>
                <Divider />
                <p>
                  Please enter your contact details so that we can notify you on
                  your turn
                </p>
                <Form size="large">
                  <Segment>
                    <Form.Dropdown
                      fluid
                      value={contactType}
                      onChange={onContactTypeChange}
                      options={contactOptions}
                    />
                  </Segment>

                  <Form.Input
                    placeholder={
                      "Please enter your " +
                      (contactType === "phone"
                        ? "phone number (.e.g. +65 1234 5678)"
                        : "email address")
                    }
                    value={contactValue}
                    onChange={onContactValueChange}
                  />
                  <Button color="green" onClick={onJoin}>
                    Join Queue
                  </Button>
                  <br />
                  <br />

                  <Link color="grey" onClick={onJoinAsGuest}>
                    Continue as Guest
                  </Link>
                </Form>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {errors && (
                <Message error>
                  <List as="ul">
                    {Object.keys(errors).map((e, index) => (
                      <List.Item as="li" key={index}>
                        {errors[e]}
                      </List.Item>
                    ))}
                  </List>
                </Message>
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }

  const datetimeString = existingData.created_at;
  const datetime = new Date(datetimeString);

  // Get the date in ISO format (yyyy-mm-dd)
  const date = datetime.toISOString().split("T")[0];

  // Get the time in 24-hour format (hh:mm:ss)
  const time = datetime.toTimeString().slice(0, 5);

  const groupQR =
    existingData.active && existingData.group_hash ? (
      <div>
        <p>Scan the QR code to join the group</p>
        <QRCode
          value={
            `${window.location.protocol}//${window.location.hostname}/join/` +
            id +
            "/" +
            hash +
            "/" +
            existingData.group_hash
          }
        />
        <Input
          fluid
          value={
            `${window.location.protocol}//${window.location.hostname}/join/` +
            id +
            "/" +
            hash +
            "/" +
            existingData.group_hash
          }
        ></Input>
      </div>
    ) : (
      ""
    );

  return (
    <Grid columns={4} centered padded>
      <Grid.Column textAlign="center" mobile={12} table={12} computer={4}>
        <Card>
          <Card.Content>
            <Card.Header>
              {existingData.active && <p> You have joined the queue! </p>}
              {!existingData.active && (
                <p> Your number has already been called </p>
              )}
            </Card.Header>
            <Card.Description>
              <Statistic>
                <Statistic.Value>
                  #{existingData.position_in_queue}
                </Statistic.Value>
                <Statistic.Label>Queue Number</Statistic.Label>
              </Statistic>
              <br />
              {groupQR}

              <Divider />
              {existingData.active && (
                <Button color="green" onClick={onRefresh}>
                  <Icon name="refresh" />
                  Update
                </Button>
              )}

              {!existingData.active && (
                <p>
                  {" "}
                  If you missed your queue, please approach the staff to be set
                  back into the queue{" "}
                </p>
              )}

              {existingData.active && (
                <MessageModal
                  size="mini"
                  button={
                    <Button basic color="red">
                      Leave Queue
                    </Button>
                  }
                  message={"Are you sure you want to leave the queue?"}
                  title="Leave Queue"
                  subtitle="You are about to leave"
                  cancelText="Close"
                  onConfirm={onLeave}
                  confirmText={"Leave Queue"}
                  color="red"
                />
              )}
              <br />
              <br />
              {existingData.currently_serving && (
                <p>Currently serving :#{existingData.currently_serving}</p>
              )}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <span className="date">
              Joined queue in {date} {time}
            </span>
          </Card.Content>
        </Card>
      </Grid.Column>

      {errors && <Message error>{errors}</Message>}
    </Grid>
  );
}
