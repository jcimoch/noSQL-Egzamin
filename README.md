Rozwiązania zadań na egzamin:
-------------
 **Zadanie 3a:**
> - Przygotować funkcje map i reduce, które:
> -wyszukają wszystkie anagramy w pliku word_list.txt 

Po zaimportowaniu pliku txt ( jako csv z nagłówkiem id i word ) , wystarczy uruchomić spreparowane funkcję map-reduce. 

```js
mongoimport -c words -d nosql--file K:\mongoBaza\words.csv --type csv --headerline
```
Czas: Pomijalnie mały.


Uruchamiamy mapreduce: [LINK](https://github.com/jcimoch/noSQL-Egzamin/blob/master/mongoAnagrams.js)

```js
{
    "result" : "letters.out",
    "timeMillis" : 384,
    "counts" : {
        "input" : 8199,
        "emit" : 8199,
        "reduce" : 914,
        "output" : 7011
    },
...

```

Anagramów jest: 914

Przykładowe 10: 

```js
db['letters.out'].find({value:{$type:2}}).sort({id:-1})

```

```js
/* 0 */
{
    "_id" : "a,a,b,d,o,r",
    "value" : "abroad,aboard"
}

/* 1 */
{
    "_id" : "a,a,b,l,s,t",
    "value" : "basalt,tablas"
}

/* 2 */
{
    "_id" : "a,a,b,m,n,t",
    "value" : "bantam,batman"
}

/* 3 */
{
    "_id" : "a,a,c,e,t,v",
    "value" : "caveat,vacate"
}

/* 4 */
{
    "_id" : "a,a,c,i,m,n",
    "value" : "caiman,maniac"
}

/* 5 */
{
    "_id" : "a,a,c,l,r,s",
    "value" : "rascal,scalar"
}

/* 6 */
{
    "_id" : "a,a,c,l,s,u",
    "value" : "casual,causal"
}

/* 7 */
{
    "_id" : "a,b,i,n,r,s",
    "value" : "bairns,brains"
}

/* 8 */
{
    "_id" : "a,b,i,n,r,y",
    "value" : "binary,brainy"
}

/* 9 */
{
    "_id" : "a,b,m,r,s,u",
    "value" : "umbras,rumbas"
}

/* 10 */
{
    "_id" : "a,b,n,o,r,y",
    "value" : "barony,baryon"
}

```


 **Zadanie 3b:**
>- Wyszukają najczęściej występujące słowa z Wikipedia data PL aktualny plik z artykułami, ok. 1.3 GB

W tym zadaniu okazało się, że zaimportowanie pliku xml do mongo nie będzie zadaniem trywialnym. Postanowiłem sparsować plik i przerobić na interesujący mnie .json. Do tego celu użyłem node.js oraz modułu SAX ( moduły takie jak xml2js nie nadawały się do tego zadania ze względu na rozmiar pliku ). 

Uruchamiamy skrypt [LINK](https://github.com/jcimoch/noSQL-Egzamin/blob/master/parsexml.js)
W którym wyłuskujemy tylko id artykułu oraz tekst. Oczysczamy dane ze znaków specjalnych i innych śmieci. Reszta danych jest zbędna do zadania. 

| lang   |      time     | 
|----------|:-------------:|
| node.js |  ~36min | 
| java |   ~7min   |  

    

Wykonujemy import nowego pliku json. Warto tutaj wspomnieć, że ten sam program napisany w JAVIE przez kolege z wykorzystaniem SAX wykonał się 4x szybciej. Łatwo wywnioskować, że node.js do zadań wymagających dużo od procesora nie jest najlepszym wyborem. 

 ```js
	mongoimport -c wiki -d nosql --file K:\mongobaza\output.json --type json --jsonArray 
 ```
Czas: ~10min

Uruchamiamy skrypt mapreduce [LINK](https://github.com/jcimoch/noSQL-Egzamin/blob/master/wikiWords.js)

| drive type|      time     | 
|----------|:-------------:|
| hdd |  ~5h| 
| ssd |  ~1h 20min   | 

![alt text](https://dl.dropboxusercontent.com/u/15067146/hddusagemapreduce.PNG "hdd and ram usage")


```js
{
    "result" : "wiki.out",
    "timeMillis" : 26472252,
    "counts" : {
        "input" : 1671883,
        "emit" : 520337162,
        "reduce" : 63187424,
        "output" : 5429884
    },
```
```js
db['wiki.out'].find().sort({value:-1}).limit(10);
```

10 najczęstszych słów z artykułów:

```js
/* 0 */
{
    "_id" : "urodził",
    "value" : 5382
}

/* 1 */
{
    "_id" : "sześć",
    "value" : 5352
}

/* 2 */
{
    "_id" : "Urodził",
    "value" : 5342
}

/* 3 */
{
    "_id" : "ukończeniu",
    "value" : 5307
}

/* 4 */
{
    "_id" : "Dwa",
    "value" : 5261
}

/* 5 */
{
    "_id" : "rodzinie",
    "value" : 5261
}

/* 6 */
{
    "_id" : "przebywał",
    "value" : 5254
}

/* 7 */
{
    "_id" : "założył",
    "value" : 5246
}

/* 8 */
{
    "_id" : "pozostał",
    "value" : 5234
}

/* 9 */
{
    "_id" : "powrocie",
    "value" : 5229
}
```