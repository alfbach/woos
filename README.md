# TicTacToe — Spieler vs. Computer

Einfaches browserbasiertes TicTacToe. Du spielst als **X**, der Computer als **O**.

## Starten

**Option A:** `index.html` direkt im Browser öffnen.

**Option B:** Lokaler Static-Server (empfohlen):

```bash
npx --yes serve .
```

Dann die angezeigte URL im Browser öffnen (meist `http://localhost:3000`).

**Option C:** Docker

```bash
docker build -t tictactoe .
docker run --rm -p 8080:80 tictactoe
```

Spiel öffnen unter `http://localhost:8080`.

## Steuern

1. Klicke auf ein leeres Feld, um X zu setzen.
2. Der Computer antwortet mit O.
3. **Neues Spiel** setzt das Brett zurück.
