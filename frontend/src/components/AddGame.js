import React from 'react'
import {Input, Button} from 'reactstrap'

const AddGame = (props) => {
  return (
    <div>
      <Input name="gamename" onChange={props.change} />
      <Button onClick={props.add} block>Add Game</Button>
    </div>
  )
}

export default AddGame
