import useSWR from "swr";
import fetcher from "../../utils/fetcher";

const useApi = {};

useApi.user = ()=> useSWR('/user', fetcher);
useApi.other = (otherId) => useSWR(otherId ? '/user/' + otherId : null, fetcher);
useApi.postList = (offset) => useSWR(offset ? '/post/list' + '/?offset='+ offset : null, fetcher);
useApi.postInfo = (postId, offset) => useSWR(postId ? '/post/'+postId + '/?offset='+ offset : null, fetcher);
useApi.searchInfo = (searchInfo) => useSWR(searchInfo ? '/search/'+encodeURIComponent(searchInfo): null, fetcher);
useApi.comment = (postId) => useSWR(postId ? '/post/'+postId+'/comment' : null, fetcher);
useApi.myFollows = () => useSWR('/user/follow', fetcher);
useApi.myFollowings = () => useSWR('/user/following', fetcher);

export default useApi;