import React, {FC, useEffect, useState} from 'react';
import {ElevatorProvider} from "./ElevatorContext";
import Box from "./Box";
import Floor from './Floor';

interface ElevatorProps {
    totalFloors: number;
    idleTime: number;
    idlePosition: number;
};

interface Queue{
    up: Array<number>;
    down: Array<number>;
}

const Elevator:FC<ElevatorProps> = ({totalFloors, idleTime, idlePosition}) =>{

    const fourMins=4*60*1000;

    const [queue, setQueue] = useState<Queue>({up:[], down:[]});
    const [currentPosition, setCurrentPosition] = useState(4);
    const [movingDirection, setMovingDirection] = useState("down");
    const [idleCount, setIdleCount] = useState(fourMins);

    const init = new Date()
    const [date, setDate] = useState(init)

    const tick = () => {
        setDate(new Date())
    }

    useEffect(() => {
        const timerID = setTimeout(() => tick(), 1000)
        return () => {
            clearTimeout(timerID)
        }
    }, [date])


    const moveBox = () =>{

        var newIdleCount=idleCount-3000;

        let goTo;

        if(movingDirection==="up"){
            goTo= queue.up.pop();
        }
        if(movingDirection==="down"){
            goTo= queue.down.pop();
        }

        console.log(goTo);
        if(goTo !== undefined) {
            console.log("hello")
            console.log("Going to ", goTo, " Direction: ", movingDirection)
            setCurrentPosition(goTo);
            newIdleCount=fourMins;
        }

        if(idleCount<=0){
            setCurrentPosition(4)
            newIdleCount=fourMins;
        }

        setIdleCount(newIdleCount);

        if(movingDirection==="up" && queue.up.length===0){
            setMovingDirection("down");
        }
        if(movingDirection==="down" && queue.down.length===0){
            setMovingDirection("up");
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            moveBox();
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    });


    const unique = (value:number, index:number, self:Array<number>) => {
        return self.indexOf(value) === index
    }


    const addToQueue = (floor: number)=>{

        var _queue=queue;

        if(floor > currentPosition ){
        //    add to up arra
            _queue={...queue, up: [...queue.up, floor].filter(unique).sort((a,b)=>{return (b-a)})}
        }
        else{
            _queue={...queue, down: [...queue.down, floor].filter(unique).sort()}
        }

        // var _queue=[...queue, floor].filter(unique).sort()
        // elevatorSort(currentPosition, _queue, movingDirection);
        setQueue(_queue);
    }

    const elevatorProperties={
        totalFloors: 7,
        idleTime: 4,
        idlePosition: 4,
        queue: queue,
        addToQueue: addToQueue,
        currentPosition: currentPosition?? 4,
        setCurrentPosition: setCurrentPosition,
        movingDirection: movingDirection,
        setMovingDirection: setMovingDirection
    }
    
    return (
        <div className="outer-wrapper">
        <div className="wrapper">

                <ElevatorProvider value={elevatorProperties}>

                    <Box/>

                    {Array(totalFloors).fill(1).map((el, i) =>
                        <Floor number={totalFloors-i-1} key={Math.random()} />
                    )}

                </ElevatorProvider>

        </div>
            <div className="helper">
                <code>
                {JSON.stringify(queue)} <br/>
                    {idleCount} <br/>
                    Current: {currentPosition} <br/>
                    Moving : {movingDirection} <br/>


                </code>

                <div>
                    {
                        date.toLocaleTimeString()
                    }
                </div>

            </div>
        </div>
    );
}

export default Elevator;