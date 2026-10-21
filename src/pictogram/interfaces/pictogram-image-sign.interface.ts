import { Category } from "src/category/entities/category.entity";

export interface PictogramImageSigned {
    id:            string;
    pictogramName: string;
    personal:      boolean;
    description:   string;
    pictoImageUrl: string;
    category:      Category;
    infantId:      string[];
    pictoImageKey: string;
}