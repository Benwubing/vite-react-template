
import { ChromePicker } from "react-color";
import { Input, Popup, Segment,Header, Label } from "semantic-ui-react";

export default function AddQueueColorPicker(props){
    const {label,color,onChange} = props;

    function wc_hex_is_light(c) {
        const hex = c.replace('#', '');
        const c_r = parseInt(hex.substring(0, 0 + 2), 16);
        const c_g = parseInt(hex.substring(2, 2 + 2), 16);
        const c_b = parseInt(hex.substring(4, 4 + 2), 16);
        const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
        return brightness > 155;
    }

    const isLight = wc_hex_is_light(color) ? "#333" : "#FFF"
    return (
        <Segment>
             <Header as="h4">{label} </Header>
                <Popup
                    trigger={<Label as='a' style={{background:color,color:isLight}} content={color} icon='eye dropper' />}
                    content={<ChromePicker color={color} onChange={onChange}/>}
                    on="click"
                />
        </Segment>
            
    )
}