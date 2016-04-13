$(function () {
  var socket = io();
  var userId = $('#user').attr('class')
  var markers = [];
  var map;
  socket.emit('user', userId)
  function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.315, lng: -105.270},
      zoom: 1
    });
    
    socket.on('user', function (posts) {
      $('.posts').empty()
      for (var i = 0; i < posts.length; i++) {
        var info = posts[i]
        var marker = new google.maps.Marker({
          position: {lat: +info.lat, lng: +info.lng},
          map: map,
        })
        markers.push(marker);
        markeEventHandler(marker, info.title, info.id)
        $('.posts')
        .append("<div class='media data' id='"+info.id+"' title='"+info.title+"'></div>");
        $('#'+ info.id )
        .append("<div class='media-left'>"
          +"<a href='/posts/"+info.id+"'>"
          +"<img class='media-object' src='"+info.img_link+"'></a></div>")
        .append("<div class='media-body'>"
          +"<h4 class='media-heading'><a href='/posts/"+info.id+"'>"+info.title+"<a/></h4>"
          +"<h5 class='list-group-item-text'><a href='/users/"+info.user_id+"'>Author:"+info.username+"</a></h5><br></div>")
        .append("<div class='media-right'>"
          +"<input class='votearrow' type='image' src='/images/uparrow.png'>"
          +"<h5>"+info.rating+"</h5>"
          +"<input class='votearrow' type='image' src='/images/downarrow.png'></div>");
      }
    })
    function markeEventHandler(marker, message, id) {
      var infowindow = new google.maps.InfoWindow({
        class: id,
        content: message
      });
      marker.addListener('click', function() {
        window.location = "/posts/" + infowindow.class;
      })
      marker.addListener('mouseover', function() {
        $('#' + infowindow.class).css('background', 'rgba(111, 106, 102, 0.31)')
        infowindow.open(marker.get('map'), marker);
      });
      marker.addListener('mouseout', function(){
        $('#' + infowindow.class).css('background', 'none')
        infowindow.close()
      })
      $(document).on('mouseover', '#' + infowindow.class, function () {
        $('#' + infowindow.class).css('background', 'rgba(111, 106, 102, 0.31)')
        infowindow.open(marker.get('map'), marker);
      })
      $(document).on('mouseout', '#' + infowindow.class, function () {
        $('#' + infowindow.class).css('background', 'none')
        infowindow.close()
      })
    }
  };

    window.initAutocomplete = initAutocomplete;
});