import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';
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
    },
    {
      name: 'tag-version.deploy-master',
      command: disposableDeployMaster
    }
  ];

  disposables.forEach(disposable => {
    const command = vscode.commands.registerCommand(disposable.name, async () => disposable.command());
    context.subscriptions.push(command);
  });

}

async function disposableDeployMaster() {
  const packageJsonPath = `${vscode.workspace.rootPath}/package.json`;
  const tagVersion = await getLastTagByRemote();
  if(!tagVersion){
    vscode.window.showErrorMessage(`Não foi possível obter a última tag do repositório remoto!`);
    return;
  }

  const incrementedTag = _incrementVersion(tagVersion);
  await updateVersionPackageJson(packageJsonPath, incrementedTag);
  disposableUpdateTagVersion();
  const git: SimpleGit = simpleGit(vscode.workspace.rootPath);
  await git.push('origin', `version-${incrementedTag}`);
}

async function disposableUpdateTagVersionPackageJson(){
  const packageJsonPath = `${vscode.workspace.rootPath}/package.json`;
  // const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = await getLastTagByRemote();
  if(!version){
    vscode.window.showErrorMessage(`Não foi possível obter a última tag do repositório remoto!`);
    return;
  }
  const incrementedTag = _incrementVersion(version);
  updateVersionPackageJson(packageJsonPath, incrementedTag);
}

function _incrementVersion(tag: string): string {
  const partes = tag.split('-')[1].split('.');

  const major = parseInt(partes[0], 10);
  const minor = parseInt(partes[1], 10);
  const patch = parseInt(partes[2], 10) + 1;

  const novaVersao = `${major}.${minor}.${patch}`;
  return `${novaVersao}`;
}

async function getLastTagByRemote(){
  try {
    const git: SimpleGit = simpleGit(vscode.workspace.rootPath);
  await git.fetch();
  const tags = await git.tags();
  const latestTag = await git.raw(['describe', '--tags', '--abbrev=0']);
  return latestTag;
  } catch (error) {
    vscode.window.showErrorMessage(`Erro ao obter a última tag: ${error}`);
    return;
  }
}


  async function updateVersionPackageJson(packageJsonPath: string, novaTag: string) {
	try {
    const git: SimpleGit = simpleGit(vscode.workspace.rootPath);

	  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	  packageJson.version = novaTag;
	  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	  vscode.window.showInformationMessage(`Tag atualizada no arquivo package.json: ${novaTag}`);

    await git.add(packageJsonPath);
    await git.commit(`Auto commit package.json to version ${novaTag}`);

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

    const lastTagByPackageJson = _getTagVersionByPackageJson();

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
  