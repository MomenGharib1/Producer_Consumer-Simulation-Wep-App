package com.example.pcbackend.Components;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

public abstract class Component {
    protected List<Component> ChainBefore = new LinkedList<>();

    protected AtomicBoolean IsFinished = new AtomicBoolean(false);

    protected int ID;

    public Component(int ID) {
        this.ID = ID;
    }

    public abstract void StartThread(ArrayList<Thread> threads);

    public void AddBefore(Component component) {
        ChainBefore.add(component);
    }

    public boolean IsFinished() {
        return IsFinished.get();
    }


}
