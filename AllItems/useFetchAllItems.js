import {useReducer, useEffect, useState} from 'react'
import axios from 'axios'

// action creators
const SET_ITEMS = 'SET_ITEMS'
const setItems = items => ({
  type: SET_ITEMS,
  items
})
const ERR_ITEMS = ''
const errItems = err => ({
  type: ERR_ITEMS,
  err
})

const initialState = {
  response: [],
  status: 'LOADING'
}

const reducer = (state, action) => {
  switch (action.type) {
    case SET_ITEMS:
      return {
        status: 'SUCCESS',
        response: action.items
      }
    case ERR_ITEMS:
      return {
        status: 'ERROR',
        response: action.err
      }
    default:
      return state
  }
}

const useFetchAllItems = endpoint => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [params, setParams] = useState({})
  const [trigger, setTrigger] = useState(false)

  useEffect(
    () => {
      axios
        .get(endpoint, {params})
        .then(res => dispatch(setItems(res.data)))
        .catch(err => dispatch(errItems(err)))
    },
    [endpoint, params, trigger]
  )

  return {
    state,
    setParams,
    trigger: () => setTrigger(!trigger)
  }
}

export default useFetchAllItems
