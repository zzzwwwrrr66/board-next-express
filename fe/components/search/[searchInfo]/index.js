// import log from '../../utils/consoleLog';
// import { useCallback, useEffect, useState } from "react";
// import useApi from '../_hooks/useApis';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PostList from '../../postList';
import useApi from '../../_hooks/useApis';
// import API from '../../utils/api';
// import Link from 'next/link';

export default function SearchInfo ({searchInfo}) {
  const [page, setPage] = useState(1);
  const { data: searchData, error, isValidating, mutate } = useApi.searchInfo(searchInfo, page);
  
  if(isValidating) return <div>loading</div>
  if(searchData?.length === 0) return <>there is no result</>

  console.log(`SearchInfo : ${searchInfo} : ${searchData}`);
  console.log();
  return (
    <div>
      <span>Search: </span><span>{searchData?.data.length}건</span> 
      <PostList 
    postList={searchData} 
    postListMutate={mutate} 
    page={page} 
    setPage={setPage}
  ></PostList>
    </div>
  )
}