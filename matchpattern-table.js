var tempMatchPatterns;

function openMatchPatternDB() {
  matchPatternDB.open(readMatchPatternDB);
}

function readMatchPatternDB() {
  matchPatternDB.readAll(function(matchPatterns) {
    tempMatchPatterns = matchPatterns;
    document.querySelector('matchpattern-table').updateUI();
  });
}

function exportMatchPatternDBToJson (matchPatterns) {
  //remove id, we don't need id
  for (index in matchPatterns) {
    delete matchPatterns[index].id;
  }
  prompt("Copy it and save to safe place:)", JSON.stringify(matchPatterns));

}

Polymer('matchpattern-table', {
  ready: function() {
    openMatchPatternDB();
    this.newMatchPattern = {};
  },
  updateUI: function() {
    this.matchPatterns = tempMatchPatterns;
  },
  editMatchPattern: function(event, detail, sender) {
    matchPatternDB.update(event.target.templateInstance.model.m, readMatchPatternDB);
  },
  deleteMatchPattern: function(event, detail, sender) {
    if (confirm("Are you really want to delete this?")) {
      matchPatternDB.delete(parseInt(sender.getAttribute('data-id')), readMatchPatternDB);
    }
  },
  formSubmit: function(event, detail, sender) {
    matchPatternDB.create(this.newMatchPattern, readMatchPatternDB);
  },
  exportMatchPatterns: function(event, detail, sender) {
    matchPatternDB.readAll(exportMatchPatternDBToJson);
  },
  importMatchPatterns: function(event, detail, sender) {
    var matchPatterns = JSON.parse(prompt("Enter the data"));
    for (index in matchPatterns) {
      matchPatternDB.create(matchPatterns[index], readMatchPatternDB);
    }
  }
});