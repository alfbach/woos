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
docker run --rm -p 8080:8080 tictactoe
```

Spiel öffnen unter `http://localhost:8080`.

**Option D:** OpenShift

Image muss für `linux/amd64` gebaut sein (Cluster-Architektur):

```bash
podman build --platform linux/amd64 --format docker -t quay.io/abach/tictactoe:latest .
podman push quay.io/abach/tictactoe:latest
oc apply -f openshift/deployment.yaml -n <namespace>
oc get route tictactoe -n <namespace>
```

## Steuern

1. Klicke auf ein leeres Feld, um X zu setzen.
2. Der Computer antwortet mit O.
3. **Neues Spiel** setzt das Brett zurück.
