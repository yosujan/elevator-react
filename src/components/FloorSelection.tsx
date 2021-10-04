import React, {useContext} from 'react';
import {ElevatorContext} from "./Elevator";

const FloorSelection = () => {

    const elevatorProperties = useContext(ElevatorContext);
    const totalFloors:number=  elevatorProperties.elevator?.totalFloors??7;

    const setDestination = (floor:number) => {
      elevatorProperties.selectDestination?.(floor)
    }

    
    return (
        <div className="buttons-panel">
            {Array(totalFloors).fill(1).map((el, i) =>
                <button type="button" className={"floorSelection-key "+ (elevatorProperties.selectedDestinations?.get(totalFloors-i-1)&&"active") } key={i} onClick={ ()=> setDestination(totalFloors-i-1)} >{totalFloors-i-1}</button>
            )}

        </div>
    );
};

export default FloorSelection;
