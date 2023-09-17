import { useContext } from "react";

import { UTxOsContext } from "../contexts/UTxOsContext";

export const useUTxOs = () => {
  const context = useContext(UTxOsContext);

  return context;
};
