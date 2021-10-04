import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';

import Box from "./Box";
import Floor from './Floor';

type Direction="up"|"down";

interface ElevatorCall{
    floor: number;
    direction: Direction;
}

interface Elevator{
    totalFloors: number;
    calls: Array<ElevatorCall>;
    destinations: Array<number>;
    currentPosition: number;
    state: "moving"|"stopped"|"idle";
    currentDirection: Direction;
    target:number|null;  // final destination in the current direction
    idleSince?: number;
}

type ElevatorContextData = {
    elevator: Elevator;
    upCalls:Map<number,boolean>;
    downCalls: Map<number,boolean>;
    maxUpCallFrom:number;
    minUpCallFrom: number;
    maxDownCallFrom: number;
    minDownCallFrom: number;
    callFromOutside: (floor:number, direction:Direction)=>void;
    selectDestination: (floor:number)=>void;
    maxDestination: number;
    minDestination: number;
    selectedDestinations: Map<number, boolean>;
}


export const ElevatorContext = React.createContext<Partial<ElevatorContextData>>({});

export const ElevatorProvider= ElevatorContext.Provider;

const twomins= 2*60*1000;
const elevatorInitalState:Elevator= {totalFloors: 7 ,calls: [],destinations:[], currentPosition: 3, state: "idle", currentDirection:"up", target:null}

