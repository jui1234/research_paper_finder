export interface PaperFile { id?: string|number; name?: string; url: string; }
export interface Paper {
  id: string | number;
  title: string;
  authors: string[] | string;
  year?: number;
  journal?: string;
  doi?: string;
  impact_factor?: number;
  files?: PaperFile[];
  [k:string]: any;
}
