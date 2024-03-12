#!/bin/sh

rm index.html

echo "<h1>reveal.js example decks</h1><ul>" >> index.html
for deck in `ls *.html`; do
    name="${deck%.html}"
    echo "<li><a href='$deck'>$name</a></li>" >> index.html
done
echo "</ul>" >> index.html
