import React from 'react';
import {ImgWrap} from './styles'

export default function Image ({imgInfo}) {
  return (
    <>
    <ImgWrap>
    {imgInfo?.map(img => 
      <div key={img.id}>
      <p><img width="100" src={`http://localhost:8080/${img.src}`} alt={img.src} ></img></p>
      </div>
    )}
    </ImgWrap>
    </>
  )
}