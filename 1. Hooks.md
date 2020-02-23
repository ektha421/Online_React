# Hooks
## 1. useState
### 1) 여러개의 input 상태 관리하기 / useRef

```js
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
```

## 2. useRef

### 1) 사용하는 경우 

> useRef 로 관리하는 값은 바뀌어도 리렌더링이 되지 않음

* setTimeout, setInterval의 id
* 외부라이브러리를 사용하여 생성된 인스턴스
* scroll 위치
* input focus 
* 특정 dom을 선택해야 할 때
* 값을 기억하여 관리해야 할 때 등

```js
// useRef로 변수관리
const nextId = useRef(4);

const onCreate = () => {
    console.log(nextId.current);
    nextId.current += 1;
}
//useRef로 생성한 값은 굳이 렌더링되지 하지 않아도 되고 계속 기억하고 싶을 때, 컴포넌트가 리렌더링되도 기억되서 계속 사용할 수 있음. 하지만 값을 바꾸면 바뀜.
```

## 3. useEffect
> 컴포넌트가 마운트 됐을 때 (처음 나타났을 때), 언마운트 됐을 때 (사라질 때), 그리고 업데이트 될 때 (특정 props가 바뀔 때) 특정 작업을 처리하는 방법

* 마운트될 때 사용 예시(처음 나타났을 때)
 - props => state(컴포넌트의 로컬 상태로 설정)
 - 외부 API 요청(REST API 등)
 - 라이브러리 사용(D3 Video.js 등)
 - setInterval을 통한 반복작업 이나 setTimeout을 통한 작업 예약

* 언마운트될 때 예시(사라질 때)
 - setInterval, setTimeout 을 사용하여 등록한 작업들 clear 하기 (clearInterval, clearTimeout)
 - 라이브러리 인스턴스 제거

### 1) 마운트/언마운트

```js
  useEffect(() => {
    console.log('컴포넌트가 화면에 나타남');
    return () => {
      console.log('컴포넌트가 화면에서 사라짐');
    };
  }, []);
```
* 첫번째 파라미터엔 함수넣기
* 두번째 파라미터엔 [ ] 배열등록: 빈배열 경우는 처음 나타날때만 실행, 조회하는 값이나 상태가 있다면 배열에 넣어줘야함.
* return() => {} cleanup(뒷정리함수): []가 비어있는 경우엔 컴포넌트가 사라질때 cleanup 함수 호출


### 2) []에 특정값 넣기

```js
  useEffect(() => {
    console.log('user 값이 설정됨');
    console.log(user);
    return () => {
      console.log('user 가 바뀌기 전..');
      console.log(user);
    };
  }, [user]);
```

* useEffect 안에서 사용하는 상태나, props가 있다면, useEffect의 []에 넣어주어야함. 만약 []안에 상태나 props를 넣지 않으면 useEffect에 등록한 함수가 실행 될 때 최신 props / 상태를 가르키지 않게 됨.

### 3) [] 파라미터 생략

```js
 useEffect(() => {
    console.log(user);
  });
```

* 컴포넌트가 리렌더링 될 때마다 호출됨

> 리액트는 기본적으로 부모 컴포넌트가 리렌더링되면 자식 컴포넌트도 리렌더링됨. (업데이트가 안되도)
> 실제 DOM에 변화가 반영되는 것은 바뀐 내용이 있는 컴포넌트에만 해당. 하지만 Virtual DOM은 모든걸 렌더링 하고 있음. 그래서 컴포넌트 성능 최적화를 하여 가상돔에서 렌더링하는 리소스를 아낄 수 있음.


## 4. useMemo

> 성능 최적화를 위해 연산된 값을 useMemo라는 Hook을 사용하여 재사용하는 방법

### 1) useMemo를 사용안했을 때

```js
// App.js input 기능있음
function countActiveUsers(users) {
  console.log('활성 사용자 수를 세는중...');
  return users.filter(user => user.active).length;
}

 const count = countActiveUsers(users);
```

* user가 변경될때만 나오면되는데 input에 입력해서 onChange될 때마다 불필요하게 활성 사용자수 메시지가 뜸.


### 2) useMemo를 사용했을 때

```js
// App.js input 기능있음
function countActiveUsers(users) {
  console.log('활성 사용자 수를 세는중...');
  return users.filter(user => user.active).length;
}

  const count = useMemo(() => countActiveUsers(users), [users]);
```

* 첫번째 마라미터는 연산정의하는 함수를 넣어주면됨
* 두번째 파라미터에는 [] 배열을 넣어주면됨. 배열안에 넣은 내용이 바뀌면 우리가 등록한 함수를 호출해서 연산해주고,
내용이 안바뀌면 이전에 연산했던 값을 재사용함.


## 5. useCallback

> useMemo 는 특정 결과값을 재사용 할 때 사용하는 반면, useCallback 은 특정 함수를 새로 만들지 않고 재사용하고 싶을때 사용
> 함수들은 컴포넌트가 리렌더링 될 때마다 새로 만들어짐. 
> 선언하는거 자체는 메모리나 리소스를 많이 차지하진 않지만, 한번 만든 함수를 필요할때마다 새로 만들고 재사용하는 것은 중요. 나중에 컴포넌트에서 props가 바뀌지 않으면 가상돔에 새로 렌더링하는 것 조차 하지 않고 컴포넌트의 결과물을 재사용하는 최적화작업을 하게 될텐데 이것을 하기 위해선 함수를 재사용하는 것이 필수.

### 1) useCallback 사용법
 
