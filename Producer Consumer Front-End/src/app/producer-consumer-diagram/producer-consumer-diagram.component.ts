import {Component, HostListener, OnInit} from '@angular/core';
import {
  faFileUpload,
  faRedoAlt,
  faMousePointer,
  faPlay,
  faCogs,
  faListOl,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import Konva from "konva";
import {DefaultDirector} from './ShapeCreator/Director/DefaultDirector';
import Shape = Konva.Shape;
import {WebSocketAPI} from "../Services/WebSocketService";
import {ProdService} from "../Services/prod.service";
import {Target} from "./Target";
import {Connector} from "./Connector";

@Component({
  selector: 'app-producer-consumer-diagram',
  templateUrl: './producer-consumer-diagram.component.html',
  styleUrls: ['./producer-consumer-diagram.component.css']
})
export class ProducerConsumerDiagramComponent implements OnInit {
  WebSocket!: WebSocketAPI;
  DefaultDirector: DefaultDirector = new DefaultDirector();
  input: number = 0;
  productsNum: number = 0;
  order: number = 0;
  products: any = [];

  faPlay = faPlay;
  faLink = faLink;
  faCogs = faCogs;
  faListOl = faListOl;
  faUpload = faFileUpload;
  faRedoAlt = faRedoAlt;
  faMousePointer = faMousePointer;

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  tr!: Konva.Transformer;
  selectionShape: Shape = new Konva.Rect({
    fill: 'rgba(255, 255, 255, 0.5)',
    visible: false,
    globalCompositeOperation: "source-over",
  });

  x1: number = 0;
  x2: number = 0;
  y1: number = 0;
  y2: number = 0;

  machineTargets: any = new Map<string, any>();
  queueTargets: any = new Map<string, any>();
  queues: any = new Map<string, any>();
  machines: any = new Map<string, any>();
  connectors: any = new Map<string, any>();
  queueOrder: any = new Map<number, string>();

  machineID: number = 0;
  queueID: number = 0;
  connectorID: number = 0;

  constructor(public ProdService: ProdService) {
  }

  @HostListener('window:keydown.Delete', ['$event']) del() {
    this.delete();
  }

  @HostListener('window:keydown.q', ['$event']) q() {
    this.buildQueue();
  }

  @HostListener('window:keydown.m', ['$event']) m() {
    this.buildMachine();
  }

  @HostListener('window:keydown.p', ['$event']) p() {
    this.simulate().then();
  }

  @HostListener('window:keydown.r', ['$event']) r() {
    this.reSimulate().then();
  }

  @HostListener('window:keydown.o', ['$event']) o() {
    this.WebSocket._connect();
  }

  @HostListener('window:keydown.c', ['$event']) c() {
    this.connect();
  }

  ngOnInit(): void {
    this.WebSocket = new WebSocketAPI(this);
    this.stage = new Konva.Stage({
      container: 'canvas',
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.tr = new Konva.Transformer({
      nodes: [],
      ignoreStroke: false,
      padding: 5,
      resizeEnabled: false,
      rotateEnabled: false,
      enabledAnchors: [],
    });
    this.layer.add(this.tr);
    this.StartQueue();
    this.EndQueue();
  }

  createProducts() {
    let queueTarget: Target = this.queueTargets.get("queue_0");

    let queue = <Konva.Group>this.queues.get("queue_0");
    let queueTextObject = <Konva.Text>queue.children![1];
    let qText = queueTextObject.text().split("\n")[0];
    queueTextObject.text(qText + "\nProducts " + this.productsNum);
    queueTextObject.offsetX(40);

    for (let i = 0; i < this.productsNum; i++) {
      let product = new Konva.RegularPolygon({
        x: 2000,
        y: 2000,
        sides: 6,
        radius: 10,
        fill: Konva.Util.getRandomColor(),
        stroke: "#888",
        strokeWidth: 1,
        shadowBlur: 5,
        visible: false,
      });
      queueTarget.products.push(product);
      this.products.push(product);
      this.layer.add(product);
    }
    this.stage.add(this.layer);
  }

  async simulate() {
    this.WebSocket._connect();
    await this.delay(200);
    this.reset("sim");
    this.createProducts();
    this.play();
  }

  play() {
    this.ProdService.sendGraph(this.connectors, this.productsNum, this.WebSocket);
  }

  async reSimulate() {
    this.WebSocket._connect();
    await this.delay(200);
    this.reset("re");
    this.WebSocket._reSend("re");
  }

  reset(state: string) {
    this.order = 0;
    this.queueOrder.clear();
    this.queues.forEach((queue: Konva.Group) => {
      let queueTextObject = <Konva.Text>queue.children![1];
      let queueText = queueTextObject.text().split("\n")[0];
      if (queue.id() == "queue_0" && state == "re")
        queueTextObject.text(queueText + "\nProducts " + this.productsNum);
      else
        queueTextObject.text(queueText + "\nProducts 0");
    });
    this.machines.forEach((machine: Konva.Group) => {
      let circleShape = <Konva.Circle>machine.children![0];
      circleShape.fill("#efa610");
    });
    this.machineTargets.forEach((machineTarget: Target) => {
      machineTarget.products = [];
    });
    if (state == "sim") {
      this.products = [];
      this.queueTargets.forEach((queueTarget: Target) => {
        queueTarget.products = [];
      });
    } else {
      this.queueTargets.forEach((queueTarget: Target) => {
        if (queueTarget.id == "queue_0") queueTarget.products = this.products;
        else queueTarget.products = [];
      });
    }
  }

  async updateSystem(message: string) {
    let orderNum = parseInt(message.split(", ")[1]);
    message = message.split(", ")[0];

    if (orderNum == this.order) {
      this.order++;
    } else {
      this.queueOrder.set(orderNum, message);
      return;
    }

    let ogColor = "#efa610";
    let from, to;

    let toTarget: Target;
    let fromTarget: Target;
    let connectorTarget: Connector;

    let connectorArrow = new Konva.Arrow;
    let product = new Konva.RegularPolygon;

    let split = message.split(" ");
    let fromID = split[0], toID = split[1];

    this.connectors.forEach((connector: any) => {
      if (connector.from == fromID && connector.to == toID) {
        connectorTarget = connector;
        connectorArrow = <Konva.Arrow>this.layer.findOne('#' + connectorTarget.id);
      }
    });

    let x1 = connectorArrow.points()[0];
    let y1 = connectorArrow.points()[1];
    let x2 = connectorArrow.points()[2];
    let y2 = connectorArrow.points()[3];

    if (fromID.includes("machine")) {
      from = <Konva.Group>this.machines.get(connectorTarget!.from);
      fromTarget = this.machineTargets.get(connectorTarget!.from);
      to = <Konva.Group>this.queues.get(connectorTarget!.to);
      toTarget = this.queueTargets.get(connectorTarget!.to);

      let fromTextObject = <Konva.Text>from.children![1];
      let fromText = fromTextObject.text().split("\n")[0];

      let toTextObject = <Konva.Text>to.children![1];
      let toText = toTextObject.text().split("\n")[0];

      product = <Konva.RegularPolygon><unknown>fromTarget.products.shift();
      toTarget.products.push(product);

      product.x(x1);
      product.y(y1);
      product.visible(true);

      let circleShape = <Konva.Circle>from.children![0];

      // flash rate
      circleShape.shadowOpacity(0.8);
      circleShape.shadowColor("#f3f3f3");

      circleShape.shadowEnabled(false);
      await this.delay(100);
      circleShape.shadowEnabled(true);
      await this.delay(100);
      circleShape.shadowEnabled(false);
      await this.delay(100);
      circleShape.shadowEnabled(true);

      // reset machine
      circleShape.shadowOpacity(0.5);
      circleShape.shadowColor("#000");
      circleShape.fill(ogColor);
      fromTextObject.text(fromText + "\nAvailable");
      fromTextObject.offsetX(33);

      // the tween has to be created after the node has been added to the layer
      let tween = new Konva.Tween({
        node: product,
        x: x2,
        y: y2,
        easing: Konva.Easings["Linear"],
        duration: 0.5,
        onFinish: () => {
          if (Math.abs(product.x() - x2) <= 10) {
            toTextObject.text(toText + "\nProducts " + (toTarget.products.length));
            product.visible(false);
            circleShape.fill(ogColor);
          }
        }
      });

      tween.play();
      tween.onFinish();

    } else {
      from = <Konva.Group>this.queues.get(connectorTarget!.from);
      fromTarget = this.queueTargets.get(connectorTarget!.from);
      to = <Konva.Group>this.machines.get(connectorTarget!.to);
      toTarget = this.machineTargets.get(connectorTarget!.to);

      let toTextObject = <Konva.Text>to.children![1];
      let toText = toTextObject.text().split("\n")[0];

      let fromTextObject = <Konva.Text>from.children![1];
      let fromText = fromTextObject.text().split("\n")[0];

      product = <Konva.RegularPolygon><unknown>fromTarget.products.shift();
      toTarget.products.push(product);

      fromTextObject.text(fromText + "\nProducts " + (fromTarget.products.length));
      fromTextObject.offsetX(40);

      product.x(x1);
      product.y(y1);
      product.visible(true);

      let circleShape = <Konva.Circle>to.children![0];

      // the tween has to be created after the node has been added to the layer
      let tween = new Konva.Tween({
        node: product,
        x: x2,
        y: y2,
        easing: Konva.Easings["Linear"],
        duration: 0.5,
        onFinish: () => {
          if (Math.abs(product.x() - x2) <= 10) {
            product.visible(false);
            circleShape.shadowOpacity(0.5);
            circleShape.shadowColor("#000");
            circleShape.fill(product.fill());
            toTextObject.text(toText + "\nProcessing");
            toTextObject.offsetX(40);
          }
        }
      });

      tween.play();
      tween.onFinish();
    }

    while (this.queueOrder.has(this.order)) {
      let dummy = this.queueOrder.get(this.order);
      this.updateSystem(dummy + ", " + this.order).then();
      this.queueOrder.delete(this.order);
      this.order++;
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateInput() {
    this.productsNum = this.input;
  }

  StartQueue() {
    this.DefaultDirector.constructPolygon(4);

    let queue = new Konva.Group({
      id: "queue" + '_' + (this.queueID),
      x: 1800,
      y: 400,
      draggable: false,
      name: "queue"
    });

    let konvaShape = <Konva.RegularPolygon>this.DefaultDirector.GetKonva();

    queue.add(konvaShape);

    queue.add(new Konva.Text({
      text: "QStart" + "\n" + "Products 0",
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: 38,
      offsetY: 20,
      align: 'center'
    }));

    this.queues.set("queue_" + (this.queueID), queue);

    this.addShape(queue);
    this.queueTargets.set(
      "queue" + '_' + (this.queueID),
      new Target("queue", "queue" + '_' + (this.queueID), queue.x(), queue.y())
    );
  }

  EndQueue() {
    this.DefaultDirector.constructPolygon(4);

    let queue = new Konva.Group({
      id: "queue" + '_' + (-1),
      x: 100,
      y: 400,
      draggable: false,
      name: "queue"
    });

    let konvaShape = <Konva.RegularPolygon>this.DefaultDirector.GetKonva();

    queue.add(konvaShape);

    queue.add(new Konva.Text({
      text: "QEnd" + "\n" + "Products 0",
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: 38,
      offsetY: 20,
      align: 'center'
    }));

    this.queues.set("queue_" + (-1), queue);

    this.addShape(queue);
    this.queueTargets.set(
      "queue" + '_' + (-1),
      new Target("queue", "queue" + '_' + (-1), queue.x(), queue.y())
    );
  }

  generateTargets(shape: Konva.Group, name: string, ID: number, targets: Map<string, any>) {
    targets.set(
      name + '_' + (ID + 1),
      new Target(name, name + '_' + (ID + 1), shape.x(), shape.y())
    );
  }

  generateConnectors(arrow: Konva.Arrow, fromShape: Konva.Group, toShape: Konva.Group) {
    let from = fromShape.id();
    let to = toShape.id();
    if (from === to) {
      return;
    }
    this.connectors.set(
      'connector_' + (this.connectorID + 1),
      new Connector('connector_' + (this.connectorID + 1), from, to, arrow.points(),)
    );
  }

  getConnectorPointsOG(from: Konva.Group, to: Konva.Group) {
    const dx = to.x() - from.x();
    const dy = to.y() - from.y();
    let angle = Math.atan2(-dy, dx);

    const radius = 70;

    return [
      from.x() + -radius * Math.cos(angle + Math.PI),
      from.y() + radius * Math.sin(angle + Math.PI),
      to.x() + -radius * Math.cos(angle),
      to.y() + radius * Math.sin(angle),
    ];
  }

  updateObjects() {
    this.machineTargets.forEach((machineTarget: any) => {
      let node = this.layer.findOne('#' + machineTarget.id);
      node.x(machineTarget.x);
      node.y(machineTarget.y);
    });
    this.queueTargets.forEach((queueTarget: any) => {
      if (queueTarget.id != "queue_0" && queueTarget.id != "queue_-1") {
        let node = this.layer.findOne('#' + queueTarget.id);
        node.x(queueTarget.x);
        node.y(queueTarget.y);
      }
    });
    this.connectors.forEach((connector: any) => {
      let line = <Konva.Arrow>this.layer.findOne('#' + connector.id);
      let fromNode = <Konva.Group>this.layer.findOne('#' + connector.from);
      let toNode = <Konva.Group>this.layer.findOne('#' + connector.to);

      const points = this.getConnectorPointsOG(
        fromNode,
        toNode,
      );
      if (line != null)
        line.points(points);
    });
  }

  delete() {
    let selectedShapes = this.tr.nodes();
    for (let selectedShape of selectedShapes) {
      if (selectedShape.id() == "queue_0" || selectedShape.id() == "queue_-1") return;
      if (this.queues.has(selectedShape.id())) {
        this.queues.delete(selectedShape.id());
        this.queueTargets.delete(selectedShape.id());
      } else if (this.machines.has(selectedShape.id())) {
        this.machines.delete(selectedShape.id());
        this.machineTargets.delete(selectedShape.id());
      } else if (this.connectors.has(selectedShape.id())) {
        this.connectors.delete(selectedShape.id());
      }
      selectedShape.destroy();
    }
    this.tr.nodes([]);
  }

  clickSelect() {
    this.stage.on('click', (e) => {
      // if we are selecting with rect, do nothing
      if (this.selectionShape.visible()) return;


      // if click on empty area - remove all selections
      if (e.target === this.stage) {
        this.tr.nodes([]);
        return;
      }

      if (e.target.hasName('connector')) {
        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = this.tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          this.tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = this.tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          this.tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = this.tr.nodes().concat([e.target]);
          this.tr.nodes(nodes);
        }
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.parent!.hasName('machine') && !e.target.parent!.hasName('queue')) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = this.tr.nodes().indexOf(e.target.parent!) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        this.tr.nodes([e.target.parent!]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = this.tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target.parent!), 1);
        this.tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = this.tr.nodes().concat([e.target.parent!]);
        this.tr.nodes(nodes);
      }
    });
  }

  boxSelect() {
    this.layer.add(this.selectionShape);
    this.stage.on('mousedown', (e) => {
      if (e.target !== this.stage) return;
      e.evt.preventDefault();

      this.x1 = this.stage.getPointerPosition()!.x;
      this.y1 = this.stage.getPointerPosition()!.y;
      this.x2 = this.stage.getPointerPosition()!.x;
      this.y2 = this.stage.getPointerPosition()!.y;

      this.selectionShape.visible(true);
      this.selectionShape.width(0);
      this.selectionShape.height(0);
    });

    this.stage.on('mousemove', (e) => {
      if (!this.selectionShape.visible()) return;
      e.evt.preventDefault();

      this.x2 = this.stage.getPointerPosition()!.x;
      this.y2 = this.stage.getPointerPosition()!.y;

      this.selectionShape.setAttrs({
        x: Math.min(this.x1, this.x2),
        y: Math.min(this.y1, this.y2),
        width: Math.abs(this.x2 - this.x1),
        height: Math.abs(this.y2 - this.y1),
      });
    });

    this.stage.on('mouseup', (e) => {
      if (!this.selectionShape.visible()) return;
      e.evt.preventDefault();

      setTimeout(() => {
        this.selectionShape.visible(false);
      });

      let shapes = [];
      for (let findElement of this.stage.find(".machine")) {
        shapes.push(findElement);
      }
      for (let findElement of this.stage.find(".queue")) {
        shapes.push(findElement);
      }
      let selectionArea = this.selectionShape.getClientRect();
      let selectedShapes = shapes.filter((shape) =>
        Konva.Util.haveIntersection(selectionArea, shape.getClientRect())
      );
      this.tr.nodes(selectedShapes);
      this.selectionShape.remove();
    });
  }

  iterate(targets: Map<string, any>, selectedShape: Konva.Node) {
    let target = targets.get(selectedShape.id());
    if (Math.abs(target.x - Math.round(selectedShape.x())) > 0.1 ||
      Math.abs(target.y - Math.round(selectedShape.y())) > 0.1) {
    } else return;
    target.x = Math.round(selectedShape.x());
    target.y = Math.round(selectedShape.y());
  }

  SelectorType() {
    this.stage.on("dragend", () => {
      let selectedShapes = this.tr.nodes();
      for (let selectedShape of selectedShapes) {
        if (this.machineTargets.has(selectedShape.id())) this.iterate(this.machineTargets, selectedShape);
        if (this.queueTargets.has(selectedShape.id())) this.iterate(this.queueTargets, selectedShape);
      }
      this.updateObjects();
    });
    this.boxSelect();
    this.clickSelect();
  }

  addShape(konvaShape: Konva.Group) {
    this.layer.add(konvaShape);
    this.stage.add(this.layer);
  }

  buildMachine() {
    let IDsString = this.machines.keys();
    let IDs = [];

    this.DefaultDirector.constructCircle();

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.machineID = Math.max(...IDs);

    let machine = new Konva.Group({
      id: "machine" + '_' + (this.machineID + 1),
      x: 200,
      y: 200,
      draggable: true,
      name: "machine"
    });

    let konvaShape = <Konva.Circle>this.DefaultDirector.GetKonva();

    machine.add(konvaShape);

    machine.add(new Konva.Text({
      text: "M" + (this.machineID + 1) + "\n" + "Available",
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: 33,
      offsetY: 20,
      align: 'center'
    }));

    this.machines.set("machine_" + (this.machineID + 1), machine);

    this.addShape(machine);
    this.generateTargets(machine, "machine", this.machineID, this.machineTargets);
  }

  buildQueue() {
    let IDsString = this.queues.keys();
    let IDs = [];

    this.DefaultDirector.constructPolygon(4);

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.queueID = Math.max(...IDs);

    let queue = new Konva.Group({
      id: "queue" + '_' + (this.queueID + 1),
      x: 600,
      y: 200,
      draggable: true,
      name: "queue"
    });

    let konvaShape = <Konva.RegularPolygon>this.DefaultDirector.GetKonva();

    queue.add(konvaShape);

    queue.add(new Konva.Text({
      text: "Q" + (this.queueID + 1) + "\n" + "Products 0",
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: 38,
      offsetY: 20,
      align: 'center'
    }));

    this.queues.set("queue_" + (this.queueID + 1), queue);

    this.addShape(queue);
    this.generateTargets(queue, "queue", this.queueID, this.queueTargets);
  }

  connect() {
    let IDsString = this.connectors.keys();
    let IDs = [];

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.connectorID = Math.max(...IDs);

    let first, second, points;
    let machine = this.tr.nodes().filter((machine) => machine.name() === "machine");
    let queue = this.tr.nodes().filter((queue) => queue.name() === "queue");

    if (machine.length != 1 || queue.length != 1) return;
    if (machine[0] === queue[0]) return;

    if (this.tr.nodes().indexOf(queue[0]) < this.tr.nodes().indexOf(machine[0])) {
      first = queue[0];
      second = machine[0];
    } else {
      second = queue[0];
      first = machine[0];
    }

    points = this.getConnectorPointsOG(<Konva.Group>first, <Konva.Group>second);

    let arrow = new Konva.Arrow({
      points: points,
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
      name: "connector",
    });
    this.layer.add(arrow);
    this.stage.add(this.layer);
    arrow.id('connector_' + (this.connectorID + 1));
    this.generateConnectors(arrow, <Konva.Group>first, <Konva.Group>second);
    this.updateObjects();
  }
}
