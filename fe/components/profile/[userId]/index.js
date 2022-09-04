import axios from 'axios';
import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import API from '../../../utils/api__.js';
import useApi from '../../_hooks/useApis';
import Follow from '../follow';


export default function OtherProfile({ohterId}) {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const { data: user, error, isValidating, mutate:userMutate } = useApi.user();
  const { data: other, error:otherError, isValidating:otherIsValidating, mutate:otherMutate } = useApi.other(ohterId);

  // if(otherError) router.push('/');
  if(otherError) {
    router.push('/404');
    return null
  };


  if(user && other) {
    if(user.id === other.id) {
      router.replace('/profile');
    }
  }

  const onFollow = (ohterId) => () => {
    console.log(ohterId)
    axios.patch('/user/'+ohterId+'/follow',{ohterId}, {withCredentials: true})
    .then(res=>{
      console.log(res);
      userMutate();
    })
    .catch(err=>console.error(err));
  }

  const onUnFollow = (ohterId) => () => {
    axios.delete('/user/'+ohterId+'/follow', {withCredentials: true})
    .then(res=>{
      console.log(res);
      userMutate();
    })
    .catch(err=>console.error(err));
  }

  const isFollowing = user?.Followings.filter((following)=>following.id===Number(ohterId));

  return (
    <>
    { other && (
      <>
      <div>
        <div>email: {other.email}</div>
        <div>nickname: {other.nickname}</div>
      </div>
      <div>
        {
          user ?
           isFollowing?.length > 0 ? <button onClick={onUnFollow(other?.id)}>unFollowing</button> :
           <button onClick={onFollow(other?.id)}>Following</button>
          : null
        }
        
      </div>
      </>
    )
    }
   </>
  )
}
