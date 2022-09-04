import axios from 'axios';
import { useRouter } from 'next/router';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { backUrl } from '../../utils/api__.js';
import useApi from '../_hooks/useApis';

const loginApi = backUrl+'/user/login';


export default function Login() {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm();
  
  const { data: user, error, isValidating, mutate:userMutate } = useApi.user();

  // on login
  const { register: updateInput, handleSubmit:updateInputSubmit, reset:updateInputReset } = useForm();

  useEffect(() => {
    return () => {
      updateInputReset();
    }
  }, [])

  const onSubmit = data => {
    axios.post(loginApi, data, { withCredentials: true })
    .then(res=>{
      router.push('/');
      userMutate();
    })
    .catch(err=>console.error(err))
    .finally(()=>{
      reset();
    })
  };


  return (
    <>
      {/* login */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} />
        <input {...register("password")} />
        <button type='submit'>Login</button>
      </form>
    </>
  )
}
