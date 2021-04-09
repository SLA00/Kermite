//npx ts-node ui_texts_code_generator.ts

import * as fs from 'fs';

const codeTemplate = `// generated by Kermite/software/misc/ui_texts_code_generator.ts

// prettier-ignore
export const textSourceEnglish = %DICT_EN%;

// prettier-ignore
export const textSourceJapanese = %DICT_JA%;
`;

function formatTextDict(dict: any) {
  const innerLines = Object.keys(dict).map((key) => {
    const value = dict[key];
    return `  ${key}: '${value}',`;
  });
  return ['{', ...innerLines, '}'].join('\n');
}

function splitRowText(line: string) {
  //"“と”"で囲まれる','を$__COMMA__に一旦退避して、その後','で行を分割し、分割して得た要素それぞれを再度もとの','に戻す
  const line1 = line.replace(/"“(.*?)”"/g, (m, p1) => {
    return p1.replace(',', '$__COMMA__');
  });
  const cellTexts = line1.split(',');
  return cellTexts.map((text) => text.replace('$__COMMA__', ','));
}

function run() {
  const csvData = fs.readFileSync('ui_texts.csv', { encoding: 'utf-8' });
  const lines = csvData.split(/\r?\n/).slice(1);

  const dict_en: any = {};
  const dict_ja: any = {};
  lines.forEach((line) => {
    const [key, text_en, text_ja] = splitRowText(line);
    if (key) {
      dict_en[key] = text_en;
      dict_ja[key] = text_ja;
    }
  });

  const generatedCode = codeTemplate
    .replace('%DICT_EN%', formatTextDict(dict_en))
    .replace('%DICT_JA%', formatTextDict(dict_ja));

  const filePath = '../src/ui-common/base/uiTextData.ts';
  fs.writeFileSync(filePath, generatedCode, {
    encoding: 'utf-8',
  });
  console.log(`file saved: ${filePath}`);
  console.log('done');
}

run();
