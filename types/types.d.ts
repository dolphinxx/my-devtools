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

type AppConfig = {
  articleDir: string;
  language: string;
  darkMode: 'system'|'light'|'dark';
};

type EmitterEventType = 'tools:shortcut'|'exitCapture'|string;

type EmitterEvent = Record<EmitterEventType, unknown>;

type Position = {x:number, y: number};
