//alert("Sparse Vector");

function SparseVector(){
	var SV = {};
	SV.range = 0;
	SV.freqs = [];
	for(var i = 5; i < 20; i++){
		SV.freqs.push(606 * i); 
	}
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
	return prod / Math.sqrt(SV.size);
}
function magn(arr){
	var mag = 0.0;
	for(var i = 0; i < arr.length; i++){
		mag += arr[i] * arr[i] * 0.01;
	}
	return 10 * Math.sqrt(mag);
}
