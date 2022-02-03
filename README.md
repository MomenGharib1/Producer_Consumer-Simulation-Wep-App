# ***Producer/Consumer Simulation***

- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.12, and Spring Boot
  version 2.5.7 [Spring Boot](https://start.spring.io/).

## Authors:    

> **Youssef Ali Bazina**
>
> **Mohamed Mamdouh Rashad**
>
> **Mahmoud Mohamed Abd-Elaziz**
>
> **Momen Mahmoud Gharib**

## Table of Contents

- [Setup](#Setup)
    - [Ports](#Ports)
    - [Packages and Running](#Packages-and-Running)
- [Design Patterns and UML Class Diagram](#Design-Patterns-and-UML-Class-Diagram)
    - [Design Patterns](#Design-Patterns)
    - [UML Class Diagram](#UML-Class-Diagram)
- [Design Decisions](#Design-Decisions)
- [Features and User Guide](#Features-and-User-Guide)
    - [Features](#Features)
    - [User Guide](#User-Guide)
    - [UI Samples](#UI-Samples)

## Setup

### Ports

> - The Back end is listening on port 8080.
>
> - The Front end is listening on port 4200.

### Packages and Running

- To install packages, write "npm install" in the terminal for the front-end.

- The `pom.xml` will do the package installation for back-end but if anything goes wrong.

- To run the front write-in the terminal `ng serve`.

## Design Patterns and UML Class Diagram

### Design Patterns

| **Design Patterns**|
| :----------------: |
| Producer-Consumer Pattern    |
| Builder Pattern  |
| Memento Pattern    |
| Observer Pattern     |

- The **Producer-Consumer** pattern: coordinate transferring products between Queues and Machines, where the machines
  were producers and consumers, and queues were the shared queues between machines **threads**.

- **Memento** pattern: to store the previous simulation, store Queues, Machines, and connections between them and number
  of input products.

- **Builder** pattern: to build simulation using the information given from frontend
  (number of Queues and their IDs, connections between machines and Queues, …).

- **Observer** pattern is used, publisher: QueueController, observers: MachineComponents, Queue loops over the next
  machines and updates them.

## UML Class Diagram

![image](https://drive.google.com/uc?export=view&id=1aHN8VGU1k7fT5Vs_oC7fk4pLEVFTuHKw)

## Design Decisions

- Each Queue has an ID numbered (0, 1, 2, …) and the last queue ID is -1.
- Each machine has an ID numbered (1, 2, …).
- Simulation must start and end with queue, starting queue is called Q0 and ending queue is called Q-1 and they are
  already created in frontend when the page opens.
- No queue can be connected to queue, no machine can be connected to machine.
- Each queue consist of two threads, Component thread and Controller thread.
- Simulation starts with queue and ends with queue, starting queue is called Q0 and ending queue is called Q-1.
- Each queue consists of two threads, Component thread and Controller thread:
    - Component Thread:
        - It is responsible for continuously checking whether the queue is finished or not, queue is finished when:
            1. Machines before it finished consuming their products.
            2. Its “Tosend” queue which contains all the products stored in the queue is empty.
        ```java
        @Override
        public void run() {
        boolean CheckFinish = false;
        while (!CheckFinish) {
        CheckFinish = true;
        
                for (var Component : ChainBefore) {
                    CheckFinish &= Component.IsFinished();
                }
        
                if (ID == 0) CheckFinish &= TheSystem.FinishedAiring.get();
        
                if (CheckFinish) {
                    MyQueue.BeforeFinished.set(true);
                }
        
                CheckFinish &= MyQueue.ToSend.isEmpty();
            }
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            IsFinished.set(true);
        }
        ```
    - Controller Thread:
        - It is responsible for checking if the next machines are available (ready for receiving products) and if so, it
          sends products from the `Tosend` queue to the next machine.
        ```java
        for (var component : ChainAfter) {
            if (ToSend.isEmpty()) break;
            if (component.IsAvailable()) {
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                String Message = "queue_" + ID + " machine_" + component.getID();
                this.listener.SendData(Message);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                component.Update();
                ToSend.poll();
            }
        }
        ```
        - It is also responsible for receiving products from previous machine.
        ```java
        if (!ChainAfter.isEmpty() && !BeforeFinished.get())
            synchronized (ToSend) {
                while (ToSend.isEmpty() && !BeforeFinished.get()) {
                    try {
                        ToSend.wait(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
            else if (ChainAfter.isEmpty()) {
                while (!ToSend.isEmpty()) {
                    ToSend.poll();
                }
            }
        ```

- Each machine consists of two threads, Component thread and Controller thread.

    - Component Thread:
        - same as QueueComponent thread.
    - Controller Thread:
        - Receiving products from previous queues when it is available.
          ```java
            synchronized (IsAvailable) {
                while (IsAvailable.get() && !BeforeFinished.get()) {
                    try {
                        IsAvailable.wait(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
            ```
        - Moving products to next queue.
          ```java
            synchronized (NextQueue.GetQueueReference()) {
                NextQueue.GetQueueReference().offer(true);
                NextQueue.GetQueueReference().notify();
            }
            ```

- Websocket protocol was used to send notifications from backend to frontend, when a product is moved from a queue to a
  machine or from a machine to a queue.
- Simulation details is sent from front-end as json and converted to a class called “Result”.

## Features and User Guide

### Features

- A friendly GUI that allows user to insert queues, machines connect them with arrows, move them around, animation that
  shows products movement between the different components.

- Toolkit Tools:

    - Queue tool.
    - Machine tool.
    - Connector tool.
    - Text input to enter products number.
    - Play button to start simulation.
    - Redo button to restart the previous simulation.

### User Guide

- In the beginning Q0 (is called **QStart**), Q-1 (is called **QEnd**) are placed on the right, left of the screen. They
  shouldn’t be removed or moved.

- Toolbar Tools:
    - **Queue Tool:** Adds a queue to the board.
    - **Machine Tool:** Adds a machine to the board.
    - **Connector Tool:** Adds connector between two components, select the two components and connector will be drawn,
      the first to be selected is the one that the connection will be fired from it to the second selected one.
    - **Play Button:** Starts new simulation.
    - **Redo Button:** Restarts last simulation.
- Before starting the simulation there is an input in the bottom-center of the screen that should be filled with the
  products number, then press the enter key.
- When a machine gets a product it changes its color to the products color until the consuming time end.
- When a machine finishes consuming a product it flashes, then gives the product to the next one.

    - **The HotKeys:**

        - > "**P**" key start the simulation.
        - > "**R**" key simulate the last simulation again.
        - > "**M**" key drops a machine “Consumer” into the board.
        - > "**Q**" key drops a queue “Producer” into the board.
        - > "**C**" key connects the first selected shape with the second one.
        - > "**Delete**" key deletes the selected shape/s on the board.

### UI Samples

- Full Program Simulation.

![image](https://drive.google.com/uc?export=view&id=1tz_cxeQzo1uPOD6al4LZMYnCPtGluSzw)

- Toolbar.

![image](https://drive.google.com/uc?export=view&id=1vu01wxjOlqZgl6ovKud55XqKq50Ce59x)

- Toolkit.

![image](https://drive.google.com/uc?export=view&id=1ysBk0P3iQ9-sSW8gcvu3HoZAEX6KxD5n)

- Settings.

![image](https://drive.google.com/uc?export=view&id=1EMwLHkQeHynV9jHuAoY9PGTcIWGkQwle)
