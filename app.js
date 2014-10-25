window.onload = function() {

  // Display the matchPattern items.
  matchPatternDB.open(refreshUI);


  // Get references to the form elements.
  var newMatchPatternForm = document.getElementById('new-matchPattern-form');
  var tabUrl = document.getElementById('tabUrl');
  var imageSpaces = document.getElementById('imageSpaces');
  var postUrls = document.getElementById('postUrls');
  var skipUrls = document.getElementById('skipUrls');
  var postImgUrl = document.getElementById('postImgUrl');


  // Handle new matchPattern item form submissions.
  newMatchPatternForm.onsubmit = function() {
    // Get the matchPattern text.
    var tabUrl_text = tabUrl.value;
    var imageSpaces_text = imageSpaces.value;
    var postUrls_text = postUrls.value;
    var skipUrls_text = skipUrls.value;
    var postImgUrl_text = postImgUrl.value;


    // Create the matchPattern item.
    matchPatternDB.create(tabUrl_text, imageSpaces_text, postUrls_text, skipUrls_text, postImgUrl_text, function(matchPattern) {
      refreshUI();
    });

    // Reset the input field.
    newMatchPatternForm.reset();

    // Don't send the form.
    return false;
  };

}

// Update the list of matchPattern items.
function refreshUI() {
  matchPatternDB.readAll(function(matchPatterns) {
    var matchPatternList = document.getElementById('matchPattern-items');
    matchPatternList.innerHTML =
      "<tr>" +
      "<th>Edit</th>" +
      "<th>Delete</th>" +
      "<th>tabUrl</th>" +
      "<th>imageSpaces</th>" +
      "<th>postUrls</th>" +
      "<th>skipUrls(Optional)</th>" +
      "<th>postImgUrl</th>" +
      "</tr>";
    console.log("read matchPatterns.length: " + matchPatterns.length);
    for (var i = 0; i < matchPatterns.length; i++) {
      // Read the matchPattern items backwards (most recent first).
      var matchPattern = matchPatterns[(matchPatterns.length - 1 - i)];

      var tr = document.createElement('tr');
      var td0 = document.createElement('td');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var td5 = document.createElement('td');
      var td6 = document.createElement('td');

      var editBtn = document.createElement('input');
      editBtn.type = "button";
      editBtn.className = "editBtn";
      editBtn.value = "edit";
      editBtn.setAttribute("data-id", matchPattern.timestamp);

      td0.appendChild(editBtn);

      var delBtn = document.createElement('input');
      delBtn.type = "button";
      delBtn.className = "matchPattern-checkbox";
      delBtn.value = "delete";
      delBtn.setAttribute("data-id", matchPattern.timestamp);

      td1.appendChild(delBtn);

      //var span = document.createElement('span');
      //span.innerHTML = matchPattern.text;

      //td2.appendChild(span);

      td2.innerHTML = matchPattern.tabUrl;
      td2.setAttribute('contenteditable', 'true');
      td3.innerHTML = matchPattern.imageSpaces;
      td3.setAttribute('contenteditable', 'true');
      td4.innerHTML = matchPattern.postUrls;
      td4.setAttribute('contenteditable', 'true');
      td5.innerHTML = matchPattern.skipUrls;
      td5.setAttribute('contenteditable', 'true');
      td6.innerHTML = matchPattern.postImgUrl;
      td6.setAttribute('contenteditable', 'true');

      tr.appendChild(td0);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      matchPatternList.appendChild(tr);

      editBtn.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));
        var tabUrl_text;
        var imageSpaces_text;
        var postUrls_text;
        var skipUrls_text;
        var postImgUrl_text;
        var table = document.getElementById('matchPattern-items');
        for (var i = 1; i < table.rows.length; i++) {
          if (table.rows[i].cells[0].childNodes[0].getAttribute('data-id') == id) {
            var row = table.rows[i];
            tabUrl_text = row.cells[2].innerHTML;
            imageSpaces_text = row.cells[3].innerHTML;
            postUrls_text = row.cells[4].innerHTML;
            skipUrls_text = row.cells[5].innerHTML;
            postImgUrl_text = row.cells[6].innerHTML;
          }
        }
        matchPatternDB.update(tabUrl_text, imageSpaces_text, postUrls_text, skipUrls_text, postImgUrl_text, id, refreshUI);
      });

      delBtn.addEventListener('click', function(e) {
        var checkDelete = confirm("Are you really want to delete this?");
        if (checkDelete) {
          var id = parseInt(e.target.getAttribute('data-id'));
          matchPatternDB.delete(id, refreshUI);
        };

      });
    }

  });
}