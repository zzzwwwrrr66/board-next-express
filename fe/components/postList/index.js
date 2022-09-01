import { useForm } from "react-hook-form";
import Link from 'next/link';
import useApi from '../_hooks/useApis';
import { PostListWrap } from './styles';
import { CommonLink } from '../../styles/styles';
import { useState } from 'react';
import PaginationComponent from "./pagination";


export default function PostList({page, setPage, postList, postListMutate}) {

  if(!postList) return (<p>post list loading...</p>);

  return (
    <>
  {postList?.data?.map( (item) => {
    return (
      <div key={item?.id}>
        <PostListWrap>
          <span> by 
            <Link href={`/profile/${item?.User?.id}`}>
              <CommonLink> {item?.User?.nickname}</CommonLink>
            </Link>
            </span>
          <span> {item?.updatedAt}</span> | 
          <span> {item?.Likers.length} like</span>
        </PostListWrap>
      <p >{item?.User?.nickname} : <Link href={`/${item.id}/postInfo`}>{item.title}</Link></p>
      </div>
    )
  })}
    <PaginationComponent dataCount={postList?.dataCount} mutate={postListMutate} page={page} setPage={setPage}></PaginationComponent>
  </>
  )
}


// export const getServerSideProps = async () => {
//   console.log('wooram ')
//   await PostList(context=>{
//     console.log('wooram');
//   })
// }