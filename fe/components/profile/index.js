import axios from 'axios';
import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import API from '../../utils/api';
import useApi from '../_hooks/useApis';
import Follow from './follow';
import { Label } from './style';


const logOutApi = 'http://localhost:8080/user/logout';
const userUpdateApi = 'http://localhost:8080/user/update/';

export default function Profile() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const { data: user, error, isValidating, mutate:userMutate } = useApi.user();

  console.log(isValidating, user);
  // if(user === null || user === undefined) {
  //   router.push('/404');
  //   return null;
  // }
  // if(!user) {
  //   router.push('/404');
  //   return null;
  // };

  // on login
  const { register: updateInput, handleSubmit:updateInputSubmit, reset:updateInputReset } = useForm();

  useEffect(() => {
    return () => {
      updateInputReset();
      userMutate();
    }
  }, [])


  const onLogOut = () => {
    axios.post(logOutApi, {}, { withCredentials: true })
    .then(res=>{
      userMutate();
      router.push('/');
    })
    .catch(err=>console.error(err))
    .finally(()=>{
      reset();
    })
  }

  const onUpdate = (data) => {
    const { nickname } = data;
    if(user?.nickname !== nickname && nickname.trim()) {
      console.log('nickname:' ,nickname);
      axios.patch(userUpdateApi, {nickname}, { withCredentials: true })
      .then(res=>{
        userMutate();
      })
      .catch(err=>{
        console.error(err);
      })
      .finally(()=>{
        // reset();
      })
    }

    return false;
  }

  if(user === null || user === undefined) {
    // router.push('/404');
    console.log('asdasdasd')
  }

  return (
    <>
    { user && (
      // before login 
      <div>
        <div><Label>email:</Label> {user.email}</div>
        <label htmlFor='nickname'><Label>nickname:</Label> </label>
        <input id='nickname' defaultValue={user?.nickname} type='text' {...updateInput("nickname")} />
        <div>
          <button onClick={onLogOut}>logout</button>
          <button onClick={updateInputSubmit(onUpdate)}>update</button>
        </div>

        <Follow userInfo={user}></Follow>
      </div>
    )
    }
    </>
  )
}
