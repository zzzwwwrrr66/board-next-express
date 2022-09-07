import React from 'react';
import { backUrl } from '../../../utils/api__.js';
import {ImgWrap} from './styles';

export default function Image ({imgInfo}) {
  return (
    <>
    <ImgWrap>
    {imgInfo?.map(img => 
      <div key={img.id}>
      <p><img width="100" src={`${img}`} alt={img} ></img></p>
      </div>
    )}
    </ImgWrap>
    </>
  )
}