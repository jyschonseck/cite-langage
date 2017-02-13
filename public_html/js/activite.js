// JavaScript Document


var activiteId = "";
var listeActivites ={};

var tblReponses ={};
if (sessionStorage.CL_reponses){
	tblReponses =  jQuery.parseJSON(sessionStorage.CL_reponses);
}

////*****************************************
//********* QCU *****************************

function qcuCreation(actId , num){
	var  elt0 = document.createElement("div");
	elt0.className = "ctnQuestion";
	elt0.id="ctn_" + actId+"_"+num;
	var eltQ = document.createElement("p");
	eltQ.className = "txtQuestion";
	eltQ.innerHTML = listeActivites[actId][num].question;
	elt0.appendChild(eltQ);
	var elt1  = document.createElement("div");//ctn des propositions
	elt1.id = "props_" + actId+"_"+num;
	elt1.className = "ctnProps";
	for (var j = 0 ; j <  listeActivites[actId][num].props.length ; j ++){
		var eltP = document.createElement("button");
		eltP.innerHTML = listeActivites[actId][num].props[j];
		eltP.id = "rep_" + j;
		if (tblReponses[actId + "_"+num] ===  j.toString()){ //coché
			eltP.className = "qcu qcuCochet";
		}else{
			eltP.className = "qcu";
		}
		if (tblReponses[actId+ "_" + num +"_V"] !== true ) {
			eltP.onclick = qcuClickHdlr ;
			eltP.className += " qcuActif";
		}
		elt1.appendChild(eltP);
	}
	elt0.appendChild(elt1);
	//zone fidebaque général
	var elt2 = document.createElement("div");
	elt2.id = "ctnFidebaque_" + actId + "_" +num;
	elt2.className = "ctnFidebaque";
	elt2.innerHTML = listeActivites[actId][num].fbGen;
	elt0.appendChild(elt2);
	
	document.getElementById("ctnQuestionsActi").appendChild(elt0);
	
	//****************************
	//***** si on a validé ---
	if ( tblReponses[actId+ "_" + num +"_V"] === true){ // déjà validé
		validerQcu(actId , num , false);
	}else{
		var eltBtn = document.createElement("button");
		eltBtn.onclick = validerQcuHdlr;
		eltBtn.id = "btnVal_" + actId +"_"+num;
		eltBtn.className = "btnValid" ;
		eltBtn.innerHTML = "Valider" ;
		elt0.appendChild(eltBtn);
	}
	
	$(".qActivite").fadeIn("slow");
	document.getElementById("rep_0").focus();
}

function qcuClickHdlr(evt){
	if ( $(evt.currentTarget).hasClass("qcuActif") ){
		if ( $(evt.currentTarget).hasClass("qcuCochet")){
			 $(evt.currentTarget).removeClass("qcuCochet");
		}else{
			$("#" + evt.currentTarget.parentElement.id + " button").removeClass("qcuCochet");
			$(evt.currentTarget).addClass("qcuCochet");
		}
		//var actId = window.location.hash.substr(1).split("_")[1];
		tblReponses[evt.currentTarget.parentElement.id.substr(6)] = evt.currentTarget.id.split("_")[1];
	}
}

function validerQcuHdlr(evt){// fonction de validation du QCU 
	var actId = evt.currentTarget.id.split("_")[1];
	var num =  evt.currentTarget.id.split("_")[2];
	validerQcu(actId , num , true) ;
}

function validerQcu(actId , num , clic){
	var questionEnCours = document.getElementById("ctn_" + actId+"_"+num);
	if (tblReponses[actId+"_"+num] === listeActivites[actId][num].correction){
		questionEnCours.className += " reponseBonne";
	}else{
		questionEnCours.className += " reponseFausse";
	}
	//}
	//$("#ctnFidebaque_" + actId +"_"+num).show("slow");
	$("#ctnFidebaque_" + actId +"_"+num).slideDown("slow");
	$("#ctnFermer").show("fast");
	$("#btnVal_" + actId +"_"+num).hide("fast");
	$("#props_" + actId +"_"+num + " button").removeClass("qcuActif");
	tblReponses[actId+"_" + num + "_V"] = true;
	sessionStorage.CL_reponses = JSON.stringify(tblReponses);
	
	//*****test pour toutes les réponses de final 
	if (actId.indexOf("FIN") !== -1){
		var nbRep = 0 ;
		for (var i = 0; i < 7 ; i++){
			if (tblReponses[actId+"_" + i + "_V"] ){
				nbRep ++;
			}
		}
		if (nbRep === 7){
			///****affic eval
			affichEvalPopup(clic);
		}
	}
}


