import React from 'react';
import User from './User';


const UserList = () => {
    const users = [
        {
            id: 1,
            username: 'velopert',
            email:'public.velopert@gmail.com'
        },
        {
            id: 2,
            username: 'velopert2',
            email:'public.velopert2@gmail.com'
        },
        {
            id: 3,
            username: 'velopert3',
            email:'public.velopert3@gmail.com'
        }
    ];
    return (
        <div>
           {
               users.map((userInfo, index )=> (<User user={userInfo} key={index}/>))
           }
        </div>
    );
};

export default UserList;