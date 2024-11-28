import isEqual from "lodash/fp/isEqual";
import { useEffect, useRef } from "react";

export default function useDeepCompareEffect(
  callback: () => any,
  dependencies: any[]
) {
  const currentDependenciesRef: React.MutableRefObject<undefined | any[]> =
    useRef();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
}
