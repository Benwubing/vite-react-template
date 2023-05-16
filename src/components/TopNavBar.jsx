import { Button, Grid, Header, Icon, Segment } from "semantic-ui-react";
import MessageModal from "./MessageModal";
import { useNavigate } from "react-router-dom";

export default function TopNavBar(props) {
  const {visible,setVisible} = props
  const navigate = useNavigate()
  const onLogout = ()=>{
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
          <Grid columns={2}>
            <Grid.Column>
              <Button.Group vertical labeled icon>
             <Button color="black" basic={visible} onClick={()=>setVisible(!visible)} icon="list" content="QMS Beta" />
              </Button.Group>
            </Grid.Column>
            
            <Grid.Column textAlign="right">
                <MessageModal
                    size="mini"
                    button={
                      <Button
                        size="small"
                        basic
                      ><Icon name="share"/>Logout</Button>
                    }
                    color="red"
                    message={""}
                    title="Log out"
                    subtitle="Are you sure you want to log out?"
                    onConfirm={onLogout}
                    confirmText={"Logout"}
                    cancelText="Cancel"
                  />
                
            </Grid.Column>
          </Grid>
  );
}
