	
	//ajax function scripts
		
    var fetch_basePath = ""
	function ajaxObject(){
		
		this.method = "GET"
		this.url = ""
		this.funcs = ""	;
		this.timeOut = 0;
		this.counter = 0;
	 	this.headers = null
		this.overrideRequestHeaders = false
		this.onConnect = ""
		this.onNotConnect = ""
		this.isRealTime = true
		this.onrealtime = false
		this.tmpUrl = ""; 
		this.tmpFunc = ""
		this.cancel = false
        this.basePath = fetch_basePath
		/* functions */
		this.getData = receive
		this.stop = stopRequest
        this.loadData = ajax_loadDataFromNetwork
        this.loadRawData = ajax_loadRawDataFromNetwork
        this.loadRawDataWithTag = ajax_loadRawDataFromNetworkTag
        this.loadFile = ajax_loadFileFromNetwork
        this.getProgress = ajax_getProgressOfDataFromNetwork
		this.send = sendUrl
		this.onOnline = onOnline
		this.doRealTime = doRealTime
		this.retry = retry
		this.esther = new XMLHttpRequest(); 
        this.offline = offline
		 
		 
	}
	
	 function offline(pth,func){
         var obj = this
         
         obj.esther.open("GET",pth ,true);
		obj.esther.send(null);
		obj.esther.onreadystatechange = function(){
			 
            if(obj.esther.readyState == 4 ) {
				 
				 func(obj.esther.response)
					  
			} 
							
		}
     }
	function onOnline(func){
		 var obj = this;
		
		 
		obj.esther.open("GET","php/online.php?rand=" + Math.random()  ,true);
		obj.esther.send(null);
		obj.esther.onreadystatechange = function(){
			  if(obj.esther.readyState == 4 && obj.esther.status == 200 ) {
				 
				 func()
					  
			}if(obj.esther.readyState == 4 && obj.esther.status != 200){
				obj.esther.open("GET","php/online.php?rand=" + Math.random()  ,true);
			 	obj.esther.send(null);
		
			};
							
		}
	}
	
	function doRealTime(){
		
		this.onrealtime = true
        this.isRealTime = true
	}
	
	function stopRequest(){
		
		this.cancel = true
        this.esther.abort()
	}
	
	function receive(url,func){
		//a function to get data from the server
		this.connectType = "receive"
		this.count = 0;
		var tm = url + ""
		var obj = this
		if(tm.length < 1){var url = obj.url}
		this.tmpUrl = url
		this.tmpFunc = func
        this.cancel = false
		 
		  if(url.indexOf("?") == -1){
              url = url + "?rand=" + Math.random()
          }else{
              url = url + "&rand=" + Math.random()
          }
         url = this.basePath + url
      
		 obj.esther = new XMLHttpRequest();
		 obj.esther.open(obj.method,url,true)
	 	 if(!obj.overrideRequestHeaders){
		   obj.esther.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		 }
		 obj.esther.send(obj.headers)
		 obj.esther.onreadystatechange = function(){
			
		  if(obj.cancel == false){
			
              if(obj.esther.readyState ==  4 && obj.esther.status == 404){
			     //file not found
               
                  if(func !=  null && !obj.cancel){
					func("",false)
				 }else{
				 obj.onConnect("",false)
				 }
			 
			
			  
				if(obj.onrealtime && !obj.cancel){
				
				obj.esther.open(obj.method,url,true)
				obj.esther.send(obj.headers)
				}
				
				 
              }
			 if(obj.esther.readyState ==  4 && obj.esther.status == 200){
				
				//retry only if realtime is set
				
				
				//call the external function
				 var tm = obj.esther.responseText 
				    
				
				if(func !=  null && !obj.cancel){
					func(tm,true)
				 }else{
				 obj.onConnect(tm,true)
				 }
			 
			
			  
				if(obj.onrealtime && !obj.cancel){
				
				obj.esther.open(obj.method,url,true)
				obj.esther.send(obj.headers)
				}
				
				 
				
			}if(obj.esther.readyState ==  4 && obj.esther.status != 200 && obj.esther.status != 404){
				
				var tm = obj.esther.responseText 
				 
				if(obj.count < (obj.timeOut + 1) && obj.timeOut != 0){
					obj.count++;	//counting timeout
				}
				 
				if((obj.count > obj.timeOut) || obj.timeOut == 0){
					if(func !=  null && !obj.cancel){
                        //call the function if no realtime
                        if(!obj.isRealTime || obj.timeOut > 0){
					func(tm,false)
                        }
					}else{
					obj.onNotConnect(tm,false)
					}
				}
				
				
				
				  //retry only if realtime is set
				if(obj.isRealTime && (obj.count <= obj.timeOut) && !obj.cancel){
				obj.esther.open(obj.method,url,true)
				obj.esther.send(obj.headers)
				}
				
			 }
			

		  }
		 }
		
		
	}
	function ajax_getProgressOfDataFromNetwork(typ,func){
        //to get progress of data upload or recieved
        if(this.esther != null){ 
           var obj = this
           if(typ == "upload"){ 
               let rt = 0; 
                obj.esther.upload.addEventListener('progress',function(e){
                     if(e.lengthComputable){
                        //calculate ration
                        rt = Math.floor((e.loaded/e.total) * 100);
                        func("[progress][ratio=" + rt + "][progress=" + e.loaded + "][total=" + e.total + "]{progress}")
                    }
                   
                },false)
            }else if(typ == "download"){
                let rt = 0
                obj.esther.onprogress = function(e){
                    if(e.lengthComputable){
                        //calculate ration
                        rt = Math.floor((e.loaded/e.total) * 100);
                        func("[progress][ratio=" + rt + "][progress=" + e.loaded + "][total=" + e.total + "]{progress}")
                    }
                    console.log(e.loaded) 
                }
            }
        }
    }
	function sendUrl(url,func){
		this.connectType = "send"
		//a function to get data from the server
		var tm = url + ""
		var obj = this
		if(tm.length < 1){var url = obj.url}
		this.tmpUrl = url
		this.tmpFunc = func
		 
		 
		 obj.esther = new XMLHttpRequest();
		 obj.esther.open(obj.method,url + "&rand=" + Math.random(),true)
		 obj.esther.send(obj.headers)
		 obj.esther.onreadystatechange = function(){
			 
			 if(obj.esther.readyState ==  4 && obj.esther.status == 200){
				
				
				 
				//call the external function
				var tm = obj.esther.responseText 
				 
				 if(func !=  null){
					func(tm,true)
				 }else{
				 obj.onConnect(tm,true)
				 }
				 
				  //retry only if realtime is set
				if(obj.onrealtime){
				obj.esther.open(obj.method,url,true)
				obj.esther.send(obj.headers)
				}
				
			}if(obj.esther.readyState ==  4 && obj.esther.status != 200 && obj.esther.status != 404){
			
				 if(func !=  null){
					func()
				 }else{
				 obj.onNotConnect("",false)
				 } 
			
				 //retry only if realtime is set
				if(obj.isRealTime){
				obj.esther.open(obj.method,url,true)
				obj.esther.send(obj.headers)
				}
				
		
			 }
			 
		 }
		
		
	}
	
	function retry(){
		 
		var tm = this.connectType + ""
		if(tm.search(/send/i) == -1){
		this.getData(this.tmpUrl,this.tmpFunc)
		}else{
			this.send(this.tmpUrl,this.tmpFunc)
		
		}
	}
	
    function ajax_loadDataFromNetwork(path,ext,func){
		
		 //load the pic
        var obj = this
         path = this.basePath + "php/image.php?image=" + escape(path)
            if(path.indexOf("?") == -1){
              path = path + "?rand=" + Math.random()
                }else{
              path = path + "&rand=" + Math.random()
            }
			
						obj.esther = new XMLHttpRequest()
							obj.esther.open('GET',path,true)
							obj.esther.send(null)
							obj.esther.responseType = 'arraybuffer'
							obj.esther.onreadystatechange = function(){
								if(obj.esther.readyState == 4 && obj.esther.status == 200 && !obj.cancel){
									var blob = obj.esther.response
										blob = new Blob([blob],{type:ext})
										
										var url = URL.createObjectURL(blob)
								        func(url);  //calling url function
								}if(obj.esther.readyState == 4 && obj.esther.status != 200 && obj.esther.status != 404 && !obj.cancel){
									//network error try again
									obj.esther.open('GET',path,true)
									obj.esther.send(null)
							 	}
							}
						 
		
	}
    function ajax_loadRawDataFromNetwork(path,func){
		
		 //load the pic
        var obj = this
        
          path = this.basePath + "php/image.php?image=" + escape(path)
            if(path.indexOf("?") == -1){
              path = path + "?rand=" + Math.random()
                }else{
              path = path + "&rand=" + Math.random()
            }
           
       
						obj.esther = new XMLHttpRequest()
							obj.esther.open('GET',path,true)
							obj.esther.send(null)
							obj.esther.responseType = 'arraybuffer'
							obj.esther.onreadystatechange = function(){
                                if(obj.esther.readyState == 4 && obj.esther.status == 200 && !obj.cancel){
									var blob = obj.esther.response;
                                     
									 	  func(blob);  //calling url function
								}if(obj.esther.readyState == 4 && obj.esther.status != 200 && obj.esther.status != 404 && !obj.cancel){
									//network error try again
									obj.esther.open('GET',path,true)
									obj.esther.send(null)
							 	}
							}
						 
		
	}
    function ajax_loadRawDataFromNetworkTag(path,func,tag){
		
		 //load the pic
        var obj = this
        
          path = this.basePath + "php/image.php?image=" + escape(path)
            if(path.indexOf("?") == -1){
              path = path + "?rand=" + Math.random()
                }else{
              path = path + "&rand=" + Math.random()
            }
           
       
						obj.esther = new XMLHttpRequest()
							obj.esther.open('GET',path,true)
							obj.esther.send(null)
							obj.esther.responseType = 'arraybuffer'
							obj.esther.onreadystatechange = function(){
                                if(obj.esther.readyState == 4 && obj.esther.status == 200 && !obj.cancel){
									var blob = obj.esther.response;
                                     
									 	  func(blob,tag);  //calling url function
								}if(obj.esther.readyState == 4 && obj.esther.status != 200 && obj.esther.status != 404 && !obj.cancel){
									//network error try again
									obj.esther.open('GET',path,true)
									obj.esther.send(null)
							 	}
							}
						 
		
	}
	function ajax_loadFileFromNetwork(path,func){

		 //load the pic
        var obj = this

          path = this.basePath + "php/image.php?image=" + escape(path)
            if(path.indexOf("?") == -1){
              path = path + "?rand=" + Math.random()
                }else{
              path = path + "&rand=" + Math.random()
            }


						obj.esther = new XMLHttpRequest()
							obj.esther.open('GET',path,true)
							obj.esther.send(null)
							obj.esther.onreadystatechange = function(){
                                if(obj.esther.readyState == 4 && obj.esther.status == 200 && !obj.cancel){
									var e = obj.esther.responseText;

									 	  func(e);  //calling url function
								}if(obj.esther.readyState == 4 && obj.esther.status != 200 && obj.esther.status != 404 && !obj.cancel){
									//network error try again
									obj.esther.open('GET',path,true)
									obj.esther.send(null)
							 	}
							}


	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	 