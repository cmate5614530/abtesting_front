import { useRef, useEffect, MutableRefObject } from 'react';

const useRefMounted = (): MutableRefObject<boolean> => {
  const isRef = useRef(true);

  useEffect(
    () => () => {
      isRef.current = false;
    },
    []
  );

  return isRef;
};

export default useRefMounted;
