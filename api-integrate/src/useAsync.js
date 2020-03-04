import { useReducer, useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

//callback는 api를 호출하는 함수
//deps는 어떤값이 변경됐을때 api를 재요청할때 받아오는 파라미터
function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  //fetchData 한번 생성하고 그 뒤로는 재사용 되게끔 useCallback 넣어줘도 됨
  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await callback();
      dispatch({ type: "SUCCESS", data });
    } catch (e) {
      dispatch({ type: "ERROR", error: e });
    }
  };

  //api가 재요청되면서 deps가 변경될 때마다 업데이트 될 수 있도록 useEffect의 두번째 파라미터로 넣어줌.
  useEffect(() => {
    if (skip) {
      return;
    }
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  //state: useAsync의 현재상태를 알 수 있음
  //fetchData: 특정 요청을 다시시작하는 함수를 받아와서 사용가능
  return [state, fetchData];
}

export default useAsync;
