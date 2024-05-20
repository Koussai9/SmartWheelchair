import { createContext, useState } from "react";

export const MyStore = createContext({
  id: "",
  setId: () => {},
});
const MyProvider = ({ children }) => {
  const [id, setId] = useState("");
  return (
    <MyStore.Provider value={{ id: id, setId: setId }}>
      {children}
    </MyStore.Provider>
  );
};
export default MyProvider;
