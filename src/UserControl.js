import {Button, FormControl, FormHelperText, Input, InputLabel, TextField} from "@mui/material";
import React from "react";


export default function UserControl() {
const [name, setName] = React.useState('');

const handleChange = (event) => {
    setName(event.target.value)

}
const handleSubmit = (event) => {
    event.preventDefault()
    console.log(name)
}

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
            <FormControl  style={{backgroundColor:"white", borderRadius:"5px"}}>
                <InputLabel style={{color:"black" ,paddingTop:"10px"}} htmlFor="my-input">User Name</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text"  value={name} onChange={handleChange}/>
                <FormHelperText id="my-helper-text">You need a username to participate.</FormHelperText>
                <Button onClick={handleSubmit} style={{color:"#010202", display:"block", width:"100%"}}>Submit</Button>
            </FormControl>
        </div>
    );
}
