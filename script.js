window.onload = function()
{
    var canvasWidth =900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;//en ms.
    /*var xCoord = 0;
    var yCoord = 0;*/
    var snakee;

    init();

    function init()
        {
//dessin du cadre
            var canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.border ="1px solid";
            document.body.appendChild(canvas);
            ctx = canvas.getContext('2d');
            snakee = new Snake([[6,4],[5,4],[4,4]],"right");
            refreshCanvas();
        }
//on raffraichi notre serpent tous les 100ms
    function refreshCanvas()
        {
// le snake va se déplacer, il faut donc effacer une partie.
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
//j'appelle la fonction pour faire avancer le serpent
            snakee.advance();
//J'appelle la fonction pour dessiner le serpent
            snakee.draw();
            setTimeout(refreshCanvas,delay);
        };

//on défini la position de départ du serpent
    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
//Notre constructeur
    function Snake(body,direction)
    {
        this.body = body;
        this.direction = direction;
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
//On supprime donc le dernier élément [4,4] de l'array
            this.body.pop();
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
//allowedDirections doit correctpondre à 0ou 1 dans l'array
//ex:allowedDirections =["up","down"] 0 pour up et 1 pour down
            if(allowedDirections.indexOf(newDirection)> -1)
            {
                this.direction = newDirection;
            }
        };
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
            default:
                return;
        }
        snakee.setDirection(newDirection);


    }
    }