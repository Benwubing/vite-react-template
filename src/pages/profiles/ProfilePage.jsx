import { Navigate } from "react-router-dom";
import {
  Grid,
  Sidebar,Segment,Header,Divider,Button,Icon
} from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import SideNav from "../../components/SideNav";
import TopNavBar from "../../components/TopNavBar";
import AddQueueColorPicker from "../queue/AddQueueColorPicker";
import PreviewQueueDisplay from "../queue/PreviewQueueDisplay";
import ColorTemplatePicker from "./ColorTemplatePicker";
import { useQuery } from "react-query";
import QueueService from "../../services/QueueService";

export default function ProfilePage() {
   const [visible, setVisible] = useState(false)
   const defaultColors = ["#ffffff","#000000","#fbbd08","#000000","#fbbd08","#000000","#FBBD08","#000000","#fbbd08"]
   const [colorSettings,setColorSettings] = useState()
   const [loading,setLoading] = useState(false)
   const [error,setError] = useState()

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  useEffect(()=>{
    QueueService.getSettings().then((res)=>{
      const {data} = res;
      if(data && data.color_settings){
        setColorSettings(data.color_settings)
      }else{
        setColorSettings([...defaultColors])
      }
    })
  },[])

    const previewDisplay = ()=>{
        window.open("/preview-display?colors="+encodeURIComponent(colorSettings),'_blank', 'rel=noopener noreferrer')
    }
    const handleSetColor=(pos,c)=>{
    const newColor = JSON.parse(JSON.stringify(colorSettings));
    newColor[pos]=c
    setColorSettings(newColor)
  }

  const handleTemplateChange = (c,v)=>{
    setColorSettings(v.value)
  }

  const onSaveSettings = ()=>{
    setLoading(true)
    QueueService.saveSettings(colorSettings).then((res)=>{
    setLoading(false)
    }).catch((err)=>{
      setLoading(false)
      console.log(err)
      setError(err+"")
    })
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
                <Header as="h1">Profile Settings</Header>
                <Divider />
                <br />
                            <Segment basic>
              <Header as="h2">Branding</Header>
              <Divider/>
              <p>
              <i>Choose your colors for branding your display panel that will be applied by default to all new queues that you have added.</i>
              </p>

                {colorSettings && (
                <Grid >
                  <Grid.Column phone={16} tablet={16} computer={16}>
                    <ColorTemplatePicker onSelected={handleTemplateChange}/>
                  </Grid.Column>
                    <Grid.Column phone={16} tablet={16} computer={8}>
                         <Grid columns={2}>
                            <Grid.Column mobile={8} tablet={8} computer={16}>
                                <AddQueueColorPicker label="Main Background" color={colorSettings[0]} onChange={(c)=>handleSetColor(0,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Serving Background" color={colorSettings[8]} onChange={(c)=>handleSetColor(8,c.hex)}/>
                            </Grid.Column>
                             <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Serving Text" color={colorSettings[1]} onChange={(c)=>handleSetColor(1,c.hex)}/>
                            </Grid.Column>
                              <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Est Time Background" color={colorSettings[2]} onChange={(c)=>handleSetColor(2,c.hex)}/>
                            </Grid.Column>
                              <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Est Time Text" color={colorSettings[3]} onChange={(c)=>handleSetColor(3,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Groups Background" color={colorSettings[4]} onChange={(c)=>handleSetColor(4,c.hex)}/>
                            </Grid.Column>
                             <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="Groups Text" color={colorSettings[5]} onChange={(c)=>handleSetColor(5,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={8} tablet={8} computer={8}>
                              <AddQueueColorPicker label="QR Background" color={colorSettings[6]} onChange={(c)=>handleSetColor(6,c.hex)}/>
                            </Grid.Column>
                            <Grid.Column mobile={8} tablet={8} computer={8}>
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
                    <Grid.Column phone={16} tablet={16} computer={16} textAlign="right">
                            <Button color="green" onClick={onSaveSettings} disabled={loading} loading={loading}>Save</Button>
                    </Grid.Column>
                </Grid>
                )}
               
            </Segment>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
      </Grid>
    </div>
  );
}
