// JavaScript Document

var listeItems = [];
var itemInd = 0 ; //index de l'item courant (dans listeItems /categorie ) = hash [2]
var catInd; // index de la categorie de l'item courant ou de la cat à lister (questions.html)
var itemsFituraide = [0 , 11 , 4 , 2 ];

var titrePages = {
	"questions" : "Cite-langage : Vidéothèque" ,	
	"parcours" : "Cite-langage : Cartes des parcours" ,
	"glossaire" : "Cite-langage : Glossaire",
	"item_0_0" : "Cite-langage : pourquoi les hommes parlent-ils?" ,
	"item_0_1" : "Cite-langage : quand est apparu le langage ?"};

/*******************************
******bloc parcours pour page carte,***
******************************/
var listeParcours = [];// liste des parcours : fichier .json
var parcours ={"id" : "z" , "index" : -1 ,"etape": -1 };// id = A-E ; index= index du parcours en cours (-1 si pas choisi); [etape] étape du parcours

/***************************/

var listeMotsCles = [];
var listeGlossaire = []; //liste des mots clés en ordre alphabétique
var listePairesItemsParcours = []; //pour le tirage au sort de fituraide

var filtres_v1 = [
[ 0 , [0,0,0,0,0,0,0,0,0,0,0,0,0] , "domaines" ], //filtres domaines
[ 0 , [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] , "prenotions" ], //filtres prenotions
[0 , [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] , "notions"] //filtres notions 
];
var filtres = {"domaines":{"actif":0 , "tags":[]} , "notions":{"actif":0 , "tags":[]}};
/* [
[ 0 , [0,0,0,0,0,0,0,0,0,0,0,0,0] , "domaines" ], //filtres domaines
[0 , [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] , "notions"] //filtres notions 
];*/

var resultatsRecherche = [ [] , [] , [] , [] ] ;
var listeTranscriptions = [ [ ] , [ ] , [ ] , [ ]]; // utilisé dans fonction recherche
var nbTranscriptionsLues = 0; // incrémenté lors de la lecture asynchrone des trnascriptions -> pour ne pas fire les recherche si elles ne sont pas encore chargées. 

var listeItemsVide = [
{"categorie": "Langage et langues", "questions": []},
{"categorie": "Une langue comment c'est fait ?", "questions": []},
{"categorie": "Langues et sociétés", "questions": []},
{"categorie": "Apprentissage et plurilinguisme", "questions": []}
];


var ftAffich = -1; //ma fonction d'affichage commence par incrémenter !
var ftNb = 4 ; // nb de "fituraide (en fait faudrait modifié le html pour que le ftNB soit vraiment un paramètre :))
var ftTempo; //variable pour tempo du fituraide
var largeurFt; // largeur de la fenetre "fituraide"

var redimEnCours = false; // à true pendant redim (tempo de 200... ) 

var couleurParcours = {"A": "#3fbbed" , "B" : "#c1292e" , "C" : "#ee7aaa" , "D" :  "#8458a0" , "E" :"#73bf44" , "F" : "#6874b7" , "G" : "#f8af3b"}; // bonne idée pas exploitée pour le moment ! 

var pourScroll;//setInterval pour scroller la transcription dans item.html

/***********************
**fonctions pour svg*****
***********************/

function item_clic(evt){
	"use strict";
        if (itemInd < listeItems.length ){
		var clicNum = evt.target.parentNode.id.split("-")[1];
		var clicConv = convNum_couple(clicNum);
		window.location.hash = "#item_" + clicConv[0] + "_" + clicConv[1];
	}
}

//********************

function glossaireClckHdlr(e){
	"use strict";
	menuQuestionsInit();
	//catInd = e.target.id.split("_")[1];
	//itemInd = e.target.id.split("_")[2];
	//on va loader ...
	window.location.hash = "#definition_" + e.target.id.split("_")[1] + "_" + e.target.id.split("_")[2];
}

