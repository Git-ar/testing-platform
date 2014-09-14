//alert("Sparse Vector");




function SparseVector(chord){
	var SV = {};
	SV.range = 2;
	SV.freqs = getChordsFreqs(chord);
	SV.sampleRate = 44100;
	SV.size = SV.freqs.length;
	return SV;
}



function prod(SV, arr){
	var prod = 0;
	//console.log(arr[400] + "   " + arr[400] * 0.001 + "   " + SV.size);
	for(var i = 0; i < SV.size; i++){
		var k  =  Math.round(SV.freqs[i] * (2048.0 / SV.sampleRate));
		for(var j = 0; j <= SV.range; j++){
			prod += arr[k - SV.range/2 + j];
		}
	}
	return prod / Math.sqrt(SV.size * (SV.range + 1) );
}

function magn(arr){
	var mag = 0.0;
	for(var i = 0; i < arr.length; i++){
		mag += arr[i] * arr[i];
	}
	return Math.sqrt(mag);
}


function getChordsFreqs(chord){
	var freqs = [];
	switch(chord){
		case 0:
			for(var i = 1; i < 2; i++){
				freqs.push(606 * i); 
			}
		break;
		case 1:
			for(var i = 1; i < 2; i++){
				freqs.push(506 * i); 
			}		
		break;
		
		case 2:
			for(var i = 1; i < 2; i++){
				freqs.push(706 * i); 
			}		
		break;
		case 3:
			for(var i = 1; i < 2; i++){
				freqs.push(806 * i); 
			}
		break;

		case 4:
			for(var i = 1; i < 2; i++){
				freqs.push(906 * i); 
			}	
		break;

	}
	return freqs;
}

