package edu.eci.arsw.collabpaint.model;

import java.util.ArrayList;
import java.util.*;
import java.util.List;

public class Polygon{

    private List<Point> points;

    public Polygon(){
        this.points = new ArrayList<>(); 
    }    
    
    public void addPoint(Point pt){
        points.add(pt);
    }

    public void clear(){
        this.points.clear();;
    }
    public List<Point> getPolygon(){
        //Collections.sort(this.points);
        return this.points;
    }

}

