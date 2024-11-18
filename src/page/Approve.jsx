import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import mailservice from 'service/mailService';


const Approve = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');


  const updateApplication = async ()=>{
    const response = await mailservice.updateApplication(id, {status :'approved'})

  }

  useEffect(()=>{
    updateApplication()
  },[])

  return (
      <div>
          <h1>Approve</h1>
          <p>The Application request is approved {id}</p>
      </div>
  );
}

export default Approve