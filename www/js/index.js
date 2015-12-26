/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	app.receivedEvent('deviceready');
    	//   alert(device.uuid);

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	  var parentElement = document.getElementById(id);
    //      var listeningElement = parentElement.querySelector('.listening');
    //      var receivedElement = parentElement.querySelector('.received');

    //      listeningElement.setAttribute('style', 'display:none;');
  //        receivedElement.setAttribute('style', 'display:block;');

          console.log('Received Event: ' + id);
            }
};

app.initialize();
function onDeviceReady() {
	geoData = {};
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError,{ maximumAge: 3000, timeout: 10000, enableHighAccuracy: true });
	function onGeoSuccess(position){
geoData = position.coords;
				/*alert('Latitude: '          + position.coords.latitude          + '\n' +
		          'Longitude: '         + position.coords.longitude         + '\n' +
		          'Altitude: '          + position.coords.altitude          + '\n' +
		          'Accuracy: '          + position.coords.accuracy          + '\n' +
		          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		          'Heading: '           + position.coords.heading           + '\n' +
		          'Speed: '             + position.coords.speed             + '\n' +
		          'Timestamp: '         + position.timestamp                + '\n');	
*/	}
	function onGeoError(error){
		/* alert('code: '    + error.code    + '\n' +
		          'message: ' + error.message + '\n');	
		*/
		window.plugins.toast.show(Error.message, 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});

	}
	$("#takeImage").unbind("click").bind("click",function(){
		navigator.camera.getPicture(cameraSuccess, cameraError,{ quality: 50,
    	    destinationType: Camera.DestinationType.DATA_URL });
	
	});
	imageURIVal = "";
	function cameraSuccess(imageURI){
	    // Unhide image elements
	    imageURIVal = 'data:image/jpeg;base64,'+imageURI;
		$("#image_container").html("<img src='"+ imageURIVal+"' style='height:50%;width:100%'/>")
	    // Show the captured photo
	    // The in-line CSS rules are used to resize the image
	    //
	  //  smallImage.src = "data:image/jpeg;base64," + imageURI;
	  /*  $.post("http://172.16.1.18/cleancityapp/services/uploadimage",{"image":imageURI},function (data){
	setTimeout(function(){
	    	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
	},0);
	    	smallImage.src = "data:image/jpeg;base64," + imageURI;	
*/
	/*}).error(function(error) {
		console.log(error);
	   alert(JSON.stringify(error)); 
	});
*/
	}   
	function cameraError(){
		window.plugins.toast.show('Please submit photo', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
	}    

	$("#gallaryImage").unbind("click").bind("click",function(){
		$("input[type='file']").toggle();
		$("input[type='file']").change(function(){
	    
				readURL(this);
	    });
	});
	$("#raiseSubmit").click(function(){
			$.post("http://172.16.1.18/cleancityapp/services/raiseissue",{
				id : localStorage.getItem("Id"),
				title : $("#issueTitle").val(),
				message : $("#issueDescription").val(),
				xcord : geoData.latitude,
				ycord : geoData.longitude,
				image : imageURIVal,
				deviceid : device.uuid

			},function(data){
				alert(JSON.stringify(data));
				$("#popupDialog").popup("open");

			}).error(function(error) {
				console.log(error);
				   alert(JSON.stringify(error)); 
				});
		});
	/*$("#filefromGallary").bind("click",function(){
		alert("A");
		//gallaryImage
		//$("#filefromGallary").trigger("click");
		
	});*/
	$(".shareIcon").bind("click",function(){
		console.log(imageURIVal);
		window.plugins.socialsharing.share($("#issueDescription").val(),$("#issueTitle").val(),imageURIVal , null);
	});
	
	$("#requestPickup").click(function(){
		if($("input[name*=radio-choiceInner-]:checked").val()=="collectibles"){
			alert("IN IF");
			$.post("http://172.16.1.18/cleancityapp/services/addcollectable",{
				address :$("#address").val() ,
				description:$("#notes").val(),
				xcord : geoData.latitude,
				ycord : geoData.longitude,
				type:$("#collectible_type").val(),
				reason:$("#question").val(),
				id : localStorage.getItem("Id")
				
			},function(data){
				alert(JSON.stringify(data));
				}).error(function(error) {
					   alert(JSON.stringify(error)); 
					});
				
		
		}else if ($("input[name*=radio-choiceInner-]:checked").val()=="waste"){
			alert("ELSE");
			$.post("http://172.16.1.18/cleancityapp/services/addwaste",{
				address :$("#address").val() ,
				description:$("#notes").val(),
				xcord : geoData.latitude,
				ycord : geoData.longitude,
				type:$("#waste_type").val(),
				id : localStorage.getItem("Id")
				
			},function(data){
				alert(JSON.stringify(data));
				}).error(function(error) {
					   alert(JSON.stringify(error)); 
					});
				
		}
		
	});
	  $('#collectibles').unbind("click").bind("click",function () {
      	

      	if ($(this).is(':checked')) {
      		$("#waste_type-button").css("display","none");
              $("#collectible_type-button").css("display","block");
              $("#question").css("display","block");
              $("#question_label").css("display","block");
          }
      });

      $('#waste').unbind("click").bind("click",function () {
      
          if ($(this).is(':checked')) {
          	$("#waste_type-button").css("display","block");
              $("#collectible_type-button").css("display","none");
              $("#question").css("display","none");
              $("#question_label").css("display","none");
              $("#collectibles").prop("checked",false);


          }
      });
	function readURL(input) {

	    if (input.files && input.files[0]) {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	        	console.log(e.target.result);
	        	imageURIVal  = e.target.result;
	    		$("#image_container").html("<img src='"+ e.target.result+"' style='height:50%;width:100%'/>")

	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}
		
	$("#registrationSubmit").click(function(){
		$.post("http://172.16.1.18/cleancityapp/services/register",{
		name : $("#name").val(),
		phonenumber : $("#phoneNumber").val(),
		password : $("#password").val(),
		gender : $("input[name*=radio-choice-]:checked").val(),
		type : $("#select-choice-1b").val(),
		idcardnumber :$("#proofNumber").val(),
		deviceid : device.uuid
		},function(data){
        	if (localStorage.getItem("Id") === null) {

			localStorage.setItem("Id", data.id);
        	}
    		$(':mobile-pagecontainer').pagecontainer('change', '#dashboard', {
    	        transition: 'fade',
    	    });

		}).error(function(error) {
			   alert(JSON.stringify(error)); 
			});
		
		
		
	});
	$("#updateAddress").click(function(){
		localStorage.setItem("address",$("#address_tb").val());
		alert(localStorage.getItem("address"));
	});

    // Now safe to use the Cordova API
}