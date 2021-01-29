#/usr/bin/env bash

for i in *.tex; do
#pdflatex $i
#pdflatex $i
#pdfcrop ${i%.*}.pdf && mv ${i%.*}-crop.pdf ${i%.*}.pdf
convert ${i%.*}.pdf ${i%.*}.png;
#rm -rf ${i%.*}.pdf
rm -rf ${i%.*}.aux
rm -rf ${i%.*}.log
rm -rf ${i%.*}.fls
rm -rf ${i%.*}.fdb_latexmk
rm -rf ${i%.*}.*.gz

done
