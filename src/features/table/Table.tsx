import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TableData } from "../../types";
import { RootState } from "../../store/store";
import {
    updateCell,
    setData,
    setSortColumn,
    setSearchQuery,
    deleteRow,
} from "../../features/table/dataSlice";
import {
    toggleColumnVisibility,
    setVisibleColumns,
} from "../../features/table/visibleColumnsSlice";
import {
    Button,
    IconButton,
    TextField,
    Checkbox,
    MenuItem,
    Select,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    Paper,
    Toolbar,
    InputAdornment,
    FormGroup,
    FormControlLabel,
} from "@mui/material";
import { Edit, Delete, Save, Cancel, Search } from "@mui/icons-material";
import {
    ChevronDoubleLeftIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
} from "@heroicons/react/20/solid";

function CustomTable(props: { tableData: TableData }) {
    const { tableData } = props;
    const dispatch = useAppDispatch();
    const { data, sortColumn, sortOrder, searchQuery } = useAppSelector(
        (state: RootState) => state.data
    );
    const visibleColumns = useAppSelector(
        (state: RootState) => state.visibleColumns
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editRowData, setEditRowData] = useState<any>({});
    const rowsPerPage = 10;

    useEffect(() => {
        if (data.length === 0) {
            dispatch(setData(tableData.data));
        }
        if (visibleColumns.length === 0) {
            dispatch(setVisibleColumns(tableData.columns.map((col) => col.id)));
        }
    }, [
        dispatch,
        data.length,
        visibleColumns.length,
        tableData.data,
        tableData.columns,
    ]);

    const handleInputChange = useCallback(
        (
            event: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >,
            _: string,
            columnId: string
        ) => {
            let value: any;
            if (event.target.type === "checkbox") {
                value = (event.target as HTMLInputElement).checked;
            } else {
                value = event.target.value;
            }
            setEditRowData((prev: Record<string, any>) => ({
                ...prev,
                [columnId]: value,
            }));
        },
        []
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSort = useCallback(
        (columnId: string) => {
            dispatch(setSortColumn(columnId));
        },
        [dispatch]
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setSearchQuery(event.target.value));
        },
        [dispatch]
    );

    const handleEdit = (rowId: string) => {
        setEditRowId(rowId);
        const rowData = data.find((row) => row.id === rowId);
        if (rowData) setEditRowData(rowData);
    };

    const handleCancelEdit = () => {
        setEditRowId(null);
        setEditRowData({});
    };

    const handleSaveEdit = () => {
        Object.keys(editRowData).forEach((columnId) => {
            dispatch(
                updateCell({
                    rowId: editRowId!,
                    columnId,
                    value: editRowData[columnId],
                })
            );
        });
        setEditRowId(null);
        setEditRowData({});
    };

    const handleDelete = (rowId: string) => {
        dispatch(deleteRow(rowId));
    };

    const getSortedData = useCallback(() => {
        let sortedData = [...data];
        if (sortColumn) {
            sortedData.sort((a, b) => {
                if (a[sortColumn] < b[sortColumn])
                    return sortOrder === "asc" ? -1 : 1;
                if (a[sortColumn] > b[sortColumn])
                    return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortedData;
    }, [data, sortColumn, sortOrder]);

    const getFilteredData = useCallback(() => {
        if (!searchQuery) return getSortedData();
        return getSortedData().filter((row) =>
            Object.values(row).some((value) =>
                value
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        );
    }, [getSortedData, searchQuery]);

    const renderHeader = () => {
        return (
            <TableRow>
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <TableCell
                            key={column.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            sortDirection={
                                sortColumn === column.id ? sortOrder : false
                            }
                        >
                            <TableSortLabel
                                active={sortColumn === column.id}
                                direction={
                                    sortColumn === column.id ? sortOrder : "asc"
                                }
                                onClick={() => handleSort(column.id)}
                                className="flex items-center justify-between"
                            >
                                {column.title}
                                <span>
                                    {sortColumn === column.id ? (
                                        sortOrder === "asc" ? (
                                            <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                        )
                                    ) : (
                                        <ChevronDoubleLeftIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                    )}
                                </span>
                            </TableSortLabel>
                        </TableCell>
                    ) : null
                )}
                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </TableCell>
            </TableRow>
        );
    };

    const renderInput = (
        columnType: string,
        columnId: string,
        value: any,
        rowId: string
    ) => {
        const inputStyles =
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";

        switch (columnType) {
            case "number":
                return (
                    <TextField
                        type="number"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        className={inputStyles}
                    />
                );
            case "boolean":
                return (
                    <Checkbox
                        checked={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        className={inputStyles}
                    />
                );
            case "date":
                return (
                    <TextField
                        type="date"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        className={inputStyles}
                    />
                );
            case "select":
                const column = tableData.columns.find(
                    (col) => col.id === columnId
                );
                return (
                    <Select
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as unknown as React.ChangeEvent<HTMLSelectElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        className={inputStyles}
                    >
                        {column?.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                );
            default:
                return (
                    <TextField
                        type="text"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        className={inputStyles}
                    />
                );
        }
    };

    const renderRows = () => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageRows = getFilteredData().slice(start, end);
        return pageRows.map((row) => (
            <TableRow key={row.id} className="border-b">
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <TableCell
                            key={column.id}
                            className="px-6 py-4 whitespace-nowrap"
                        >
                            {editRowId === row.id
                                ? renderInput(
                                      column.type,
                                      column.id,
                                      editRowData[column.id],
                                      row.id
                                  )
                                : column.type === "boolean"
                                ? row[column.id]
                                    ? "Yes"
                                    : "No"
                                : row[column.id] !== undefined
                                ? row[column.id]
                                : null}
                        </TableCell>
                    ) : null
                )}
                <TableCell className="px-6 py-4 whitespace-nowrap">
                    {editRowId === row.id ? (
                        <>
                            <IconButton
                                onClick={handleSaveEdit}
                                color="primary"
                            >
                                <Save />
                            </IconButton>
                            <IconButton
                                onClick={handleCancelEdit}
                                color="secondary"
                            >
                                <Cancel />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton
                                onClick={() => handleEdit(row.id)}
                                color="primary"
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                onClick={() => handleDelete(row.id)}
                                color="secondary"
                            >
                                <Delete />
                            </IconButton>
                        </>
                    )}
                </TableCell>
            </TableRow>
        ));
    };

    const renderColumnVisibilityControls = () => {
        return (
            <FormGroup row>
                {tableData.columns.map((column) => (
                    <FormControlLabel
                        key={column.id}
                        control={
                            <Checkbox
                                checked={visibleColumns.includes(column.id)}
                                onChange={() =>
                                    dispatch(toggleColumnVisibility(column.id))
                                }
                            />
                        }
                        label={column.title}
                    />
                ))}
            </FormGroup>
        );
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
        return (
            <div className="flex justify-center mt-4">
                <Button
                    onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                            currentPage === index + 1 ? "font-bold" : ""
                        }`}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button
                    onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
            </div>
        );
    };

    return (
        <Paper className="p-4">
            <Toolbar className="mb-4">
                <div className="flex">{renderColumnVisibilityControls()}</div>
            </Toolbar>
            <TextField
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                className="mb-4"
            />
            <TableContainer>
                <Table className="min-w-full bg-white border border-gray-300">
                    <TableHead>{renderHeader()}</TableHead>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </TableContainer>
            {renderPagination()}
        </Paper>
    );
}

export default CustomTable;