function menuQuestionsInit(){
	"use strict";
	/**** reinit elements...****/
	//document.getElementById("ctnTxtTitre").innerHTML = "Questions"; 
	$("#ctnFiltres").slideUp("slow");
	filtres.domaines.actif = 0;
	filtres.notions.actif = 0;
	/*$('#ctnListNotions').hide('fast');
	$('#ctnListDomaines').hide('fast');
	$('#ctnListPrenotions').hide('fast');
	$(".ssMenu").hide("fast");*/
}


function itemsFiltre_OU(){ 
	"use strict";
	var itemsFiltred = listeItems;
	for (var i in filtres){ //boucle sur filtres 
		if (filtres[i].actif === 1 && filtres[i].tags.length >0){ //si un filtre est enclenché i = num du filtre et un au moins tags choisi
			// on vide 
			itemsFiltred = [
				{"categorie": "Langage et langues", "questions": []},
				{"categorie": "Une langue comment c'est fait ?", "questions": []},
				{"categorie": "Langues et sociétés", "questions": []},
				{"categorie": "Apprentissage et plurilinguisme", "questions": []}
				]; 
			
			for ( var j = 0 ; j < listeItems.length ; j ++){ //boucle sur categories/question
				for ( var k = 0 ; k < listeItems[ j ].questions.length ; k++){ // boucle sur QUESTIONS
					for (var m = 0  ; m <  filtres[i].tags.length ; m++){ //boucle sur les tag de la cat i
						var temp =  listeItems[j].questions[k][ i ][m];
						if (listeItems[j].questions[k][i].indexOf(filtres[i].tags[m]) > -1){
							itemsFiltred[ j ].questions.push(listeItems[j].questions[k]);
							break;
						}
					}
				}
			}
			
		}
	}
	affichItemsFiltred(itemsFiltred);
}

function itemsFiltre_ET(){
	"use strict";
	var itemsFiltred = listeItems;
	for (var i in filtres){ //boucle sur filtres 
		if (filtres[i].actif === 1 ){ //et un filtre au moins :))
                    itemsFiltred = [
                            {"categorie": "Langage et langues", "questions": []},
                            {"categorie": "Une langue comment c'est fait ?", "questions": []},
                            {"categorie": "Langues et sociétés", "questions": []},
                            {"categorie": "Apprentissage et plurilinguisme", "questions": []}
                            ]; 
                    for ( var j = 0 ; j < listeItems.length ; j++){ //boucle sur categories/question
                            for ( var k = 0 ; k < listeItems[ j ].questions.length ; k++){ // boucle sur QUESTIONS
                                    var item2Push = 0;
                                    //******boucle sur tags du filtres
                                    for ( var m = 0 ; m < filtres[i].tags.length ; m++){ // boucle sur les filtres enclenchés
                                            if (listeItems[j].questions[k][i].indexOf(filtres[i].tags[m]) > -1) { item2Push += 1;}
                                    }
                                    if (item2Push === filtres[i].tags.length){
                                            itemsFiltred[j].questions.push(listeItems[j].questions[k]);
                                    }
                            }
                    }
		
		}
	}
	
	affichItemsFiltred(itemsFiltred);
}

