# Extensão Tag Version

Esta é uma extensão para o Visual Studio Code que oferece algumas funcionalidades relacionadas à manipulação de tags de versão em um repositório Git e no arquivo `package.json`. Com esta extensão, você pode atualizar a versão do `package.json` com a última tag do repositório, atualizar a tag do repositório com a tag definida no `package.json` e realizar o deploy da versão no ramo principal do repositório.

## Funcionalidades

### Tag Version: Update package.json

Esta função atualiza a versão do arquivo `package.json` com a última tag disponível no repositório Git. Ela obtém a última tag criada, incrementa o número de patch e atualiza a versão no arquivo `package.json`.

### Tag Version: Update tag version

Com esta função, você pode atualizar a tag do repositório Git com a tag definida no arquivo `package.json`. Ela utiliza a tag presente no `package.json` e atualiza a tag do repositório correspondente.

### Tag Version: Deploy master

Esta função é responsável por realizar o deploy da versão no ramo principal (master) do repositório. Ela segue os seguintes passos:

1. Obtém a última tag criada no repositório Git.
2. Incrementa o número de patch na tag obtida.
3. Atualiza a versão no arquivo `package.json` com a nova tag incrementada.
4. Cria uma nova tag no repositório com a nova versão.
5. Realiza o push da nova tag criada.

## Como usar

1. Abra o Visual Studio Code.
2. Navegue até o menu de extensões e pesquise por "Tag Version".
3. Instale a extensão com o nome "Tag Version" e aguarde a instalação ser concluída.
4. Após a instalação, você verá as três funcionalidades disponíveis no menu de comandos do Visual Studio Code.
5. Selecione a funcionalidade desejada e aguarde a execução da ação correspondente.

Certifique-se de que o seu repositório esteja inicializado como um repositório Git antes de utilizar as funcionalidades desta extensão.

## Observações

- Esta extensão utiliza a biblioteca `simple-git` para interagir com o Git e manipular as tags e o arquivo `package.json`. Certifique-se de que a dependência esteja instalada corretamente.
- Antes de executar a funcionalidade "Tag Version: Deploy master", verifique se você tem as permissões adequadas para realizar o push das tags no repositório remoto.

## Contribuição

Se você encontrar algum problema, tiver alguma sugestão ou quiser contribuir para esta extensão, sinta-se à vontade para abrir um problema ou enviar uma solicitação de pull no repositório oficial da extensão: [[link para o repositório no GitHub]](https://github.com/gustavolopesv3/tag-version).

Esperamos que esta extensão seja útil para você!
