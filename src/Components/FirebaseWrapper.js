import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from "@firebase/remote-config";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FirebaseTerminal } from "./FirebaseTerminal";

export const FirebaseWrapper = ({ setPrompt, setUniqueKey }) => {
  const [path, setPath] = useState(null);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const configEvent = async () => {
      const remoteConfig = getRemoteConfig();
      const change = await fetchAndActivate(remoteConfig);

      console.log(`activated ${change}`);
      const val = getValue(remoteConfig, "reviewzon_online");
      console.log(val);
      const url = JSON.parse(val._value)["backend_url"];
      await fetch(url, {
        method: "POST",
        body: searchParams.get("data"),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((r) => {
          setPath(`livedata/${r["unique_id"]}`);
          setUniqueKey(r["unique_id"]);
        });
    };
    configEvent();
  }, [searchParams, setUniqueKey]);
  return path ? <FirebaseTerminal path={path} setPrompt={setPrompt} /> : null;
};