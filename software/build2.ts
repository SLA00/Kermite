import fs from 'fs';
import readline from 'readline';
import { build, cliopts } from 'estrella';
import open from 'open';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const servor = require('servor');

const [opts] = cliopts.parse(
  ['x-mockview', 'start mockview'],
  ['x-build-profile-drwaing-generator', 'build outward modules'],
  ['x-debug-profile-viewer', 'debug profile viewer'],
  ['x-build-profile-viewer', 'build profile viewer'],
);
const reqMockView = opts['x-mockview'];
const reqBuildProfileDrawingDataGenerator =
  opts['x-build-profile-drwaing-generator'];

const reqDebugProfileViewer = opts['x-debug-profile-viewer'];
const reqBuildProfileViewer = opts['x-build-profile-viewer'];

type IKeyPressEvent = {
  sequence: string;
  name: string;
  ctrl: boolean;
  shift: boolean;
  meta: boolean;
};

async function readKey(): Promise<IKeyPressEvent> {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  const res = await new Promise<IKeyPressEvent>((resolve) => {
    process.stdin.once('keypress', (_, key: any) => resolve(key));
  });
  process.stdin.setRawMode(false);
  return res;
}

function launchDebugServer(distDir: string) {
  servor({
    root: distDir,
    fallback: 'index.html',
    reload: true,
    browse: true,
    port: 3000,
  });
  open('http://localhost:3000');
  console.log('server listening on http://localhost:3000');

  (async () => {
    const key = await readKey();
    if (key.sequence === '\x1B' || key.sequence === '\x03') {
      process.exit();
    }
  })();
}

function patchOutputIndexHtmlBundleImport(htmlFilPath: string) {
  const text = fs.readFileSync(htmlFilPath, { encoding: 'utf-8' });
  const tt = Date.now().toString();
  const modText = text.replace(
    '<script src="./index.js"></script>',
    `<script src="./index.js?${tt}"></script>`,
  );
  fs.writeFileSync(htmlFilPath, modText, { encoding: 'utf-8' });
}

function startMockView() {
  const srcDir = './src/ui/mock-view';
  const distDir = `./dist/ui_mock`;
  fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(`${srcDir}/index.html`, `${distDir}/index.html`);

  build({
    entry: `${srcDir}/index.tsx`,
    outfile: `${distDir}/index.js`,
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    },
    bundle: true,
    minify: false,
    watch: true,
    clear: false,
    tslint: false,
    sourcemap: true,
    sourcesContent: true,
  });

  launchDebugServer(distDir);
}

async function makeProfileDrawingDataGeneratorModule() {
  const srcDir = './src/ex_profileDrawingDataGenerator';
  const distDir = `./dist_ex`;
  fs.mkdirSync(distDir, { recursive: true });

  return await new Promise((resolve) =>
    build({
      entry: `${srcDir}/index.ts`,
      outfile: `${distDir}/kermite_profile_drawing_data_generator.js`,
      define: {
        'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
      },
      bundle: true,
      minify: false,
      watch: false,
      clear: false,
      tslint: false,
      sourcemap: false,
      onEnd: resolve,
    }),
  );
}

function buildDebugProfileViewer(watch: boolean) {
  const srcDir = './src/ex_profileViewer';
  const distDir = `./dist_ex/profile-viewer`;
  fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(`${srcDir}/index.html`, `${distDir}/index.html`);
  patchOutputIndexHtmlBundleImport(`${distDir}/index.html`);

  build({
    entry: `${srcDir}/index.tsx`,
    outfile: `${distDir}/index.js`,
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    },
    bundle: true,
    minify: false,
    watch,
    clear: false,
    tslint: false,
    sourcemap: true,
    sourcesContent: true,
  });

  if (watch) {
    launchDebugServer(distDir);
  }
}

async function entry() {
  if (reqMockView) {
    startMockView();
    return;
  }

  if (reqDebugProfileViewer) {
    buildDebugProfileViewer(true);
    return;
  }

  if (reqBuildProfileViewer) {
    buildDebugProfileViewer(false);
    return;
  }

  if (reqBuildProfileDrawingDataGenerator) {
    await makeProfileDrawingDataGeneratorModule();
  }
}

entry();
