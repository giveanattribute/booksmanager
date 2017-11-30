var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAApZFPJrTvFTRlEd4Z2ZT-tPby3tnGxyY",
  authDomain: "booksmanager-65233.firebaseapp.com",
  databaseURL: "https://booksmanager-65233.firebaseio.com",
  projectId: "booksmanager-65233",
  storageBucket: "booksmanager-65233.appspot.com",
  messagingSenderId: "504099748281"
});
var db = firebaseApp.database();
var booksRef = db.ref('books');

var app = new Vue({
  el: '#app',
  data: {
    db: null,
    title: 'Gestione Libri',
    activeHeader: '',
    newBook: {
      author: '',
      title: '',
      year: '',
      tag: 'Già letto'
    },
    editBook: {
      author: 'default',
      title: 'default',
      year: 'default',
      tag: 'default'
    }
  },
  firebase: {
    books: booksRef
  },
  methods: {
    addBook: function(){
      booksRef.push(this.newBook);
      this.newBook.author = '';
      this.newBook.title = '';
      this.newBook.year = '';
      this.newBook.tag = 'Già letto';
      toastr.success("Libro aggiunto alla lista");
    },
    changeTag: function(){
      if(this.newBook.tag == 'Già letto'){
        this.newBook.tag = 'Da leggere';
      }else{
        this.newBook.tag = 'Già letto';
      }
    },
    removeBook: function(book){
      booksRef.child(book['.key']).remove();
      toastr.success("Libro rimosso dalla lista");
    },
    sortTable: function(column){
      this.activeHeader = column;
      this.books.sort(this.dynamicSort(column));
    },
    dynamicSort: function(property){
      var sortOrder = 1;
      if(property[0] === '-'){
        sortOrder = 1;
        property = property.substr(1);
      }
      return function(a, b){
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    },
    activeTableHeader: function(columnName){
      return{
        'active': this.activeHeader == columnName
      }
    },
    bookCompleted: function(book){
      booksRef.child(book['.key']).update({
        'tag': 'Già letto'
      });
      toastr.success("Grande! Hai finito un altro libro!");
    },
    updateBook: function(){
      booksRef.child(this.editBook['.key']).update({
        'author': this.editBook.author,
        'title': this.editBook.title,
        'year': this.editBook.year
      });
      toastr.success("Libro modificato!");
    }
  },
  computed: {
    booksFinished: function(){
      var finished = 0;
      for(var i=0; i<this.books.length; i++){
        if(this.books[i].tag == 'Già letto'){
          finished++;
        }
      }
      return finished;
    }
  }
})