function affichItemsFiltred(itemsAffich){
	"use strict";
	//efface 
	var element = document.getElementById("ctnQuestions");
	while (element.firstChild) {
	  element.removeChild(element.firstChild);
	}
	for (var i = 0 ; i < itemsAffich.length ; i++){
		var ctnCat = document.createElement("div");
		ctnCat.className =" ctnCat";
	
		var catTitre = document.createElement("div");
		var eltImage = document.createElement("img");
		eltImage.src= "img/icones/cat_" + i +".svg";
		catTitre.appendChild(eltImage);
		var catTitreTxt = document.createElement("span");
		catTitreTxt.className = "questionsCatTitre";
		catTitreTxt.innerHTML = itemsAffich[i].categorie;// + "(" + itemsAffich[i].questions.length + ")";
		catTitre.appendChild(catTitreTxt);
		//catTitre.className = "titreCatClicable"; 
		catTitre.onclick = catTitreClcHdlr;
		ctnCat.appendChild(catTitre);
		var ctnCatItems = document.createElement("div");
		ctnCatItems.id = "ctnCatItems_" + i;
		ctnCatItems.className = "ctnCatItems";
		
		if ( itemsAffich[i].questions.length >0 ){
			for ( var j = 0 ; j < itemsAffich[i].questions.length ; j++){
				ctnCatItems.appendChild(creationExtraitItem(itemsAffich ,i , j));
				ctnCat.appendChild(ctnCatItems);
			}
			document.getElementById("ctnQuestions").appendChild(ctnCat);
		}
	}
}

function creationExtraitItem(itemsAffich, catId , itemId){
	"use strict";
	var element = document.createElement("button");
	element.className = "ctnResumeItem";
	//element.id = "ctnResumeItem_" + catId + "_" + itemId;
	element.id = "ctnResumeItem_" + itemsAffich[catId].questions[itemId].qId;
	element.onclick = resumeClcHdlr;
	var elt1 = 	document.createElement("div");//vignette
	elt1.width = "33px";
	elt1.height = "33px";
	var elt2 = document.createElement("p");
	elt2.innerHTML = itemsAffich[catId].questions[itemId].titre;
	//var elt3 = document.createElement("p");
	//elt3.innerHTML = itemsAffich[catId].questions[itemId].auteurs;
	
	element.appendChild(elt1);
	element.appendChild(elt2);
	//element.appendChild(elt3);
	
	return element;
}

function catTitreClcHdlr(e){
	"use strict";
	var idCible = "ctnCatItems_" + e.currentTarget.id.split("_")[1];
	if ($("#" + idCible).css("display") === "none"){
		$("#" + idCible).show("fast");
	}else{
		$("#" + idCible).hide("fast");
	}
}

function resumeClcHdlr(e){
	"use strict";
	menuQuestionsInit();
	var temp = e.currentTarget.id.split("_");
	window.location.hash = "#item_" + temp[1] + "_" + temp[2];
}
/**********************/
function convNum_couple(num){
	"use strict";
	var ftC = 0 ;
	var ftQ = num;
	if (ftQ > 21){
		ftC = 3 ; 
		ftQ = ftQ - 22;
	}else if (ftQ > 12){
		ftC =  2;
		ftQ = ftQ - 13;
	}else if (ftQ > 7){
		ftC = 1 ;
		ftQ = ftQ - 8;
	}
	return [ftC, ftQ];
}

function creeListePourFituraide(){
	"use strict";
	listePairesItemsParcours = [];	
	for (var i = 0 ; i < listeParcours.length ; i++){ // boucle sur parcours
		for ( var j = 0 ; j < listeParcours[i].listeObjets.length ; j++){
			if (listeParcours[i].listeObjets[j].type === "item"){
				listePairesItemsParcours.push ({"parcoursId" : listeParcours[i].id , "parcoursNom":listeParcours[i].nom , "itemId" : listeParcours[i].listeObjets[j].objId});
			}
		}
	}
}


function windowResizeHdlr(){
	"use strict";
	window.removeEventListener("resize", windowResizeHdlr);
	redimEnCours = true;
	var tempo = setTimeout(function(){// pour éviter la pagaille !
		
		if (window.location.hash.indexOf("item") >-1 ){
			redimVimeo();
		} else {
			redimensioneFt();
		}
		window.addEventListener("resize", windowResizeHdlr);
		redimEnCours = false;
	},200);
}

