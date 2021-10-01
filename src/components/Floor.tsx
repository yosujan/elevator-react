import React, {FC, useContext} from 'react';
import Button from "./Button";
import ElevatorContext from "./ElevatorContext";

interface FloorProps{
    number: number;
}

const Floor:FC<FloorProps> = ({number}) => {

    const elevatorProperties = useContext(ElevatorContext);

    const callElevator = (floor:number, wantsToGo:string)=>{

        elevatorProperties.addToQueue(floor, wantsToGo)

    }

    return (
        <div className="floor">

            <div className="outside">
                <h5>Floor {number}</h5>
                {elevatorProperties.totalFloors!==number+1 && <Button direction={"up"} onButtonClick={()=>callElevator(number, "up")} /> }

                {number !==0 && <Button direction={"down"} onButtonClick={() => callElevator(number, "down")}/>}
            </div>

            <div className="chamber"></div>

        </div>
    );
};

export default Floor;
