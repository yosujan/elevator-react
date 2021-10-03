import React, {FC, useContext} from 'react';
import FloorSelection from "./FloorSelection";
import {ElevatorContext} from "./Elevator";

interface BoxProps{

}

const Box:FC<BoxProps> = () => {

    const elevatorProperties = useContext(ElevatorContext);

    const currentPosition = elevatorProperties.elevator?.currentPosition??4;


    return (
        <div className="box" style={{"bottom":(currentPosition)*81}}>

            <FloorSelection/>
        </div>
    );
}

export default Box;