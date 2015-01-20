<h3> **Hardware:**
 
```
Desktop:
CPU Core i7 4770K @ 4.5Ghz
RAM 16 GB DDR3 1600Mhz CL10
SSD Plextor M5S 250mb/s SATA 3
HDD 1TB Seagate 64mb cache 7200rpm
```
----------


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
| node.js |  ~32min | 
| java |   ~8min   |  

    

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

Jak łatwo zauważyć wyniki są podejrzanie małe, co ciekawe pokrywają się z wynikami w parserze SAX w implementacji javowej. Aby je zweryfikować postanowiłem użyć jeszcze pasera napisanego w php. 
Wyniki z tego parsera są kompletnie odmienne ale jednocześnie nie do końca poprawne, ponieważ parser ten uwzględnia cały tekst, łącznie z tagami np. "span", "bgcolor" , "www" . Przez co wyniki są zakłamane w drugą stronę.

skrypt wykonywał się znacznie dłużej niż implementacja w js czy javie
| lang   |      time     | 
|----------|:-------------:|
| php |  ~58min | 


```js
db['wiki.out'].count()
5441098
db.pr.find({value: {$gt: 100}}).sort({value: -1})
{ "_id" : "w", "value" : 13318251 }
{ "_id" : "i", "value" : 5673827 }
{ "_id" : "align", "value" : 4910631 }
{ "_id" : "–", "value" : 4812528 }
{ "_id" : "na", "value" : 4483914 }
{ "_id" : "z", "value" : 4411273 }
{ "_id" : "ref", "value" : 4264212 }
{ "_id" : "data", "value" : 3495151 }
{ "_id" : "Kategoria", "value" : 3169246 }
{ "_id" : "do", "value" : 2823615 }
{ "_id" : "center", "value" : 2719307 }
{ "_id" : "się", "value" : 2571716 }
{ "_id" : "http", "value" : 2324475 }
{ "_id" : "br", "value" : 2221204 }
{ "_id" : "W", "value" : 2072932 }
{ "_id" : "www", "value" : 2053453 }
{ "_id" : "left", "value" : 2037762 }
{ "_id" : "tytuł", "value" : 1668387 }
{ "_id" : "roku", "value" : 1511654 }
{ "_id" : "small", "value" : 1466680 }
{ "_id" : "a", "value" : 1449271 }
{ "_id" : "style", "value" : 1432662 }
{ "_id" : "bgcolor", "value" : 1400557 }
{ "_id" : "flaga", "value" : 1370419 }
{ "_id" : "px", "value" : 1339655 }
{ "_id" : "nie", "value" : 1290672 }
{ "_id" : "r", "value" : 1286691 }
{ "_id" : "RD", "value" : 1275575 }
{ "_id" : "jest", "value" : 1260071 }
{ "_id" : "pl", "value" : 1235733 }
{ "_id" : "name", "value" : 1098228 }
{ "_id" : "o", "value" : 1077834 }
{ "_id" : "język", "value" : 1059868 }
{ "_id" : "nazwa", "value" : 1056992 }
{ "_id" : "Plik", "value" : 1023572 }
{ "_id" : "to", "value" : 1021988 }
{ "_id" : "przez", "value" : 1010958 }
{ "_id" : "url", "value" : 1005558 }
{ "_id" : "infobox", "value" : 995637 }
{ "_id" : "span", "value" : 991489 }

```

![alt text](https://dl.dropboxusercontent.com/u/15067146/words.PNG "words chart")
