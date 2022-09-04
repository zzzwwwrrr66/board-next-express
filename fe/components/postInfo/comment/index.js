import axios from 'axios';
import { useForm } from 'react-hook-form';
import { backUrl } from '../../../utils/api__.js';
import useApi from '../../_hooks/useApis';
import {CommentInfoWrap, CommentContent} from './styles';

export default function Comment ({postId}) {
  const { register, handleSubmit, reset } = useForm();
  const { data: comments, error, isValidating, mutate } = useApi.comment(postId);

  const onSubmit = data => {
    if(data.content.trim()) {
      axios.post(backUrl+'/post/'+postId+'/comment', {content: data.content,postId}, { withCredentials: true })  
      .then(res=>{
        console.log(res.data);
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
    <CommentInfoWrap>
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
          
            <span>▲ by {comment.User.nickname}</span>
            <span> {comment.updatedAt}</span> | 
            <span> 0 like</span>

          <CommentContent>
            {comment.content}
          </CommentContent>
        </div>
        )
      })
    }
    </CommentInfoWrap>
  )
}