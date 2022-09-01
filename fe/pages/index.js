import Head from 'next/head';

import Base from '../components/layouts/base';
import { Wrap } from '../styles/styles';
import Post from '../components/post';
import PostList from '../components/postList';
import MainPage from '../components/index';

export default function Home() {
  return (
    <>
    <Head>
      <title>HOME</title>
    </Head>
    <Wrap>
      <Base>
        {/* <Post></Post>
        <PostList></PostList> */}
        <MainPage></MainPage>
      </Base>
    </Wrap>
  </>
  )
}
