import axios from 'axios';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import Nav from '../nav';
import Footer from '../footer';

export default function Base({children}) {
  
  return (
    <>
    <Nav></Nav>
    {children}
    <Footer></Footer>
    </>
  )
}
