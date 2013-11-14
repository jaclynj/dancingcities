function getUserPicture( URL ) {
  $.ajax({
    type: "GET",
    url: "/convert?image_url=" + URL
  }).done( function( data ) {
    // userImage = THREE.ImageUtils.loadTexture( data );
    // userImageSpheres();
    var imgSrc = "data:image/png;base64, " + data;
    var imgTag = $('<img>').attr('src', imgSrc );
    $( document.body ).append( imgTag );
  });
}

getUserPicture("http://pbs.twimg.com/profile_images/2983620867/8eaa1d9315e3e5c7d9849ab4b151f72e_normal.jpeg");