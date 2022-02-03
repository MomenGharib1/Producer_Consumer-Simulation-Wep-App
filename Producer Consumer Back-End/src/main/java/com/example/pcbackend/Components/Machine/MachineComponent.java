package com.example.pcbackend.Components.Machine;

import com.example.pcbackend.BackController.WebController;
import com.example.pcbackend.Components.Component;
import com.example.pcbackend.Components.Queue.QueueComponent;
import com.example.pcbackend.Timer;

import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

public class MachineComponent extends Component implements Runnable {
    protected QueueComponent NextQueue = null;
    private MachineController MyMachine = null;

    private WebController listener;

    public MachineComponent(int ID, WebController listener) {
        super(ID);
        this.listener = listener;
    }

    public void StartThread(ArrayList<Thread> threads) {
        Thread Controller = new Thread(MyMachine);
        Thread ComponentThread = new Thread(this);
        threads.add(Controller);
        threads.add(ComponentThread);
        Controller.start();
        ComponentThread.start();
    }

    public boolean LinkNextQueue(QueueComponent Queue) {
        if (NextQueue != null) return false;
        NextQueue = Queue;
        MyMachine = new MachineController(Queue, ID, listener);
        return true;
    }

    public synchronized boolean IsAvailable() {
        if (MyMachine.Reserved.get()) return false;
        if (MyMachine.IsAvailable.get()) MyMachine.Reserved.set(true);
        return MyMachine.IsAvailable.get();
    }

    public synchronized boolean IsReserved() {
        return MyMachine.Reserved.get();
    }

    public int getID() {
        return ID;
    }

    public synchronized void Update() {
        MyMachine.IsAvailable.set(false);
        synchronized (MyMachine.IsAvailable) {
            MyMachine.IsAvailable.notify();
        }
    }

    public void restart() {
        IsFinished.set(false);
        MyMachine.Reserved.set(false);
        MyMachine.BeforeFinished.set(false);
        MyMachine.IsAvailable.set(true);
        MyMachine.Consumed.set(0);
    }

    @Override
    public void run() {
        boolean CheckFinish = false;
        while (!CheckFinish) {
            CheckFinish = true;

            for (var Component : ChainBefore) {
                CheckFinish &= Component.IsFinished();
            }

            if (CheckFinish) {
                MyMachine.BeforeFinished.set(true);
            }

            CheckFinish &= MyMachine.IsAvailable.get();
        }
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        IsFinished.set(true);
        System.out.println("Machine " + ID + " Finished " + MyMachine.IsAvailable.get() + " : " + (System.currentTimeMillis() - Timer.time));
    }
}