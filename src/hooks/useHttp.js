import { useState, useEffect, useCallback, useContext } from "react";
import { shopCart } from "../store/GlobalContext";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || "Something happened, request was not sent"
    );
  }
  return responseData;
}

export default function useHttp(url, config) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState(initialState);

    const { setMealsList } = useContext(shopCart);

  const sendRequest = useCallback (async function sendRequest(data) {
    setIsLoading(true);
    try {
      const resData = await sendHttpRequest(url, {...config, body: data});
    if (!data){
    setMealsList(resData);
    }
    } catch (error) {
      setError(error.message) || "something went wrong";
     
    }
    setIsLoading(false);
  }, [url, config] );

  useEffect(()=>{
    if ((config && (config.method === "GET" || !config.method)) || !config){
    sendRequest()}

  }, [sendRequest, config]);

  return {
    sendRequest,
    error,
    isLoading
  };
}
