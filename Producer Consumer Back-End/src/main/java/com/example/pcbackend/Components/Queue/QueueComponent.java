package com.example.pcbackend.Components.Queue;

import com.example.pcbackend.BackController.WebController;
import com.example.pcbackend.Components.Component;
import com.example.pcbackend.Components.Machine.MachineComponent;
import com.example.pcbackend.TheSystem;
import com.example.pcbackend.Timer;

import java.util.ArrayList;
import java.util.Queue;

public class QueueComponent extends Component implements Runnable {

    private final QueueController MyQueue;

    public QueueComponent(int ID, WebController listener) {
        super(ID);
        MyQueue = new QueueController(ID, listener);
    }

    public void restart() {
        IsFinished.set(false);
        MyQueue.BeforeFinished.set(false);
        MyQueue.Produced.set(0);
    }

    public void StartThread(ArrayList<Thread> threads) {
        Thread Controller = new Thread(MyQueue);
        Thread ComponentThread = new Thread(this);
        threads.add(Controller);
        threads.add(ComponentThread);
        Controller.start();
        ComponentThread.start();
    }

    public Queue<Boolean> GetQueueReference() {
        return MyQueue.ToSend;
    }

    public void AddAfter(MachineComponent component) {
        MyQueue.ChainAfter.add(component);
    }

    public void AddInput() {
        MyQueue.ToSend.add(true);
        synchronized (MyQueue.ToSend) {
            MyQueue.ToSend.notify();
        }
    }

    public int getID() {
        return ID;
    }

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
        System.out.println("Queue " + ID + " Finished " + MyQueue.ToSend.isEmpty() + " : " + (System.currentTimeMillis() - Timer.time));
    }
}
