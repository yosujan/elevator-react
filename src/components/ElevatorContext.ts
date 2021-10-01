import React from 'react';


interface Queue{
    up: Array<number>;
    down: Array<number>;
}


type ElevatorContextProps = {
    totalFloors: number,
    idleTime: number,
    idlePosition: number,
    queue: Queue,
    currentPosition: number,
    movingDirection: string,
    addToQueue?: any,
    setCurrentPosition?: React.Dispatch<React.SetStateAction<number>>,
    setMovingDirection?: React.Dispatch<React.SetStateAction<string>>,
}



const ElevatorContext = React.createContext<Partial<ElevatorContextProps>>({});

export const ElevatorProvider= ElevatorContext.Provider;

export default ElevatorContext;