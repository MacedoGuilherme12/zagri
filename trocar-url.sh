#!/usr/bin/env bash
# Troca a URL base do site em index.html (og:image, canonical, JSON-LD)
# e em script.js (CONFIG.BASE_URL) de uma vez.
# Uso: ./trocar-url.sh https://www.zagriconstrutora.com.br
set -euo pipefail
cd "$(dirname "$0")"
NOVA="${1:?Informe a nova URL, ex.: ./trocar-url.sh https://www.zagriconstrutora.com.br}"
NOVA="${NOVA%/}"
ATUAL=$(sed -n 's/.*BASE_URL: "\([^"]*\)".*/\1/p' script.js)
sed -i "s#${ATUAL}#${NOVA}#g" index.html script.js
echo "URL trocada: ${ATUAL} -> ${NOVA}"
