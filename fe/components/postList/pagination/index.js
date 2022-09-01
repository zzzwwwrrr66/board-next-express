import React, { useEffect, useState } from "react";
import { PaginationWrap } from "./styles";
import Pagination from 'react-js-pagination';

export default function PaginationComponent(props) {

  const handlePageChange= async (res)=>{
    props.setPage(res);
  }

  return <>
  <PaginationWrap>
      <Pagination
          activePage={props?.page}
          itemsCountPerPage={10}
          totalItemsCount={props?.dataCount}
          pageRangeDisplayed={5}
          onChange={handlePageChange}>
        </Pagination>
    </PaginationWrap>
  </>
}