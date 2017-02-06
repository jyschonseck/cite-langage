///**** var 
var transcritionPos = 0 ; 
var trans; 
var nbCaractFin; // nb de caractèreavant le dernier segment
var scrollEnCours = false;
var tempoScroll;

    var player = $('#vidItem');
    var playerOrigin = '*';

$(function(){
	$("#menuGeneral button").removeClass("menuClicableChoisi");
	
	$("#ctnFituraide").hide("slow");
	//$("#ctnFituraide").load("html/vide.html");
	$("#colGaucheBas").html("");
	
	catInd = window.location.hash.split("_")[1];
	itemInd = window.location.hash.split("_")[2];
	$("#ctnNum").html(listeItems[catInd].questions[itemInd].questionNum);
	$("#ctnIllus").attr("src" , "img/"+listeItems[catInd].questions[itemInd].illustration);
	$("#ctnTitre").html(listeItems[catInd].questions[itemInd].titre);
	$("#ctnBaratin").html(listeItems[catInd].questions[itemInd].texte);
	$("#txtAutresRes").html(listeItems[catInd].questions[itemInd].autresRes);
	if (listeItems[catInd].questions[itemInd].idVimeo) {
		$("#vidItem").attr("src" , "https://player.vimeo.com/video/" + listeItems[catInd].questions[itemInd].idVimeo);
	}else {
		$("#vidItem").attr("src" , "https://player.vimeo.com/video/170475416?api=1&amp;player_id=player_1");
	}
	
	$("#lienPdf").attr("href" , "donnees/transcriptions/" + listeItems[catInd].questions[itemInd].questionNum + ".pdf");
	$("#txtTranscription").load("donnees/transcriptions/" + listeItems[catInd].questions[itemInd].questionNum + ".html" ,function(){
		trans = $("#txtTranscription").children('span');
		nbCaractFin =  trans[(trans.length-1)].dataset.caract; //pour le scroll
	});
	
	
//********affichage tags 
//*************domaines
	var listIdDomaines = listeItems[catInd].questions[itemInd].domaines;
	var  listDomaines = [];
	for (var i = 0 ; i < listIdDomaines.length ; i++){//on scanne les domaine de l'item
		var temp ;
		for (var k = 0 ; k < listeMotsCles.domaines.tags.length ; k ++){//on cherche des les motCles
			if (listeMotsCles.domaines.tags[k].sous){
				for ( var m = 0 ; m < listeMotsCles.domaines.tags[k].sous.length ; m++){
					if  (listeMotsCles.domaines.tags[k].sous[m].id == listIdDomaines[i]){
						temp = listeMotsCles.domaines.tags[k].sous[m].titre;
						break;
					}
				}
			}
			if  (listeMotsCles.domaines.tags[k].id == listIdDomaines[i]){
				temp = listeMotsCles.domaines.tags[k].titre;
				break;
			}
		}
		var eltDomaine = {"id" : listIdDomaines[i] , "terme" : temp}
		listDomaines.push(eltDomaine);
	}
	listDomaines.sort(triTags);	
	for (var i = 0 ; i < listDomaines.length ; i ++){ // boucle sur les notions à afficher
		if (i >0){
			var ponctuation = document.createElement("span");
			ponctuation.innerHTML = " – ";
			txtDomaines.appendChild(ponctuation);
		}
		var tagDomaine = document.createElement("button");
		tagDomaine.innerHTML = listDomaines[i].terme;
		tagDomaine.id = "tagDomaine_domaines_" + listDomaines[i].id;
		tagDomaine.className = "tagClicable";
		tagDomaine.onclick = glossaireClckHdlr;
		txtDomaines.appendChild(tagDomaine);	
	}
	
//*************notions
	var listIdNotions = listeItems[catInd].questions[itemInd].notions;
	var listNotions = [];
	for ( var i = 0 ; i < listIdNotions.length ; i++){
		var temp;
		for (var k = 0 ; k < listeMotsCles.notions.tags.length ; k ++){
			if  (listeMotsCles.notions.tags[k].id == listIdNotions[i]){
				temp = listeMotsCles.notions.tags[k].titre;
				break;
			}
		}
		var eltNotion = {"id" : listIdNotions[i] , "terme" : temp}
		listNotions.push(eltNotion);
	}
	listNotions.sort(triTags);	
	for (var i = 0 ; i < listNotions.length ; i ++){ // boucle sur les notions à afficher
		if (i >0){
			var ponctuation = document.createElement("span");
			ponctuation.innerHTML = " – ";
			txtNotions.appendChild(ponctuation);
		}
		var tagNotion = document.createElement("button");
		tagNotion.innerHTML = listNotions[i].terme;
		tagNotion.id = "tagNotion_notions_" + listNotions[i].id;
		tagNotion.className = "tagClicable";
		tagNotion.onclick = glossaireClckHdlr;
		txtNotions.appendChild(tagNotion);	
	}
	
    //affich parcours
	affichParcours();

// écouteur sur le player (pour transcription)
     window.addEventListener('message', onMessageReceived, false);
  
	redimVimeo(); // pour avoir la bonne hauteur de la video
	$("#ctnTranscription").css("height" , "400px");
}); //******* fin init



