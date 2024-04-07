import { product } from './class.js';
$(document).ready(function () {

  var productList = [];
  var displayList = [];

  function add_product(product) {
    var name = product.name;
    var description = product.desc;
    var price = product.price;
    var rating = product.rating;
    var cover = product.cover;
    var html = '';
    html += '<div class="content">';
    html += '<img src="' + cover + '">';
    html += '<h3>' + name + '</h3>';
    html += '<p>' + description + '</p>';
    html += '<h6>$' + price + '</h6>';
    html += '<ul>';
    for (var i = 0; i < 5; i++) {
      if (rating > 0) {
        html += '    <li><i class="fa fa-star checked"></i></li>';
        rating--;
      } else {
        html += '    <li><i class="fa fa-star"></i></li>';
      }
    }

    html += '</ul>';
    html += '<button class="buy-1">Buy Now</button>';
    html += ' </div>';

    return html;

  }


  function get_all_product() {
    $.ajax({
      type: 'get',
      headers: { 'Access-Control-Allow-Origin': 'http://localhost' },
      url: 'http://localhost:3100/get_all_products/',
      dataType: 'json',
      success: function (result) {
        console.log(result);
        for (var i = 0; i < result.length; i++) {
          productList.push(new product(result[i].productid, result[i].productname, result[i].price, result[i].quantity, result[i].description, result[i].rating, result[i].path));

        }
        displayList = productList;
        update_display_product();
        $('#search').change(function () {

          var keyword =  $(this).val();
          console.log('hi');
          displayList = filtered_by_keyword(productList,keyword);
          update_display_product();
      
      
        })

         

         


      }


    });

  }


  function filtered_by_keyword(productList, keyword) {

    return productList.filter(product => product.name.includes(keyword));
  }

  function sort_by_name(productList) {
    productList.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return productList;
  }

  function sort_by_rating(productList) {
    productList.sort((a, b) => {
      if (a.rating < b.rating) return 1;
      if (a.rating > b.rating) return -1;
      return 0;
    });

    return productList;
  }

  function sort_by_price_asc(productList) {
    productList.sort((a, b) => {
      if (a.price < b.price) return -1;
      if (a.price > b.price) return 1;
      return 0;
    });
    return productList;
  }


    function sort_by_price_desc(productList) {
      productList.sort((a, b) => {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
      });

    return productList;
  }

  function update_display_product() {
    $('#productList').children().remove();
    for (var i = 0; i < displayList.length; i++) {

      $('#productList').append(add_product(displayList[i]));
    }
  }






  //main


  get_all_product();


  //ui listeners

  $('#search').on('input',function () {

    var keyword =  $(this).val();
    console.log('hi');
    displayList = filtered_by_keyword(productList,keyword);
    update_display_product();


  })

  $('#sort-by').change(function () {

    var sortBy =  $(this).val();
    console.log('hi');

    switch(sortBy){
    case 'name': displayList = sort_by_name(productList);break;
    case 'rating': displayList = sort_by_rating(productList);break;
    case 'asc_price': displayList = sort_by_price_asc(productList);break;
    case 'desc_price': displayList = sort_by_price_desc(productList);break;

     
    default:
    }
    update_display_product();


  })

  //test   session     will remove after product detail page finished


  //





})