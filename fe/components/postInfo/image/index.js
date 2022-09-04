import React from 'react';
import { backUrl } from '../../../utils/api';
import {ImgWrap} from './styles';

export default function Image ({imgInfo}) {
  return (
    <>
    <ImgWrap>
    {imgInfo?.map(img => 
      <div key={img.id}>
      <p><img width="100" src={`${backUrl}/${img.src}`} alt={img.src} ></img></p>
      </div>
    )}
    </ImgWrap>
    </>
  )
}