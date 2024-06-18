

# E2e Playwright

[end_to_end_testaus_playwright](https://fullstackopen.com/osa5/end_to_end_testaus_playwright)

Playwright on NodeJs pohjainen e3e testikehys

## Alustus
```
npm init playwright@latest
npm install dotenv
```


## Backend

Playwright olettaa, että testattava palvelu on käynnissä. Tehdään backendiin käynnistysskripti. Tällöin backend käyttää [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) palvelun tarjoamaa NoSQL testitietokantaa

```
"start:test": "cross-env NODE_ENV=test node index.js"
```

Generoidaan frontendin koodi: `npm run build:ui` ja käynnistetään backend: `npm run start:test`. Tällöin frontend toimisi osoitteessa http://localhost:3003/. Jos Frontend käynnistetään omana palveluna, niin osoite on http://localhost:5173/

Testausta varten on backendissä on testing-route, kun ollaan test-moodissa: POST `/api/testing/reset` tyhjentää tietokannan. 

## Testien suoritus

Testikantaan pitää luoda testikäyttäjä. Tämän voi tehdä backendin requests kansiossa olevalla add_user.rest tiedostolla

```
npm test
npm run test:report
```

Käyttöliittymän voi käynnistää seuraavalla komennolla
```
npm run test:ui
```
