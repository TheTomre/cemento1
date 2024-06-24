import { faker } from '@faker-js/faker';
import { TableData, Column, DataRow } from '../types';

export const mockData = (rowCount: number): TableData => {
    const columns: Column[] = [
        { id: "name", ordinalNo: 1, title: "Name", type: "string" },
        { id: "age", ordinalNo: 2, title: "Age", type: "number" },
        { id: "isActive", ordinalNo: 3, title: "Active", type: "boolean" },
        { id: "dob", ordinalNo: 4, title: "Date of Birth", type: "date" },
        { id: "gender", ordinalNo: 5, title: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    ];

    const data: DataRow[] = [];

    for (let i = 0; i < rowCount; i++) {
        data.push({
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            age: faker.number.int({ min: 18, max: 80 }),
            isActive: faker.datatype.boolean(),
            dob: faker.date.past({ years: 50, refDate: new Date(2002, 0, 1) }).toISOString().split('T')[0],
            gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        });
    }

    return { columns, data };
};
