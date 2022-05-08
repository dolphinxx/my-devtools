type PromiseOr<T> = Promise<T> | T;

interface FormatResult {
  code?:string;
  warnings?: string[];
}

interface MenuDefinition {
  name: string;
  route?: {path: string};
  icon?: string;
  children?: MenuDefinition[];
}

type FormatterFn = (input:string)=>PromiseOr<FormatResult>;