const Elevator:FC= () =>{

    const [elevator, setElevator] = useState<Elevator>(elevatorInitalState);

    const callFromOutside = (floor:number, direction:Direction) => {

        setElevator(e=>({...e, calls:[...e.calls, {floor,direction}]}))

    }


    const selectDestination = (floor:number) => {

        setElevator(e=>({...e, destinations:[...e.destinations, floor]}))

    }


    const elevatorContext:ElevatorContextData= useMemo(() => {

        const _upcalls = elevator.calls.filter((c)=>c.direction==="up");
        const _downcalls = elevator.calls.filter((c)=>c.direction==="down");

                return {
                    elevator,
                    upCalls: new Map(_upcalls.map(c=>[c.floor,true])),
                    downCalls: new Map(_downcalls.map(c=>[c.floor,true])),
                    maxUpCallFrom: Math.max(..._upcalls.map(c=>c.floor)),
                    minUpCallFrom: Math.min(..._upcalls.map(c=>c.floor)),
                    maxDownCallFrom: Math.max(..._downcalls.map(c=>c.floor)),
                    minDownCallFrom: Math.min(..._downcalls.map(c=>c.floor)),
                    maxDestination: Math.max(...elevator.destinations),
                    minDestination: Math.min(...elevator.destinations),
                    selectedDestinations: new Map(elevator.destinations.map(f=>[f, true])),
                    callFromOutside,
                    selectDestination
                }
        }, [elevator]);



    const stop = useCallback(()=>{

        setElevator(e=>({
            ...e,
            state:"stopped",
            destinations: e.destinations.filter(d=> d!==e.currentPosition),
            calls: e.calls.filter(c=> c.direction !== e.currentDirection || c.floor !== e.currentPosition)
        }))
    },[]);

    const moveElevator = useCallback((direction: Direction) => {

        setElevator(e=>({
            ...e,
            currentPosition: e.currentPosition+(direction==="up"?1:-1),
            state:"moving",
            currentDirection: direction,
            calls: e.calls.filter(c=> c.direction !== direction || c.floor !== e.currentPosition)
        }))

    },[])


    const idle = useCallback(() => {

        setElevator(e=> ({...elevatorInitalState, currentPosition:e.currentPosition, currentDirection:e.currentDirection, idleSince: Date.now()}))

    },[])


    const controller= useCallback(()=>{


        //if there are no calls and destinations -> make idle
        if(elevator.state !=="idle"
            && elevatorContext.maxUpCallFrom <= elevator.currentPosition
            && elevatorContext.minUpCallFrom >= elevator.currentPosition
            && elevatorContext.minDownCallFrom >= elevator.currentPosition
            && elevatorContext.maxDownCallFrom <= elevator.currentPosition
            && elevatorContext.minDestination >= elevator.currentPosition
            && elevatorContext.maxDestination <= elevator.currentPosition){

            idle();
            return;
        }
        else if (elevator.state==="idle" && elevator.idleSince && elevator.idleSince < Date.now()- (twomins) && elevator.currentPosition!==elevatorInitalState.currentPosition){
            // if idle for more than 2 mins -> goto 4t floor
            selectDestination(elevatorInitalState.currentPosition);

        }

        switch (elevator.currentDirection){
            case "up":

                if(elevator.state==="moving"){
                    // stop if this floor is destination
                    //stop if someone wants to go up from this floor OR this floor is the maximum level you towards up direction and someone wants to go down from here
                    if( elevatorContext.selectedDestinations.get(elevator.currentPosition)
                        || elevatorContext.upCalls.get(elevator.currentPosition)
                        || ( elevatorContext.downCalls.get(elevator.currentPosition) && elevatorContext.maxUpCallFrom < elevator.currentPosition && elevatorContext.maxDownCallFrom === elevator.currentPosition ) ){
                        stop()
                    }
                    else{
                        //otherwise move up
                        moveElevator("up")
                    }
                }
                else{
                    //when the elevetor has stopped
                    // Move up if someone from above the current floor has pressed the up button or dopwn button
                    // if someone wants to go above current floor
                    if(elevatorContext.maxUpCallFrom > elevator.currentPosition
                        || elevatorContext.maxDownCallFrom > elevator.currentPosition
                        || elevatorContext.maxDestination> elevator.currentPosition){
                        moveElevator("up")
                    }
                    else if(elevatorContext.minDownCallFrom < elevator.currentPosition    // do down if someone who is below the current position ha called the elevator
                        || elevatorContext.minUpCallFrom < elevator.currentPosition         //// OR someone from below the current position wants to go up
                        || elevatorContext.minDestination < elevator.currentPosition){
                        moveElevator("down")
                    }
                }
                break
            case "down":

                if(elevator.state==="moving"){
                    // stop if this floor is destination
                    //Stop if someone at the current position wants to go down
                    // OR the elevator is already below the minimum down call and someone wants to go up from current position
                    if(elevatorContext.selectedDestinations.get(elevator.currentPosition)
                        || elevatorContext.downCalls.get(elevator.currentPosition)
                        || (elevatorContext.upCalls.get(elevator.currentPosition) && elevatorContext.minDownCallFrom > elevator.currentPosition && elevatorContext.minUpCallFrom === elevator.currentPosition) ){
                        stop()
                    }
                    else{
                        moveElevator("down")
                    }
                }
                else{

                    // keep moving down if the someone below the current position of elevator wants do go down
                    // OR someone who is below the current position wants to go up
                    if(elevatorContext.minDownCallFrom < elevator.currentPosition
                        || elevatorContext.minUpCallFrom < elevator.currentPosition
                        || elevatorContext.minDestination < elevator.currentPosition){
                        moveElevator("down")
                    }
                    else if(elevatorContext.maxUpCallFrom > elevator.currentPosition   // move up if someone who is above the current position has called the elevator to go up
                        || elevatorContext.maxDownCallFrom > elevator.currentPosition
                        || elevatorContext.maxDestination > elevator.currentPosition){ // OR if someone who is above the current position wants to go down
                        moveElevator("up")
                    }
                }
                break
        }

    }, [elevatorContext, elevator])



    useEffect(() => {
        const timer = setInterval(controller, 1000);
        // Clear timeout if the component is unmounted
        return () => clearInterval(timer);
    }, [controller]);
    
    return (
        <div className="outer-wrapper">
        <div className="wrapper">

                <ElevatorProvider value={elevatorContext}>

                    <Box/>

                    {Array(elevator.totalFloors).fill(1).map((el, i) =>
                        <Floor number={elevator.totalFloors-i-1} key={Math.random()} />
                    )}

                </ElevatorProvider>

        </div>
            <div className="helper">

                <pre>
                {
                    JSON.stringify(elevatorContext, null, 2)
                }
                </pre>
            </div>
        </div>
    );
}

export default Elevator;