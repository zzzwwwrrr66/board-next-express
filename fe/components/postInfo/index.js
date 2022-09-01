import log from '../../utils/consoleLog';
import { useCallback, useEffect, useState } from "react";
import useApi from '../_hooks/useApis';
import { useRouter } from 'next/router';
import { PostInfoWrap } from './styles';
import API from '../../utils/api';
import Link from 'next/link';
import { CommonLink } from '../../styles/styles';
import Comment from './comment/index';
import Image from './image';
import PostContent from './postCotent';



export default function PostInfo ({postId}) {
  const router = useRouter();
  const { data: postInfo, error, isValidating, mutate } = useApi.postInfo(postId);
  const { data: user} = useApi.user();
  const [data,setData] = useState(null);

  const onLike = () => {
    API.patch('/post/'+postId+'/like')
    .then((res) => {
      log('onLike res : ', res);
      mutate();
    })
    .catch((err)=>{
      console.error(err);
      alert(err.response.data);
    })
  }

  const onUnLike = () => {
    API.delete('/post/'+postId+'/like')
    .then((res) => {
      mutate();
    })
    .catch((err)=>{
      console.error(err);
      alert(err.response.data);
    });
  }

  const onDeletePost = () => {
    if(window.confirm('are you sure delete this post?')) {
      API.delete('/post/' + postId)
      .then(res=>{
        log(res);
        router.replace('/');
      })
      .catch(err=>console.error(err));
    } else {
      return false;
    }
    
  }

  if(postInfo && !postInfo && error) router.push('/');

  if(isValidating) return <div>loading</div>

  const liked = postInfo?.Likers?.find(v => user?.id === v.Like.UserId ? true : false);

  return (
    <div>
      <PostInfoWrap className=''>
        <span> by 
          <Link href={`/profile/${postInfo?.User?.id}`}>
            <CommonLink> {postInfo?.User?.nickname}</CommonLink>
          </Link>
        </span>
        <span> {postInfo?.updatedAt}</span> | 
        <span> {postInfo?.Likers.length} like</span> 
        {
          !liked ? ( 
          <button onClick={onLike}>like</button>) : ( 
          <button onClick={onUnLike}>liked</button> )
        }
        {
          user?.id === postInfo?.User?.id && 
          <button onClick={onDeletePost}>delete</button>
        }

        <h3><PostContent postContent={postInfo?.title}></PostContent></h3>
        <PostContent postContent={postInfo?.content}></PostContent>
      </PostInfoWrap>
      <Image imgInfo={postInfo?.Images}></Image>
      <Comment postId={postId}></Comment>

    </div>
  )
}