////*****************************************
//********* QCM *****************************

function qcmCreation(actId , num){
	//*** si on a pas encore repondu :
	if (!tblReponses[actId + "_"+num]) { tblReponses[actId + "_"+num] = [ "0", "0", "0", "0" , "0", "0", "0"];}
	var  elt0 = document.createElement("div");
	elt0.className = "ctnQuestion";
	elt0.id="ctn_" + actId+"_"+num;
	var eltQ = document.createElement("p");
	eltQ.className = "txtQuestion";
	eltQ.innerHTML = listeActivites[actId][num].question;
	elt0.appendChild(eltQ);
	var elt1  = document.createElement("div");//ctn des propositions
	elt1.id = "props_" + actId+"_"+num;
	elt1.className = "ctnProps";
	for (var j = 0 ; j <  listeActivites[actId][num].props.length ; j ++){
		var eltP = document.createElement("button");
		eltP.innerHTML = listeActivites[actId][num].props[j];
		eltP.id = "rep_" + j;
		if (tblReponses[actId + "_"+num][j] === "1"){// ===  j.toString()){ //coché
			eltP.className = "qcm qcmCochet";
		}else{
			eltP.className = "qcm";
		}
		if (tblReponses[actId+ "_" + num +"_V"] !== true ) {
			eltP.onclick = qcmClickHdlr ;
			eltP.className += " qcmActif";
		}
		elt1.appendChild(eltP);
	}
	elt0.appendChild(elt1);
	//zone fidebaque général
	var elt2 = document.createElement("div");
	elt2.id = "ctnFidebaque_" + actId + "_" +num;
	elt2.className = "ctnFidebaque";
	elt2.innerHTML = listeActivites[actId][num].fbGen;
	elt0.appendChild(elt2);
	
	document.getElementById("ctnQuestionsActi").appendChild(elt0);
	
	//****************************
	//***** si on a validé ---
	if ( tblReponses[actId+ "_" + num +"_V"] === true){ // déjà validé
		validerQcm(actId , num , false);
	}else{
		var eltBtn = document.createElement("button");
		eltBtn.onclick = validerQcmHdlr;
		eltBtn.id = "btnVal_" + actId +"_"+num;
		eltBtn.className = "btnValid" ;
		eltBtn.innerHTML = "Valider" ;
		elt0.appendChild(eltBtn);
		//}
	}
	
	$(".qActivite").fadeIn("slow");
	document.getElementById("rep_0").focus();
}

function qcmClickHdlr(evt){	
	if ( $(evt.currentTarget).hasClass("qcmActif") ){
		if ( $(evt.currentTarget).hasClass("qcmCochet")){
			 $(evt.currentTarget).removeClass("qcmCochet");
			 tblReponses[evt.currentTarget.parentElement.id.substr(6)][parseInt(evt.currentTarget.id.split("_")[1])] = "0";
		}else{
			//$("#" + evt.currentTarget.parentElement.id + " p").removeClass("qcmCochet");
			$(evt.currentTarget).addClass("qcmCochet");
			 tblReponses[evt.currentTarget.parentElement.id.substr(6)][parseInt(evt.currentTarget.id.split("_")[1])] = "1";
		}
		
	}
}

function validerQcmHdlr(evt){// fonction de validation du QCU 
	var actId = evt.currentTarget.id.split("_")[1];
	var num =  evt.currentTarget.id.split("_")[2];
	validerQcm(actId , num , true) ;
}

