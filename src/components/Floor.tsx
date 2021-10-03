import React, {FC, useContext} from 'react';
import Button from "./Button";
import {ElevatorContext} from "./Elevator";

interface FloorProps{
    number: number;
}

const Floor:FC<FloorProps> = ({number}) => {

    const elevatorProperties = useContext(ElevatorContext);

    return (
        <div className="floor">

            <div className="outside">
                <h5>Floor {number}</h5>
                {elevatorProperties?.elevator?.totalFloors!==number+1 && <Button active={!!(elevatorProperties.upCalls?.get(number))} direction={"up"} onButtonClick={()=> elevatorProperties.callFromOutside?.(number, "up") } /> }

                {number !==0 && <Button direction={"down"} active={!!(elevatorProperties.downCalls?.get(number))} onButtonClick={()=> elevatorProperties.callFromOutside?.(number, "down")}/>}

            </div>

            <div className="chamber"></div>

        </div>
    );
};

export default Floor;
