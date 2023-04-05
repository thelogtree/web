import { flow, last, lowerCase, startCase } from "lodash/fp";
import _, { first } from "lodash";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export const getKeyFromValueInMap = (map: Object, valueToFind: any) => {
  for (const [key, value] of Object.entries(map)) {
    if (value === valueToFind) return key;
  }
  return undefined;
};

export const shortenString = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length) + "...";
};

// ie. if pathName is /path1/path2/path3 output will be path3
export const getLastPath = (pathName: string) => last(pathName.split("/"));

// ie. if pathName is /path1/path2/path3 output will be /path3
export const getLastPathWithSlash = (pathName: string) =>
  "/" + getLastPath(pathName);

// ie. if pathName is /path1/path2/path3 output will be /path1
export const getFirstPathWithSlash = (pathName: string) =>
  "/" + (pathName.split("/").length > 1 ? pathName.split("/")[1] : "");

// ie. if str is HELLO output will be Hello
export const sentenceCase = (str: string) => flow(lowerCase, startCase)(str);

// ie. if str is "apple", titleCase of str will be "Apple"
export const titleCase = (str: string) =>
  str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());

// example: 50000 -> 50,000
export const numberToNumberWithCommas = (val: number): string =>
  Math.trunc(val)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const getErrorMessage = (e: AxiosError) =>
  _.get(e, "response.data", e.message);

export const showGenericErrorAlert = (e: any) =>
  Swal.fire({ title: "Oops", text: getErrorMessage(e), icon: "error" });

export const usePathname = () => {
  const history = useHistory();
  const [activePathname, setActivePathname] = useState<string>(
    history.location.pathname
  );

  useEffect(() => {
    history.listen((location) => {
      setActivePathname(location.pathname);
    });
  }, []);

  return activePathname;
};

export const useSearchParams = (): any => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const resObj = useMemo(() => {
    let res = {};
    for (const [key, value] of Array.from(params.entries())) {
      res[key] = value;
    }
    return res;
  }, [Array.from(params.entries())]);

  return resObj;
};
