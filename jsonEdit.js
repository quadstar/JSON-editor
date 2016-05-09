var edit = false;
var dog = JSON.parse('{"hours": 30,"priorities": [25,12,18,18],"static_priority": 10,"check_volume": false,"advanced": [{"transfer_time": 45,"dates_recieved": ["2015-12-04","2016-01-07","2016-01-07"],"permissions": [{"has_color": false,"added_on": "2015-06-07"},{"can_see_add_new_account": true,"added_on": "2010-08-10"}]},{"qc suspicious": {"reason": "santa claus","method": "reindeer","elves": [{"height": 55,"weight": 45},{"height": 75,"weight": 87}]}}]}');
var objContainer = '<div class="objectContainer"></div>';
var arrContainer = '<div class="arrayContainer"></div>';

function createForms(obj, container) {
  if(Array.isArray(obj)) {
    container.append(arrContainer);
    container = container.children().last();
    for (var i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object') {
        createForms(obj[i], container);
      } else {
        container.append('<div class="propContainer"> \
          <i class="fa fa-ban"></i><i class="fa fa-pencil"></i> \
          <span class="valueContainer">'+obj[i]+'</span><br></div>');
      }
    }
  } else { 
    container.append(objContainer);
    container = container.children().last();

    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        container.append('<div class="propContainer"><i class="fa fa-ban"></i><i class="fa fa-pencil"></i><span class="keyContainer">'+key+'</span> : <i class="fa fa-plus"></i>');
        createForms(obj[key], container.children().last());
      } else {
        container.append('<div class="propContainer"> \
          <i class="fa fa-ban"></i><i class="fa fa-pencil"></i> \
          <span class="keyContainer">'+key+'</span> : \
          <span class="valueContainer">'+obj[key]+'</span><br></div>');
      }
    }
    container.append('<i class="fa fa-plus"></i>');
  }
}

function editForms () {

}

function crawl(obj) {
  if(obj.className === 'valueContainer') {
    return obj.innerHTML;
  }
  else if(obj.className === 'objectContainer') {
    var res = {}
    for(var i = 0; i < obj.children.length; i++){
      Object.assign(res, crawl(obj.children[i]));
    }
    return res;
  }
  else if(obj.className === 'propContainer') {
    if($(obj).children('.keyContainer').length === 0){
      return crawl($(obj).children('.valueContainer')[0]);
    } else {
      var value, res = {};
      if ($(obj).children('.valueContainer')[0] !== undefined) {
        value = $(obj).children('.valueContainer')[0];
      } else if ($(obj).children('.arrayContainer')[0] !== undefined) {
        value = $(obj).children('.arrayContainer')[0];
      } else {
        value = $(obj).children('.objectContainer')[0];
      }
      res[$(obj).children('.keyContainer')[0].innerHTML] = crawl(value);
      return res
    }
  }
  else if(obj.className === 'arrayContainer') {
    var res = [];
    for(var i = 0; i < obj.children.length; i++){
      res.push(crawl(obj.children[i]));
    }
    return res;
  }
  else {
    return 'woof';
  }
}


createForms(dog, $('#jsonForm'));

setDeleteButton();
setEditButton();

$('.fa-plus').on('click', function(event) {
  var brother = event.target.nextSibling;
  if(brother && brother.className === 'arrayContainer'){
    $(brother).append('<div class="propContainer"> \
          <i class="fa fa-ban"></i><i class="fa fa-pencil"></i> \
          <span class="valueContainer"><input type="text" value=""></span><button class="save">save</button><br></div>');
    setSaveButton();
  } else {
    var parent = event.target.parentElement;
    $(parent).append('<div class="propContainer"><i class="fa fa-ban"></i><i class="fa fa-pencil"></i> \
      <span class="keyContainer"><input type="text" value=""></span> : \
      <span class="valueContainer"><input type="text" value=""></span><button class="save">save</button><br></div>');
    setSaveButton();
  }


});

function setSaveButton() {
  $('.save').on('click', function(event){
    event.preventDefault();
    var parent = event.target.parentElement;
    var key = $(parent).children('.keyContainer').children()[0];
    var value = $(parent).children('.valueContainer').children()[0];
    if(key !== undefined) {
      $(parent).children('.keyContainer')[0].innerHTML = key.value;
    }
    if(value !== undefined) {
      $(parent).children('.valueContainer')[0].innerHTML = value.value;
    }
    $(event.target).remove();
    setDeleteButton();
    setEditButton();
  });
}

function setDeleteButton() {
  $('.fa-ban').on('click', function(event) {
  var child = event.target.parentElement;
  child.parentElement.removeChild(child);
  });
}

function setEditButton() {
  $('.fa-pencil').on('click', function(event) {
    var parent = event.target.parentElement;
    var key = $(parent).children('.keyContainer').html();
    var value = $(parent).children('.valueContainer').html();

    if(key !== undefined) {
      $(parent).children('.keyContainer')[0].innerHTML = '<input type="text" value="'+key+'">';
    }
    if(value !== undefined) {
      $(parent).children('.valueContainer')[0].innerHTML = '<input type="text" value="'+value+'">';
    }
    $(parent).append('<button class="save">save</button>');

    setSaveButton();
  });
}

$('.submiterino').on('click', function(event) {
  event.preventDefault();
  result = crawl($('#jsonForm').children()[0]);
  console.log(result);
  console.log(JSON.stringify(result));
});


