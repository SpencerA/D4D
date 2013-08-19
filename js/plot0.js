var p0 = {type: "FeatureCollection", features : []}
var cnter = 0
function plot_helper(d,m,r,nc,clusts) {
	if (is_stopped) return;
    var m_hash = {};
    var co_hash = {};
    d3.json("./php/getday.php?date="+d+"&rows="+r+"&max="+m_id+"&clusts="+clusts, 
	function(json)
    {
		if (is_stopped) return;
        var kk = 0; 
		var cti = 0;
        function plot0()
        {
			if (is_stopped) return;
            document.getElementById("explain").innHTML = "Plotting... " +
					Math.floor(100*(cnter/m_id)) + "% done"	
			setTimeout(function()
            {
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
                        p0.features[m_hash[u_id]] =
                            create_LS(u_id, co_hash[u_id], color);kk++;
                    }
                    p0.features[m_hash[u_id]]
                        .geometry.coordinates.push(co);
                } else {
                    co_hash[u_id] = [co];
                }
            if (cti < json.users.length) {
                plot0();
                update(p0, 0, 0);
            }
			if (cti >= json.users.length-1 && r >=nc){
				document.getElementById("explain").style.color="Orange"
                document.getElementById("explain").innerHTML = "Complete.";
                return;
			}
			if (cti%100==0 && cti>0){
              var cnt = parseInt(100*cti/(json.users.length -1));
              document.getElementById("explain").innerHTML = cnt+" % Complete.";
            }
            cti += 1;
			cnter = cti;
            if (cti % 100 === 0) clearall();
            }, 1)
        }
        plot0();
    })
	
}

function plotit2()
{
	is_stopped = false;
    var d = document.getElementById("date").value;
	var clusts = getclusts();
	if (clusts.length === 0) clusts = [1,2,3,4]
    d3.json("./php/max.php?date="+d+"&clusts="+clusts, function(json2)
    {
		if (is_stopped) return;
        m_id = json2.res[0];
        var num = parseInt(m_id) / 70000;
        var num_calls = Math.floor(num+1);
        var r = 1
        document.getElementById("explain").innerHTML = 
				"Fetching " + m_id + " calls, please wait.";

        switch(num_calls)
        {
            case 1:
                plot_helper(d,m_id,1,num_calls,clusts);
                break;
            case 2:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                break;
            case 3:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                plot_helper(d,m_id,3,num_calls,clusts);
                break;
            case 4:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                plot_helper(d,m_id,3,num_calls,clusts);
                plot_helper(d,m_id,4,num_calls,clusts);
                break;
            case 5:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                plot_helper(d,m_id,3,num_calls,clusts);
                plot_helper(d,m_id,4,num_calls,clusts);
                plot_helper(d,m_id,5,num_calls,clusts);
                break;
            case 6:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                plot_helper(d,m_id,3,num_calls,clusts);
                plot_helper(d,m_id,4,num_calls,clusts);
                plot_helper(d,m_id,5,num_calls,clusts);
                plot_helper(d,m_id,6,num_calls,clusts);
                break;
            case 7:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                plot_helper(d,m_id,3,num_calls,clusts);
                plot_helper(d,m_id,4,num_calls,clusts);
                plot_helper(d,m_id,5,num_calls,clusts);
                plot_helper(d,m_id,6,num_calls,clusts);
                plot_helper(d,m_id,7,num_calls,clusts);
                break;
            case 8:
                plot_helper(d,m_id,1,num_calls,clusts);
                plot_helper(d,m_id,2,num_calls,clusts);
                plot_helper(d,m_id,3,num_calls,clusts);
                plot_helper(d,m_id,4,num_calls,clusts);
                plot_helper(d,m_id,5,num_calls,clusts);
                plot_helper(d,m_id,6,num_calls,clusts);
                plot_helper(d,m_id,7,num_calls,clusts);
                plot_helper(d,m_id,8,num_calls,clusts);
                break;
            default:
                console.log("Oh dear...")
        }
    })
}
