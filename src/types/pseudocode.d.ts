// pseudocode.js ships without types. Only the build-time entry point is used.
declare module 'pseudocode' {
  interface Options {
    lineNumber?: boolean;
    lineNumberPunc?: string;
    noEnd?: boolean;
    captionCount?: number;
    indentSize?: string;
    commentDelimiter?: string;
    titlePrefix?: string;
  }
  const pseudocode: {
    renderToString(input: string, options?: Options): string;
  };
  export default pseudocode;
}
