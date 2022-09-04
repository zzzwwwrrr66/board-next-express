import axios from 'axios';
import {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import { backUrl } from '../../utils/api__.js';
const isUserLoggedInApi = backUrl+'/user';

export default function Join() {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm();
  const [isUser, setIsUser] = useState(true);

  useEffect(()=>{
    axios.get(isUserLoggedInApi, { withCredentials: true })
    .then(res=>{
      if(res.data) {
        router.push('/');
      } 
    })
    .catch(err=>console.error(err))
  },[]);

  const onSubmit = data => {
    if(data.email && data.password && data.nickname) {
      const sendData = {
        email : data.email,
        password: data.password,
        nickname: data.nickname
      };
      axios.post(backUrl+'/user/join', data)
      .then(res=>{
        alert(res.data);
        router.push('/');
      })
      .catch(err=>{
        console.error(err);
        alert(err.response.data);
      })
      .finally(()=>{
        reset();
      })
    }
    
    // axios.post(loginApi, data, { withCredentials: true })
    // .then(res=>{
    //   if(res.data) {
    //     serUser(res.data);
    //   } else {
    //     serUser(null);
    //   }
      
    // })
    // .catch(err=>console.error(err))
    // .finally(()=>{
    //   reset();
    // })
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="email" {...register("email")} />
      <input type="text" placeholder="password" {...register("password")} />
      <input type="text" placeholder="nickname" {...register("nickname")}/>
      <button type="submit">add</button>
    </form>
  )
}
