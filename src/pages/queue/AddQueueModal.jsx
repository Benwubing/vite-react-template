import { useState } from "react";
import { Button, Icon, Modal, Header, Form } from "semantic-ui-react";
import QueueService from "../../services/QueueService";

export default function AddQueueModal(props) {
  const { refresh } = props;
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  // const [passcode, setPasscode] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [est_time, setEstTime] = useState("");
  const [groupQueue, setGroupQueue] = useState(false);

  function isStringValid(str) {
    return str && str.trim().length !== 0;
  }
  function isValidTime(timeString) {
    const pattern = /^([01]\d|2[0-3])?([0-5]\d)?$/;
    return pattern.test(timeString);
  }

  const restartAll = () => {
    setName("");
    // setPasscode("");
    setStartTime("");
    setEndTime("");
    setEstTime("");
    setGroupQueue(false);
  };

  const addQueue = () => {
    const err = {};

    let verdict = true;

    if (!isStringValid(name)) {
      verdict = false;
      err.name = "Please enter queue name";
    }

    // if (!isStringValid(passcode)) {
    //   verdict = false;
    //   err.passcode = "Please enter a passcode for your queue";
    // }

    if (!isValidTime(start_time)) {
      verdict = false;
      err.start_time = "Please enter valid start time";
    }

    if (!isValidTime(end_time)) {
      verdict = false;
      err.end_time = "Please enter valid end time";
    }

    if (start_time >= end_time) {
      verdict = false;
      err.end_time = "Please enter end time that is after start time";
    }

    if (!verdict) {
      setErrors(err);
    } else {
      setErrors({});
      QueueService.addQueue(name, start_time, end_time, groupQueue, est_time)
        .then((res) => {
          setLoading(false);
          setOpen(false);
          restartAll();
          refresh();
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.errors) {
            setErrors(e.response.data.errors);
          }
        });
    }
  };

  const handleStartTime = (e) => {
    const value = e.target.value;
    if (value.length === 0) {
      setStartTime(value);
      return;
    }
    const pattern = /^\d+$/;
    if (pattern.test(value)) {
      setStartTime(value);
    }
  };
  const handleEndTime = (e) => {
    const value = e.target.value;
    if (value.length === 0) {
      setEndTime(value);
      return;
    }
    const pattern = /^\d+$/;
    if (pattern.test(value)) {
      setEndTime(value);
    }
  };

  const handleEstTime = (e) => {
    const value = e.target.value;
    const pattern = /^\d+$/;
    if (pattern.test(value)) {
      setEstTime(value);
    }
  };

  return (
    <Modal
      size={"large"}
      dimmer={"blurring"}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button color="green" icon>
          <Icon name="add" />
          New Queue
        </Button>
      }
    >
      <Modal.Header>Add Queue</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Start by filling up the following information</Header>
          <Form size="large">
            <Form.Input
              fluid
              onChange={(event) => setName(event.target.value)}
              error={errors.name}
              value={name}
              placeholder="Queue Name"
            />
            <Form.Input
              fluid
              maxLength="4"
              onChange={handleStartTime}
              error={errors.start_time}
              value={start_time}
              max="2400"
              placeholder="Start Time (0000 - 2359)"
            />
            <Form.Input
              fluid
              maxLength="4"
              onChange={handleEndTime}
              error={errors.end_time}
              value={end_time}
              max="2400"
              placeholder="End Time (0000 - 2359)"
            />
            <Form.Input
              fluid
              type="number"
              onChange={handleEstTime}
              error={errors.est_time}
              value={est_time}
              placeholder="Estimated wait time in mins"
            />
            {/* <Form.Input
              fluid
              onChange={(event) => setPasscode(event.target.value)}
              error={errors.passcode}
              value={passcode}
              placeholder="Passcode used for your queue displays"
              type="password"
            /> */}
            <Form.Checkbox
              toggle
              onChange={(e, d) => setGroupQueue(d.checked)}
              checked={groupQueue}
              label="Allow group queuing"
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          onClick={addQueue}
          disabled={loading}
          loading={loading}
        >
          Add Queue
        </Button>

        <Button color="black" onClick={() => setOpen(false)} disabled={loading}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
