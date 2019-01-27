import ts, { parseConfigFileTextToJson } from 'typescript';
import tstoolsService, { TypeScriptService } from '@ts-tools/service';
import { flatten } from 'lodash';

// const baseHost = tstoolsService.createBaseHost(process.cwd());
// const host = tstoolsService.createLanguageServiceHost(baseHost, [], {
//
// });
const service = new TypeScriptService();
service.transpileFile('src/apply-extends.ts', {
  getCompilerOptions(baseHost, tsconfigOptions) {
    return tsconfigOptions as any;
  }
});
const runningService = service.runningServices.get('tsconfig.json')!;
const diagnostics = flatten(Array.from(runningService.rootFileNames).map(rfn => {
  return runningService.languageService.getSemanticDiagnostics(rfn);
}));

const converter = createDiagnosticJsonConverter(runningService.baseHost);
console.log(JSON.stringify(
  converter.diagnosticsToJson(diagnostics)
));
// console.log(ts.formatDiagnosticsWithColorAndContext(diagnosticsA, runningService.baseHost));
// console.log('-------------------------------');
// console.log(ts.formatDiagnosticsWithColorAndContext(diagnosticsB, runningService.baseHost));
// const result = service.transpileFile('src/obj-filter.ts', {
//   isolated: true,
//   tsconfigFileName: 'tsconfig.json',
//   cwd: process.cwd(),
//   getCompilerOptions(baseHost, tsconfigOptions) {
//     return tsconfigOptions as any;
//   }
// });
// service.runningServices.get('foo')!.languageService.getSemanticDiagnostics();

// const program = ts.createProgram({

// });
// const diagnostics = program.getSemanticDiagnostics();
// for(const d of diagnostics) {
//   for(const ri of d.relatedInformation) {
//     ri.
//   }
// }

function createDiagnosticJsonConverter(host: tstoolsService.IBaseHost) {
  return {
    diagnosticFileToJson,
    diagnosticMessageTextToJson,
    diagnosticRelatedInformationToJson,
    diagnosticToJson,
    diagnosticsToJson
  };
  function diagnosticsToJson(ds: ts.Diagnostic[] | undefined) {
    if(ds === undefined) {
      return {
        diagnostics: [],
        flattenedDiagnostics: []
      };
    }
    const converted = ds.map(d => diagnosticToJson(d));
    const flattened: Array<ReturnType<typeof diagnosticToJson> | ReturnType<typeof diagnosticRelatedInformationToJson>> = [];
    for(const d of converted) {
      flattened.push(d);
      if(d!.relatedInformation) {
        flattened.push(...d!.relatedInformation!);
      }
    }
    return {
      diagnostics: converted,
      /**
       * All related diagnostics are hoisted to the root array.
       * Note they are also still children of the root diagnostics, since the
       * objects aren't being cloned or modified at all.
      */
      flattenedDiagnostics: flattened,
    }
  }

  function diagnosticToJson(d: ts.Diagnostic | undefined) {
    if(d === undefined) return null;
    return {
      category: d.category,
      code: d.code,
      file: diagnosticFileToJson(d.file),
      source: d.source,
      start: d.start,
      length: d.length,
      messageText: diagnosticMessageTextToJson(d.messageText),
      relatedInformation: d.relatedInformation
        ? d.relatedInformation.map(ri => diagnosticRelatedInformationToJson(ri))
        : null,
      reportsUnnecessary: d.reportsUnnecessary,
      formattedPretty: ts.formatDiagnosticsWithColorAndContext([d], host),
      formatted: ts.formatDiagnostic(d, host)
    };
  }
  function diagnosticFileToJson(file: ts.SourceFile | undefined) {
    if(file === undefined) return null;
    return {
      fileName: file.fileName
    };
  }

  function diagnosticRelatedInformationToJson(d: ts.DiagnosticRelatedInformation) {
    return {
      category: d.category,
      code: d.code,
      file: diagnosticFileToJson(d.file),
      length: d.length,
      messageText: diagnosticMessageTextToJson(d.messageText),
      start: d.start,
      formattedPretty: ts.formatDiagnosticsWithColorAndContext([d], host),
      formatted: ts.formatDiagnostic(d, host),
    };
  }

  function diagnosticMessageTextToJson(mt: ts.Diagnostic['messageText'] | undefined) {
    if(mt === undefined) return null;
    if(typeof mt === 'string') {
      return {
        messageText: mt
      };
    }
    return {
      messageText: mt.messageText,
      category: mt.category,
      code: mt.code,
      next: diagnosticMessageTextToJson(mt.next)
    };
  }
}

function foo(a, b, c) {

}
foo(1);
