var pu = {type: "FeatureCollection", features: []};

function plotit()
{
	is_stopped = false;
    document.getElementById("explain").style.color = "Blue"
	document.getElementById("explain").innerHTML = "Setting up plot conditions...";
	var d = document.getElementById("date").value;
	var arr = [];
	var clusts = getclusts();
    if (clusts.length == 0) {
        clusts = [1,2,3,4];
    }
	d3.json("./php/rand.php?date="+d+"&clusts="+clusts, function(json)
    {
        arr = json.rands;
	});
	//process inputs
    var inputs = document.getElementById("user_id").value;
	if (inputs === '0' || inputs === '') {
		plotit2();
		return;
	}
    inputs = inputs.split(',');
	var u_ids = new Array();
	var inv_ids = new Array();
	setTimeout(function() {
		if (is_stopped) return;
		for (var i = 0; i < inputs.length; i++) {
			if (arr.indexOf(parseInt(inputs[i])) === -1) {
				inv_ids.push(inputs[i])
				continue;
			}
			u_ids.push(inputs[i])
		}
		if (u_ids.length === 0) {
			document.getElementById("explain").style.color = "Red"
			document.getElementById("explain").innerHTML = 
				"No valid User IDs were supplied for your choices of " +
				"the date and clusters."
			return;
		}
		if (u_ids.length < inputs.length) {
			document.getElementById("explain").style.color = "Red"
			document.getElementById("explain").innerHTML =
                "Some invalid User IDs were supplied for your choices of " +
                "the date and clusters: " + inv_ids
		}
		    var m_hash = {};
    		var co_hash = {};
   	 		setTimeout(function() {
				if (is_stopped) return;
				document.getElementById("explain").style.color = "Blue"
				document.getElementById("explain").innerHTML = "Initializing Plot...";}, 1000)

    		d3.json("./php/wuw2.php/?date="+d+"&uid="+u_ids, function(json)
    		{
				if (is_stopped) return;
        		var kk = 0; var cti = 0; var cnter = 0; var m = 0;
        		function plotu()
        		{
					if (is_stopped) return;
            		setTimeout(function()
            		{
						console.log(pu);
            			try {
            				u_id = json.users[cti].userid
            			}
            			catch(TypeError) {
                			return;
            			}
            			co = json.users[cti].coords;
            			col = parseInt(json.users[cti].cluster)
            			var color = "";
            			switch(col)
            			{
                			case 1:
                    			color = "hsla(0,0%,0%,.5)"; //H,S,L = (0,0,0) for black
                    			break;
                			case 2:
                    			color = "hsla(0,100%,50%,.5)"; //red
                    			break;
                			case 3:
                    			color = "hsla(120,100%,50%,.5)"; //green
                    			break;
                			case 4:
                    			color = "hsla(240,100%,50%,.5)"; //blue
                    			break;
                			default:
                    			console.log(col)
            			}
            			if (u_id in co_hash){
                    		prev = co_hash[u_id].length-1;
                    		co_hash[u_id].push(co);
                    		if (prev === 0) {
                        		m_hash[u_id] = kk;
                       	 		pu.features[m_hash[u_id]] =
                            	create_LS(u_id, co_hash[u_id], color);kk++;
                    		}
                    		pu.features[m_hash[u_id]]
                        		.geometry.coordinates.push(co);
                		} else {
                    		co_hash[u_id] = [co];
                		}
           	 			if (cti < json.users.length-1) {
                			plotu();
                			update(pu, 0, 0);
            			}
            			else {
							document.getElementById("explain").style.color="Orange"
							document.getElementById("explain").innerHTML="Complete.";
							is_stopped = true;
							return;
            			}
						if (cti>0){
      						var cnt = parseInt(100*cti/(json.users.length -1));
							document.getElementById("explain").style.color="Green";
      						document.getElementById("explain").innerHTML = cnt+" % Complete.";
    					}
            			cti += 1;
            			if (cti % 100 === 0) clearall();
            			}, 1)
        		}
        		plotu();
    		})
		
		}, 5000)
}
