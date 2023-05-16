import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu,Sidebar,Icon } from 'semantic-ui-react'

export default function SideNav (props){
    const {visible,setVisible} = props
    const navigate = useNavigate();
    return (
     <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width='thin'
          >
            <Menu.Item as='a' onClick={()=>navigate("/home")}>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a'  onClick={()=>navigate("/profile")}>
              <Icon name='user'/>
              Profile
            </Menu.Item>
          </Sidebar>
    )
  }
