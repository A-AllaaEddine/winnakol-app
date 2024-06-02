export type toISOString = {
  toISOString: () => string;
};

export type Favorite = {
  id: string;
  userId: string;
  favourite_id: string;
  type: 'store' | 'dish';
  createdAt: Date;
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  averageRating: number;
  price: number;
  totalReviews: number;
  category: string;
  imgUrl: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    key?: string;
    name?: string;
    size?: number;
    url: string;
  };
  ingredients: string[];
  shopId: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type Review = {
  id: string;
  reviewer_id: string;
  reprot_id?: string;
  dish_id?: string;
  shopId_id?: string;
  reviewer?: User;
  report?: Report;
  dish?: Dish;
  shop?: Shop;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  averageRating: number;
  address: string;
  categories: string[];
  dishes: [];
  profilePicture: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    key?: string;
    name?: string;
    size?: number;
    url: string;
  };
  type: 'user' | 'admin';
  isShopOwner: boolean;
  shop_id: string[];
  accountStatus: string;
  createdAt: Date;
  updatedAt?: Date;
  providers: string[];
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  expoPushToken: string;
  deviceLang: string;
};

export type Shop = {
  id: string;
  name: string;
  username: string;
  averageRating: number;
  totalReviews: number;
  address: { street: string; latitude: number; longitude: number };
  categories: string[];
  shopLogo: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    key?: string;
    name?: string;
    size?: number;
    url: string;
  };
  shopPictures: {
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    key?: string;
    name?: string;
    size?: number;
    url: string;
  }[];
  phones: string[];
  workingHours: string[];
  owner?: User;
  type: string;
  status: 'open' | 'closed';
  shopStatus: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  providers: string[];
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  expoPushToken: string;
  deviceLang: string;
};

export type Report = {
  id: string;
  tag: string;
  reason: string;
  status: string;
  type: string;
  reporter_id: string;
  shopId_id?: string;
  dish_id?: string;
  review_id?: string;
  createdAt: Date;
  updatedAt: Date;
  parentReportId?: string;

  shop?: Shop;
  dish?: Dish;
  reporter?: User;
  review?: Review;
};
