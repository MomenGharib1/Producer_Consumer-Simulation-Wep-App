package com.example.pcbackend.Memento;

import com.example.pcbackend.Components.Machine.MachineComponent;
import com.example.pcbackend.Components.Queue.QueueComponent;

import java.util.Map;

public class Memento {
    private Map<Integer, QueueComponent> Queues;
    private Map<Integer, MachineComponent> Machines;
    private int noOfInputs = 0;

    public Memento(Map<Integer, QueueComponent> queues, Map<Integer, MachineComponent> machines, int noOfInputs) {
        Queues = queues;
        Machines = machines;
        this.noOfInputs = noOfInputs;
    }

    public Map<Integer, QueueComponent> getQueues() {
        return Queues;
    }

    public Map<Integer, MachineComponent> getMachines() {
        return Machines;
    }

    public int getNoOfInputs() {
        return noOfInputs;
    }


}