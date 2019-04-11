var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    var pt = null;
    var channel = null;
    
    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };

    var createPolygon = function(polygon){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = '#f00';
        var org =  polygon[0];
        ctx.moveTo(org.x, org.y);
        for(var i = 1; i < polygon.length; i++){
        	var elem =  polygon[i];
    		ctx.lineTo(elem.x,elem.y);
        }
        ctx.lineTo(org.x,org.y);
    	ctx.closePath();
    	ctx.fill();

    }
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    //https://stackoverflow.com/questions/23744605/javascript-get-x-and-y-coordinates-on-mouse-click
    var sendFromCanvas = function(env){
        var pos = getMousePosition(env)
        console.log("aca");
      	stompClient.send("/app/newpoint."+channel, {}, JSON.stringify(pos));
    };
    
    var sendTopicNewPt = function(){
        stompClient.send("/app/newpoint."+channel, {}, JSON.stringify(pt)); 
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint.'+channel, function (eventbody) {
                var ptn=JSON.parse(eventbody.body);
                addPointToCanvas(ptn);
            });
            stompClient.subscribe('/topic/newpolygon.'+channel, function (eventbody) {
                var polygon=JSON.parse(eventbody.body);
                console.log("Holaaa " + polygon);
                createPolygon(polygon);
            });
        });
    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            can.addEventListener('click',sendFromCanvas);
            if($("#channel").val() == ""){
                alert("The channel can not null");
            }else if(channel !=""){
                app.disconnect();
                channel  = $("#channel").val();
                connectAndSubscribe();
            }else{      
                connectAndSubscribe();
            }
        },

        publishPoint: function(px,py){
            pt=new Point(px,py);
            console.info("publishing point at "+pt.x + " " + pt.y);
            addPointToCanvas(pt);
        },

        sendPoint: function(){
        	sendTopicNewPt();
        },


        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            //setConnected(false);
            console.log("Disconnected");
        }
    };

})();