// Handle messages received from the player
function onMessageReceived(event) {
	// Handle messages from the vimeo player only
	if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
		return false;
	}
	if (playerOrigin === '*') {
		playerOrigin = event.origin;
	}
	var data = JSON.parse(event.data);
	
	switch (data.event) {
		case 'ready':
			onReady();
			break;
		   
		case 'playProgress':
			if ( $("#txtTranscription").css("display") === "block"){
				onPlayProgress(data.data);
			}
			break;
			
		case 'pause':
			//onPause();
			break;
		   
		
	}
}

function onReady() {
	post('addEventListener', 'playProgress');
}

// Helper function for sending a message to the player
function post(action, value) {
	var data = {
	  method: action
	};
	
	if (value) {
		data.value = value;
	}
	
	var message = JSON.stringify(data);
	player[0].contentWindow.postMessage(message, playerOrigin);
}

function tagPrenotionClcHdlr(e){
	var txtTag = e.currentTarget.innerHTML.trim() ;//"Accent";
	var prenotionInd = listeMotsCles[1][1].indexOf(txtTag);
	filtres[0][0] = 0;
	filtres[1][0] = 1;
	for (var i = 0 ; i < filtres[1][1].length ; i++){
		if (i == prenotionInd) { filtres[1][1][i] = 1; }else{filtres[1][1][i] = 0;}
	}
	window.location.hash="#questions";
}

function btnTranscriptionClckHdlr(){
	var ctnTranscription = document.getElementById("ctnTranscription");
	if (parseInt($("#ctnTranscription").css("width")) < 20 ){
		ctnTranscription.className = "ctnBloc affiche";// lance anim css
	}else{
		ctnTranscription.className = "ctnBloc masque";
	}
	var tempoRedimVimeo = setInterval( function(){
		var temp = redimVimeo() +  parseInt($("#ctnTxtVid").css("height"))+ parseInt($("#separateur").css("height")) + 16;
		$("#ctnTranscription").css("height" , temp );
	}, 100);
	ctnTranscription.addEventListener("animationend", function(e){
		clearInterval(tempoRedimVimeo);
	},false);
}

function txtTranscriptionClckHdlr(evt){
	if (evt.target.dataset.debut){
		//vidItem.currentTime = evt.target.dataset.debut; // version html5
		post("seekTo" , evt.target.dataset.debut);
	}
}

function btnPdfClckHdlr(){
		var nouvelleFenetre = window.open("donnees/transcriptions/"+ listeItems[catInd].questions[itemInd].questionNum + ".pdf" );
}

function onPlayProgress(donnees){
	var heure = donnees.seconds;
	scrollAmplitude = ctnTranscription.scrollHeight  ;//-pour décoller text du haut
	if ( heure > trans[transcritionPos].dataset.fin){ // position après fin TXT 
		$("#txtTranscription span").removeClass("transActive");//enleve le style 
		//incremente transcritionPos
		while ( heure > trans[transcritionPos].dataset.fin && transcritionPos < trans.length -1  ){
			transcritionPos ++ ; 
		}
		txtTransPosition(transcritionPos);
	}else { // donc on  est avant la fin de pos en cours
		if ( heure > trans[transcritionPos].dataset.debut){
			$("#txtTranscription span:eq("+transcritionPos+")").addClass("transActive");
		}else{
			//if (transcritionPos > 0 ) {transcritionPos -- ; }
			while (transcritionPos > 0 && heure < trans[transcritionPos].dataset.debut){
				transcritionPos -- ;
			}
			txtTransPosition(transcritionPos);
		}
	}
}

function txtTransPosition(dest){
	//****scroll *****//
	var fenetreTransHauteur = parseInt( $("#ctnTranscription").css("height"));
	if (dest < trans.length -1 && !scrollEnCours){
		if ((trans[dest+1].dataset.caract / nbCaractFin) * ctnTranscription.scrollHeight > ctnTranscription.scrollTop  + fenetreTransHauteur -100){
			monScroll(ctnTranscription , ((trans[dest].dataset.caract / nbCaractFin)) * ctnTranscription.scrollHeight , dest);
		}else if ((trans[dest].dataset.caract / nbCaractFin) * ctnTranscription.scrollHeight < ctnTranscription.scrollTop + 20){
			monScroll(ctnTranscription , ((trans[dest].dataset.caract / nbCaractFin)) * ctnTranscription.scrollHeight , dest);
		}
	}
}
	
function monScroll(obj , valeur , trPos){
	scrollEnCours = true;
	if (valeur > 40 ){valeur -= 40;} // pour avaoir une marge 
	var topMax = ctnTranscription.scrollHeight - parseInt( $("#ctnTranscription").css("height")) - 32;//32 pour les margin et padding = 2 rem :/
	if (valeur > topMax){valeur=topMax;}
	tempoScroll = setInterval(function(){
		if (obj.scrollTop > valeur + 3){
			obj.scrollTop-= 3;
		}else if (obj.scrollTop < valeur - 3 ) {
			obj.scrollTop+= 3;
		}else{
			scrollEnCours = false;
			clearInterval(tempoScroll);
		}
	},4);
}
	

function triTags(a , b){
	 return a.terme.localeCompare(b.terme);
}

