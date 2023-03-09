from datetime import datetime
import os
from generate_index import index_update
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import sys

def presentation_update(name):
	environment = Environment(loader=FileSystemLoader("templates/"))
	presentation_files = []
	presentation_files.append(environment.get_template("presentation.html"))
	presentation_files.append(environment.get_template("presentation.md"))
	today = get_formated_today()
	new_folder = Path(f'presentations/{today}_{name}')
	new_folder.mkdir(parents=True, exist_ok=True)
	for presentation_file in presentation_files:
		file_extension = presentation_file.name.split('.')[-1]
		with open(f'{new_folder}/index.{file_extension}', mode="w", encoding="utf-8") as file:
		    content = presentation_file.render()
		    file.write(content)
	print(f'Presenation {new_folder} created.')

def get_formated_today():
	now = datetime.now()
	today = now.strftime('%Y%m%d')
	today = str(today)
	return today

if __name__ == '__main__':
	presentation_update(sys.argv[1])
	index_update()