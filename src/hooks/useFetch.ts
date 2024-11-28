import type { AxiosResponse } from "axios";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDeepCompareEffect from "./useDeepCompareEffect";
import { useGetQueryString } from "./useGetQueryString";
import useUrlQueryHooks from "./useUrlQueryHooks";

export type genericResponse<T> = {
  datasets: any;
  data: T;
  message: string;
  success: true;
};
export type genericFetchResponse<T, J, K> = {
  error: K | undefined;
  data: T | undefined;
  isLoading?: boolean;
  fetchData?: (e?: callbackPayloadType<J>) => void;
};

export type fetchType<T> = genericFetchResponse<genericResponse<T>, any, any>;

type QueryProps = { [k: string]: string | number | boolean | null } | undefined;

type configType<J> = {
  query?: QueryProps;
  payload?: J | "no-Data";
  path?: number | string | undefined | null;
  useLazy?: boolean;
  callOnce?: boolean;
};

export type callbackPayloadType<J> = {
  query?: string | undefined;
  payload?: J;
  path?: number | string | undefined | null;
};

type useFetchTypeReturn<T, J> = {
  fetchData: (e?: callbackPayloadType<J>) => void;
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
};

type callbackType<T, J> = (
  event?: callbackPayloadType<J>
) => Promise<AxiosResponse<T>>;

const useFetch = <T, J>(
  callback: callbackType<T, J>,
  config?: configType<J>
): useFetchTypeReturn<T, J> => {
  const [data, setData] = useState();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const queryData = useGetQueryString(config?.query);
  const go = useNavigate();

  const [getUrlQuery] = useUrlQueryHooks();
  const projectId = getUrlQuery("projectId") || null;

  const callbackPayload = useMemo(() => {
    if (config && config?.payload !== "no-Data") {
      if (config?.query) {
        if (queryData) {
          return {
            query: queryData,
            payload: config?.payload,
            path: config?.path,
            useLazy: config?.useLazy,
            callOnce: config?.callOnce,
          };
        }
      } else {
        return {
          query: undefined,
          payload: config?.payload,
          path: config?.path,
          useLazy: config?.useLazy,
          callOnce: config?.callOnce,
        };
      }
    } else {
      return undefined;
    }
  }, [queryData, config]);

  const fetchData = useCallback(
    async (callbackPayload?: callbackPayloadType<J>) => {
      try {
        setLoading(true);
        const response: any = await callback(callbackPayload);
        setData(response.data);

        setError(null);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 300);
        setLoading(false);
        return () => clearTimeout(timer);
      } catch (err: any) {
        setLoading(false);
        if (err?.response?.status === 403) {
          go("/request-access?projectId=" + projectId);
        }

        setError(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useDeepCompareEffect(() => {
    if (!callbackPayload?.useLazy && !callbackPayload?.callOnce) {
      if (
        callbackPayload?.path ||
        callbackPayload?.payload ||
        callbackPayload?.query
      ) {
        fetchData(callbackPayload);
      }
    }
  }, [callbackPayload]);

  useDeepCompareEffect(() => {
    if (!config && !callbackPayload) {
      fetchData();
    }

    return () => {
      setLoading(false);
    };
  }, [callbackPayload, config]);

  return { fetchData, data, isLoading, error };
};

export default useFetch;
