t = db.words;  // wygodny skrót

db.letters.out.drop(); // drop collection if exists


//Map
m = function() {

    var xx = this.word.split("").sort().toString(); //split word to single characters and sort them

        emit(xx,this.word); //emit this array as key , and word as a value , so words which have anagrams will be emitted at least twice

     

};

//Reduce
r = function(key, value) {

        return results.toString(); // return string (for some reason reduce method must return the same type as emited value)

};



var finalize = function(key, reducedValue) { // finalize for simpler recognition which word has anagram, we could also run map-reduce once more and extract only those which have

  if(reducedValue.length > 6 )

    return reducedValue; //every word has 6chars, so if our string contains more, that means whit have at least 2 anagrams

  else

    return  reducedValue=null; //we set value filed to null to indicate that this words has no anagrams in database
    //later db.letters.out.find({$type:2})
};

res = t.mapReduce( m, r,  {out: 'letters.out',finalize: finalize});

//db.letters.find();

db.letters.out.find();

