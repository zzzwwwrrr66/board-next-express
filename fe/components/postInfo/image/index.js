import React from 'react';
import { backUrl } from '../../../utils/api__.js';
import {ImgWrap} from './styles';

export default function Image ({imgInfo}) {
  return (
    <>
    <ImgWrap>
    {imgInfo?.map(img => 
      <div key={img.id}>
      <p><img src={`${img.src}`} alt={img.src} width="100"/></p>
      </div>
    )}
    </ImgWrap>
    </>
  )
}