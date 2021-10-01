import React, {FC} from 'react';

interface ButtonProps{
    direction: string;
    onButtonClick: any;
}

const Button: FC<ButtonProps> = ({direction,onButtonClick }) => {
    
    // const onClick = (direction: string) => {
    //     onButtonClick(direction);
    // }

    return (<>
        <button type="button" className={"direction-"+direction} onClick={onButtonClick}>
            {direction} <i className={"arrow "+direction}></i>
        </button>

        </>
    );
};

export default Button;
