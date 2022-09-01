import Link from 'next/link';
import { memo, useMemo } from 'react';

import log from '../../../utils/consoleLog';
import {ListWrap, Label, List, FollowLink } from './style';

function follow ({userInfo}) {
  log('follow', userInfo);

  return (
    <>
    <div>
      <Label>follow : </Label>
      {
      userInfo?.Followers?.length && 
      <ListWrap>
        {
          userInfo?.Followers.map(Follower=>
          <List key={Follower.id}>
            <Link href={`/profile/${Follower.id}`}>
              <FollowLink> {Follower.nickname}</FollowLink>
            </Link>
          </List>)
        }
      </ListWrap>
      }
    </div>
    <div>
      <Label>following : </Label>
      {
      userInfo?.Followings?.length && 
      <ListWrap>
        {
          userInfo?.Followings.map(Following=>
          <List key={Following.id}>
            <Link href={`/profile/${Following.id}`}>
              <FollowLink> {Following.nickname}</FollowLink>
            </Link>
          </List>)
        }
      </ListWrap>
      }
    </div>
    </>
  )
}
const Follow = memo(follow);
export default Follow;