function validerQcm(actId , num , clic){
	var questionEnCours = document.getElementById("ctn_" + actId+"_"+num);
	var corrQcm = true;
	for ( var i = 0 ; i < listeActivites[actId][num].correction.length ; i++){
		if (tblReponses[actId+"_"+num][i] !== listeActivites[actId][num].correction[i]){
			corrQcm = false;
		}
	}
	if ( corrQcm){
		questionEnCours.className += " reponseBonne";
	}else{
		questionEnCours.className += " reponseFausse";
	}
	$("#ctnFidebaque_" + actId +"_"+num).slideDown("slow");
	$("#ctnFermer").show("fast");
	$("#btnVal_" + actId +"_"+num).hide("fast");
	$("#props_" + actId +"_"+num + " p").removeClass("qcmActif");
	tblReponses[actId+"_" + num + "_V"] = true;
	sessionStorage.CL_reponses = JSON.stringify(tblReponses);
	
	//*****test pour toutes les réponses de final 
	if (actId.indexOf("FIN") !== -1){
		var nbRep = 0 ;
		for (var j = 0; j < 7 ; j++){
			if (tblReponses[actId+"_" + j + "_V"] ){
				nbRep ++;
			}
		}
		if (nbRep === 7){
			///****affic eval
			affichEvalPopup(clic);
		}
	}
}

//***************************************

function validerPageQ(){//obsolete ??
	var actId = window.location.hash.substr(1).split("_")[1];
	for (var i = 0 ; i < listeActivites[actId].length ; i ++){ //boucle sur les questions de la page activité 
		validerQcu(i);
	}
	$("#btnValid").hide("fast");
	tblReponses[actId+"_V"] = true;
	sessionStorage.CL_reponses = JSON.stringify(tblReponses);
	
	if (listeParcours[parcours.index].listeObjets[parcours.etape].type.indexOf("FIN") > -1 ) {
		affichEvalPopup();	
	}
}

function affichEval(){
	var repB = 0;
	var nbQ = 0;
	var activiteEncours = listeParcours[parcours.index].listeObjets[parcours.etape].objId;
		
	for (var j=0 ; j < listeActivites[activiteEncours].length ; j++){
		nbQ += 1;
		if ( listeActivites[activiteEncours][j].type === "qcu"){
			if (tblReponses[activiteEncours+"_"+j] === listeActivites[activiteEncours][j].correction){
				repB += 1;
			}
		}else { // donc qcm
			var temp = 1;
			for ( var k = 0 ; k < listeActivites[activiteEncours][j].correction.length ; k++){
				if (tblReponses[activiteEncours+"_"+j][k] !== 	listeActivites[activiteEncours][j].correction[k]){
					temp = 0;
				}
			}
			repB += temp;
		}
	}
	var boiteHaut = document.getElementById("ctnEval");
	var pluriel = "";
	if (repB >1) { pluriel = "s";}
	if (repB > 5 ){
		$("#ctnEval").html("Vous avez : " + repB + " réponses correctes sur 7.<br>Bravo ! Vous savez (presque) tout sur les sciences du langage.");
		boiteHaut.className = "ctnEvalBon";
	} else if (repB >2){
		$("#ctnEval" ).html("Vous avez : " + repB + " réponses correctes sur 7.<br>Pas mal, n'hésitez pas à revisionner certaines vidéos.");
		boiteHaut.className = "ctnEvalMoy";
	} else {
		$("#ctnEval").html("Vous avez : " + repB + " réponse" + pluriel + " correcte" + pluriel + " sur 7.<br>Oups ! Je vous conseille de revisionner les vidéos.");
		boiteHaut.className = "ctnEvalNul";
	}
	var ctnPopinEval = document.getElementById("ctnPopinEval");
	ctnPopinEval.innerHTML = $("#ctnEval").html();
	ctnPopinEval.className = boiteHaut.className;
	$("#ctnEval").show("slow");
}

function affichEvalPopup(clic){
	affichEval();// pour calculer et afficher l'encart haut
	// génrer le popup ... :
	if (clic){
		$(".ctnEvalPopin").show("slow"); // affich les popin via class
	}
}