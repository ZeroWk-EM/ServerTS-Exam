export interface ITicket {
  eventName: string;
  owner: string;
  barcode: string;
  buyDate: Date;
  obliterationDate?: Date;
}
