import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Base from '../../components/layouts/base';
import Profile from '../../components/profile/';
import useApi from '../../components/_hooks/useApis';
import { Wrap } from '../../styles/styles';

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, error, isValidating, mutate } = useApi.user();

  if(!user&& error) router.replace('/404');

  return (
    <>
    <Head>
      <title>{user?.nickname + '\'s page'}</title>
    </Head>
    <Wrap>
      <Base>
      <Profile></Profile>
      </Base>
    </Wrap>
  </>
  )
}
