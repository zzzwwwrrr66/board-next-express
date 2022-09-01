import axios from 'axios';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import Nav from '../nav';
import Footer from '../footer';
const loginApi = 'http://localhost:8080/user/login';
const isUserLoggedInApi = 'http://localhost:8080/user';
const logOutApi = 'http://localhost:8080/user/logout';

export default function Base({children}) {
  
  return (
    <>
    <Nav></Nav>
    {children}
    <Footer></Footer>
    </>
  )
}
