import axios from 'axios';
import { useForm } from 'react-hook-form';
import { backUrl } from '../../utils/api__.js';
import log from '../../utils/consoleLog';
import useApi from '../_hooks/useApis';
import {CommentInfoWrap} from './styles'

export default function Comment ({postId}) {
  const { register, handleSubmit, reset } = useForm();
  const { data: comments, error, isValidating, mutate } = useApi.comment(postId);

  const onSubmit = data => {
    if(data.content.trim()) {
      axios.post(backUrl+'/post/'+postId+'/comment', {content: data.content,postId}, { withCredentials: true })  
      .then(res=>{
        log(res.data);
        mutate();
      })
      .catch(err=>{
        alert(err.response.data);
        console.error(err);
      })
      .finally(()=>reset());
    }
  }

  return (
    <>
    <h3>comment</h3>
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea placeholder="add comment" {...register("content")} rows='8' cols='80' />
      <div>
        <button type="submit">Add Comment</button>
      </div>
    </form>
    
    
    {
      comments?.length > 0 &&
      comments.map((comment)=>{
        return (
        <div key={comment.id}>
          <CommentInfoWrap>
            <span>▲ by {comment.User.nickname}</span>
            <span> {comment.updatedAt}</span> | 
            <span> 0 like</span>
          </CommentInfoWrap>
          <div>
            {comment.content}
          </div>
        </div>
        )
      })
    }
    </>
  )
}