import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import { TableEditDialogProps } from "../../../types";

const TableEditDialog: React.FC<TableEditDialogProps> = ({
    open,
    cancelDelete,
    confirmDelete,
}) => {
    return (
        <Dialog
            open={open}
            onClose={cancelDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this row?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelDelete} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={confirmDelete}
                    style={{ color: "red" }}
                    autoFocus
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TableEditDialog;
