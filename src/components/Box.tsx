import React, {FC, useContext} from 'react';
import FloorSelection from "./FloorSelection";
import ElevatorContext from "./ElevatorContext";

interface BoxProps{

}

const Box:FC<BoxProps> = () => {

    const elevatorProperties = useContext(ElevatorContext);

    const currentPosition = elevatorProperties.currentPosition?? 4;


    return (
        <div className="box" style={{"bottom":(currentPosition)*80}}>

            <FloorSelection/>
        </div>
    );
}

export default Box;