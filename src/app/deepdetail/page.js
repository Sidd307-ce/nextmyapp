import Deepdetail from "../Components/Deepdetails";

import React, { Suspense } from 'react';

const page=()=> {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Deepdetail/>
    </Suspense>
  )}
export default page