import React, {useContext} from 'react';
import ElevatorContext from "./ElevatorContext";

const FloorSelection = () => {

    const elevatorProperties = useContext(ElevatorContext);
    const totalFloors:number=  elevatorProperties.totalFloors?? 7;

    const addToQueue = (floor:number) => {
      elevatorProperties.addToQueue(floor);
    }

    
    return (
        <div>

            {Array(totalFloors).fill(1).map((el, i) =>
                <button type="button" className="floorSelection-key" key={Math.random()} onClick={ ()=> addToQueue(i)} >{i}</button>
            )}

        </div>
    );
};

export default FloorSelection;
