<p align="center">
  <a href="https://revealjs.com">
  <img src="https://hakim-static.s3.amazonaws.com/reveal-js/logo/v1/reveal-black-text-sticker.png" alt="reveal.js" width="500">
  </a>
  <br><br>
  <a href="https://github.com/hakimel/reveal.js/actions"><img src="https://github.com/hakimel/reveal.js/workflows/tests/badge.svg"></a>
  <a href="https://slides.com/"><img src="https://s3.amazonaws.com/static.slid.es/images/slides-github-banner-320x40.png?1" alt="Slides" width="160" height="20"></a>
</p>

A biblioteca open-source reveal.js é um fremework para criação de apresentações. 
Uma demostração do poder da biblioteca poderá ser acessado em [revealjs.com](https://revealjs.com/).
Esta biblioteca vem com várias funcionalidades poderoas como [slides hierárquicos](https://revealjs.com/vertical-slides/), [suporte a markdown support](https://revealjs.com/markdown/), [animações](https://revealjs.com/auto-animate/), [exportar para PDF](https://revealjs.com/pdf-export/), [notas para o apresentador](https://revealjs.com/speaker-view/), [LaTeX typesetting](https://revealjs.com/math/), [sintaxe para demonstrar código](https://revealjs.com/code/) e uma [extensiva API](https://revealjs.com/api/).

---

Este repositório é um fork do [repositório original](https://github.com/hakimel/reveal.js) visando sempre buscar as versões mais atualizadas do mesmo.
Por não ser um repositório da organização [transparencia-mg](https://github.com/transparencia-mg) não é permitido a inclusão de issues no mesmo.
Neste sentido, os issues para solicitação de melhoria e ou correção de bugs poderão ser abertos no repositório [handbook](https://github.com/transparencia-mg/handbook/issues), com a inclusão da tag `reveal.js`.

---

### Instalação

Para utilização do repositório necessário realizar a instalação dos programas 

- Docker.
    - 🚀 [Instalação docker windows](https://docs.docker.com/desktop/install/windows-install/#:~:text=Double%2Dclick%20Docker%20Desktop%20Installer,bottom%20of%20your%20web%20browser.)
    - 🚀 [Instalação docker linux](https://docs.docker.com/desktop/install/linux-install/)
    - Visualizar apresentações no endereço http://127.0.0.1:8080/
Poetry:
    - [Instalação windows e linux](https://python-poetry.org/docs/#installation)

### Utilização

```
# Listar comandos disponíveis
poetry run task --list

# Update index.html file com novas apresentações
poetry run task index        Update index.html file.

# Criar strutura de nova apresentação
poetry run task presentation <nome_da_nova_apresentação>

Inicializa container docker e servidor local
poetry run task container
```

Obs.: Ao executar o comando `poetry run task presentation` o nome da nova apresentação deverá ser informada no padrão `snaque_small_case`.

Comandos `poetry run task presentation` e `poetry run task index` realização modificações/criações nos arquivos do repositório, sendo necessário, portanto, commit para registro destas mudanças.

### Suas apresentações

Para criar uma nova apresentação basta rodar o comando `poetry run task presentation nome_da_nova_apresentação`.
Uma pasta com o nome da apresentação fornecido será adicionada em `presentations/`.
A nova apresentação deverá ser criada utilizando Markdown no arquivo `index.md`.
Três linhas em branco separam um slide do outro horizontalmente.
Duas linhas em branco separam um slide do outro verticalmente.
`Note:` Adiciona notas que podem ser acessadas com o "speaker view", como explicado abaixo.

Este template possui um "speaker view". 
Ao apertar a tecla "s" uma nova janela será aberta, apenas para o apresentador, com um relógio, preview dos slides e notas (caso elas existam).
O "speaker view" desta apresentação também foi configurado para ajudar na gestão do tempo da apresentação.
A configuração padrão adotada foi de 3600 segundos (ou uma hora). Caso necessite, esta  poderá ser modificada no parâmetro `totalTime` ta tag `script` do arquivo `index.html` existente na raiz da sua apresentação.


```
    <script>
      // More info about initialization & config:
      // - https://revealjs.com/initialization/
      // - https://revealjs.com/config/
      Reveal.initialize({
        hash: true,
        progress: true,
        slideNumber: 'c/t',
        totalTime: 3600,

        // Learn about plugins: https://revealjs.com/plugins/
        plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ]
      });
    </script>
```

As apresentações pode ser [salvas em pdf](https://revealjs.com/pdf-export/) no navegador Google Chrome, bastando acrescentar `?print-pdf` ao final da URL da mesma e utilizando o atalho `CTRL+P` para selecionar o local aonde a mesma será salva em sua máquina.

### Atalhos

- `esc`: Visualização de todos os slides.
- `g`: Dá possibilidade de indicar o número do slide que deseja acessar.
- `s`: Acessa página extra speaker view.