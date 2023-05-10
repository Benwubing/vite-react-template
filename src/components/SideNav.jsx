import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class SideNav extends Component {
  state = {}
  handleItemClick = (e,  name ) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>Queues</Menu.Header>

          <Menu.Menu>
            <Menu.Item
                icon="list"
              name={"My Queues"}
              active={activeItem === 'My Queues'}
              onClick={(e)=>this.handleItemClick(e,"home")}
            />
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    )
  }
}