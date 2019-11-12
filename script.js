window.onload = function()
{
    var canvasWidth =900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;//en ms.
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;

    init();

    function init()
        {
//dessin du cadre
            var canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.border ="30px solid gray";
            canvas.style.margin = "50px auto";
            canvas.style.display ="block";
            canvas.style.backgroundColor = "#ddd";
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
            snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
            applee = new Apple([10,10]);
            score = 0;
            refreshCanvas();
        }
//on raffraichi notre serpent tous les 100ms
    function refreshCanvas()
        {
//j'appelle la fonction pour faire avancer le serpent
            snakee.advance();
            if(snakee.checkCollision())
                {
                    gameOver();
                }
                else
                {
                    if(snakee.isEatingApple(applee))
                    {
                        score++;
                        snakee.ateApple = true;
                        do
                        {
                            applee.setNewPosition();
                        }
                        while(applee.isOnSnake(snakee))
                    }
        // le snake va se déplacer, il faut donc effacer une partie.
                    ctx.clearRect(0,0,canvasWidth, canvasHeight);
                    drawScore();
        //J'appelle la fonction pour dessiner le serpent
                    snakee.draw();
                    applee.draw();
                    timeout = setTimeout(refreshCanvas,delay);
                }

        };
    function gameOver()
        {
            ctx.save();
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.strokeStyle = "white";
            ctx.lineWidth =5;
            ctx.textBaseline = "middle";
            ctx.font = "bold 70px sans-serif";
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight /2;
            ctx.strokeText("Game Over", centreX, centreY - 180);
            ctx.fillText("Game Over", centreX, centreY - 180);

            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
            ctx.fillText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
            ctx.restore();
        }

        function drawScore()
        {
            ctx.save();
            ctx.fillStyle = "gray";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "bold 200px sans-serif";
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight /2;
            ctx.fillText(score.toString(), centreX, centreY);
            ctx.restore();
        }

    function restart()
        {
            snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
            applee = new Apple([10,10]);
            score = 0;
            clearTimeout(timeout);
            refreshCanvas();
        }
//on défini la position de départ du serpent
    function drawBlock(ctx, position)
        {
            var x = position[0] * blockSize;
            var y = position[1] * blockSize;
            ctx.fillRect(x,y,blockSize,blockSize);
        }
///////////////////////Notre constructeur pour le serpent//////////////////////////////////
    function Snake(body,direction)
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
            {
                ctx.save();
                ctx.fillStyle ="#ff0000";
//je dessine les blocks du serpent
                for(var i= 0; i< this.body.length; i++)
                    {
                        drawBlock(ctx, this.body[i]);
                    }
                 ctx.restore();
            };
//on fait avancer le serpent
        this.advance= function()
        {
            var nextPosition =this.body[0].slice();
// [0] correspond au 6 du [6,4]du serpent soit le x du bloc tête , on le fait avancer/reculer d'un block vers la droite
// [1] correspond au 4 du [6,4]du serpent soit le y du bloc tête , on le fait monter/descendre d'un block haut/bas
            switch(this.direction)
            {
                case"left":
                    nextPosition[0] -= 1;
                    break;
                case"right":
                    nextPosition[0] += 1;
                     break;
                case"down":
                    nextPosition[1] += 1;
                    break;
                case"up":
                    nextPosition[1] -= 1;
                     break;
                default:
                    throw("Invalid Direction");
            };
//on ajoute à notre body la nouvelle position [7,4], on aura donc 4 éléments
            this.body.unshift(nextPosition);
//si le serpent a mangé a mangé une on ne supprime pas le dernier élément du serpent
            if(!this.ateApple)
//On supprime donc le dernier élément [4,4] de l'array
                this.body.pop();
            else
                this.ateApple = false;
        };
//On détermine les directions permises,
//ex: on ne pourra pas appuyer sur la touche gauche si on vient de la gauche
        this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction)
            {
                case"left":
                case"right":
                    allowedDirections =["up","down"];
                     break;
                case"down":
                case"up":
                    allowedDirections =["left","right"];
                     break;
                default:
                    throw("Invalid Direction");
            }
//allowedDirections doit correspondre à 0ou 1 dans l'array
//ex:allowedDirections =["up","down"] 0 pour up et 1 pour down
            if(allowedDirections.indexOf(newDirection)> -1)
            {
                this.direction = newDirection;
            }
        };

//pour qu'en cas de collision le serpent s'arrête
        this.checkCollision = function()
        {
            wallCollision = false;
            snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX =0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY =heightInBlocks - 1;
            var isNotBtwXWalls = snakeX < minX || snakeX > maxX;
            var isNotBtwYWalls = snakeY < minY || snakeY > maxY;
//Dans le cas où la tête entre en colision avec un mur
            if(isNotBtwXWalls || isNotBtwYWalls)
                {
                    wallCollision = true;
                }
//Dans le cas où la tête du serpent touche son corps
            for(var i=0; i<rest.length; i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                        {
                            snakeCollision = true;
                        }
                }
                return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(AppleToEat)
        {
            var head = this.body[0];
            if(head[0] === AppleToEat.position[0] && head[1] === AppleToEat.position[1])
                    return true;
                else
                    return false;

        }

    }
///////////////////////Notre constructeur pour la pomme//////////////////////////////////
function Apple(position)
{
this.position = position;
this.draw = function()
    {
    ctx.save();
    ctx.fillStyle ="#33cc33";
    ctx.beginPath();
    var radius = blockSize/2;//rayon du cercle
//on défini le centre du cercle
    var x = this.position[0]*blockSize+radius;
    var y = this.position[1]*blockSize+radius;
//on dessine notre rond
    ctx.arc(x,y,radius,0,Math.PI*2,true);
    ctx.fill();
    ctx.restore();
    };

//on veut qu'une fois la pomme a été mangée, il y ait une nouvelle qui se mette à une position aléatoire
    this.setNewPosition = function()
    {
        var newX = Math.round(Math.random() * (widthInBlocks -1));
        var newY = Math.round(Math.random() * (heightInBlocks -1));
        this.position = [newX,newY];
    };
//on veut éviter que la pomme soit mise sur le serpent
    this.isOnSnake =function(snakeToCheck)
   {
        var isOnSnake = false;
        for(var i = 0; i < snakeToCheck.body.length; i++)
        {
            if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
            {
                isOnSnake = true;
            }
        }
            return isOnSnake;
   }
}
//actions sur le clavier
    document.onkeydown = function handleKeyDown(e)
    {
//code de la touche qui a été appuyée
        var key = e.keyCode;
//direction en fonction de la touche appuyée
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);


    }
    }