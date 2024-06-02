import { createContext, useState } from 'react';

export const viewsContext = createContext<
  | {
      saveView: (username: any) => void;
      checkUsername: (username: any) => string | undefined;
    }
  | undefined
>(undefined);

export const ViewaProvider = ({ children }: { children: any }) => {
  const [viewedUsers, setViewedUsers] = useState<string[]>([]);

  const saveView = (username: string) => {
    const exist = viewedUsers.find((user) => user === username);
    if (!exist) {
      setViewedUsers((prev) => {
        return [...prev, username];
      });
    }
  };

  const checkUsername = (username: string) => {
    return viewedUsers.find((user) => user === username);
  };

  return (
    <viewsContext.Provider value={{ saveView, checkUsername }}>
      {children}
    </viewsContext.Provider>
  );
};
