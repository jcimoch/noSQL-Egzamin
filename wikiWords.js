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

  var finalize = function(key, value){
                        var notANumber = isNaN(value);
                        return notANumber?1:parseInt(value);
                }
                 
                         
res = t.mapReduce( map, reduce,  {out: 'wiki.out',finalize: finalize});

db.wiki.out.find();