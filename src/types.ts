export type Column = {
  id: string;
  ordinalNo: number;
  title: string;
  type: string;
  width?: number;
  options?: string[];
};

export type DataRow = {
  id: string;
  [columnId: string]: any;
};

export type TableData = {
  columns: Column[];
  data: DataRow[];
};

export type SortOrder = 'asc' | 'desc';

export type TableHeaderProps = {
  columns: Column[];
  sortColumn: string | null;
  sortOrder: SortOrder;
  visibleColumns: string[];
  handleSort: (columnId: string) => void;
};

export type TableRowProps = {
  row: DataRow;
  columns: Column[];
  visibleColumns: string[];
  editRowId: string | null;
  editRowData: Record<string, any>;
  handleEdit: (rowId: string) => void;
  handleDelete: (rowId: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    rowId: string,
    columnId: string
  ) => void;
  renderInput: (
    columnType: string,
    columnId: string,
    value: any,
    rowId: string
  ) => React.ReactNode;
};

export type ColumnVisibilityControlsProps = {
  columns: Column[];
  visibleColumns: string[];
};

export type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

export type TableEditDialogProps = {
  open: boolean;
  cancelDelete: () => void;
  confirmDelete: () => void;
};
