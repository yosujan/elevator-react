import React, {useContext} from 'react';
import {ElevatorContext} from "./Elevator";

const FloorSelection = () => {

    const elevatorProperties = useContext(ElevatorContext);
    const totalFloors:number=  elevatorProperties.elevator?.totalFloors??7;

    const addToQueue = (floor:number) => {
      elevatorProperties.selectDestination?.(floor)
    }

    
    return (
        <div>

            {Array(totalFloors).fill(1).map((el, i) =>
                <button type="button" className="floorSelection-key" key={i} onClick={ ()=> addToQueue(i)} >{i}</button>
            )}

        </div>
    );
};

export default FloorSelection;
