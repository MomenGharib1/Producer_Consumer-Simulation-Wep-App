package com.example.pcbackend.BackController;

import com.example.pcbackend.Components.ComponentsBuilder;
import com.example.pcbackend.Result.Result;
import com.example.pcbackend.Result.ResultBuilder;
import com.example.pcbackend.TheSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Random;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Controller
public class WebController {

    public TheSystem Main = new TheSystem(this);
    private Lock lock = new ReentrantLock();

    @Autowired
    private SimpMessagingTemplate template;

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public void greeting(String simulationInfo) {
        if (simulationInfo.equals("re")) {
            Main.RestartSimulation();
        } else {
            Result result = ResultBuilder.buildResult(simulationInfo);
            ComponentsBuilder componentsBuilder = new ComponentsBuilder(Main);
            componentsBuilder.buildComponents(result);
        }
        new Thread(Main).start();
    }

    @SendTo("/topic/greetings")
    public void SendData(String Message) {
        lock.lock();
        try {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            Message = Message.concat(", " + MessagesOrder.Order.intValue());
            //System.out.println(Message);
            MessagesOrder.Order.increment();
            this.template.convertAndSend("/topic/greetings", Message);
        } finally {
            lock.unlock();
        }

    }
}