Rozwiązania zadań na egzamin:
-------------
 **Zadanie 3a:**
> - Przygotować funkcje map i reduce, które:
> -wyszukają wszystkie anagramy w pliku word_list.txt 

Po zaimportowaniu pliku txt ( jako csv z nagłówkiem id i word ) , wystarczy uruchomić spreparowane funkcję map-reduce. 

```js
mongoimport -c words -d nosql--file K:\mongoBaza\words.csv --type csv --headerline
```

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