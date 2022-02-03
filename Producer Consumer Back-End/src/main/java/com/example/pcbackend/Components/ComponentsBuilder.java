package com.example.pcbackend.Components;

import com.example.pcbackend.Result.Result;
import com.example.pcbackend.TheSystem;

public class ComponentsBuilder {
    TheSystem system;

    public ComponentsBuilder(TheSystem system) {
        this.system = system;
    }

    public void buildComponents(Result result) {
        for (var queueID : result.getQueuesIDs()) {
            system.AddQueue(queueID);
        }
        for (var machineID : result.getMachinesIDs()) {
            system.AddMachine(machineID);
        }
        for (var connector : result.getQueuesConnectors()) {
            system.QueueToMachine(Integer.parseInt(connector.split("\\s+")[0]), Integer.parseInt(connector.split("\\s+")[1]));
        }
        for (var connector : result.getMachinesConnectors()) {
            system.MachineToQueue(Integer.parseInt(connector.split("\\s+")[0]), Integer.parseInt(connector.split("\\s+")[1]));
        }
        system.setInputs(result.getProducts());
    }
}
