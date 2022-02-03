package com.example.pcbackend.Components.Queue;

import com.example.pcbackend.BackController.WebController;
import com.example.pcbackend.Components.Machine.MachineComponent;
import com.example.pcbackend.Timer;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class QueueController implements Runnable {
    protected final List<MachineComponent> ChainAfter = new LinkedList<>();
    protected final Queue<Boolean> ToSend = new LinkedList<>();
    protected final AtomicBoolean BeforeFinished = new AtomicBoolean(false);
    protected AtomicInteger Produced = new AtomicInteger(0);
    int ID;

    private WebController listener;

    public QueueController(int ID, WebController listener) {
        this.ID = ID;

        this.listener = listener;
    }

    @Override
    public void run() {
        while (!(ToSend.isEmpty() && BeforeFinished.get())) {

            for (var component : ChainAfter) {
                if (ToSend.isEmpty()) break;
                if (component.IsAvailable()) {

                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    //if (!component.IsAvailable()) continue;
                    String Message = "queue_" + ID + " machine_" + component.getID();


                    this.listener.SendData(Message);

                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    component.Update();
                    ToSend.poll();
                    System.out.println("Queue " + ID + " Produced NO " + Produced.incrementAndGet()+ " to " + component.getID()
                            + " : " + (System.currentTimeMillis() - Timer.time));
                }
            }

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
        }
    }
}