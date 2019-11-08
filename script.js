window.onload = function()
{
    var canvas;
    var ctx;
    var delay = 100;//en ms.
    var xCoord = 0;
    var yCoord = 0;

    init();

    function init()
        {
            //dessin du cadre
                canvas = document.createElement('canvas');
                canvas.width = 900;
                canvas.height = 600;
                canvas.style.border ="1px solid";
                document.body.appendChild(canvas);
                ctx = canvas.getContext('2d');
                refreshCanvas();
        }

    function refreshCanvas()
        {
//
            xCoord += 2;
            yCoord += 2;
// le snake va se déplacer, il faut donc effacer une partie.
            ctx.clearRect(0,0,canvas.width, canvas.height);
//couleur rouge
            ctx.fillStyle = '#ff0000';
// dessin rect ( x (a partir du coin haut gauche), y (à partir coin haut gauche), largeur du rect, hauteur du rect)
            ctx.fillRect(xCoord,yCoord,100,50);//on va mettre à jour le x et le y
            setTimeout(refreshCanvas,delay);
    }
}