

import { IconArrowBackUp, IconCheck, IconX } from "@tabler/icons-react";


export interface TableType {
    avatar?: any;
    name?: string;
    post?: string;
    pname?: string;
    teams: {
        id: string;
        color: string;
        text: string;
    }[];
    status?: string;
    statuscolor?: string;
    budget?: string;
}





const basicTableData: TableType[] = [
    {
        avatar: '/images/profile/user-2.jpg',
        name: "Sunil Joshi",
        post: "Web Designer",
        pname: "Elite Admin",
        status: "Active",
        statuscolor: "lightSuccess",
        teams: [
            {
                id: "1",
                color: "error",
                text: "S",
            },
            {
                id: "2",
                color: "secondary   ",
                text: "D",
            },
        ],
        budget: "$3.9",
    },
    {
        avatar: '/images/profile/user-8.jpg',
        name: "Andrew McDownland",
        post: "Project Manager",
        pname: "Real Homes WP Theme",
        status: "Pending",
        statuscolor: "lightWarning",
        teams: [
            {
                id: "1",
                color: "secondary",
                text: "N",
            },
            {
                id: "2",
                color: "warning   ",
                text: "X",
            },
            {
                id: "3",
                color: "primary   ",
                text: "A",
            },
        ],
        budget: "$24.5k",
    },
    {
        avatar: '/images/profile/user-3.jpg',
        name: "Christopher Jamil",
        post: "Project Manager",
        pname: "MedicalPro WP Theme",
        status: "Completed",
        statuscolor: "lightPrimary",
        teams: [
            {
                id: "1",
                color: "secondary",
                text: "X",
            },
        ],
        budget: "$12.8k",
    },
    {
        avatar: '/images/profile/user-7.jpg',
        name: "Nirav Joshi",
        post: "Frontend Engineer",
        pname: "Hosting Press HTML",
        status: "Active",
        statuscolor: "lightSuccess",
        teams: [
            {
                id: "1",
                color: "primary",
                text: "X",
            },
            {
                id: "2",
                color: "error",
                text: "Y",
            },
        ],
        budget: "$2.4k",
    },
    {
        avatar: '/images/profile/user-5.jpg',
        name: "Micheal Doe",
        post: "Content Writer",
        pname: "Helping Hands WP Theme",
        status: "Cancel",
        statuscolor: "lightError",
        teams: [
            {
                id: "1",
                color: "secondary",
                text: "S",
            },
        ],
        budget: "$9.3k",
    },
];


const checkboxTableData: any[] = [
    {
        invoice: 'INV-3066',
        status: 'paid',
        statuscolor: 'primary',
        statusicon: IconCheck,
        avatar: "/images/profile/user-11.jpg",
        name: 'Olivia Rhye',
        handle: 'olivia@ui.com',
        progress: 60
    },
    {
        invoice: 'INV-3067',
        status: 'cancelled',
        statuscolor: 'error',
        statusicon: IconX,
        avatar: "/images/profile/user-8.jpg",
        name: 'Barbara Steele',
        handle: 'steele@ui.com',
        progress: 30
    },
    {
        invoice: 'INV-3068',
        status: 'paid',
        statuscolor: 'primary',
        statusicon: IconCheck,
        avatar: "/images/profile/user-3.jpg",
        name: 'Leonard Gordon',
        handle: 'olivia@ui.com',
        progress: 45
    },
    {
        invoice: 'INV-3069',
        status: 'refunded',
        statuscolor: 'secondary',
        statusicon: IconArrowBackUp,
        avatar: "/images/profile/user-4.jpg",
        name: 'Evelyn Pope',
        handle: 'steele@ui.com',
        progress: 37
    },
    {
        invoice: 'INV-3070',
        status: 'cancelled',
        statuscolor: 'error',
        statusicon: IconX,
        avatar: "/images/profile/user-5.jpg",
        name: 'Tommy Garza',
        handle: 'olivia@ui.com',
        progress: 87
    },
    {
        invoice: 'INV-3071',
        status: 'refunded',
        statuscolor: 'secondary',
        statusicon: IconArrowBackUp,
        avatar: '/images/profile/user-12.jpg',
        name: 'Isabel Vasquez',
        handle: 'steele@ui.com',
        progress: 32
    }
];



export { basicTableData, checkboxTableData };
