package edu.eci.arsw.collabpaint.controller;

import org.springframework.stereotype.Controller;
import edu.eci.arsw.collabpaint.model.*;
import org.springframework.messaging.handler.annotation.*;

@Controller
public class CollabPaintController {

    @MessageMapping("/topic/newpoint")
    @SendTo("/topic/newpoint")
    public Point sendMessage(@Payload Point point) {
        System.out.println(point.getX() +  " , " + point.getY());
        return point;
    }
}