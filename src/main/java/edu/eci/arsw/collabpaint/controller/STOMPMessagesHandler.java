package edu.eci.arsw.collabpaint.controller;

import org.springframework.stereotype.Controller;
import edu.eci.arsw.collabpaint.model.*;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
public class STOMPMessagesHandler {
	
	@Autowired
    SimpMessagingTemplate msgt;
    

    ConcurrentHashMap<String , Polygon > poligonos = new ConcurrentHashMap<String, Polygon>();;

	@MessageMapping("/newpoint.{numdibujo}")    
	public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:"+pt + " con numero de dibujo "+numdibujo);
        msgt.convertAndSend("/topic/newpoint."+numdibujo,pt);
        if(!poligonos.containsKey(numdibujo)){
            System.out.println(numdibujo);
            poligonos.put(numdibujo, new Polygon());
            
        }
        poligonos.get(numdibujo).addPoint(pt); 
        System.out.println(poligonos.get(numdibujo).getPolygon().size());
        if(poligonos.get(numdibujo).getPolygon().size()==4) {
            System.out.println("El poligono vive");
            msgt.convertAndSend("/topic/newpolygon."+numdibujo, poligonos.get(numdibujo).getPolygon());
            poligonos.get(numdibujo).clear();
            
        }
    }
}