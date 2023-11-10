import {IProductItem} from "../items/products/products";

export interface StaffInteractionI {
  id: number
  user_id: string
  interaction_type: string
  item_id: string
  date_created: string
}

export interface StaffTransactionI {
  interaction: StaffInteractionI
  product_blueprint_id: number

  product: IProductItem
  count: number
  amount: number
  currency: string

  status: string
  checkout_id: string

  date_created: string
  date_completed: string
}