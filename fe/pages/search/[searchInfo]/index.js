import Head from 'next/head';
import { useRouter } from 'next/router';
import { Wrap } from '../../../styles/styles';
import Base from '../../../components/layouts/base';
import SearchInfo from '../../../components/search/[searchInfo]';

export default function SearchInfoPage () {
  const router = useRouter();
  return (
    <>
    <Head>
      <title>Search Page</title>
    </Head>
    <Wrap>
      <Base>
        <SearchInfo searchInfo={router.query.searchInfo}></SearchInfo>
      </Base>
    </Wrap>
  </>
  )
}