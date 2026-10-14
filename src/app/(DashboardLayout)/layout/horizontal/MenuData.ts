import { uniqueId } from 'lodash';
import {
  IconPoint,
  IconAlertCircle,
  IconSettings,
} from '@tabler/icons-react';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: "solar:layers-line-duotone",
    href: '',
    children: [
      {
        id: uniqueId(),
        title: " eCommerce",
        icon: 'solar:widget-add-line-duotone',
        href: "/dashboard",
      },
      {
        id: uniqueId(),
        title: "Analytics",
        icon: 'solar:chart-line-duotone',
        href: "/dashboards/analytics",
      },
      {
        id: uniqueId(),
        title: "CRM",
        icon: 'solar:layers-line-duotone',
        href: "/dashboards/crm",
      },
      {
        id: uniqueId(),
        title: "Front Pages",
        icon: "solar:home-angle-linear",
        href: "",
        children: [
          {
            title: "Homepage",
            id: uniqueId(),
            href: "/frontend-pages/homepage",
          },
          {
            title: "About Us",
            id: uniqueId(),
            href: "/frontend-pages/aboutus",
          },
          {
            title: "Blog",
            id: uniqueId(),
            href: "/frontend-pages/blog",
          },
          {
            title: "Blog Details",
            id: uniqueId(),
            href: "/frontend-pages/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow",
          },
          {
            title: "Contact Us",
            id: uniqueId(),
            href: "/frontend-pages/contact",
          },
          {
            title: "Portfolio",
            id: uniqueId(),
            href: "/frontend-pages/portfolio",
          },
          {
            title: "Pricing",
            id: uniqueId(),
            href: "/frontend-pages/pricing",
          },
        ],
      },
      {
        title: "Landingpage",
        icon: "solar:bill-list-line-duotone",
        id: uniqueId(),
        href: "/landingpage",
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Apps',
    icon: 'solar:widget-line-duotone',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: "Contacts",
        icon: 'solar:phone-line-duotone',
        href: "/apps/contacts",
      },
      {
        id: uniqueId(),
        title: "Chats",
        icon: 'solar:chat-round-line-line-duotone',
        href: "/apps/chats",
      },
      {
        id: uniqueId(),
        title: "Notes",
        icon: 'solar:document-text-line-duotone',
        href: "/apps/notes",
      },
      {
        id: uniqueId(),
        title: "Calendar",
        icon: 'solar:calendar-mark-line-duotone',
        href: "/apps/calendar",
      },
      {
        id: uniqueId(),
        title: "Email",
        icon: 'solar:letter-line-duotone',
        href: "/apps/email",
      },
      {
        id: uniqueId(),
        title: "Tickets",
        icon: 'solar:ticker-star-outline',
        href: "/apps/tickets",
      },
      {
        id: uniqueId(),
        title: "Kanban",
        icon: 'solar:notebook-linear',
        href: "/apps/kanban",
      },
      {
        id: uniqueId(),
        title: 'AI',
        icon: 'solar:star-circle-linear',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Chat',
            icon: IconPoint,
            href: '/apps/chat-ai',
          },
          {
            id: uniqueId(),
            title: 'Image',
            icon: IconPoint,
            href: '/apps/image-ai',
          },
          {
            id: uniqueId(),
            title: 'Prompts',
            icon: IconPoint,
            href: '/theme-pages/prompts',
          },
        ]
      },
      {
        id: uniqueId(),
        title: 'User Profile',
        icon: 'solar:shield-user-outline',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Profile',
            icon: IconPoint,
            href: '/apps/user-profile/profile',
          },
          {
            id: uniqueId(),
            title: 'Followers',
            icon: IconPoint,
            href: '/apps/user-profile/followers',
          },
          {
            id: uniqueId(),
            title: 'Friends',
            icon: IconPoint,
            href: '/apps/user-profile/friends',
          },
          {
            id: uniqueId(),
            title: 'Gallery',
            icon: IconPoint,
            href: '/apps/user-profile/gallery',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Ecommerce',
        icon: 'solar:document-text-line-duotone',
        href: '',
        children: [
          {
            id: uniqueId(),
            title: 'Shop',
            icon: IconPoint,
            href: '/apps/ecommerce/shop',
          },
          {
            id: uniqueId(),
            title: 'Detail',
            icon: IconPoint,
            href: '/apps/ecommerce/detail/1',
          },
          {
            id: uniqueId(),
            title: 'List',
            icon: IconPoint,
            href: '/apps/ecommerce/list',
          },
          {
            id: uniqueId(),
            title: 'Checkout',
            icon: IconPoint,
            href: '/apps/ecommerce/checkout',
          },
          {
            id: uniqueId(),
            title: 'Add Product',
            icon: IconPoint,
            href: '/apps/ecommerce/addproduct',
          },
          {
            id: uniqueId(),
            title: 'Edit Product',
            icon: IconPoint,
            href: '/apps/ecommerce/editproduct',
          },
        ],
      },
      {
        title: "Invoice",
        id: uniqueId(),
        icon: "solar:bill-check-outline",
        href: '',
        children: [
          {
            id: uniqueId(),
            title: "List",
            icon: IconPoint,
            href: "/apps/invoice/list",
          },
          {
            id: uniqueId(),
            title: "Details",
            icon: IconPoint,
            href: "/apps/invoice/detail/PineappleInc",
          },
          {
            id: uniqueId(),
            title: "Create",
            icon: IconPoint,
            href: "/apps/invoice/create",
          },
          {
            id: uniqueId(),
            title: "Edit",
            icon: IconPoint,
            href: "/apps/invoice/edit/PineappleInc",
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Blog',
        icon: 'solar:widget-add-line-duotone',
        href: '/apps/blog/',
        children: [
          {
            id: uniqueId(),
            title: 'Posts',
            icon: IconPoint,
            href: '/apps/blog/post',
          },
          {
            id: uniqueId(),
            title: 'Detail',
            icon: IconPoint,
            href: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
          },
        ],
      },
    ],
  },

  {
    id: uniqueId(),
    title: "Headless UI",
    column: 4,
    icon: "solar:text-underline-cross-broken",
    href: "",
    children: [
      {
        title: "Dropdown",
        icon: "solar:round-alt-arrow-down-outline",
        id: uniqueId(),
        href: "/headless-ui/dropdown",
      },
      {
        title: "Disclosure",
        icon: "solar:accumulator-broken",
        id: uniqueId(),
        href: "/headless-ui/disclosure",
      },
      {
        title: "Dialog",
        icon: "solar:smartphone-update-line-duotone",
        id: uniqueId(),
        href: "/headless-ui/dialog",
      },
      {
        title: "Popover",
        icon: "solar:airbuds-case-charge-line-duotone",
        id: uniqueId(),
        href: "/headless-ui/popover",
      },
      {
        title: "Tabs",
        icon: "solar:clapperboard-text-linear",
        id: uniqueId(),
        href: "/headless-ui/tabs",
      },
      {
        title: "Transition",
        icon: "solar:round-transfer-horizontal-line-duotone",
        id: uniqueId(),
        href: "/headless-ui/transition",
      },

      {
        id: uniqueId(),
        title: "Buttons",
        icon: "solar:adhesive-plaster-outline",
        href: "/headless-form/buttons",
      },
      {
        id: uniqueId(),
        title: "Checkbox",
        icon: "solar:check-circle-linear",
        href: "/headless-form/checkbox",
      },
      {
        id: uniqueId(),
        title: "Combobox",
        icon: "solar:archive-down-minimlistic-broken",
        href: "/headless-form/combobox",
      },
      {
        id: uniqueId(),
        title: "Fieldset",
        icon: "solar:password-minimalistic-input-outline",
        href: "/headless-form/fieldset",
      },
      {
        id: uniqueId(),
        title: "Input",
        icon: "solar:text-italic-circle-linear",
        href: "/headless-form/input",
      },
      {
        id: uniqueId(),
        title: "Listbox",
        icon: "solar:list-check-linear",
        href: "/headless-form/listbox",
      },
      {
        id: uniqueId(),
        title: "Radio Group",
        icon: "solar:round-graph-linear",
        href: "/headless-form/radiogroup",
      },
      {
        id: uniqueId(),
        title: "Select",
        icon: "solar:minimize-square-3-outline",
        href: "/headless-form/select",
      },
      {
        id: uniqueId(),
        title: "Switch",
        icon: "solar:branching-paths-down-outline",
        href: "/headless-form/switch",
      },
      {
        id: uniqueId(),
        title: "Textarea",
        icon: "solar:text-square-2-linear",
        href: "/headless-form/textarea",
      },
    ],
  },

  {
    id: uniqueId(),
    title: "Shadcn UI",
    column: 4,
    icon: "solar:command-broken",
    href: "/shadcn/",
    children: [
      {
        title: "Accordion",
        icon: "solar:round-alt-arrow-down-outline",
        id: uniqueId(),
        href: "/shadcn-ui/accordion",
      },
      {
        id: uniqueId(),
        title: "Badge",
        icon: "solar:tag-horizontal-line-duotone",
        href: "/shadcn-ui/badge",
      },
      {
        id: uniqueId(),
        title: "Button",
        icon: "solar:airbuds-case-minimalistic-line-duotone",
        href: "/shadcn-ui/buttons",
      },
      {
        id: uniqueId(),
        title: "Dropdowns",
        icon: "solar:airbuds-case-line-duotone",
        href: "/shadcn-ui/dropdown",
      },
      {
        id: uniqueId(),
        title: "Dialogs",
        icon: "solar:bolt-line-duotone",
        href: "/shadcn-ui/dialogs",
      },
      {
        id: uniqueId(),
        title: "Tab",
        icon: "solar:box-minimalistic-line-duotone",
        href: "/shadcn-ui/tab",
      },
      {
        id: uniqueId(),
        title: "Tooltip",
        icon: "solar:feed-line-duotone",
        href: "/shadcn-ui/tooltip",
      },
      {
        id: uniqueId(),
        title: "Alert",
        icon: "solar:flag-line-duotone",
        href: "/shadcn-ui/alert",
      },
      {
        id: uniqueId(),
        title: "Progressbar",
        icon: "solar:programming-line-duotone",
        href: "/shadcn-ui/progressbar",
      },
      {
        id: uniqueId(),
        title: "Breadcrumbs",
        icon: "solar:slider-minimalistic-horizontal-line-duotone",
        href: "/shadcn-ui/breadcrumb",
      },
      {
        id: uniqueId(),
        title: "Drawer",
        icon: "solar:laptop-minimalistic-line-duotone",
        href: "/shadcn-ui/drawer",
      },
      {
        id: uniqueId(),
        title: "Carousel",
        icon: "solar:align-horizonta-spacing-line-duotone",
        href: "/shadcn-ui/carousel",
      },
      {
        id: uniqueId(),
        title: "Skeleton",
        icon: "solar:soundwave-bold-duotone",
        href: "/shadcn-ui/skeleton",
      },
      {
        id: uniqueId(),
        title: "Avatar",
        icon: "solar:user-line-duotone",
        href: "/shadcn-ui/avatar",
      },
      {
        id: uniqueId(),
        title: "Card",
        icon: "solar:card-line-duotone",
        href: "/shadcn-ui/card",
      },
      {
        id: uniqueId(),
        title: "Datepicker",
        icon: "solar:calendar-search-linear",
        href: "/shadcn-ui/datepicker",
      },
      {
        id: uniqueId(),
        title: "Combobox",
        icon: "solar:wad-of-money-outline",
        href: "/shadcn-ui/combobox",
      },
      {
        id: uniqueId(),
        title: "Collapsible",
        icon: "solar:list-up-minimalistic-bold-duotone",
        href: "/shadcn-ui/collapsible",
      },
      {
        id: uniqueId(),
        title: "Command",
        icon: "solar:command-outline",
        href: "/shadcn-ui/command",
      },
      {
        id: uniqueId(),
        title: "Toast",
        icon: "solar:notification-unread-broken",
        href: "/shadcn-ui/toast",
      },
      {
        id: uniqueId(),
        title: "Input",
        icon: "solar:text-circle-linear",
        href: "/shadcn-form/input",
      },
      {
        id: uniqueId(),
        title: "Select",
        icon: "solar:round-alt-arrow-down-outline",
        href: "/shadcn-form/select",
      },
      {
        id: uniqueId(),
        title: "Checkbox",
        icon: "solar:shield-check-linear",
        href: "/shadcn-form/checkbox",
      },
      {
        id: uniqueId(),
        title: "Radio",
        icon: "solar:record-linear",
        href: "/shadcn-form/radio",
      },
    ],
  },

  {
    id: uniqueId(),
    title: 'Pages',
    icon: 'solar:book-outline',
    href: '',
    children: [
      {
        title: "Account Setting",
        icon: "solar:settings-minimalistic-line-duotone",
        id: uniqueId(),
        href: "/theme-pages/account-settings",
      },
      {
        title: "FAQ",
        icon: "solar:question-circle-line-duotone",
        id: uniqueId(),
        href: "/theme-pages/faq",
      },
      {
        title: "Pricing",
        icon: "solar:dollar-minimalistic-linear",
        id: uniqueId(),
        href: "/theme-pages/pricing",
      },

      {
        title: "Roll Base Access",
        icon: "solar:accessibility-broken",
        id: uniqueId(),
        href: "/theme-pages/casl",
      },
      {
        title: "Integrations",
        icon: "solar:home-add-linear",
        id: uniqueId(),
        href: "/theme-pages/inetegration",
      }, {
        title: "API Keys",
        icon: "solar:key-linear",
        id: uniqueId(),
        href: "/theme-pages/apikey",
      },
      {
        title: "Solar Icons",
        icon: "solar:sticker-smile-circle-outline",
        id: uniqueId(),
        href: "/icons/solar",
      },
      {
        id: uniqueId(),
        title: 'Widgets',
        icon: 'solar:adhesive-plaster-outline',
        href: '/widgets/cards',
        children: [
          {
            id: uniqueId(),
            title: 'Cards',
            icon: IconPoint,
            href: '/widgets/cards',
          },
          {
            id: uniqueId(),
            title: 'Banners',
            icon: IconPoint,
            href: '/widgets/banners',
          },
          {
            id: uniqueId(),
            title: 'Charts',
            icon: IconPoint,
            href: '/widgets/charts',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Auth',
        icon: 'solar:lock-password-linear',
        href: '/400',
        children: [
          {
            id: uniqueId(),
            title: 'Error',
            icon: IconAlertCircle,
            href: '/400',
          },
          {
            id: uniqueId(),
            title: 'Maintenance',
            icon: IconSettings,
            href: '/auth/maintenance',
          },
          {
            id: uniqueId(),
            title: 'Login',
            icon: 'solar:key-square-line-duotone',
            href: '/auth/auth1/login',
            children: [
              {
                id: uniqueId(),
                title: 'Side Login',
                icon: IconPoint,
                href: '/auth/auth1/login',
              },
              {
                id: uniqueId(),
                title: 'Boxed Login',
                icon: IconPoint,
                href: '/auth/auth2/login',
              },
            ],
          },
          {
            id: uniqueId(),
            title: 'Register',
            icon: 'solar:user-check-rounded-broken',
            href: '/auth/auth1/register',
            children: [
              {
                id: uniqueId(),
                title: 'Side Register',
                icon: IconPoint,
                href: '/auth/auth1/register',
              },
              {
                id: uniqueId(),
                title: 'Boxed Register',
                icon: IconPoint,
                href: '/auth/auth2/register',
              },
            ],
          },
          {
            id: uniqueId(),
            title: 'Forgot Password',
            icon: 'solar:shield-cross-broken',
            href: '/auth/auth1/forgot-password',
            children: [
              {
                id: uniqueId(),
                title: 'Side Forgot Password',
                icon: IconPoint,
                href: '/auth/auth1/forgot-password',
              },
              {
                id: uniqueId(),
                title: 'Boxed Forgot Password',
                icon: IconPoint,
                href: '/auth/auth2/forgot-password',
              },
            ],
          },
          {
            id: uniqueId(),
            title: 'Two Steps',
            icon: 'solar:password-minimalistic-input-outline',
            href: '/auth/auth1/two-steps',
            children: [
              {
                id: uniqueId(),
                title: 'Side Two Steps',
                icon: IconPoint,
                href: '/auth/auth1/two-steps',
              },
              {
                id: uniqueId(),
                title: 'Boxed Two Steps',
                icon: IconPoint,
                href: '/auth/auth2/two-steps',
              },
            ],
          },
        ],
      },
      {
        id: uniqueId(),
        title: "Charts",
        icon: "solar:chart-2-outline",
        href: "",
        children: [
          {
            title: "Line Chart",
            icon: "solar:chart-square-line-duotone",
            id: uniqueId(),
            href: "/charts/line",
          },
          {
            title: "Area Chart",
            icon: "solar:graph-new-broken",
            id: uniqueId(),
            href: "/charts/area",
          },
          {
            title: "Gradient Chart",
            icon: "solar:round-graph-outline",
            id: uniqueId(),
            href: "/charts/gradient",
          },
          {
            title: "Candlestick",
            icon: "solar:chandelier-outline",
            id: uniqueId(),
            href: "/charts/candlestick",
          },
          {
            title: "Column",
            icon: "solar:chart-2-bold-duotone",
            id: uniqueId(),
            href: "/charts/column",
          },
          {
            title: "Doughnut & Pie",
            icon: "solar:pie-chart-2-linear",
            id: uniqueId(),
            href: "/charts/doughnut",
          },
          {
            title: "Radialbar & Radar",
            icon: "solar:graph-line-duotone",
            id: uniqueId(),
            href: "/charts/radialbar",
          },
        ],
      },

    ],
  },





  {
    id: uniqueId(),
    title: 'Tables',
    icon: 'solar:tuning-square-2-line-duotone',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: "Shadcn Tables",
        icon: "solar:command-line-duotone",
        href: "",
        children: [
          {
            id: uniqueId(),
            title: "Basic",
            href: "/shadcn-tables/basic",
          },
          {
            id: uniqueId(),
            title: "Striped Row Table",
            href: "/shadcn-tables/striped-row",
          },
          {
            id: uniqueId(),
            title: "Hover Table",
            href: "/shadcn-tables/hover-table",
          },
          {
            id: uniqueId(),
            title: "Chechbox Table",
            href: "/shadcn-tables/checkbox-table",
          },


        ],
      },
      {
        id: uniqueId(),
        title: "React Tables",
        icon: "solar:calendar-add-broken",
        href: "",
        children: [
          {
            id: uniqueId(),
            title: "Basic",
            href: "/react-tables/basic",
          },
          {
            id: uniqueId(),
            title: "Dense",
            href: "/react-tables/dense",
          },
          {
            id: uniqueId(),
            title: "Sorting",
            href: "/react-tables/sorting",
          },
          {
            id: uniqueId(),
            title: "Filtering",
            href: "/react-tables/filtering",
          },
          {
            id: uniqueId(),
            title: "Pagination",
            href: "/react-tables/pagination",
          },
          {
            id: uniqueId(),
            title: "Row Selection",
            href: "/react-tables/row-selection",
          },
          {
            id: uniqueId(),
            title: "Column Visibility",
            href: "/react-tables/columnvisibility",
          },
          {
            id: uniqueId(),
            title: "Editable",
            href: "/react-tables/editable",
          },
          {
            id: uniqueId(),
            title: "Sticky",
            href: "/react-tables/sticky",
          },
          {
            id: uniqueId(),
            title: "Drag & Drop",
            href: "/react-tables/drag-drop",
          },
          {
            id: uniqueId(),
            title: "Empty",
            href: "/react-tables/empty",
          },
          {
            id: uniqueId(),
            title: "Expanding",
            href: "/react-tables/expanding",
          },

        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Charts',
    icon: 'solar:chart-square-line-duotone',
    href: '',
    children: [
      {
        id: uniqueId(),
        title: "Apex Charts",
        icon: "solar:graph-new-broken",
        href: "",
        children: [
          {
            title: "Line Chart",

            id: uniqueId(),
            href: "/charts/line",
          },
          {
            title: "Area Chart",

            id: uniqueId(),
            href: "/charts/area",
          },
          {
            title: "Gradient Chart",

            id: uniqueId(),
            href: "/charts/gradient",
          },
          {
            title: "Candlestick",

            id: uniqueId(),
            href: "/charts/candlestick",
          },
          {
            title: "Column",
            icon: "solar:chart-2-bold-duotone",
            id: uniqueId(),
            href: "/charts/column",
          },
          {
            title: "Doughnut & Pie",

            id: uniqueId(),
            href: "/charts/doughnut",
          },
          {
            title: "Radialbar & Radar",

            id: uniqueId(),
            href: "/charts/radialbar",
          },

        ],
      },
      {
        id: uniqueId(),
        title: "Shadcn Charts",
        icon: "solar:chart-2-linear",
        href: "",
        children: [
          {
            id: uniqueId(),
            title: "Line Chart",
            href: "/shadcn-charts/line",


          },
          {
            id: uniqueId(),
            title: "Area Chart",
            href: "/shadcn-charts/area",

          },

          {
            id: uniqueId(),
            title: "Radar",
            href: "/shadcn-charts/radar",


          },
          {
            id: uniqueId(),
            title: "Bar",
            href: "/shadcn-charts/bar",


          },
          {
            id: uniqueId(),
            title: "Doughnut & Pie",
            href: "/shadcn-charts/pie",


          },
          {
            id: uniqueId(),
            title: "Radialbar & Radar",
            href: "/shadcn-charts/radial",

          },

        ],
      },
    ],
  },
];
export default Menuitems;
