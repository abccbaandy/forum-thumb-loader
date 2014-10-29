/**
 * @file A module for interacting with the DB.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */
//this is a module, check
//http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
var matchPatternDB = (function() {
  var dbObj = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
   dbObj.open = function(callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('matchPatterns', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = dbObj.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('matchPattern')) {
        db.deleteObjectStore('matchPattern');
      }

      // Create a new datastore.
      var store = db.createObjectStore('matchPattern', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;

      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = dbObj.onerror;
  };


  /**
   * Fetch all of the matchPattern items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the matchPattern items.
   */
   dbObj.readAll = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['matchPattern'], 'readwrite');
    var objStore = transaction.objectStore('matchPattern');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var matchPatterns = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(matchPatterns);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      matchPatterns.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = dbObj.onerror;
  };


  /**
   * Create a new matchPattern item.
   * @param {string} text The matchPattern item.
   */
   dbObj.create= function(newMatchPattern, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['matchPattern'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('matchPattern');

    // Create a timestamp for the matchPattern item.
    var timestamp = new Date().getTime();
    newMatchPattern.timestamp = timestamp;

    // Create the datastore request.
    var request = objStore.put(newMatchPattern);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback();
    };

    // Handle errors.
    request.onerror = dbObj.onerror;
  };


  /**
   * Delete a matchPattern item.
   * @param {int} id The timestamp (id) of the matchPattern item to be deleted.
   * @param {function} callback A callback function that will be executed if the
   *                            delete is successful.
   */
   dbObj.delete= function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['matchPattern'], 'readwrite');
    var objStore = transaction.objectStore('matchPattern');

    var request = objStore.delete(id);

    request.onsuccess = function(e) {
      callback();
    }

    request.onerror = function(e) {
      console.log(e);
    }
  };

  dbObj.update= function(matchPattern, callback) {
    var db = datastore;
    var transaction = db.transaction(['matchPattern'], 'readwrite');
    var objStore = transaction.objectStore('matchPattern');

    var request = objStore.get(matchPattern.timestamp);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      var requestUpdate = objStore.put(matchPattern);
      requestUpdate.onerror = function(event) {
        // Do something with the error
      };
      requestUpdate.onsuccess = function(event) {
        // Success - the data is updated!
        alert("update successful");
        // Execute the callback function.
        callback();
      };


    };

    // Handle errors.
    request.onerror = dbObj.onerror;
  };
  // Export the dbObj object.
  return dbObj;
}());