# Cemento Assignment 1: Data Table

## Project Description

This project is a data table implemented using React and Redux Toolkit. The table supports various data types, cell editing, column filtering, and local data saving.

## Features

-   **Display different data types**: Strings, numbers, booleans, and selection lists.
-   **Column filtering**: Users can select which columns to show or hide.
-   **Data editing**: Users can edit data directly in the table cells and save the changes.
-   **Local data saving**: Data is saved locally using `localStorage`.
-   **Pagination**: The table supports pagination for handling large datasets.

## Project Structure

-   `src/`
    -   `features/`
        -   `table/`
            -   `dataSlice.ts`: Redux slice for managing table data.
            -   `Table.tsx`: Table component.
            -   `visibleColumnsSlice.ts`: Redux slice for managing column visibility.
    -   `hooks/`
        -   `redux.ts`: Custom hooks for using Redux.
    -   `mock/`
        -   `mockData.ts`: Data generation using the `faker` library.
    -   `store/`
        -   `store.ts`: Redux store configuration.
    -   `App.tsx`: Main application component.
    -   `index.css`: Application styles.
    -   `main.tsx`: Entry point of the application.
    -   `types.ts`: Type definitions for table data.

## Reasoning Behind Decisions

1. **Using TypeScript**: To enhance code reliability through static typing.
2. **Using Redux Toolkit**: To simplify state management and data logic.
3. **Using MUI for UI components**: To quickly create and customize the user interface.
4. **Using Faker for data generation**: To easily generate large datasets for testing.
5. **Local data saving**: To simplify data handling without needing a backend.
