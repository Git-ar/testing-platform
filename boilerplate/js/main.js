/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var cAverage = 0;

var outputBox;

$( document ).ready(function() {
    outputBox = $("#testingBox").val();
    console.log(outputBox);


    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var audioContext = new AudioContext();
    var audioInput = null,
        realAudioInput = null,
        inputPoint = null,
        audioRecorder = null,
        biquadFilter = null;
    var rafID = null;
    var analyserContext = null;
    var canvasWidth, canvasHeight;
    var recIndex = 0;


    // MAIN FUNCTION

    function updateAnalysers(time) {

        if (!analyserContext) {
            var canvas = document.getElementById("analyser");
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            analyserContext = canvas.getContext('2d');
        }

        // analyzer draw code here
        {
            var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
            var SR = SparseVector();
            
            analyserNode.getByteFrequencyData(freqByteData);
            var p = prod(SR, freqByteData);
            var m = magn(freqByteData);
            console.log("Prod: " + Math.round(100 * p / m) / 100 + "  magnitude: " +  Math.round(m) );
            plotArray(freqByteData);
        }
        
        rafID = window.requestAnimationFrame( updateAnalysers );
    }
    function gotStream(stream) {
        inputPoint = audioContext.createGain();

        // Create an AudioNode from the stream.
        realAudioInput = audioContext.createMediaStreamSource(stream);
        biquadFilter = audioContext.createBiquadFilter(); //Here

        audioInput = realAudioInput;
        audioInput.connect(inputPoint);


    //  audioInput = convertToMono( input );

        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        inputPoint.connect( analyserNode );

        

        zeroGain = audioContext.createGain();
        //zeroGain.gain.value = 0.0;
        //inputPoint.connect( zeroGain );
        //zeroGain.connect( audioContext.destination );
        updateAnalysers();
    }

    function plotArray(arr){
            // MAKES BLACK SCREEN
            var SPACING = 2;
            var BAR_WIDTH = 1;
            var numBars = Math.round(canvasWidth / SPACING);

            analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
            
            analyserContext.fillStyle = '#F6D565';
            analyserContext.lineCap = 'round';
            var multiplier = analyserNode.frequencyBinCount / numBars;

            // Draw rectangle for each frequency bin.
            for (var i = 0; i < numBars; ++i) {
                var magnitude = 0;
                var offset = Math.floor( i * multiplier );
                // gotta sum/average the block, or we miss narrow-bandwidth spikes
                for (var j = 0; j < multiplier; j++)
                  magnitude += arr[offset + j];
                magnitude = magnitude / multiplier;
                
                var magnitude2 = arr[i * multiplier];
                analyserContext.fillStyle = "#FF6600";
                analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude );
                /*
                $("#testingBox").html("i         : " + i + "\n" +
                                      "magnitude : " + magnitude + "\n" +
                                      "magnitude2: " + magnitude2 + "\n"
                                      );
                */
            }

    }


    function initAudio() {
        
            if (!navigator.getUserMedia)
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!navigator.cancelAnimationFrame)
                navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
            if (!navigator.requestAnimationFrame)
                navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;


        navigator.getUserMedia({audio:true}, gotStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });
    }

    window.addEventListener('load', initAudio );



});
