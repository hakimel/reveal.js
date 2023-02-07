## Webnar 001 de 2023



## Agenda

- Revisão comandos bash e git
- Configurações básicas ambiente python e variáveis de ambiente
- Mão na massa: 
	- Criação de um dataset do zero
	- Clone dataset [Crimes Violentos](https://github.com/transparencia-mg/crimes-violentos)



## Revisão comandos bash e git


## Comandas bash - TERMINAL

```
pwd # print working directory
ls # list
cd # change directory
touch # create file
mkdir # make directory
```

[touch timestamp](https://phoenixnap.com/kb/touch-command-in-linux#:~:text=The%20touch%20command's%20primary%20function,file%20doesn't%20already%20exist.)

[touch timestamp](https://unix.stackexchange.com/a/355169/498427)


# Comandos git

```
git init # inicializa trabalho git
git add . # adiciona arquivo 
git commit -m "Mensage" # salva
git push # sincronização (envia)
git pull # sincronização (busca)
git checkout -b <nome-novo-branch> # cria novo branch
git checkout <nome-branck> # muda de branch
```



# Python


# Criando Ambiente Virtual Python

```
python -m venv venv
source venv/bin/activate # linux
souce venv/Scritps/activate # windows
pip install <nome-biblioteca>
pip install -r requirements.txt
```



# Mão na massa

- Tudo visto até agora
- Validação frictionless
- Cadastro de variáveis de ambiente para publicação via dpckan


# Vamos misturar tudo

Quais comandos terminal, git e python vamos utilizar para criar um dataset do zero e ou utilizar um já existente?