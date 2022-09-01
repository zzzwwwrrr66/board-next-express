import { useState } from "react";
import PostList from "../postList/index";
import Post from "./post";
import useApi from "../_hooks/useApis";

export default function MainPage() {
  const [page, setPage] = useState(1);
  const { data: postList, error, isValidating, mutate: postListMutate } = useApi.postList(page);

  return <>
  <Post page={page}></Post>
  <PostList 
    postList={postList} 
    postListMutate={postListMutate} 
    page={page} 
    setPage={setPage}
  ></PostList>
  </>
}