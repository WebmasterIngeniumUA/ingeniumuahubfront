import {IProductGroupInfo, IProductItem} from "./products";
import {IItem} from "../IItem";

export class CartSection {
  private _source_item: IItem;
  private _cartGroups: ICartGroup[];


  private getGroupIndex(group: IProductGroupInfo): number {
    const boolMap = this._cartGroups.map((value) => {return value.productsGroup === group})
    return boolMap.indexOf(true)
  }
  public setProductCount(group: IProductGroupInfo, product: IProductItem, count: number): void {
    const groupIndex = this.getGroupIndex(group);

    if (groupIndex < 0) {
      const transaction: [IProductItem, number] = [product, count]
      const cartGroup: ICartGroup = {productsGroup: group, transactions: [transaction]}
      this._cartGroups.push(cartGroup)
      return
    }

    // Groupindex was found so look up transactions
    const transactions: [IProductItem, number][] = this._cartGroups.at(groupIndex)!.transactions
    const transactionIndex = transactions.map((value) => {
      return value.at(0) === product
    }).indexOf(true);

    if (transactionIndex < 0) { // Transaction not found, push back
      const transaction: [IProductItem, number] = [product, count]
      this._cartGroups.at(groupIndex)!.transactions.push(transaction)
      return;
    }

    // Transaction was found, so update value
    this._cartGroups.at(groupIndex)!.transactions[transactionIndex][1] = count
  }

  public getProductCount(group: IProductGroupInfo, product: IProductItem): number {
    const groupIndex = this.getGroupIndex(group);
    if (groupIndex < 0) return 0

    // Groupindex was found so look up transactions
    const transactions: [IProductItem, number][] = this._cartGroups.at(groupIndex)!.transactions
    const transactionIndex = transactions.map((value) => {
      return value.at(0) === product
    }).indexOf(true);

    // Transaction was found, so update value
    const transaction: [IProductItem, number] = transactions.at(transactionIndex)!;
    return transaction[1]!;
  }

  constructor(source_uuid: IItem) {
    this._cartGroups = [];
    this._source_item = source_uuid
  }

  get source_item(): IItem {
    return this._source_item;
  }
  set source_item(value: IItem) {
    this._source_item = value;
  }

  get cartGroups(): ICartGroup[] {
    return this._cartGroups;
  }

  set cartGroups(value: ICartGroup[]) {
    this._cartGroups = value;
  }
}

export interface ICartGroup {
  productsGroup: IProductGroupInfo
  transactions: [IProductItem, number][]
}
