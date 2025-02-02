import {
  vObject,
  vString,
  vStringMatchesTo,
} from "~/shared/modules/SchemaValidationHelper";
import { LayoutDataMigrator } from "~/shell/loaders/LayoutDataMigrator";
import { persistEditKeyboardDesignSchemaChecker } from "~/shell/loaders/LayoutFileSchemaChecker";
import { ProfileDataMigrator } from "~/shell/loaders/ProfileDataMigrator";
import { profileDataSchemaChecker } from "~/shell/loaders/ProfileDataSchemaChecker";
import { fsxReadJsonFile, globSync } from "./helpers";

process.chdir("..");

const projectJsonDataValidator = vObject({
  projectId: vStringMatchesTo([/^[a-zA-Z0-9]{6}$/]),
  keyboardName: vString(20),
});

function checkFiles(
  target: string,
  globPttern: string,
  checker: (obj: any) => any
) {
  console.log(`cheking ${target} json schemas ...`);

  const filePaths = globSync(globPttern);
  console.log("target files", filePaths);

  const results = filePaths
    .map((filePath) => {
      const obj = fsxReadJsonFile(filePath);
      const errors = checker(obj);
      return errors ? { filePath, errors } : undefined;
    })
    .filter((a) => !!a);

  if (results.length > 0) {
    console.log(`found schema errors`);
    console.log(JSON.stringify(results, null, "  "));
    process.exit(1);
  }

  console.log(`cheking ${target} json schemas ... ok`);
}

function projectJsonSchemaCheckerEntry() {
  checkFiles(
    "project",
    "src/projects/**/project.json",
    projectJsonDataValidator
  );
  checkFiles("layout", "src/projects/**/*.layout.json", (layout) => {
    LayoutDataMigrator.patchOldFormatLayoutData(layout);
    return persistEditKeyboardDesignSchemaChecker(layout);
  });
  checkFiles("preset", "src/projects/**/*.profile.json", (profile) => {
    profile = ProfileDataMigrator.fixProfileData(profile);
    return profileDataSchemaChecker(profile);
  });
}

projectJsonSchemaCheckerEntry();
