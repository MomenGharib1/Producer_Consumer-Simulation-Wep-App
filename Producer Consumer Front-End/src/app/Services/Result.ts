export class Result {
  public error!: boolean;
  public message!: string;
  public products!: number;
  public queuesIDs: number[] = [];
  public machinesIDs: number[] = [];
  public queuesConnectors!: string[];
  public machinesConnectors!: string[];
}
