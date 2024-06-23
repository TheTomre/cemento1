export type Column = {
    id: string;
    ordinalNo: number;
    title: string;
    type: string;
    width?: number;
  };
  
  export type DataRow = {
    id: string;
    [columnId: string]: any;
  };
  
  export type TableData = {
    columns: Column[];
    data: DataRow[];
  };
  