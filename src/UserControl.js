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
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor:"white", borderRadius:"5px", padding:"10px" }}>
            <FormControl>
                <InputLabel style={{color:"black"}} htmlFor="my-input">User Name</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text"  value={name} onChange={handleChange}/>
                <FormHelperText id="my-helper-text">You need a username to participate.</FormHelperText>
                <Button size="small" variant="outlined" onClick={handleSubmit} style={{color:"#010202", display:"block", width:"100%"}}>Submit</Button>
            </FormControl>
        </div>
    );
}
