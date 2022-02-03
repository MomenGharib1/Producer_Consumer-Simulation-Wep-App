package com.example.pcbackend.Result;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ResultBuilder {
    public static Result buildResult(String simulationInfo) {
        ObjectMapper objectMapper = new ObjectMapper();
        Result result = null;
        try {
            result = objectMapper.readValue(simulationInfo, Result.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
