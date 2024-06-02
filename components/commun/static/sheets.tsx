import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';

import AddressSheet from '../ActionSheets/AddressSheet';
import LanguageSheet from '../ActionSheets/LanguageSheet';
import ShopActionSheet from '../ActionSheets/ShopActionSheet';
import ShopRatingModal from '@/components/modules/shop/modals/ShopRatingModal';
import ShopReportModal from '@/components/modules/shop/modals/ShopReportModal';
import DishActionSheet from '../ActionSheets/DishActionSheet';
import DishRatingModal from '@/components/modules/dish/DishRatingModal';
import DishReportModal from '@/components/modules/dish/DishReportModal';
import DishEditModal from '@/components/modules/dish/DishEditModal';
import IngredientSheet from '@/components/modules/dish/IngredientSheet';
import { Dispatch, SetStateAction } from 'react';
import CategorySheet from '@/components/modules/dish/CategorySheet';
import DishDeleteSheet from '@/components/modules/dish/DishDeleteSheet';
import HourSheet from '@/components/modules/shop/modals/HourSheet';
import DishAddModal from '@/components/modules/dish/DishAddModal';
import ReviewDeleteSheet from '../ActionSheets/ReviewDeleteSheet';
import ReviewEditSheet from '../ActionSheets/ReviewEditSheet';
import ReviewReportSheet from '../ActionSheets/ReviewReportSheet';
import ResetSheet from '@/components/modules/auth/ResetSheet';
import CodeSheet from '@/components/modules/auth/CodeSheet';

registerSheet('language-sheet', LanguageSheet);
registerSheet('address-sheet', AddressSheet);
registerSheet('shop-action-sheet', ShopActionSheet);
registerSheet('dish-action-sheet', DishActionSheet);
registerSheet('shop-rating-sheet', ShopRatingModal);
registerSheet('shop-report-sheet', ShopReportModal);
registerSheet('dish-rating-sheet', DishRatingModal);
registerSheet('dish-report-sheet', DishReportModal);
registerSheet('dish-edit-sheet', DishEditModal);
registerSheet('dish-delete-sheet', DishDeleteSheet);
registerSheet('dish-add-sheet', DishAddModal);
registerSheet('ingredient-sheet', IngredientSheet);
registerSheet('category-sheet', CategorySheet);
registerSheet('hours-sheet', HourSheet);
registerSheet('review-delete-sheet', ReviewDeleteSheet);
registerSheet('review-edit-sheet', ReviewEditSheet);
registerSheet('review-report-sheet', ReviewReportSheet);
registerSheet('reset-sheet', ResetSheet);
registerSheet('code-sheet', CodeSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'language-sheet': SheetDefinition<{
      payload: {
        data: { value: string; label: string }[];
        currentLanguage: string;
      };
    }>;
    'address-sheet': SheetDefinition<{
      payload: {
        address: string;
      };
    }>;
    'shop-action-sheet': SheetDefinition<{
      payload: {
        shopId: string;
      };
    }>;
    'dish-action-sheet': SheetDefinition<{
      payload: {
        dish: string;
      };
    }>;
    'shop-rating-sheet': SheetDefinition<{
      payload: {
        shopId: string;
      };
    }>;
    'shop-report-sheet': SheetDefinition<{
      payload: {
        shopId: string;
      };
    }>;
    'dish-rating-sheet': SheetDefinition<{
      payload: {
        dishId: string;
      };
    }>;
    'dish-report-sheet': SheetDefinition<{
      payload: {
        dishId: string;
      };
    }>;
    'dish-delete-sheet': SheetDefinition<{
      payload: {
        dishId: string;
        shopId: string;
      };
    }>;
    'dish-edit-sheet': SheetDefinition<{
      payload: {
        dish: string;
      };
    }>;
    'dish-add-sheet': SheetDefinition<{
      payload: {
        shopId: string;
      };
    }>;
    'ingredient-sheet': SheetDefinition<{
      payload: {
        selectedIngredients: string[];
        setSelectedIngredients: Dispatch<SetStateAction<string[]>>;
      };
    }>;
    'category-sheet': SheetDefinition<{
      payload: {
        category: string;
        setFormFields: any;
      };
    }>;
    'hours-sheet': SheetDefinition<{
      payload: {
        hour: string;
        setHour: any;
        header: string;
      };
    }>;
    'review-delete-sheet': SheetDefinition<{
      payload: {
        reviewId: string;
      };
    }>;
    'review-edit-sheet': SheetDefinition<{
      payload: {
        review: string;
      };
    }>;
    'review-report-sheet': SheetDefinition<{
      payload: {
        reviewId: string;
      };
    }>;
    'reset-sheet': SheetDefinition;
    'code-sheet': SheetDefinition<{
      payload: {
        email: string;
      };
    }>;
  }
}

export {};
