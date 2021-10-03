import React, {FC} from 'react';

interface ButtonProps{
    direction: string;
    onButtonClick: any;
    active?: boolean|undefined;
}

const Button: FC<ButtonProps> = ({direction,onButtonClick, active }) => {
    

    return (<>
        <button type="button" className={"direction-"+direction + " "+ (active &&"active")} onClick={onButtonClick}>
            {direction} <i className={"arrow "+direction}></i>
        </button>

        </>
    );
};

export default Button;
