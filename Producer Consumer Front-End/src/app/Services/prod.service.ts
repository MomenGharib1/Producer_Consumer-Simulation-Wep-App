import {Injectable} from '@angular/core';
import {Result} from "./Result";
import {WebSocketAPI} from "./WebSocketService";

@Injectable()
export class ProdService {

  sendGraph(connectors: any[], products: number, WebSocket: WebSocketAPI) {
    let result = new Result();
    let machinesIDs = new Set<number>(), queuesIDs = new Set<number>();
    result.products = products;
    let machinesConnectors: string[] = [], queuesConnectors: string[] = [];
    console.log(connectors);
    connectors.forEach((connector: any) => {
      let from = connector.from.split("_");
      let to = connector.to.split("_");
      if (from[0] == "machine") {
        let id1 = from[1];
        let id2 = to[1];
        machinesIDs.add(parseInt(id1));
        queuesIDs.add(parseInt(id2));
        machinesConnectors.push(id1 + " " + id2);
      } else {
        let id1 = from[1];
        let id2 = to[1];
        queuesIDs.add(parseInt(id1));
        machinesIDs.add(parseInt(id2));
        queuesConnectors.push(id1 + " " + id2);
      }
    });
    result.machinesConnectors = machinesConnectors;
    result.queuesConnectors = queuesConnectors;
    for (let machineID of machinesIDs) {
      result.machinesIDs.push(machineID);
    }
    for (let queueID of queuesIDs) {
      result.queuesIDs.push(queueID);
    }
    console.log(result);
    WebSocket._send(result);
  }
}
