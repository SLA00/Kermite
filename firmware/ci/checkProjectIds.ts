import {
  fsExistsSync,
  fsxReadJsonFile,
  fsxReadTextFile,
  getMatched,
  globSync,
  pathDirname,
  pathJoin,
  pathRelative,
  stringifyArray,
  uniqueArrayItems,
  uniqueArrayItemsDeep,
} from "./helpers";

process.chdir("..");

const AbortOnError = process.argv.includes("--abortOnError");

function getAllProjectVariationPaths() {
  return globSync("src/projects/**/rules.mk")
    .map((fpath) => pathDirname(fpath))
    .filter(
      (fpath) =>
        fsExistsSync(pathJoin(fpath, "config.h")) &&
        fsExistsSync(pathJoin(pathDirname(fpath), "project.json"))
    )
    .map((fpath) => pathRelative("src/projects", fpath));
}

interface IProjectInfo {
  projectPath: string;
  projectId: string;
}

function loadProjectInfo(projectVariationPath: string): IProjectInfo {
  const projectPath = pathDirname(projectVariationPath);
  const projectFilePath = `./src/projects/${projectPath}/project.json`;
  const configFilePath = `./src/projects/${projectVariationPath}/config.h`;
  const projectObj = fsxReadJsonFile(projectFilePath);
  const projectId = projectObj.projectId as string;

  const configContent = fsxReadTextFile(configFilePath);
  const configProjectId = getMatched(
    configContent,
    /^#define KERMITE_PROJECT_ID "([a-zA-Z0-9]+)"$/m
  );

  try {
    if (!projectId) {
      throw `projectId is not defined in ${projectPath}/project.json`;
    }

    if (!configProjectId) {
      throw `KERMITE_PROJECT_ID is not defined in ${projectVariationPath}/config.h`;
    }

    if (!projectId?.match(/^[a-zA-Z0-9]{6}$/)) {
      throw `invalid Project ID ${projectId} for ${projectPath}`;
    }

    if (projectId !== configProjectId) {
      throw `inconsistent Project IDs in ${projectVariationPath}/config.h and ${projectPath}/project.json`;
    }
  } catch (error) {
    console.log(error);
    if (AbortOnError) {
      process.exit(1);
    }
  }

  return {
    projectPath,
    projectId,
  };
}

function checkAllProjectIds(_projectInfos: IProjectInfo[]) {
  const projectInfos = uniqueArrayItemsDeep(_projectInfos);
  // console.log({ projectInfos });
  const allProjectIds = projectInfos
    .map((info) => info.projectId)
    .filter((a) => !!a);

  const duprecatedProjectIds = uniqueArrayItems(
    allProjectIds.filter((it, index) => allProjectIds.indexOf(it) !== index)
  );
  if (duprecatedProjectIds.length > 0) {
    duprecatedProjectIds.forEach((badProjectId) => {
      const badProjectPath = projectInfos
        .filter((info) => info.projectId === badProjectId)
        .map((info) => info.projectPath);
      console.log(
        `Project ID confliction. ${badProjectId} is used for ${stringifyArray(
          badProjectPath
        )}`
      );
    });
    if (AbortOnError) {
      process.exit(1);
    }
  }
}

function checkProjectIds() {
  const projectVariationPaths = getAllProjectVariationPaths();
  // console.log({ projectVariationPaths });
  const projectInfos = projectVariationPaths.map(loadProjectInfo);
  checkAllProjectIds(projectInfos);
  if (AbortOnError) {
    console.log("ok");
  } else {
    console.log("done");
  }
}

checkProjectIds();
