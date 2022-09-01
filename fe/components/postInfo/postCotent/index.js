import Link from 'next/link';
import React, { useState } from 'react';
import {SPostContent} from './styles';

export default function PostContent ({postContent}) {
  const [content, setContent] = useState([]);

  return (
    <>
    <SPostContent>{
      postContent?.split(/(#[^\s#]+)/g).map((v, i)=>{
        if(v.match(/(#[^\s#]+)/g)) return <span key={i}><Link href="/">{v}</Link></span>
        else return <span key={i}>{v}</span>
      })
    }</SPostContent>
    </>
  )
}