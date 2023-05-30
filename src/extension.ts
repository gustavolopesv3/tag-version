import * as vscode from 'vscode';
import simpleGit, { SimpleGit, TagResult } from 'simple-git';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

  const disposables = [
    {
      name: 'tag-version.lastTag',
      command: disposableUpdateTagVersion
    },
    {
      name: 'tag-version.getAuthorLastTag',
      command: disposableGetAuthorLastTag
    },
    {
      name: 'tag-version.update-package-json',
      command: disposableUpdateTagVersionPackageJson
    }
  ];

  disposables.forEach(disposable => {
    const command = vscode.commands.registerCommand(disposable.name, async () => disposable.command());
    context.subscriptions.push(command);
  });

}

function disposableUpdateTagVersionPackageJson(){
  const packageJsonPath = `${vscode.workspace.rootPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = packageJson.version;
  const incrementedTag = _incrementVersion(version);
  updateVersionPackageJson(packageJsonPath, incrementedTag);
}

function _incrementVersion(tag: string): string {
  const partes = tag.split('.');

  const major = parseInt(partes[0], 10);
  const minor = parseInt(partes[1], 10);
  const patch = parseInt(partes[2], 10) + 1;

  const novaVersao = `${major}.${minor}.${patch}`;
  return `${novaVersao}`;
}


  function updateVersionPackageJson(packageJsonPath: string, novaTag: string) {
	try {
    const git: SimpleGit = simpleGit(vscode.workspace.rootPath);

	  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	  packageJson.version = novaTag;
	  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	  vscode.window.showInformationMessage(`Tag atualizada no arquivo package.json: ${novaTag}`);

    git.add(packageJsonPath);
    git.commit(`Auto commit package.json to version ${novaTag}`);

    vscode.window.showInformationMessage(`Commit realizado com sucesso no arquivo package.json!`);

	} catch (error) {
	  vscode.window.showErrorMessage(`Erro ao atualizar a tag no arquivo package.json: ${error}`);
	}
  }


  function _getTagVersionByPackageJson(): string {
    const packageJsonPath = `${vscode.workspace.rootPath}/package.json`;
    const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;
    const versionNumer = version.split('-')[1] || version;
    return `version-${versionNumer}`;
  }

  async function disposableUpdateTagVersion() {
    const git: SimpleGit = simpleGit(vscode.workspace.rootPath);
    try {

    const lastTagByPackageJson =  _getTagVersionByPackageJson();

    await git.addTag(lastTagByPackageJson);

      vscode.window.showInformationMessage(`Nova tag no git adicionada: ${lastTagByPackageJson}`);
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
  