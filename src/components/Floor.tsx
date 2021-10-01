import React, {FC, useContext} from 'react';
import Button from "./Button";
import ElevatorContext from "./ElevatorContext";

interface FloorProps{
    number: number;
}

const Floor:FC<FloorProps> = ({number}) => {

    const elevatorProperties = useContext(ElevatorContext);

    const callElevator = (floor:number)=>{

        elevatorProperties.addToQueue(floor)

    }

    return (
        <div className="floor">

            <div className="outside">
                <h5>Floor {number}</h5>
                <Button direction={"up"} onButtonClick={()=>callElevator(number)} />
                <Button direction={"down"} onButtonClick={()=>callElevator(number)} />
            </div>

            <div className="chamber"></div>

        </div>
    );
};

export default Floor;
