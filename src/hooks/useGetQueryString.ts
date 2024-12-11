import { useState } from "react";
import useDeepCompareEffect from "./useDeepCompareEffect";
import { convertObjToString } from "../utils";
type payloadProps = { [k: string]: any } | undefined;

export const useGetQueryString = (payload: payloadProps) => {
  const [Query, setQuery] = useState<string | undefined>(undefined);
  useDeepCompareEffect(() => {
    if (payload && Object.keys(payload).length > 0) {
      const params = convertObjToString(payload);
      setQuery(params);
    }
  }, [payload]);

  return Query;
};
