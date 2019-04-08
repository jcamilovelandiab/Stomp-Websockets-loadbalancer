var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;
    var pt = null;
    
    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
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
        console.log(pos.x + " " + pos.y );
    	stompClient.send("/topic/newpoint", {}, JSON.stringify(pos));
    };
    
    var sendTopicNewPt = function(){
        stompClient.send("/topic/newpoint", {}, JSON.stringify(pt)); 
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var ptn=JSON.parse(eventbody.body);
                addPointToCanvas(ptn);
            });
        });
    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            can.addEventListener('click',sendFromCanvas)
            //websocket connection
            connectAndSubscribe();
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
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();