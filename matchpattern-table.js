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

Polymer('matchpattern-table', {
  ready: function() {
    openMatchPatternDB();
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
    matchPatternDB.create("1", "1", "1", "1", "1", readMatchPatternDB);
  }
});