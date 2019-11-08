window.onload = function()
{
    var canvasWidth =900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;//en ms.
    var xCoord = 0;
    var yCoord = 0;
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
                snakee = new Snake([[6,4],[5,4],[4,4]]);
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
        ctx.fillRect(x,y,blockSize,blockSize)
    }

    function Snake(body)
    {
        this.body = body;
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
// [0] correspond à [6,4], on le fait avancer d'un block
                nextPosition[0]++;
//on ajoute à notre body la nouvelle position [7,4], on aura donc 4 éléments
                this.body.unshift(nextPosition);
//On supprime donc le dernier élément [4,4] de l'array
                this.body.pop();

            };

    }
}