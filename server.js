var Mindwave = require('mindwave');
var mw = new Mindwave();
var attAverage = 0
var medAverage = 0;
var medTotal=0;
var iteration =0;
var attTotal=0;
var focused = false;
var takenOff = false;
var forward = false;
var backward = false;
var medCount =0;
var focusCount =0
var med;
var att;
var arDrone = require('ar-drone');
var client  = arDrone.createClient();



const resetForward = ()=>{
    setTimeout(() => {
        forward=false;
    }, 5000);
}
const resetBackward = ()=>{
    setTimeout(() => {
        backward=false;
    }, 5000);
}


mw.on('eeg', function(eeg){
	

});

mw.on('signal', function(signal){
	console.log('signal', signal);
});

mw.on('attention', async function(attention){
    var num = iteration+1
    console.log("FOCUS COUNT",focusCount)
	console.log('attention', attention);
    att=attention
    if(attention!=undefined&&iteration<50){
    console.log("COLLECTING AVERAGE FOCUS",num+"/50")
    
    attTotal+=attention;
    iteration++
    console.log(attTotal)
    attAverage = attTotal/iteration
    console.log(attAverage)}
    else{
        console.log("AVERAGE att",attAverage)
    if(focusCount>6&&takenOff&&!forward){
        client.front(.1)
        setTimeout(() => {
            client.stop()
           console.log("STOP")
        }, 1000);
        console.log("Move forward for 1 second")
        forward=true;
        
    }
    if(attention>attAverage){
        focusCount++
        
    }else{focusCount=0}

    if(focusCount>4&&!takenOff){
        
        client.takeoff();
        console.log("TAKEOFF")
        focusCount=0;
        takenOff=true;
    }}
});

mw.on('meditation', function(meditation){
    med=meditation
    console.log('meditation', meditation);
    console.log("MED COUNT",medCount)
    var num = iteration+1
    if(meditation!=undefined&&iteration<50){
        console.log("COLLECTING AVERAGE MEDITATION",num+"/50")
        
        medTotal+=meditation;
        
        
        medAverage = medTotal/iteration
        console.log("ABERAGE MED",medAverage)
        
        
	
    }
    else{
    if(meditation>att&&takenOff){
        medCount++;
    }
    else{medCount=0}

    if(medCount>4&&!backward&&takenOff){
        client.back(.1)
        setTimeout(() => {
            client.stop()
            console.log("STOP")
        }, 1000);
    console.log("Move backward for 1 seconds") 
    backward=true;
    medCount=0;}
    if(medCount>6&&takenOff){
        client.stop()
        client.land()
        console.log("Landing")
        process.exit()
    }


}
});

mw.on('blink', function(blink){
	console.log('blink', blink);
});

// These are the raw EEG data
// They come in at about 512Hz
// mw.on('wave', function(wave){
// 	console.log('wave', wave);
// });

mw.connect('/dev/tty.MindWaveMobile-SerialPo');