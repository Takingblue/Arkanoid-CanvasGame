window.onload = function()
{
    var canvas = document.getElementById("paintGround");
    var ctx = canvas.getContext("2d");

    var W = 800;
    var H = 600;
    canvas.width = W;
    canvas.height = H;

    //  Ball class
    function Ball(_radius, _x, _y)
    {
        this.radius = _radius;
        this.x = _x;
        this.y = _y;

        this.go = 0;
        this.horizonVel=0;
        this.verticalVel=0;
        
        this.checkDead = function()
        {
            if(this.y>600+this.radius)
                return 1;
            else
                return 0;
        }

        this.checkBrickCollision = function(brick)
        {
            if(this.y>brick.y && this.y<brick.y+brick.length && (this.x+this.radius==brick.x || this.x-this.radius==brick.x+brick.length))
            {
                brick.gone=1;
                this.horizonVel = -this.horizonVel;
            }
            if(this.x>brick.x && this.x<brick.x+brick.length && (this.y+this.radius==brick.y || this.y-this.radius==brick.y+brick.length))
            {
                brick.gone=1;
                this.verticalVel = -this.verticalVel;
            }
            //four angles
            var basic_x = brick.x - this.x;
            var basic_y = brick.y - this.y;
            var rr = (this.radius)*(this.radius);
            if((basic_x+brick.length)*(basic_x+brick.length)+(basic_y+brick.length)*(basic_y+brick.length)<=rr)
            {
                brick.gone=1;
                this.horizonVel = -this.horizonVel;
                this.verticalVel = -this.verticalVel;
            }
            if((basic_x)*(basic_x)+(basic_y+brick.length)*(basic_y+brick.length)<=rr)
            {
                brick.gone=1;
                this.horizonVel = -this.horizonVel;
                this.verticalVel = -this.verticalVel;
            }
            if((basic_x)*(basic_x)+(basic_y)*(basic_y)<=rr)
            {
                brick.gone=1;
                this.horizonVel = -this.horizonVel;
                this.verticalVel = -this.verticalVel;
            }
            if((basic_x+brick.length)*(basic_x+brick.length)+(basic_y)*(basic_y)<=rr)
            {
                brick.gone=1;
                this.horizonVel = -this.horizonVel;
                this.verticalVel = -this.verticalVel;
            }
        }
        this.checkPanelCollision = function(panel)
        {
            if(this.x-this.radius <= 0 || this.x+this.radius > 799)
                this.horizonVel = -this.horizonVel;
            if(this.y-this.radius <= 0)   
                this.verticalVel = -this.verticalVel;
            if(this.x>=panel.leftX && this.x<=panel.leftX+panel.width && this.y+this.radius > 600-panel.height)
                this.verticalVel = -this.verticalVel;
        }
        this.start = function()
        {
            this.go = 1;
        }
        this.setDirectionAndSpeed = function(horizon, vertical)
        {
            this.horizonVel = horizon;
            this.verticalVel = vertical;
        }

        this.move = function()
        {
            if(this.go==0)
                this.setDirectionAndSpeed(-1,-1);
            else 
            {
                this.x = this.x+this.horizonVel;
                this.y = this.y+this.verticalVel;
            }
        }

        this.draw = function(panelCenter)
        {
            if(this.go==0)  //not start
                this.x = panelCenter;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
            ctx.fillStyle="black";
            ctx.fill();
            ctx.strokeStyle="black";
            ctx.stroke();
        }
    }

    function Panel(leftX, width, height)
    {
        this.leftX = leftX;
        this.width = width;
        this.height = height;
        this.moveLeft=1;
        this.moveRight=1;

        this.checkCollision = function()
        {
            if(this.leftX<=0)
                this.moveLeft=0;
            else 
                this.moveLeft=1;
            if(this.leftX+this.width>=799)
                this.moveRight=0;
            else 
                this.moveRight=1;
        }
        this.move = function(keyCode)
        {
            if((keyCode==97 || keyCode==65) && this.moveLeft==1)  //left 
                this.leftX = this.leftX-15;
            else if((keyCode==100 || keyCode==68) && this.moveRight==1)  //right
                this.leftX = this.leftX+15;
        }
        this.draw = function()
        {
            ctx.fillStyle="#FFF000";
            ctx.fillRect(this.leftX, H-this.height , this.width, this.height);
        }
    }
    
    function Brick(_x, _y, _length)
    {
        this.gone = 0;
        this.x = _x;
        this.y = _y;
        this.color = randomRGB();
        this.length = _length;
        this.draw = function()
        {
            if(this.gone==0)
            {
                ctx.strokeStyle=this.color;
                ctx.strokeRect(this.x, this.y, this.length, this.length);
            }
        }
    }

    //  =========== Main ==============   

    function initialDraw()
    {
        
        panel = new Panel(10, 200, 10);
        ball = new Ball(5, panel.leftX+panel.width/2,H-panel.height-5);
        var index=0;
        for(var i=1;i<800;i=i+50)
        {
            for(var j=1;j<300;j=j+50)
            {
                brick[index] = new Brick(i,j,49);
                brick[index].draw();
                index = index+1;
            }
        }

        ball.draw(panel.leftX+panel.width/2);
        panel.draw();
    }
    
    globalDraw = function()
    {
        ball.checkPanelCollision(panel);
        for(var i=0;i<96;i=i+1)
        {
            if(brick[i].gone==0)
                ball.checkBrickCollision(brick[i]);
        }
        panel.checkCollision();
        ball.move();
        clear();
        ball.draw(panel.leftX+panel.width/2);
        panel.draw();
        for(var i=0;i<96;i=i+1)
            brick[i].draw();
        if(ball.checkDead())
        {
            clearInterval(intervalID);
            ctx.font = "50px Arial";
            ctx.fillText("Game Over!",100,500);
        }
            //game over
    }
    var ball, panel, brick=[];
    initialDraw();
    document.onkeypress = function(event)
    {
        var event = window.event || event;
        if(event.keyCode==32)  //fire
        {
            ball.start();
        }
        else 
        {
            panel.move(event.keyCode);
        }
    }

    var intervalID = setInterval(globalDraw,1);


    function randomRGB()
    {
        var r = Math.round(Math.random()*255);
        var g = Math.round(Math.random()*255);
        var b = Math.round(Math.random()*255);
        var ans = "rgba("+r+","+g+","+b+",1)";
        return ans;
    }
    function clear()
    {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.rect(0,0,800,600);
        ctx.closePath();
        ctx.fill();
    }
}

