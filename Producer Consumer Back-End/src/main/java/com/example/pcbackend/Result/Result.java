package com.example.pcbackend.Result;

public class Result {
    private boolean error;
    private String message;
    private int[] queuesIDs;
    private int[] machinesIDs;
    private String[] queuesConnectors;
    private String[] machinesConnectors;

    private int products;

    Result(boolean error, String message, int[] queuesIDs, int[] machinesIDs,
           String[] queuesConnectors, String[] machinesConnectors, int products) {
        this.error = error;
        this.message = message;
        this.queuesIDs = queuesIDs;
        this.machinesIDs = machinesIDs;
        this.queuesConnectors = queuesConnectors;
        this.machinesConnectors = machinesConnectors;
        this.products = products;
    }

    Result() {

    }

    public boolean isError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public int[] getQueuesIDs() {
        return queuesIDs;
    }

    public int[] getMachinesIDs() {
        return machinesIDs;
    }

    public String[] getQueuesConnectors() {
        return queuesConnectors;
    }

    public String[] getMachinesConnectors() {
        return machinesConnectors;
    }

    public int getProducts() {
        return products;
    }
}