function redimensioneFt(){
	"use strict";
	if (largeurFt) {
		largeurFt = parseInt($("#ctnFts").css("width"));
		for (var ftId = 0 ; ftId < ftNb ; ftId++){
			$("#ctnFt_"+ftId).css("width" , largeurFt - 120); // padding de 60 pour laisser place aux flêches
			if (parseInt($("#ctnFt_"+ftId).css("left")) > 0){
				$("#ctnFt_"+ftId).css("left" , largeurFt);
			}
		}
	}
}

function parcoursMAJparId (pcID){
	//****maj du parcours % pcId et parcours.etape % hash
	parcours.id = pcID;
// trouver indexParcours
	for (var i = 0 ; i < listeParcours.length ; i++){
		if (listeParcours[i].id === parcours.id) {parcours.index = i ;}
	}
	for (var j = 0 ; j < listeParcours[parcours.index].listeObjets.length ; j ++){
		if (listeParcours[parcours.index].listeObjets[j].objId === window.location.hash.substring(6)) {
			parcours.etape = j ;
		}
	}
}

function redimVimeo(){ //fixe la hauteur de la video (lecture vimeo ne le fait pas (encore ? ) )
	var hauteur = parseInt($("#vidItem").css("width"))*9/16;
	$("#vidItem").css("height" , hauteur);
	return hauteur;
}

function lectureTranscriptions(iCat, iQ){	
	var tId = listeItems[iCat].questions[iQ].questionNum;
	var urlT="donnees/transcriptions/" + tId +".html";	
	$.ajax({
		type: 'GET',
		url: urlT,
		dataType: 'html',
		success: function(data) {
			if (data) {
				var reg=new RegExp("<.[^>]*>", "gi" );
				listeTranscriptions[iCat][iQ] = data.replace(reg, "" );
				nbTranscriptionsLues +=1 ;
			}
		},
		error: function() { alert('Pas de lecture du fichier : ' + urlT , 'erreur');}
	});
	
}

function affichParcours(){
	 //affich parcoursaffichParcours
	if (parcours.id !== "z" ){
		$("#colGaucheBas").load("html/barreParcours.html");
		//**** afficher vignette prec
		
		if (parcours.etape < listeParcours[parcours.index].listeObjets.length - 1){ // on est pas sur la derniere
			if (parcours.etape >0){ // on est pas sur la premiere
				var objId =  listeParcours[parcours.index].listeObjets[parcours.etape-1].objId;
				$("#ctnParcoursPrec").html("Vidéo précédente");
				$("#ctnParcoursPrec").show("fast");
			} else {$("#ctnParcoursPrec").hide("fast");}
			//**** afficher vignette suiv
			var objIdS =  listeParcours[parcours.index].listeObjets[parcours.etape+1].objId;
			if ( listeParcours[parcours.index].listeObjets[parcours.etape+1].type.indexOf("acti") === 0){
				var vignetteS = document.createElement("img");
				vignetteS.src = "img/interface/acti.png";
				document.getElementById("ctnParcoursSuiv").appendChild(vignetteS);
			}else {
				$("#ctnParcoursSuiv").html("Vidéo suivante");
			}
			$("#ctnParcoursSuiv").show("fast");
		} else {
			$("#ctnParcoursSuiv").hide("fast");
			}
		
		//********affichache question
		if ( window.location.hash.indexOf('acti') === -1 ){
			var activite = parcours.id + "-" + listeItems[window.location.hash.split("_")[1]].questions[window.location.hash.split("_")[2]].questionNum;
			if ( tblReponses[activite+"_0_V"] !== true ){// pas encore répondu
				//*****on affiche la question dans popin
				if (listeActivites[activite][0].type === "qcu"){
					qcuCreation(activite , 0);
				}else if (listeActivites[activite][0].type === "qcm"){
					qcmCreation(activite , 0);
				}
			}
		}
	}else{
		//****on affiche les parcous dont fait partie cet item
		$("#colGaucheBas").load("html/sansParcours.html");
	}
}