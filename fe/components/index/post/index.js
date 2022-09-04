import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import useApi from '../../_hooks/useApis';
import API, { backUrl } from '../../../utils/api__.js';
import { AddFileLabel } from './style';


export default function Post({page}) {
  const { register, handleSubmit, reset } = useForm();
  const { mutate:postListMutate } = useApi.postList(page);
  const { data: user } = useApi.user();
  const [imgsUrl, setImgsUrl] = useState([]);

  const onSubmit = data => {
    if(data.title.trim() && data.content.trim()) {
      const form = new FormData();
      form.append('title', data.title);
      form.append('content', data.content);
      if(imgsUrl.length > 0) imgsUrl.forEach(imgUrl => form.append('image', imgUrl));
      else form.append('image', '');
      
      API.post('/post', form)
      .then(res=>{
        console.log(res.data);
        postListMutate();
      })
      .catch(err=>{
        alert(err.response.data);
        console.error(err);
      })
      .finally(()=>{
        reset();
        setImgsUrl([]);
      });
    }
  }

  const onImageChange = async (e) => {
    const imageFormData = new FormData();
    [].filter.call(e.target.files, (f, i) => {
      if(i < 3) return f;
    }).forEach((img)=>{
      imageFormData.append('image', img);
      console.log('wooram test:', img);
    });

    if(imageFormData.getAll('image').length > 0) {
      try {
        const {data} = await API.post('/post/images', imageFormData);
        console.log('images upload success by wooram : \n', data);
        setImgsUrl(v=>[...data]);
      } catch(err) {
        console.error(err);
      }
    }
  }

  const onRemoveImage = imgIndex => () =>{ // server 에서도 지우고 싶을때는 API.delete 로 지우기 
    setImgsUrl(imgsUrl.filter((v,i)=>imgIndex !== i));
  }

  return (
    <>
    {user && 
    <form encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)} >
      <input type="text" placeholder="new title" {...register("title")} maxLength="30"/>
    <textarea placeholder="post conetent" {...register("content")} rows='8' cols='80' />
    <div>
      <AddFileLabel htmlFor="files">Select files</AddFileLabel>
      <input type="file" id="files" name="image" multiple {...register("image", {onChange: onImageChange}) } style={{display:'none'}}/>
      {
        imgsUrl.length > 0 && 
        imgsUrl.map((imgUrl, i)=>(
          <span key={i} >
          <img src={`${backUrl}/${imgUrl}`} alt={imgUrl} width="100"/>
          <button onClick={onRemoveImage(i)}>delete</button>
          </span>
        ))
      }
    </div>
    <div>
      <button type="submit">add post</button>
    </div>
  </form>
    }
    
    </>
  )
};
