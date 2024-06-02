import { trpc } from '@/trpc/client';
import { Shop } from '@/types/types';
import { useSession } from '@fullauth/react-native';
import { createContext, useEffect, useState } from 'react';

export const shopsContext = createContext<
  | {
      currentShop: Shop | null;
      refrechCxtData: () => void;
    }
  | undefined
>(undefined);

export const ShopsProvider = ({
  children,
  lang,
}: {
  children: any;
  lang?: string | null;
}) => {
  const { session } = useSession();
  const { data: shop, refetch } = trpc.shop.get.useQuery(
    {
      shopId: session?.user.shop_id[0]!,
    },
    {
      enabled: session?.user ? session?.user.isShopOwner : false,
    }
  );
  const [currentShop, setCurrentShop] = useState<Shop | null>(shop);
  useEffect(() => {
    setCurrentShop(shop);
  }, [shop]);

  const refrechCxtData = () => {
    refetch();
  };

  return (
    <shopsContext.Provider value={{ currentShop, refrechCxtData }}>
      {children}
    </shopsContext.Provider>
  );
};
