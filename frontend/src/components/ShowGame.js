import React from 'react'
import {ListGroup, ListGroupItem, ListGroupItemText} from 'reactstrap'

const ShowGame = (props) => {
  return (
   <ListGroup>
    { props.games.map(game => 
      <ListGroupItem key={game._id} id={game._id}>
        <ListGroupItemText>
         {game.name}
        </ListGroupItemText>
      </ListGroupItem>
     )}
    

 </ListGroup>
  )
}

export default ShowGame
