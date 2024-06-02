import { createContext, Dispatch, SetStateAction, useState } from 'react';

export const emailContext = createContext<
  | {
      isDelayed: boolean;
      setIsDelayed: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const EmailProvider = ({ children }: { children: any }) => {
  const [isDelayed, setIsDelayed] = useState<boolean>(false);

  return (
    <emailContext.Provider value={{ isDelayed, setIsDelayed }}>
      {children}
    </emailContext.Provider>
  );
};
