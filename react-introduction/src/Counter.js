import React, {useState} from 'react';

const Counter = () => {
    const [number, setNumber] = useState(0);
    
    const onInc = () => {
        setNumber(prevNumber => prevNumber + 1);
    }
    const onDec = () => {
        setNumber(number - 1);
    }

    return (
        <div>
            <h1>{number}</h1>
            <button onClick={onInc}>+1</button>
            <button onClick={onDec}>-1</button>
        </div>
    );
};

export default Counter;