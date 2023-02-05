$(document).ready(function () {

  var lists = $("footer .link-list");
  if (lists.length > 1) {
    $("footer").show();
    return;
  }
  $("footer .link-list").hide();

  var newLists = [];
  for (var e of $footerLinks) {
    newLists.push(e.html)
  }

  $("footer").show();

  $("footer .container.footer__container").append(newLists.join(''))

  $('.blog-listing__more').html('המשיכו לקרוא ...');

});

