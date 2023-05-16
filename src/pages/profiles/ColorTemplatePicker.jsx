import React from 'react'
import { Dropdown,Button,Icon } from 'semantic-ui-react'

const templateOptions = [
  { key: 'freshnblue', text: 'Fresh and Blue', value: `#05386B,#EDF5E1,#EDF5E1,#05386B,#EDF5E1,#05386B,#EDF5E1,#05386B,#05386B` },
  { key: 'bright', text: 'Bright Accent', value: `#242582,#fcfcfc,#f64c72,#fffff,#f64c72,#ffffff,#f64c72,#ffffff,#2A1B3D` },
  { key: 'dark', text: 'Dark', value: `#0b0c10,#66fcf1,#1f2833,#66FCF1,#1f2833,#66FCF1,#1f2833,#c5c6c7,#1F2833` },
  { key: 'pastel', text: 'Pastel', value: `#eee2dc,#ac3b61,#eee2dc,#ac3b61,#eee2dc,#ac3b61,#eee2dc,#123c69,#FFFFFF` },
  { key: 'green', text: 'Green', value: `#2c3531,#ffffff,#116466,#d1e8e2,#116466,#d1e8e2,#116466,#d1e8e2,#116466` },
  { key: 'desert', text: 'Desert', value: `#eae7dc,#5f4242,#d8c3a5,#5f4242,#d8c3a5,#5f4242,#d8c3a5,#5f4242,#D8C3A5` },
  { key: 'vivid', text: 'Sharp', value: `#44318d,#f6eef2,#2a1b3d,#f0f0f0,#2a1b3d,#d4ebf0,#d83f87,#f4f4f4,#d83f87` },
  { key: 'baby', text: 'Baby', value: `#84ceeb,#FFFFFF,#5680e9,#ffffff,#5680e9,#ffffff,#8860d0,#f4f4f4,#5680E9` },
{ key: 'youthful', text: 'Youthful', value: `#a64ac9,#ffffff,#fccd04,#151515,#ffb48f,#2a2828,#17e9e0,#000000,#F76C6C` },
 
]

const ColorTemplatePicker = (props) => {
    const {onSelected} = props;

    const onTemplateSelected = (c,v)=>{
      const payload = {value:v.value.split(",")}
      onSelected(c,payload)
    }
    return (
        <Button.Group color='teal'>
        <Button icon><Icon name="eye dropper"/> Template(s)</Button>
        <Dropdown
        className='button icon'
        floating
        onChange={onTemplateSelected}
        options={templateOptions}
        trigger={<></>}
        />
   
  
  </Button.Group>
    )
}
  

export default ColorTemplatePicker