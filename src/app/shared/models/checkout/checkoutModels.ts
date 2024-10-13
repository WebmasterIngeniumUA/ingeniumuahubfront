import {TransactionInI} from "@ingenium/app/shared/models/transaction/transactionModels";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";

export interface CheckoutI {
  checkout_uuid: string

  user_uuid: string
  user_email: string

  payment_provider: number

  amount: number
  note: string | null

  checkout_status: PaymentStatusEnum

  completed_timestamp: string | null
  last_updated_timestamp: string
  created_timestamp: string
}

export interface CheckoutInI {
  user_email: string;
  payment_provider: number

  transactions: TransactionInI[]
  note: number | null
}

export interface CheckoutPatchI {
  checkout_status: number
}
