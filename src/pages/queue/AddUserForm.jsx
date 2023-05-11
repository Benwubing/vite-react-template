import React,{ useState } from "react";
import {
  Button,
  Form,
  Segment,
  Message,
  List,
  Modal,
  Icon,Header
} from "semantic-ui-react";
import QueueService from "../../services/QueueService";
import sha256 from "crypto-js/sha256";

export default function AddUserForm(props){
    const {id,hash,group,afterAdd } =props 
    const [errors, setErrors] = useState();
    const [contactType, setContactType] = useState("phone");
    const [contactValue, setContactValue] = useState("");
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);

    const phoneRegex = /^(\+65|65) \d{4}\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactOptions = [
    { key: "phone", text: "Phone", value: "phone" },
    { key: "email", text: "Email", value: "email" },
  ];
    const addUser = () => {
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

        if(!name || name.trim().length === 0){
            verdict=false;
            err.name = "Please enter name"
        }

        if (!verdict) {
            setErrors(err);
            return;
        } else {
           const psuedoDeviceHash = sha256(name+contactValue).toString();
           QueueService.joinQueue(id, psuedoDeviceHash, hash, contactType, contactValue, group)
            .then((res) => {
                afterAdd();
                setOpen(false)
            })
            .catch((error) => {
                setErrors({ general: "Unable to join queue:" + error });
            });
        }

    }

    const onContactTypeChange = (e, data) => {
        setContactType(data.value);
    };

    const onContactValueChange = (e) => {
        setContactValue(e.target.value);
    };

    return (

        <Modal
      size={"small"}
      dimmer={"blurring"}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color="teal"><Icon name="add"/> Add</Button>}
    >
      <Modal.Header ><b>Add User</b></Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Please fill in contact information</Header>
                      <p>
                Please enter customer's contact details so that we can notify them on
                their turn
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
                    "Please enter customer's " +
                    (contactType === "phone"
                    ? "phone number (.e.g. +65 1234 5678)"
                    : "email address")
                }
                value={contactValue}
                onChange={onContactValueChange}
                />

                <Form.Input
                placeholder={
                    "Please enter customer's name"
                }
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
            </Form>
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
                
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
       
          <Button
            content={"Join queue"}
            onClick={addUser}
            color={"green"}
          />
          <Button color="black" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>

       
      </Modal.Actions>
    </Modal>

    )
}