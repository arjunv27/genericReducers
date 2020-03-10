import React from 'react'

import useFetchAllItems from './useFetchAllItems'
const AllItems = () => {
  const {state, setParams, trigger} = useFetchAllItems('/api/endpoint')
  // useFetchAllItems takes an endpoint and returns state, setParams, and a trigger
	// trigger is a function, when called will rerender the component
        // { state :
	//      response = [],
	//      status = Either LOADING, ERROR, SUCCESS
	// }
  // setParams is used to filter response, automatically updates componenet on run

  return (
    <>
      {
        {
          LOADING: <h1>"Loading"</h1>,
          ERROR: state.response,
          SUCCESS: state.response.map(item => (
            <div key={item.id}>
		  <h1>DISPLAY ITEM HERE</h1>
            </div>
          ))
        }[state.status]
      }
    </>
  )
}

export default AllItems

