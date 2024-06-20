
# Szolgáltás értékelő alkalmazás blokklánc technológiával

**JELENELG NEM FUTTATHATÓ**

Az alkalmazás teljeskörű használatáhóz elengedhetetlen, hogy Metamask legyen telepítve a felhasználónál alkalmazás, vagy böngésző bővítmény formában. Ezen kívül fontos hogy a Metamskban a Sepolia hálózat legyen kiválasztva, mivel jelenleg ezt a teszthálózatot használja az alkalmazás. Contcartok deployolásához szükséges a deploy.js-ben az ideiglenes szöveg helyére a Metamaskhoz tartozó 12 szóból álló kulcsót beilleszteni.

Lokális futtatáshoz szükséges hogy node.js is telepítve legyen.

Futtatáshoz először a függőségek telepítése szükséges a következő paranccsal:

```bash
  npm install --legacy-peer-deps
```

Ezek után a futtatáshoz szükséges parancs:

```bash
  npm start
```

Ezek után az alkalmazás elérhető lesz a "localhost:3000" címen
