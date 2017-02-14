exports.valoreVoto = function(voto){
    switch (voto) {
        case "UP":
        return 1 ;
        break;
        case "AUTHOR_UP":
        return 2 ;
        break;
        case "EDITOR_UP":
        return 3 ;
        break;
        case "MOD_UP":
        return 5 ;
        break;
        case "ADMIN_UP":
        return 5 ;
        break;
        case "DOWN":
        return - 1 ;
        break;
        case "AUTHOR_DOWN":
        return - 2 ;
        break;
        case "EDITOR_DOWN":
        return - 3 ;
        break;
        case "MOD_DOWN":
        return - 5 ;
        break;
        case "ADMIN_DOWN":
        return - 5 ;
        break;
        default:
        break;
    }
}