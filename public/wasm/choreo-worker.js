'use strict';

let Module = null;
let moduleInitializer = null;

async function initModule() {
  try {
    importScripts('co-web.js');
    moduleInitializer = ChoreoModule;
    Module = await moduleInitializer();
    const version = Module.getVersion();
    postMessage({ type: 'ready', data: { version } });
  } catch (e) {
    postMessage({
      type: 'error',
      data: { message: 'Failed to initialize WASM module: ' + e.message }
    });
  }
}

async function reinitModule() {
  try {
    Module = await moduleInitializer();
  } catch (e) {
    Module = null;
    postMessage({
      type: 'error',
      data: { message: 'Failed to reinitialize WASM module: ' + e.message }
    });
  }
}

async function safeCall(fn, errorPrefix) {
  try {
    fn();
  } catch (e) {
    const msg = e.message || String(e);
    if (msg.includes('exit(') || msg.includes('Program terminated')) {
      postMessage({
        type: 'error',
        data: { message: errorPrefix + ': internal error (module crashed). Reinitializing...' }
      });
      await reinitModule();
    } else {
      postMessage({
        type: 'error',
        data: { message: errorPrefix + ': ' + msg }
      });
    }
  }
}

onmessage = async function (e) {
  const { type, source, target, flags } = e.data;

  if (!Module) {
    postMessage({ type: 'error', data: { message: 'WASM module not yet initialized.' } });
    return;
  }

  switch (type) {
    case 'compile': {
      await safeCall(() => {
        const result = Module.compile(source, target || 'cc', flags || '');
        postMessage({ type: 'compile-result', data: { output: result.output, errors: result.errors, success: result.success } });
      }, 'Compilation error');
      break;
    }
    case 'mockRun': {
      await safeCall(() => {
        const result = Module.mockRun(source);
        var errors = typeof result.errors === 'string' ? result.errors : '';
        errors = errors.split('\n').filter(function(line) {
          return !/warning:\s*mock:\s*unhandled expression type/.test(line);
        }).join('\n').trim();
        postMessage({ type: 'compile-result', data: { output: result.output, errors: errors, success: result.success } });
      }, 'Interpreter error');
      break;
    }
    case 'dumpAST': {
      await safeCall(() => {
        const result = Module.dumpAST(source);
        postMessage({ type: 'compile-result', data: { output: result.output, errors: result.errors, success: result.success } });
      }, 'AST dump error');
      break;
    }
    default:
      postMessage({ type: 'error', data: { message: 'Unknown message type: ' + type } });
  }
};

initModule();
