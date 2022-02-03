import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ProducerConsumerDiagramComponent} from "../producer-consumer-diagram/producer-consumer-diagram.component";

export class WebSocketAPI {
  webSocketEndPoint = 'http://localhost:8080/pc';
  topic = '/topic/greetings';
  stompClient: any;
  producerConsumerDiagramComponent: ProducerConsumerDiagramComponent;

  constructor(producerConsumerDiagramComponent: ProducerConsumerDiagramComponent) {
    this.producerConsumerDiagramComponent = producerConsumerDiagramComponent;
  }

  _connect() {
    const pc = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(pc);
    const this1 = this;
    this1.stompClient.connect({}, () => {
      this1.stompClient.subscribe(this1.topic, (sdkEvent: any) => {
        this1.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  _send(body: Object = {}) {
    this.stompClient.send('/app/hello', {}, JSON.stringify(body));
  }

  _reSend(message: string) {
    this.stompClient.send('/app/hello', {}, message);
  }

  onMessageReceived(message: any) {
    this.producerConsumerDiagramComponent.updateSystem(message.body).then();
  }
}
