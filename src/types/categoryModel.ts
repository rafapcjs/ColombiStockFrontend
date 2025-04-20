export interface CategoryModel {
  name: string;
  description: string;
  code: string;
}

export type CategoryModelDto = Omit<CategoryModel, "id">;

export type UpdateCategoryModel = Partial<CategoryModel>;
