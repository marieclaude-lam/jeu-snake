window.onload = function()
{
//dessin du cadre
    var canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    canvas.style.border ="1px solid";
    document.body.appendChild(canvas);

//dessin du rectangle
    var ctx = canvas.getContext('2d');
//couleur rouge
    ctx.fillStyle = '#ff0000';
// dessin rect ( x (a partir du coin haut gauche), y (à partir coin haut gauche), largeur du rect, hauteur du rect)
    ctx.fillRect(30 , 30, 100, 50);

}