import { useNavigate } from "react-router";
import { Grid, Segment,Button,Container,Header,List, Icon,Image } from "semantic-ui-react";
import queuepeople from '../../assets/queue.jpeg'
export default function LandingPage(){

  const navigate = useNavigate()
  return (
    <div>
    <Segment  basic inverted  style={{ minHeight: 600, padding: '1em 0em' }}>
      <Grid columns={1}>
          <Grid.Column textAlign="right"> 
              <Button basic inverted onClick={()=>navigate("/login")}>Login</Button>
              <Button basic inverted onClick={()=>navigate("/register")}>Sign Up</Button>
          </Grid.Column>
        </Grid>
        <Segment basic padded textAlign="center">
            <Header as="h2" inverted style={{ fontSize: '3em' }}>SET UP QUEUES</Header>
            <Header as="h2" inverted style={{ fontSize: '6em' }}>EASILY</Header>
            <Button size="huge" color="blue" onClick={()=>navigate("/register")}>Get Started <Icon name="angle right" /></Button>
        </Segment>
    </Segment>

    <Segment  basic style={{ minHeight: 600, padding: '5em 5em' }}>
      <Grid columns={2}>
        <Grid.Column>
          <Segment basic>
              <Header as="h1">We Help Companies and Companions</Header>
              <p style={{ fontSize: '1.5em' }}>
                We can give your company superpowers to do things that they never thought possible. 
                Let us delight your customers and empower your needs.</p>
          </Segment>

            <Segment basic>
              <Header as="h1">Queuing MADE EASY!</Header>
              <p style={{ fontSize: '1.5em' }}>
                We can give your company superpowers to do things that they never thought possible. 
                Let us delight your customers and empower your needs.</p>
          </Segment>
        </Grid.Column>
        <Grid.Column >
            <Image src={queuepeople} size='large' rounded centered/>
        </Grid.Column>
      </Grid>
     
      
    </Segment>


     <Segment basic inverted  style={{ minHeight: 200, padding: '5em 5em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Religious Ceremonies</List.Item>
                <List.Item as='a'>Gazebo Plans</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>Banana Pre-Order</List.Item>
                <List.Item as='a'>DNA FAQ</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Favorite X-Men</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>


    </div>
   
  )
}