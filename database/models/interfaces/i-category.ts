import { IBase } from "./i-base";

export interface ICategory extends IBase {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  comicsCount: number;
  parentCategory?: string;
  deletedAt: Date;
}
