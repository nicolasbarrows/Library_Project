console.log("Hello World!\n==========\n");

// PROJECT Section
console.log("PROJECT:\n==========\n");

class Record {
  static counter = 1; // a counter to help create unique ids for each record

  constructor(album, artist, collected, spotifyUrl) {
    this.album = album;
    this.artist = artist;
    this.collected = collected;
    this.spotifyUrl = spotifyUrl;
    this.id = "r" + Record.counter++; // Increments the counter for each new record
    console.log("new record generated");
  }
}

class Library {
  constructor(recordCount, records) {
    this.recordCount = recordCount;
    this.records = records;
  }

  rmv(id) {
    let recordIndex = this.records.findIndex(record => record.id === id);
    console.log(recordIndex);
    if (recordIndex !== -1) {
      console.log(
        `${this.records[recordIndex].album} by ${this.records[recordIndex].artist} removed (at row ${id})`
      );

      this.records.splice(recordIndex, 1);

      console.log("Updating localStorage after removal");
      localStorage.setItem("library", JSON.stringify(this));
      console.log("localStorage updated");
      //localStorage.setItem("library", JSON.stringify(updatedLibrary));
    }
    //remove row from DOM
    let row = document.getElementById(id);
    if (row) {
      row.remove();
    }
  }

  markCollected(checkbox, id) {
    this.records.forEach((i) => {
      if (id == this.records.id) {
        if (i.collected == false) {
          checkbox = true;
          alert(i.album + " added to Your Collection!");
        }
      }
    });
  }

  addRecord() {
    //load input data
    let album = document.getElementById("albumInput").value;
    let artist = document.getElementById("artistInput").value;
    let collected = document.getElementById("collectedInput").checked;
    let spotifyUrl = document.getElementById("spotifyInput").value;

    let r = new Record(album, artist, collected, spotifyUrl);
    //update library
    this.recordCount = this.recordCount + 1;
    let x = this.records;
    x.push(r);
    console.log(myLibrary);
    //save to localStorage
    if (localStorage) {
      localStorage.setItem("library", JSON.stringify(this));
    }
    //update the DOM
    this.displayRecord(r);
  }

  displayRecord(record) {
    //this is the culprit i think
    //console.log(record.album, record.artist, record.collected, record.spotifyUrl, record.id);
    //let r = new Record(record.album,record.artist,record.collected,record.spotifyUrl,record.id);

    let parent = document.getElementById("library-table");
    let tr = document.createElement("tr");
    parent.appendChild(tr);

    tr.setAttribute("id", record.id);

    let tdAlbum = document.createElement("td");
    let tdArtist = document.createElement("td");
    let tdCollected = document.createElement("td");
    let tdSpotifyUrl = document.createElement("td");
    let tdRemoveBtn = document.createElement("td");

    tdAlbum.appendChild(document.createTextNode(record.album));
    tdArtist.appendChild(document.createTextNode(record.artist));

    let checked = document.createElement("input");
    checked.setAttribute("type", "checkbox");
    checked.checked = record.collected;
    checked.disabled = true;
    tdCollected.appendChild(checked);

    let link = document.createElement("a");
    link.setAttribute("href", record.spotifyUrl);
    link.setAttribute("target", "_blank");
    tdSpotifyUrl.appendChild(link);
    link.appendChild(document.createTextNode("link"));

    let removeBtn = document.createElement("button");
    let removeBtnId = "rmv-" + record.id;
    removeBtn.setAttribute("type", "button");
    removeBtn.setAttribute("id", removeBtnId);
    removeBtn.addEventListener("click", function () {
      console.log("button " + record.id + " clicked!");
      myLibrary.rmv(record.id);
    });
    removeBtn.appendChild(document.createTextNode("Remove"));
    tdRemoveBtn.appendChild(removeBtn);

    tr.appendChild(tdAlbum);
    tr.appendChild(tdArtist);
    tr.appendChild(tdCollected);
    tr.appendChild(tdSpotifyUrl);
    tr.appendChild(tdRemoveBtn);
  }
}

  if (localStorage) {
    //load saved library from localStorage data
    const savedLibrary = localStorage.getItem("library");

    if (savedLibrary) {
      const myLibraryData = JSON.parse(savedLibrary);
      var myLibrary = new Library(
        myLibraryData.recordCount,
        myLibraryData.records.map(
          (r) => new Record(r.album, r.artist, r.collected, r.SpotifyUrl)
        )
      );
      console.log("saved library loaded. new Library created.");
      myLibraryData.records.forEach((record) =>
        myLibrary.displayRecord(record)
      );
    } else {
      //create example library if no storage data found
      let exampleRecord = new Record(
        "Abbey Road",
        "The Beatles",
        0,
        "https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN?si=J5NHBcofQUSrdt1fiJy8ew:play"
      );
      var myLibrary = new Library(1, [exampleRecord]);
      myLibrary.displayRecord(exampleRecord);
    }
  } else {
    console.log("localstorage not supported");
  }

document.getElementById("addAlbumBtn").addEventListener("click", function () {
  myLibrary.addRecord();
});