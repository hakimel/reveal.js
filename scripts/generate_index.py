import os
from jinja2 import Environment, FileSystemLoader

def index_update():
	environment = Environment(loader=FileSystemLoader("templates/"))
	index_template = environment.get_template("index.html")
	names = os.listdir('presentations/')
	names.sort()
	content = index_template.render(names=names)
	with open('index.html', mode="w", encoding="utf-8") as file:
	    file.write(content)
	    print(f"index.html Updated")

if __name__ == '__main__':
	index_update()