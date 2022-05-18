type PromiseOr<T> = Promise<T> | T;

interface FormatResult {
  code?: string;
  warnings?: string[];
}

interface MenuDefinition {
  name: string;
  route?: { path: string };
  icon?: string;
  children?: MenuDefinition[];
}

type FormatterFn = (input: string) => PromiseOr<FormatResult>;

type SystemConfig = {
  appDir: string;
};

type Language = 'cn'|'en';

type AppConfig = {
  articleDir: string;
  language: Language;
  darkMode: 'system'|'light'|'dark';
  tesseractLangDir: string;
};

type EmitterEventType = 'tools:shortcut'|'exitCapture'|'tools:message'|'tools:recognizeText:success'|string;

type EmitterEvent = {
  'tools:shortcut': string;
  'clip:exit': void;
  'tools:message': {type:'info'|'error'|'success'|'warning';message:string};
  'tools:recognizeText:success': {image:string;result:RecognizeResult};
  'clip:startSelect': void;
  [x:string]:unknown;
};

type Position = {x:number, y: number};

type Rectangle = {x:number, y:number, width: number, height: number};

// https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016
type TessLangCode = 'eng' | 'chi_sim';
