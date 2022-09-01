import Head from 'next/head';

import Base from '../../components/layouts/base';
import { Wrap } from '../../styles/styles';
import Join from '../../components/join'

export default function JoinPage() {
  return (
    <>
    <Head>
      <title>join page</title>
    </Head>
    <Wrap>
      <Base>
        <Join></Join>
      </Base>
    </Wrap>
  </>
  )
}
