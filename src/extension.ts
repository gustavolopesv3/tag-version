import * as vscode from 'vscode';
import simpleGit, { SimpleGit, TagResult } from 'simple-git';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('tag-version.lastTag', async () => disposableUpdateTagVersion());
  let disposable2 = vscode.commands.registerCommand('tag-version.getAuthorLastTag', async () => disposableGetAuthorLastTag());

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2);
}

function incrementVersion(tag: string): string {
  const partes = tag.split('-');
  if (partes.length !== 2) {
    return tag; // Tag em formato inválido, retorna a tag original
  }

  const prefixo = partes[0];
  const versaoAtual = partes[1];
  const partesVersao = versaoAtual.split('.');
  if (partesVersao.length !== 3) {
    return tag; // Versão em formato inválido, retorna a tag original
  }

  const major = parseInt(partesVersao[0], 10);
  const minor = parseInt(partesVersao[1], 10);
  const patch = parseInt(partesVersao[2], 10) + 1;

  const novaVersao = `${major}.${minor}.${patch}`;
  return `${prefixo}-${novaVersao}`;
}


function updateVersionPackageJson(packageJsonPath: string, novaTag: string) {
	try {
	  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	  packageJson.version = novaTag;
	  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	  vscode.window.showInformationMessage(`Tag atualizada no arquivo package.json: ${novaTag}`);
	} catch (error) {
	  vscode.window.showErrorMessage(`Erro ao atualizar a tag no arquivo package.json: ${error}`);
	}
  }

  async function disposableUpdateTagVersion() {
    const git: SimpleGit = simpleGit(vscode.workspace.rootPath);
    try {
      const tags = await git.tags();
      const latestTag = tags.latest;
	  if(!latestTag){
		  vscode.window.showErrorMessage('Nenhuma tag encontrada');
		  return;
	  }
      const incrementedTag = incrementVersion(latestTag);
	  await git.addTag(incrementedTag);
	  const packageJsonPath = `${vscode.workspace.rootPath}/package.json`;
	  updateVersionPackageJson(packageJsonPath, incrementedTag);
      vscode.window.showInformationMessage(`Tag atual: ${latestTag}\nNova tag: ${incrementedTag}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Erro ao obter a última tag: ${error}`);
    }
  }

  async function disposableGetAuthorLastTag(){
	const git: SimpleGit = simpleGit(vscode.workspace.rootPath);
	const tags = await git.tags();
	const latestTag = tags.latest;
	if(latestTag){
		const tagInfo = await git.show(['--format=%an', latestTag]);
		const lines = tagInfo.split('\n');
		const author = lines[0];
		vscode.window.showInformationMessage(`Autor da última tag: ${author}`);
	}
}
  