  <!-- meta tags -->
    <meta name='viewport' content='width=device-width, initial-scale=1.0 user-scalable=no' >
    <link rel="stylesheet" type='text/css' href='css/layout.css' />
    <link rel="stylesheet" type='text/css' href='css/button.css' />
    <link rel="stylesheet" type='text/css' href='css/color.css' />
    <link rel="stylesheet" type='text/css' href='css/element.css' />
    <link rel="stylesheet" type='text/css' href='css/anim.css' />
    <link rel="stylesheet" type="text/css" href="css/font/css/all.css">
<style>
    @keyframes grow{
        0%{
            height:0px;
        }
        100%{
            height:calc(1005 - 120px);
        }
    }
    .grow{
        animation:grow 700ms;
    }
</style>
<html>
    <head>
        <title>SPARQL QUERY</title>
    </head>
<body class="center topgravity full plane" style="height:100%;background:#f5f5f5">
        
        <div class="elevation_1 round centre hidden" style="margin-top:-30px;margin-right:15px;background:#fff;width:calc(100% - 30px);max-width:600px;height:50px">
            <button onclick = 'clear_search()' class="noBut black full" style="width:50px;font-size:20px">
                <span class="fas fa-times"></span>
            </button>
            <input id='txt' class="nobut full" style='font-size:17px;width:calc(100% - 100px);' placeholder='Search here....'/>
            <button onclick='query_1()' class="noBut blue full" style="width:50px;font-size:20px">
                <span id='icon' class="fas fa-search"></span>
            </button>    
    </div>
    
    <div id='res' class="elevation_1 grow round scroll off" style="margin-top:20px;margin-right:15px;background:#fff;width:calc(100% - 30px);max-width:600px;height:calc(100% - 120px)">
        
        
    </div>
    
    
</body>
</html>
<script src="ajax.js"></script>
<script>
    var ajax_obj = null;
    
    //run query functions
    function clear_search(){ 
        //clear search field 
        document.getElementById('txt').value = ""
        //hide results page
        document.getElementById('res').style.display ='none'
        //stop any ajax calls(for when cancel is used to stop search query)
        if(ajax_obj != null){ajax_obj.stop()}
        //reset icon to search icon
        document.getElementById('icon').className = 'fas fa-search'
    }
    //run query functions
    function query_1(){ 
        //getting the value in the search field
        let tm = document.getElementById('txt').value
        if(tm != ""){
            //stopping any previous ajax calls to prevent multiple calls
            if(ajax_obj != null){ajax_obj.stop()}
            //creating a new ajax object using a custom made library ajax.js
            ajax_obj = new ajaxObject()
            //setting timeout
            ajax_obj.timeOut = 2
            //call function to request server to return search results
            ajax_obj.getData("sparql.php?search="+tm,function(e,status){
                if(status){  
                    if(e != "" && e != "0"){
                         //display already formatted results in result view
                         document.getElementById('res').innerHTML = e
                    }
                    else{
                        //show no results
                        let no_res = '<div class="center full">No Results Found</div>'
                        document.getElementById('res').innerHTML = no_res
                    }
                    //show result view
                    document.getElementById('res').style.display = 'flex'
                    //turn back icon from rotating spinner to search icon
                    document.getElementById('icon').className = 'fas fa-search'
                }
                else{
                    //network error
                    document.getElementById('icon').className = 'fas fa-search'
                }
            })
            //show spinning effect
            document.getElementById('icon').className = 'fas fa-spinner fa-spin'
        }
    }


</script>



