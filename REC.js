/*RECURRENT ERROR DENSITY */

function saveFile(){
	
	var blob = new Blob([allline], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "CompilationByParserKhon.csv");
}


function saveFile2(){
			
	var blob = new Blob([allline2], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "TopErros.csv");
}
		
function removeConsecutiveError(){
	newarrayCount = [];
	for( var l = 0; l < errorsCount.length; l++){
		if(errorsCount[l] == undefined)
			continue;

		newarrayCount[l] = [];
		last = undefined;
		for( var m = 0; m < errorsCount[l].length-1; m++){	
			for( var n = 0; n < errorsCount[l][m].length-1; n++){
				
				//console.log(errorsCount[l][m][n], errorsCount[l][m][n+1], parseInt(errorsCount[l][m][n]) == (parseInt(errorsCount[l][m][n+1])-1) );
				if( parseInt(errorsCount[l][m][n]) == parseInt(errorsCount[l][m][n+1])-1 ){
						
						errorsCount[l][m][n] = "";
							
				}	
			}
		}
	}
	
	
}
		
function removeFirstError(){
	newarrayCount = [];
	for( var l = 0; l < errorsCount.length; l++){
		if(errorsCount[l] == undefined)
			continue;

		newarrayCount[l] = [];
		last = undefined;
		for( var m = 0; m < errorsCount[l].length; m++){	
			for( var n = 0; n < errorsCount[l][m].length; n++){
				
				if( errorsCount[l][m][n] != "" ){
						errorsCount[l][m][n] = "";
						break;
				}	
			}
		}
	}	
}

removeConsecutiveError();
removeFirstError();

Y = [];
//id students na base de dados
studentsid = [52,53,54,57,58,59,60,61,62,63,64,66];


//para cada estudante
for(var l = 0; l < studentsid.length; l++){
	
	idstudent = studentsid[l];
	//para cada projeto do estudante
	for(var m = 0; m < compProjects[idstudent].length; m++){
		//projeto é nulo?
		if( compProjects[idstudent][m] == null )
				continue;
				
		idproject = m;

		
		//tratando locais indefinidos				
		if(Y[idstudent] == undefined)
			Y[idstudent] = [];
		
		if(Y[idstudent][idproject] == undefined)
			Y[idstudent][idproject] = [];

		//varrendo a lista de erros do estudante
		for(var i = 0; i < errorsCount[idstudent].length; i++){
			//para cada erro, verificando a ocorrencia nas compilacoes
			for(var j = 0; j < errorsCount[idstudent][i].length; j++){
				if(errorsCount[idstudent][i][j] == '')
					continue;
					
				//a ocorrencia está inclusa nas compilacoes deste projeto ?
				if( compProjects[idstudent][idproject].includes( errorsCount[idstudent][i][j] ) ){
					
					if( Y[idstudent][idproject][i] == undefined)
						Y[idstudent][idproject][i] = 0;
					
					//incrementa a ocorrencia desse erro							
					Y[idstudent][idproject][i]++;  
				}
			}
		}
	}
}

Z =[];


//fazer o cômputo 
for( var i = 0; i < Y.length; i++){
	if( Y[i] == undefined)
		continue;
	idstudent = i; 
	//Y por estudante			
	for( var j = 0; j < Y[idstudent].length; j++){
		if( Y[i][j] == undefined)
			continue;
			
		idproject = j;	
		y_project = 0;
		for( var l = 0; l < Y[idstudent][idproject].length; l++){
			
			if( Y[idstudent][idproject][l] == undefined) 
				continue;
			
			y = Y[idstudent][idproject][l];
			
			//original: y_project +=  (y*y) / (y + 1);
			//simplificada 
			y_project +=  y * 0.5;
			
		}
			
		if(Z[idstudent] == undefined)
		 Z[idstudent] =[];
		
		Z[idstudent][idproject] = y_project.toFixed(2);	
		
	}
}

//convert idproject to idactivity
X = [];
line = "";
for( var i = 0; i < Z.length; i++){
	if( Z[i] == undefined) 
			continue; 
			
	if( X[i] == undefined)
		X[i] = [];
	
	for( var j = 0; j < Z[i].length; j++){
		
		if( Z[i][j] == undefined) {
			continue;
		}
		//get id activity
		idactivity = act[ j ] ;
		X[i][ idactivity ] = Z[i][j];
	}
}


//head activities id
allline = "id,5,8,9,10,11,12,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48\n";
//id of all activities in database
act_arr = [5,8,9,10,11,12,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];

 
for( var i = 0; i < X.length; i++){
	if(  X[i] == undefined)
		continue;

	for( var j = 0; j < X[i].length; j++){
	
			for(var l = 0; l < act_arr.length; l++){
				
				if(X[i][act_arr[j]] == undefined){
					X[i][act_arr[j]] = 0;
				}
			}
		
	}
	
}

//criando linhas para exportar 
for( var i = 0; i < X.length; i++){
	if(  X[i] == undefined)
		continue;
	
	line = i + ",";
	//console.log(i);
	for( var j = 0; j < X[i].length; j++){
		
		if(X[i][j] == undefined){
			continue;
		}
		
		line += X[i][j]+ ",";
		

	}
	
	allline += line+"\n";
}

saveFile();

/*** TOP ERROS ***//

TopErrosName = [];
TopErrosCount = [];

for( var i = 0; i < Y.length; i++){
	if(  Y[i] == undefined)
		continue;
	
	 
	for( var j = 0; j < Y[i].length; j++){
		
		if(Y[i][j] == undefined){
			continue;
		}
		
		for( var l = 0; l < Y[i][j].length; l++){
			
			if(Y[i][j][l] == undefined){
				continue;
			}
		
			
			
			if( TopErrosName.includes(errors[i][l])){
				//console.log(  errors[i][l], i, j, l  ) 
				index = TopErrosName.indexOf(errors[i][l]);
				TopErrosCount[index]++;
			} else{
				TopErrosName.push(errors[i][l]);
				TopErrosCount.push(1);
			}
		
		}
		
	}
	
}

var allline2 = "";

for( var i = 0; i < TopErrosName.length; i++){
	allline2 += TopErrosName[i]+";"+TopErrosCount[i]+"\n";
}


saveFile2();
