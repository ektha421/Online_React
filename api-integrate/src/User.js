import React, { useEffect } from 'react';
import { useUsersState, useUsersDispatch, getUser } from './UsersContextBasic';

function User({ id }) {
  const state = useUsersState();
  const dispatch = useUsersDispatch();

  //컴포넌트가 처음 렌더링될 때, id와 dispatch가 바뀔 때
  useEffect(() => {
    getUser(dispatch, id);
  }, [dispatch, id]);

  const { data: user, loading, error } = state.user;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!user) return null;
  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>
    </div>
  );
}

export default User;