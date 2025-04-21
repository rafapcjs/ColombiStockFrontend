export interface SuppliersModel {

    name :string
    lastName :string
    dni :string
    phone :string
    email :string

}


export type SuppliersModelDto = Omit<SuppliersModel, "id">;

export type UpdateSuppliersModel = Partial<SuppliersModel>;