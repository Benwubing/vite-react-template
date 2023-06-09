import { useState } from "react";
import { Button, Icon, Modal, Header, Form, Grid, Divider,Segment } from "semantic-ui-react";
import QueueService from "../../services/QueueService";
import { BlockPicker } from "react-color";
import PreviewQueueDisplay from "./PreviewQueueDisplay";
import AddQueueColorPicker from "./AddQueueColorPicker";
import ColorTemplatePicker from "../profiles/ColorTemplatePicker";


export default function EditQueueModal(props) {
  const {queue} = props
  const defaultColors = ["#ffffff","#000000","#fbbd08","#000000","#fbbd08","#000000","#FBBD08","#000000","#fbbd08"]
  const { refresh } = props;
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [start_time, setStartTime] = useState(queue.start_time);
  const [end_time, setEndTime] = useState(queue.end_time);
  const [name, setName] = useState(queue.name);
  const [est_time, setEstTime] = useState(queue.estimated_wait_mins);
  const [prefix,setPrefix] = useState(queue.prefix)
  const [colorSettings,setColorSettings] = useState(queue.color_settings);

  function isStringValid(str) {
    return str && str.trim().length !== 0;
  }

  function isValidTime(timeString) {
    if(timeString.trim().length === 0) return false;
    const pattern = /^([01]\d|2[0-3])?([0-5]\d)?$/;
    return pattern.test(timeString);
  }
  const restartAll = () => {
    setGroupQueue(false);
    setColorSettings([...defaultColors])
  };

  const editQueue = () => {
    const err = {};

    let verdict = true;

    if (!isStringValid(name)) {
      verdict = false;
      err.name = "Please enter queue name";
    }

    if(!est_time){
      verdict=false;
      err.est_time="Please enter estimated time"
    }

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
      QueueService.updateQueue(queue.id,undefined,undefined,name,est_time,prefix,colorSettings,start_time,end_time)
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
      setEstTime(e.target.value);
  };

  const handleSetColor=(pos,c)=>{
    const newColor = JSON.parse(JSON.stringify(colorSettings));
    newColor[pos]=c
    setColorSettings(newColor)
  }

  const previewDisplay = ()=>{
    window.open("/preview-display?colors="+encodeURIComponent(colorSettings),'_blank', 'rel=noopener noreferrer')
  }

  return (
    <Modal
      size={"large"}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button color="orange" icon>
          <Icon name="edit" />
          Edit
        </Button>
      }
    >
      <Modal.Header>Update Queue</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header as="p">Start by filling up the following information</Header>
          <Divider/>
         
              <Form size="large">
            <Form.Input
              fluid
              label={"Queue Name *"}
              onChange={(event) => setName(event.target.value)}
              error={errors.name}
              value={name}
              placeholder="Queue Name"
            />

             <Grid columns={2}>
              <Grid.Column>
                 <Form.Input
                    fluid
                    maxLength="4"
                    label={"Start Time *"}
                    onChange={handleStartTime}
                    error={errors.start_time}
                    value={start_time}
                    max="2400"
                    placeholder="Start Time (0000 - 2359)"
                  />
              </Grid.Column>
               <Grid.Column>
                 <Form.Input
                    fluid
                    maxLength="4"
                    label={"End Time *"}
                    onChange={handleEndTime}
                    error={errors.end_time}
                    value={end_time}
                    max="2400"
                    placeholder="End Time (0000 - 2359)"
                  />
               </Grid.Column>
            </Grid><br/>
        
            <Form.Input
              fluid
              type="number"
              label={"Estimated wait time in mins per group added*"}
              onChange={handleEstTime}
              error={errors.est_time}
              value={est_time}
              placeholder="How much to extend the wait time per participant"
            />
             <Form.Input
              fluid
              maxLength="5"
              label={"Prefix for queue number"}
              onChange={(e)=>setPrefix(e.target.value)}
              error={errors.est_time}
              value={prefix}
              placeholder=".e.g. If this is A, queue will start with A101"
            />
            <Segment basic>
              <Grid columns={2}>
                <Grid.Column> <Header as="h3">Display color settings</Header></Grid.Column>
              </Grid>
              <Divider/>
              <ColorTemplatePicker onSelected={(c,v)=>setColorSettings(v.value)}/><br/><br/>
                <Grid columns={2}>
                    <Grid.Column phone={16} tablet={16} computer={8}>
                         <Grid columns={2}>
                            <Grid.Column mobile={16} tablet={16} computer={16}>
                                <AddQueueColorPicker label="Main Background" color={colorSettings[0]} onChange={(c)=>handleSetColor(0,c.hex)}/>
                            </Grid.Column>
                              <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Serving Background" color={colorSettings[8]} onChange={(c)=>handleSetColor(8,c.hex)}/>
                            </Grid.Column>
                             <Grid.Column mobile={16} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Serving Text" color={colorSettings[1]} onChange={(c)=>handleSetColor(1,c.hex)}/>
                            </Grid.Column>
                              <Grid.Column mobile={16} tablet={8} computer={8}>

                              <AddQueueColorPicker label="Est Time Background" color={colorSettings[2]} onChange={(c)=>handleSetColor(2,c.hex)}/>
                            </Grid.Column>
                              <Grid.Column mobile={16} tablet={8} computer={8}>

                              <AddQueueColorPicker label="Est Time Text" color={colorSettings[3]} onChange={(c)=>handleSetColor(3,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>

                              <AddQueueColorPicker label="Groups Background" color={colorSettings[4]} onChange={(c)=>handleSetColor(4,c.hex)}/>
                            </Grid.Column>
                             <Grid.Column mobile={16} tablet={8} computer={8}>

                              <AddQueueColorPicker label="Groups Text" color={colorSettings[5]} onChange={(c)=>handleSetColor(5,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>

                              <AddQueueColorPicker label="QR Background" color={colorSettings[6]} onChange={(c)=>handleSetColor(6,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                              <AddQueueColorPicker label="QR Text" color={colorSettings[7]} onChange={(c)=>handleSetColor(7,c.hex)}/>
                            </Grid.Column>
                          </Grid>

                    </Grid.Column>
                    <Grid.Column phone={16} tablet={16} computer={8}>
                      <Segment>
                        <Grid columns={2}>
                          <Grid.Column> <Header as="h4">Preview</Header></Grid.Column>
                           <Grid.Column textAlign="right"> <Button color="black" onClick={previewDisplay} icon> <Icon name='clone outline'/></Button></Grid.Column>
                        </Grid>
                         <PreviewQueueDisplay colors={colorSettings} compact={true}/>
                      </Segment>
                    </Grid.Column>
                </Grid>
            </Segment>
          </Form>    
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          onClick={editQueue}
          disabled={loading}
          loading={loading}
        >
          Update Queue
        </Button>

        <Button color="black" onClick={() => setOpen(false)} disabled={loading}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
