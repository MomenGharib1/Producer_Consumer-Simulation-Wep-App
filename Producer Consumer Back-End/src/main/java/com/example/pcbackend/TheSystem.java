package com.example.pcbackend;

import com.example.pcbackend.BackController.MessagesOrder;
import com.example.pcbackend.BackController.WebController;
import com.example.pcbackend.Components.Machine.MachineComponent;
import com.example.pcbackend.Components.Queue.QueueComponent;
import com.example.pcbackend.Memento.Memento;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.atomic.AtomicBoolean;

public class TheSystem implements Runnable {
    public static AtomicBoolean FinishedAiring = new AtomicBoolean(false);
    private Map<Integer, QueueComponent> Queues = new HashMap<>();
    private Map<Integer, MachineComponent> Machines = new HashMap<>();
    private QueueComponent StartingQueue;
    private QueueComponent EndingQueue;
    private ArrayList<Thread> threads = new ArrayList<>();
    public static AtomicBoolean SystemFinishedWorked = new AtomicBoolean(false);
    private Memento lastSimulation;
    private int Inputs = 0;

    private WebController listener;

    public TheSystem(WebController listener) {
        this.StartingQueue = new QueueComponent(0, listener);
        this.EndingQueue = new QueueComponent(-1, listener);
        Queues.put(0, StartingQueue);
        Queues.put(-1, EndingQueue);

        this.listener = listener;
    }

    public void AddQueue(int ID) {
        Queues.put(ID, new QueueComponent(ID, this.listener));
    }

    public void AddMachine(int ID) {
        Machines.put(ID, new MachineComponent(ID, this.listener));
    }

    public void QueueToMachine(int ID1, int ID2) {
        Queues.get(ID1).AddAfter(Machines.get(ID2));
        Machines.get(ID2).AddBefore(Queues.get(ID1));
    }

    public void MachineToQueue(int ID1, int ID2) {
        Machines.get(ID1).LinkNextQueue(Queues.get(ID2));
        Queues.get(ID2).AddBefore(Machines.get(ID1));
    }

    public void RestartSimulation() {
        Queues = lastSimulation.getQueues();
        Machines = lastSimulation.getMachines();
        Inputs = lastSimulation.getNoOfInputs();
        this.run();
    }

    private void makeMemento() {
        for (Map.Entry<Integer, QueueComponent> Component : Queues.entrySet()) {
            Component.getValue().restart();
        }
        for (Map.Entry<Integer, MachineComponent> Component : Machines.entrySet()) {
            Component.getValue().restart();
        }
        lastSimulation = new Memento(new HashMap<>(Queues), new HashMap<>(Machines), this.Inputs);
    }

    private void clear() {
        Queues.clear();
        Machines.clear();
        threads.clear();
        FinishedAiring.set(false);
        SystemFinishedWorked.set(false);
        Inputs = 0;
        System.out.println("---------------------------------------------");
    }

    @Override
    public void run() {
        if (Inputs == 0) return;

        for (Map.Entry<Integer, QueueComponent> Component : Queues.entrySet()) {
            Component.getValue().StartThread(threads);
        }
        for (Map.Entry<Integer, MachineComponent> Component : Machines.entrySet()) {
            Component.getValue().StartThread(threads);
        }

        Random rand = new Random();
        int RandomInput = 301 + rand.nextInt(700);

        Timer.time = System.currentTimeMillis();
        for (int i = 0; i < Inputs; i++) {
            try {
                Thread.sleep(RandomInput);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            Queues.get(0).AddInput();
        }

        FinishedAiring.set(true);
        for (var thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        SystemFinishedWorked.set(true);
        MessagesOrder.Order.reset();
        makeMemento();
        clear();
    }

    public void setInputs(int inputs) {
        Inputs = inputs;
    }
}
