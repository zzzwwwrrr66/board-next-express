import log  from '../../utils/consoleLog';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { NavWrap, Logo } from './styles';
import Link from 'next/link';
import useApi from '../_hooks/useApis';


export default function Nav() {
  const { register, handleSubmit, reset } = useForm();
  const { data: user, error, isValidating, mutate } = useApi.user();

  return (
    <nav>
      <NavWrap>
        <div>
          <Logo>Logo</Logo>
          <Link href='/'>Home</Link>
          {user ? null : <Link href='/join'>Join</Link> }
        </div>
        <div>
        {user ? <Link href='/profile'>{user.nickname}</Link> : <Link href='/login'>Login</Link> }
        </div>
      </NavWrap>
    </nav>
  )
}
