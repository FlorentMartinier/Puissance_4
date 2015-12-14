$(document).ready(function(){
	$("#game_restart").hide();
	
	//definition des attributs
	var nbJoueur; // nombre de joueurs dans la partie
	var couleurAJouer="red";//couleur du joueur qui joue
	var cases=new Array(7);//grille de jeu
	
	/*indice parcours de la grille:
	6 - hauteur (parcours i)
	7 - largeur (parcours j)
	initialisation de tableau 6x7*/
	
	// définition du nombre de joueurs dans la partie.
	$('#jouerModal').click(function(e){
		e.preventDefault();
		var choix = $("input:checked").val();
		if (choix === "1VS1"){
			nbJoueur=2;
		}
		else if (choix === "1VSIA"){
			nbJoueur=1;
		}
		if (choix !== undefined){
			hideModal();
		}
	});
	
	showModal();
	
	///////////////////////////définition des règles du jeu///////////////////////////////////////
	
	//initialisation de la grille de jeu
	function initGrille(){
		for (var c = 0; c <7 ; c++){
				cases[c] = new Array(6);
		}
		for (var i = 0; i <7 ; i++){
			for (var j = 0; j <6 ; j++){
				cases[i][j] = null;
			}
		}
	}
	
	// remise à zero de la grille de jeu
	function reInitGrille(){
		couleurAJouer="red";
		for (var i = 0; i <7 ; i++){
			for (var j = 0; j <6 ; j++){
				cases[i][j] = null;
			}
		}

	}
	
	// retourne vrai si 4 pions de meme couleur sont trouvés en largeur
	function parcoursLargeur (){
		for (var i = 0; i <7 ; i++){
			for (var j = 0; j <6 ; j++){
				if (cases[i][j] != null){
					if (i+3 < 7){
						if (cases[i][j]===cases[i+1][j] && cases[i][j]=== cases[i+2][j] && cases[i][j]=== cases[i+3][j]){
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	
	// retourne vrai si 4 pions de meme couleur sont trouvés en hauteur
	function parcoursHauteur(){
		for (var i = 0; i <7 ; i++){
			for (var j = 0; j <6 ; j++){
				if (cases[i][j] !== null){
					if (j+3 <= 6){
						if (cases[i][j]=== cases[i][j+1] && cases[i][j]=== cases[i][j+2] && cases[i][j] === cases[i][j+3]){
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	
	// retourne vrai si 4 poins de meme couleur sont trouvés en diagonal
	function parcoursDiagonal(){
		for (var i = 0; i <7 ; i++){
			for (var j = 0; j <6 ; j++){
				if (cases[i][j] !== null){
					if (i+3 < 7 && j-3>=0){
						//alert(i+" "+j+" top");
						if (cases[i][j]===cases[i+1][j-1] && cases[i][j]===cases[i+2][j-2] && cases[i][j]===cases[i+3][j-3]){
							return true;
						}
					}
					if (i-3 >= 0 &&  j-3 >= 0){
						if (i+3 < 7){
							if (cases[i][j]===cases[i+1][j-1] && cases[i][j]===cases[i+2][j-2] && cases[i][j]===cases[i+3][j-3]){
								return true;
							}
						}
						if (cases[i][j]===cases[i-1][j-1] && cases[i][j]===cases[i-2][j-2] && cases[i][j]===cases[i-3][j-3]){
							return true;
						}
					}
						  
				}
			}
		}
		return false;
	}
	
	//retourne vrai si 4 pions sont alignés dans le jeu
	function partieTerminee(){
		return (parcoursDiagonal() || parcoursHauteur() || parcoursLargeur ());
	}
	
	// change la couleur actuelle de jeu
	function changeCouleur(){
		if (couleurAJouer ==="red"){
			couleurAJouer = "blue";
		}else{
			couleurAJouer = "red";
		}
	}
	
	// insère le pion sur la pile de pions dans la colonne choisi
	function insererPion(colonneChoisi, couleur){
		var i = 1;
		if (!colonnePleine(colonneChoisi)){
			while (i<7 && cases[colonneChoisi][i] === null){
				i++;
			}
			cases[colonneChoisi][i-1] = couleur;
			colonneChoisi = colonneChoisi+1;
			var selId = "#el"+colonneChoisi+""+i;
			$(selId).removeClass("no_active");
			$(selId).addClass(couleur);
		}
	}
	
	// retourne vrai si la colonne choisi est déjà pleine
	function colonnePleine(colonne){
		return (cases[colonne][0] !== null);
	}
	
	///////////////////////////////Définition de la  fenêtre modale /////////////////////////////////
	
	// ouvre la fenêtre modale
   function showModal(){
	   var id = '#modal';
	   resizeModal();
	   
	   $('#fond').fadeIn(1000);   
	   $('#fond').fadeTo("slow",0.8);
	   $(id).fadeIn(2000);
	}
	
	// ferme la fenêtre modale
	function hideModal(){
	   $('#fond, .popup').hide();
	   $('.popup').html('');
	}
	
	//gère la taille de la fenêtre modale
	function resizeModal(){
	   var modal = $('#modal');
	   var winH = $(document).height();
	   var winW = $(window).width();
	   $('#fond').css({'width':winW,'height':winH});
	   var winH = $(window).height();
	   modal.css('top', winH/2 - modal.height()/2);
	   modal.css('left', winW/2 - modal.width()/2);
	}
	
	$(window).resize(function () {
      resizeModal()
    });
	
	///////////////////////////Définition de l'intelligence artificielle///////////////////////////
	
	// insertion du meilleur pion possible pour l'intelligence artificielle
	function IAMinMax(profondeur){
		var iMax;
		var maxi=-10001;
		var j=5;
		for (var i=0; i < 7; i++){
			if (!colonnePleine(i)){
				j=5;
				while (cases[i][j] !== null){
					j--;
				}
				cases[i][j] = "blue";
				var maxiLocal = max(profondeur-1, -10000, 10000);
				console.log ("indice ["+i+"]["+j+"] poids du coup : " + maxiLocal);
				if (maxi < maxiLocal){
					maxi = maxiLocal;
					iMax = i;
				}
				
				cases[i][j]=null;
			}
		}
		insererPion(iMax, "blue");
	}
	
	// calcul poid maximum possible dans la profondeur actuelle
	function max(profondeur, alpha, beta){
		if (partieTerminee() || profondeur === 0){
			return eval("bon");
		}
		var j;
		var mini=10000;
		for (var i=0; i < 7; i++){
			a++;
			j=5;
			if (!colonnePleine(i)){
				while (cases[i][j] !== null){
					j--;
				}
				cases[i][j] = "red";
				var miniLocal =  min(profondeur-1, alpha, beta);
				if (mini > miniLocal){
					mini = miniLocal;
				}
				cases[i][j]=null;
				if(mini < alpha){
					return eval("mauvais");
				}
				if(mini < beta){
					beta = mini;
				}
			}
		}
		return mini;
	}
	
	// calcul du minimum possible dans la profondeur actuelle de l'arbre
	function min(profondeur, alpha, beta){
		if (partieTerminee() || profondeur === 0){
			return eval("mauvais");
		}
		var j;
		var maxi=-10000;
		for (var i=0; i < 7; i++){
			a++;
			if (!colonnePleine(i)){
				a++;
				j=5;
				while (cases[i][j] !== null){
					j--;
				}
				cases[i][j] = "blue";
				var maxiLocal = max(profondeur-1,alpha, beta);
				if (maxi < maxiLocal){
					maxi = maxiLocal;
				}
				cases[i][j]=null;
				if(maxi > beta){
					return eval("bon");
				}
				if(maxi > alpha){
					alpha = maxi;
				}
			}
		}
		return maxi;
	}
	
	// évaluation du poid d'un noeud ou d'une feuille de l'arbre
	function eval (cas){
		if (partieTerminee()){
			if (cas==="bon"){
				return 10000;
			}
			if (cas==="mauvais"){
				return -10000;
			}
		}
		else {
			var poid = 0;
			if (couleurAJouer === "red"){
				if (bloque(couleurAJouer)){
					return 100;
				}
				poid = poid + (nbCoups(couleurAJouer))*2 + piege(couleurAJouer);
			}
			else {
				if (bloque(couleurAJouer)){
					return -100;
				}
				poid = poid + (nbCoups(couleurAJouer))*2 + piege(couleurAJouer);
			}
		}
		return poid;
	}
	
	// determine si le piege est actif (deux lignes de 3 pions superposés)
	// XOOOXXX
	// XOOOXXX --> exemple
    function piege (couleur){
	for (var i = 0; i <7 ; i++){
		for (var j = 0; j <6 ; j++){
			if (cases[i][j] === null){
				if (i+3 <7 && j+1 <6){
					if (cases[i+1][j] === couleur && cases[i+2][j] === couleur && cases[i+3][j] === couleur){
						if (cases [i][j+1]===null && cases [i+1][j+1]===couleur && cases [i+2][j+1]===couleur && cases [i+3][j+1]===couleur){
							return 30;
						}
					} 
				}
				if (i-3 >=0 && j+1 <6){
					if (cases[i-1][j] === couleur && cases[i-2][j] === couleur && cases[i-3][j] === couleur){
						if (cases [i][j+1]===null && cases [i-1][j+1]===couleur && cases [i-2][j+1]===couleur && cases [i-3][j+1]===couleur){
							return 30;
						}
					} 
				}
			}
		}
	}
	return 0;
	}
	
	// determine si l'on peut être gagnant quel que soit le coup de l'adversaire
	// XXOOOXX --> l'adversaire est perdant quel que soit son coup.
	function bloque (couleur){
		for (var i = 0; i <7 ; i++){
			for (var j = 0; j <6 ; j++){
				if (cases[i][j] === couleur){
					if (i+2 <7 && i-1>=0){
						if (cases[i+1][j] === couleur && cases[i+2][j] === null && cases[i-1][j] === null){
							nbBloque++;
							return true;
						}
						else{
							return false;
						}
					}
				}
			}
		}
	}
	
	// heuristique : calcul du nombre total de coups gagnants possible a partir du pion joué.
    function nbCoups (couleur){
        var nb = 0;
        for (var i = 0; i <7 ; i++){
            for (var j = 0; j <6 ; j++){
				if (i+3 < 7){ // largeur
					if(cases[i][j] === couleur || cases[i+1][j] === couleur || cases[i+2][j] === couleur || cases[i+3][j] === couleur){
						if ((cases[i][j] === null || cases[i][j] === couleur)&&
							(cases[i+1][j] === null || cases[i+1][j] === couleur)&&
							(cases[i+2][j] === null || cases[i+2][j] === couleur)&&
							(cases[i+3][j] === null || cases[i+3][j] === couleur)){
							nb++;
						}
					}
				}
				if (j+3 < 6){ // hauteur
					if(cases[i][j] === couleur || cases[i][j+1] === couleur || cases[i][j+2] === couleur || cases[i][j+3] === couleur){
						if ((cases[i][j] === null || cases[i][j] === couleur)&&
							(cases[i][j+1] === null || cases[i][j+1] === couleur)&&
							(cases[i][j+2] === null || cases[i][j+2] === couleur)&&
							(cases[i][j+3] === null || cases[i][j+3] === couleur)){
							nb++;
						}
					}
				}
				 
				if (i+3 < 7 && j-3>=0){ // diagonal montante
					if(cases[i][j] === couleur || cases[i+1][j-1] === couleur || cases[i+2][j-2] === couleur || cases[i+3][j-3] === couleur){
						if ((cases[i][j] === null || cases[i][j] === couleur)&&
							(cases[i+1][j-1] === null || cases[i+1][j-1] === couleur)&&
							(cases[i+2][j-2] === null || cases[i+2][j-2] === couleur)&&
							(cases[i+3][j-3] === null || cases[i+3][j-3] === couleur)){
							nb++;
						}
					}
				}
				if (i-3 >= 0 &&  j-3 >= 0){ // diagonal descendante
					if(cases[i][j] === couleur || cases[i-1][j-1] === couleur || cases[i-2][j-2] === couleur || cases[i-3][j-3] === couleur){
						if ((cases[i][j] === null || cases[i][j] === couleur)&&
							(cases[i-1][j-1] === null || cases[i-1][j-1] === couleur)&&
							(cases[i-2][j-2] === null || cases[i-2][j-2] === couleur)&&
							(cases[i-3][j-3] === null || cases[i-3][j-3] === couleur)){
							nb++;
						}
					}
				} 
            }
        }
        return nb;
    }
     
	/////////////////////////////////Interaction avec la grille : ////////////////////////////
	
    function addClfdgass(idSeletor,newClass){
        for(var i=2; i<7; i++){
            $("#el"+idSeletor).removeClass("no_active");
            $("#el"+idSeletor).addClass(newClass);
        }
    }
	
	// retourne la colonne choisie
    function getIdClomne(idColomne){
        return idColomne.substring(3)-1;
    }
	
    // détermine ce qu'il se passe quand nous jouons
    function clickColonne(){
		// jeu à un joueur
		if (nbJoueur===1){
			var idColonne = $(this).attr("id");
			var idColCourant = getIdClomne(idColonne);
			insererPion(idColCourant, "red");
			if(partieTerminee()){
				alert("red a gagné");
				 $("body").off("click",".grille_colonne", clickColonne);
	 
			}
			else{
				setTimeout(function(){
					a=0;
					nbBloque = 0;
					IAMinMax(6);// avec une profondeur de 5 ça marche un coup de plus
					console.log("nb de combinaisons : " + a);
					if(partieTerminee()){
						alert("blue a gagné");
						$("body").off("click",".grille_colonne", clickColonne);
	 
					}
				},20); 
			}
		}
		
		// jeu à deux joueurs
		else if (nbJoueur===2){
			var idColonne = $(this).attr("id");
			var idColCourant = getIdClomne(idColonne);
			insererPion(idColCourant, couleurAJouer);
			if(partieTerminee()){
				alert(couleurAJouer+" a gagné");
				 $("body").off("click",".grille_colonne", clickColonne);
			}
			changeCouleur();
		}
    }
     
	// initialisation du jeu quand nous cliquons sur "jouer"
    $("#game_play").click(function(){
        $("body").on("click",".grille_colonne", clickColonne);
        initGrille();
        $(this).hide();
        $("#game_restart").show();
         $("h1").css({
                backgroundImage: 'url(images/arrowleft.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left'
         });        
                 
    });
	
	// reinitialisation du jeu quand nous cliquons sur "recommencer"
    $("#game_restart").click(function(){
        $("body").off("click",".grille_colonne", clickColonne);                
        $("body").on("click",".grille_colonne", clickColonne);
        reInitGrille();
        $("a[id^='el']").attr('class', 'no_active');
    });   
});