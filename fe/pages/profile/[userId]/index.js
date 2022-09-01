import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Base from '../../../components/layouts/base';
import Profile from '../../../components/profile/';
import OtherProfile from '../../../components/profile/[userId]';
import useApi from '../../../components/_hooks/useApis';
import { Wrap } from '../../../styles/styles';

export default function OtherProfilePage() {
  const router = useRouter();
  const { data: user, error, isValidating, mutate } = useApi.user();

  // if(!user &&!error&& isValidating) router.push('/');
  console.log('wooram router query',router.query.userId);

  return (
    <>
    <Head>
      <title>{user?.nickname + '\'s page'}</title>
    </Head>
    <Wrap>
      <Base>
        <OtherProfile ohterId={router.query.userId}></OtherProfile>
      </Base>
    </Wrap>
  </>
  )
}
