import React, { useState } from "react";
import axios from "axios";
import useAsync from "./useAsync";
import User from "./User";

//useAsync 사용할때 callback으로 넣어 줄 함수
async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
}

function UsersBefore() {
  const [userId, setUserId] = useState(null);
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={refetch}>불러오기</button>;
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => setUserId(user.id)}>
          {user.username} ({user.name})
        </li>
      ))}
      <button onClick={refetch}>다시 불러오기</button>
      {userId && <User id={userId} />}
    </ul>
  );
}

export default UsersBefore;
