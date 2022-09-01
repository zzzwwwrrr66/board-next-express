import log from '../../../utils/consoleLog';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Wrap } from '../../../styles/styles';
import Base from '../../../components/layouts/base';
import PostInfo from '../../../components/postInfo';


export default function PostInfoPage () {
  const router = useRouter();
  
  
  return (
    <>
    <Head>
      <title>post Info page</title>
    </Head>
    <Wrap>
      <Base>
        <PostInfo postId={router.query?.postId}></PostInfo>
      </Base>
    </Wrap>
  </>
  )
}