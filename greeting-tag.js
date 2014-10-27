var temp;
function getData () {
  matchPatternDB.open(function() {
    matchPatternDB.readAll(function(matchPatterns) {
      temp = matchPatterns;
      document.querySelector('greeting-tag').updateModel();
    });
  });
}
Polymer('greeting-tag', {
  dbReadAllCallback:function (matchPatterns) {
    this.salutations = matchPatterns;
  },
  dbOpenCallback :function () {
    matchPatternDB.readAll(this.dbReadAllCallback);
  },
  ready: function() {
    this.salutations = [
      {tabUrl: 'Hello', imageSpaces: 'World'},
      {tabUrl: 'Goodbye', imageSpaces: 'DOM APIs'},
      {tabUrl: 'Hello', imageSpaces: 'Declarative'},
      {tabUrl: 'Goodbye', imageSpaces: 'Imperative'}
    ];
    //matchPatternDB.open(this.dbOpenCallback);
    getData();
    this.alternates = ['Hello', 'Hola', 'Howdy'];
    this.current = 0;
  },     
  updateModel: function() {
    this.current = (this.current + 1) % this.alternates.length;
    //this.salutations[0].tabUrl = this.alternates[this.current];
    this.salutations = temp;
  }
});
