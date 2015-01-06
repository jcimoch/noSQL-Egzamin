Rozwiązania zadań na egzamin:
-------------
 **Zadanie 3a:**
> - Przygotować funkcje map i reduce, które:
> -wyszukają wszystkie anagramy w pliku word_list.txt 

Po zaimportowaniu pliku txt ( jako csv z nagłówkiem id i word ) , wystarczy uruchomić spreparowane funkcję map-reduce. 

```js
mongoimport -c words -d nosql--file K:\mongoBaza\words.csv --type csv --headerline
```
Anagramów jest: 914

 **Zadanie 3b:**
>- Wyszukają najczęściej występujące słowa z Wikipedia data PL aktualny plik z artykułami, ok. 1.3 GB

W tym zadaniu okazało się, że zaimportowanie pliku xml do mongo nie będzie zadaniem trywialnym. Postanowiłem sparsować plik i przerobić na interesujący mnie .json. Do tego celu użyłem node.js oraz modułu SAX ( moduły takie jak xml2js nie nadawały się do tego zadania ze względu na rozmiar pliku ). 