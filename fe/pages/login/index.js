import Head from 'next/head';
import { useRouter } from 'next/router';

import Base from '../../components/layouts/base';
import Login from '../../components/login/login';
import useApi from '../../components/_hooks/useApis';
import { Wrap } from '../../styles/styles';



export default function LoginPage() {
  const { data: user, error, isValidating, mutate } = useApi.user();
  const router = useRouter();

  if(user && !error) router.push('/');

  return (
    <>
    <Head>
      {user ? <title>{user.nickname + '\'s page'}</title> : <title>Login page</title>}
    </Head>
    <Wrap>
      <Base>
      <Login></Login>
      </Base>
    </Wrap>
  </>
  )
}
