import React from "react";
import { Button } from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PaginationControlsProps } from "../../../types";

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    handlePageChange,
}) => {
    const maxPages = 5;
    const pageNumbers = [];

    if (totalPages <= maxPages) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(
                1,
                "...",
                totalPages - 2,
                totalPages - 1,
                totalPages
            );
        } else {
            pageNumbers.push(
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages
            );
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
            }}
        >
            <Button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
            </Button>
            {pageNumbers.map((page, index) => (
                <Button
                    key={index}
                    onClick={() =>
                        typeof page === "number" && handlePageChange(page)
                    }
                    style={{
                        fontWeight: currentPage === page ? "bold" : "normal",
                        backgroundColor:
                            currentPage === page ? "#5f64f5" : "transparent",
                        color: currentPage === page ? "white" : "black",
                    }}
                    disabled={typeof page !== "number"}
                >
                    {page}
                </Button>
            ))}
            <Button
                onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
            >
                <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
            </Button>
        </div>
    );
};

export default PaginationControls;
