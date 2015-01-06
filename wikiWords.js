t = db.wiki;  // wygodny skrót
var map = function(){           
    var words = this.text.toString().split(" ");
            words.forEach(function(key){
                emit(key, key);
            });
          };

var reduce = function(key, value){
                        return value.length;
             };
 
                         
res = t.mapReduce( map, reduce,  {out: 'wiki.out'});

db.wiki.out.find();