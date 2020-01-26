import React, { useState, useRef } from 'react';

const InputSample = () => {
    const [inputs, setInputs] = useState({
        name: '',
        nickname: '',
    });
    const nameInput = useRef();
    //userRef 호출
    const {name, nickname} = inputs;

    const onChange = e => {
        const {name, value} = e.target;
        setInputs({
             ...inputs, 
	        //inputs 객체 복사
            [name]: value,
            //nextInputs[name] = value 와 동일함
            //name 들의 값이 name 일 수도 있고 nickname 일 수도 있음
        });
       
    }

    const onReset = () => {
        setInputs({
            name:'',
            nickname:''
        })
        nameInput.current.focus();
        //해당 dom 직접 선택하여 이벤트연결
    }

    return (
        <div>
            <input 
                name="name" 
                placeholder="이름" 
                onChange={onChange} 
                value={name}
                ref = {nameInput}
                //userRef 설정
            />
            <input 
                name="nickname" 
                placeholder="닉네임" 
                onChange={onChange} 
                value={nickname}
            />
            <button onClick={onReset}>초기화</button>
            <div>
            <b>값: </b>
            {name} ({nickname})
            </div>
        </div>
    );
};
export default InputSample;