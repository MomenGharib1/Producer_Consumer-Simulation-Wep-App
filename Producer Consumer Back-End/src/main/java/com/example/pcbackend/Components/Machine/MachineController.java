package com.example.pcbackend.Components.Machine;

import com.example.pcbackend.BackController.MessagesOrder;
import com.example.pcbackend.BackController.WebController;
import com.example.pcbackend.Components.Queue.QueueComponent;
import com.example.pcbackend.Timer;

import java.util.Random;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class MachineController implements Runnable {
    protected final AtomicBoolean IsAvailable = new AtomicBoolean(true);
    protected final AtomicInteger ServeTime = new AtomicInteger();
    protected final AtomicBoolean BeforeFinished = new AtomicBoolean(false);
    protected QueueComponent NextQueue;
    protected AtomicInteger Consumed = new AtomicInteger(0);
    protected AtomicBoolean Reserved = new AtomicBoolean(false);
    int ID;

    private WebController listener;

    protected MachineController(QueueComponent Next, int ID, WebController listener) {
        Random rand = new Random();
        int RandomInput = 401 + rand.nextInt(1500);
        ServeTime.set(RandomInput);

        NextQueue = Next;
        this.ID = ID;

        this.listener = listener;
    }

    @Override
    public void run() {
        while (!(BeforeFinished.get() && IsAvailable.get())) {
            synchronized (IsAvailable) {
                while (IsAvailable.get() && !BeforeFinished.get()) {
                    try {
                        IsAvailable.wait(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }

            if (!IsAvailable.get()) {
                try {
                    Thread.sleep(ServeTime.get());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                String Message = "machine_" + ID + " queue_" + NextQueue.getID();

                this.listener.SendData(Message);

                try {
                    Thread.sleep(800);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (NextQueue.GetQueueReference()) {
                    NextQueue.GetQueueReference().offer(true);
                    NextQueue.GetQueueReference().notify();
                }
                IsAvailable.set(true);
                Reserved.set(false);
                System.out.println("Machine " + ID + " Consumed NO " + Consumed.incrementAndGet() + " to " + NextQueue.getID()
                        + " : " + (System.currentTimeMillis() - Timer.time));
            }


        }
    }
}