```js
//onChange 
 const onChange = useCallback(
    e => {
      const { name, value } = e.target;
      setInputs({
        ...inputs,
        [name]: value
      });
    },
    [inputs]
  );

//onCreate 
 const onCreate = useCallback(() => {
    const user = {
      id: nextId.current,
      username,
      email
    };
    setUsers(users.concat(user));

    setInputs({
      username: '',
      email: ''
    });
    nextId.current += 1;
  }, [users, username, email]);

//onRemove 
const onRemove = useCallback(
    id => {
      // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
      // = user.id 가 id 인 것을 제거함
      setUsers(users.filter(user => user.id !== id));
    },
    [users]
  );

//onToggle 
const onToggle = useCallback(
    id => {
      setUsers(
        users.map(user =>
          user.id === id ? { ...user, active: !user.active } : user
        )
      );
    },
    [users]
  );
``` 

* 함수 안에서 사용하는 상태나 props가 있다면, [] 배열안에 포함시켜야함. 포함시키지 않으면 가장 최신의 값을 참조할 수 없음. props로 받아온 함수가 있다면 그것도 []안에 넣어야함.

* useCall0back 만으로는 눈에 띄는 최적화는 없음. 컴포넌트 렌더링 최적화 작업을 해주어야 성능이 최적화됨.

* useCallback은 useMemo를 기반으로 만들어짐.

```js
//이런식으로도 표현가능
const onToggle = useMemo(
  () => () => {
    /* ... */
  },
  [users]
);
```

## 6. React.memo

>props가 바뀌었을때만, 리렌더링됨.

### 1) React.memo 사용법

> 크롬에서 component -> 설정 -> Highlight Update 체크 -> 리렌더링 되는지 확인가능

```js
export default React.memo(CreateUser);
```

### 2) React.memo가 먹지 않을때

```js
const onRemove = useCallback(
  id => {
    // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = user.id 가 id 인 것을 제거함
    setUsers(users.filter(user => user.id !== id));
  },
  [users]
);
const onToggle = useCallback(
  id => {
    setUsers(
      users.map(user =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  },
  [users]
);
```

* React.memo 했다 해도 []안에 users가 들어있기 때문에 업데이트 될때마다 함수가 새로 만들어지는 것.


### 3) React.memo가 먹지 않을때 해결방안

```js
  const onRemove = useCallback(id => {
    // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = user.id 가 id 인 것을 제거함
    setUsers(users => users.filter(user => user.id !== id));
  }, []);
  const onToggle = useCallback(id => {
    setUsers(users =>
      users.map(user =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  }, []);
```

* []안에 users를 지우고 함수들이 useState로 관리하는 users를 참조하지 않게끔 함수형 업데이트 방식을 이용함.
* 함수형 업데이트를 하면, setUsers에 등록하는 콜백함수의 파라미터에서 최신 user를 참조할 수 있어서 []에 users를 넣지 않아도 됨.
* 이렇게 수정하면, 특정 항목만 바뀔 때 리렌더링이 됨.

### 4) 특정 값들 비교

```js
export default React.memo(
  UserList,
  (prevProps, nextProps) => prevProps.users === nextProps.users
);
```
* 이걸 사용할 때 주의할 점은 함수형 업데이트로 전환을 해야만 최신 users만 비교가능함. 전환안하면 최신 users배열을 참지하지 못해서 심각한 오류가 발생할 수 있음.


> useCallback, useMemo, React.memo는 컴포넌트의 성능을 실제로 개선할 수 있을 때만 해야함. onClick 설정해준 함수들은 useCallback으로 재사용한다고 해도 리렌더링을 막지는 못하기 때문에 굳이 할 필요는 없음.

> 렌더링 최적화하지 않을 컴포넌트에 React.memo를 사용하는건 불필요한 props 비교만 하는 것이기 때문에 실제로 렌더링을 방지할 수 있는 상황에만 사용해야함.


## 7. useReducer

> useState를 사용해서 상태를 업데이트 할 때는 새로운 상태를 설정해주었는데 , useReducer를 사용하면 컴포넌트의 상태 업데이트 로직을 컴포넌트에서 분리할수도있고 다른파일에 작성 후 불러와서 사용할 수 도 있음.

### 1) reducer 란?

```js
function reducer(state, action) {
  // 새로운 상태를 만드는 로직
  // const nextState = ...
  return nextState;
}
```  

* return에서 반환하는 상태가 곧 컴포넌트의 새로운 상태.
* action은 업데이트를 위한 정보를 가지고 있음. 주로 type 값을 지닌 객체 형태로 사용.

### 2) useReducer 사용법

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

* state: 앞으로 컴포넌트에서 사용 할 수 있는 상태.
* dispatch: 액션을 발생시키는 함수 ex) dispatch({type:'INCREMENT'})
* 첫번째 파라미터: reducer 함수
* 두번째 파라미터: 초기상태

### 3) useReducer 예시

```js
//Counter.js
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

function Counter() {
  const [number, dispatch] = useReducer(reducer, 0);

  const onIncrease = () => {
    dispatch({ type: 'INCREMENT' });
  };

  const onDecrease = () => {
    dispatch({ type: 'DECREMENT' });
  };

  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
}

export default Counter;
```

### 04) useState VS useReducer

> 관리하는 값이 하나고, 값이 단순한 숫자나 문자열 또는 boolean값이라면 useState로 관리하는 것이 편함.

```js
const [value, setValue] = useState(true);
```

> 컴포넌트에서 관리하는 값이 여러개가 되어 복잡한 구조가 된다면 useReducer로 관리하는 것이 편함.
