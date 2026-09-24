export interface ChildItem {
  disabled?: any;
  badge?: boolean;
  badgeType?: string;
  badgeContent?: string;
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    id: 1,
    name: "Dashboard",
    items: [
      {
        heading: "Dashboards",
        children: [
          {
            name: "Home",
            icon: "solar:home-2-line-duotone",
            id: uniqueId(),
            url: "/",
          },
          {
            name: "Overview",
            icon: "solar:widget-add-line-duotone",
            id: uniqueId(),
            url: "/dashboard",
          },
          {
            name: "Campaigns",
            icon: "solar:flag-2-line-duotone",
            id: uniqueId(),
            url: "/dashboard/campaigns",
          },
          {
            name: "Donations",
            icon: "solar:hand-money-line-duotone",
            id: uniqueId(),
            url: "/dashboard/donations",
          },
          {
            name: "Donors",
            icon: "solar:users-group-rounded-line-duotone",
            id: uniqueId(),
            url: "/dashboard/donors",
          },
          {
            name: "Fundraisers",
            icon: "solar:user-heart-rounded-line-duotone",
            id: uniqueId(),
            url: "/dashboard/fundraisers",
          },
          {
            name: "Analytics",
            icon: "solar:chart-line-duotone",
            id: uniqueId(),
            url: "/dashboards/analytics",
          },
          {
            name: "CRM",
            icon: "solar:layers-line-duotone",
            id: uniqueId(),
            url: "/dashboards/crm",
          },


        ],
      },
      {
        heading: "Front End Pages",
        children: [
          {
            name: "Homepage",
            id: uniqueId(),
            url: "/frontend-pages/homepage",
            icon: "solar:home-smile-line-duotone"
          },
          {
            name: "About Us",
            id: uniqueId(),
            url: "/frontend-pages/aboutus",
            icon: "solar:info-circle-line-duotone"
          },
          {
            name: "Blog",
            id: uniqueId(),
            url: "/frontend-pages/blog",
            icon: "solar:document-line-duotone"
          },
          {
            name: "Blog Details",
            id: uniqueId(),
            url: "/frontend-pages/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow",
            icon: "solar:notebook-square-line-duotone"
          },
          {
            name: "Contact Us",
            id: uniqueId(),
            url: "/frontend-pages/contact",
            icon: "solar:mailbox-line-duotone"

          },
          {
            name: "Portfolio",
            id: uniqueId(),
            url: "/frontend-pages/portfolio",
            icon: "solar:gallery-minimalistic-line-duotone"

          },
          {
            name: "Pricing",
            id: uniqueId(),
            url: "/frontend-pages/pricing",
            icon: "solar:dollar-minimalistic-line-duotone"

          },



        ]
      },
      {
        heading: "Landing Page",
        children: [
          {
            name: "Landingpage",
            icon: "solar:bill-list-line-duotone",
            id: uniqueId(),
            url: "/landingpage",
          },
        ]
      }


    ],
  },




  {
    id: 11,
    name: "Apps",
    items: [

      {
        heading: "Apps",
        children: [
          {
            name: "AI",
            icon: "solar:star-circle-linear",
            id: uniqueId(),
            children: [
              {
                id: uniqueId(),
                name: "Chat",
                url: "/apps/chat-ai",

              },
              {
                id: uniqueId(),
                name: "Image ",
                url: "/apps/image-ai",

              },
              {
                id: uniqueId(),
                name: "Prompts ",
                url: "/theme-pages/prompts",
                badge: true,
                badgeType: 'filled',
                badgeContent: 'New',
              },
            ],
          },
          {
            name: "Ecommerce",
            id: uniqueId(),
            icon: "solar:cart-3-line-duotone",
            children: [
              {
                id: uniqueId(),
                name: "Shop",
                url: "/apps/ecommerce/shop",
              },
              {
                id: uniqueId(),
                name: "Details",
                url: "/apps/ecommerce/detail/1",
              },
              {
                id: uniqueId(),
                name: "List",
                url: "/apps/ecommerce/list",
              },
              {
                id: uniqueId(),
                name: "Checkout",
                url: "/apps/ecommerce/checkout",
              },
              {
                id: uniqueId(),
                name: "Add Product",
                url: "/apps/ecommerce/addproduct",
              },
              {
                id: uniqueId(),
                name: "Edit Product",
                url: "/apps/ecommerce/editproduct",
              },
            ],
          },
          {
            id: uniqueId(),
            name: "Contacts",
            icon: "solar:phone-line-duotone",
            url: "/apps/contacts",
          },

          {
            name: "Blogs",
            id: uniqueId(),
            icon: "solar:widget-add-line-duotone",
            children: [
              {
                id: uniqueId(),
                name: "Blog Post",
                url: "/apps/blog/post",
              },
              {
                id: uniqueId(),
                name: "Blog Detail",
                url: "/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow",
              },
              {
                id: uniqueId(),
                name: "Blog Edit",
                url: "/apps/blog/edit",
              },
              {
                id: uniqueId(),
                name: "Blog Create",
                url: "/apps/blog/create",
              },
              {
                id: uniqueId(),
                name: "Manage Blog",
                url: "/apps/blog/manage-blog",
              },
            ],
          },
          {
            id: uniqueId(),
            name: "Chats",
            icon: "solar:chat-round-line-line-duotone",
            url: "/apps/chats",
          },
          {
            name: "User Profile",
            id: uniqueId(),
            icon: "solar:shield-user-outline",
            children: [
              {
                id: uniqueId(),
                name: "Profile",
                url: "/apps/user-profile/profile",
              },
              {
                id: uniqueId(),
                name: "Followers",
                url: "/apps/user-profile/followers",
              },
              {
                id: uniqueId(),
                name: "Friends",
                url: "/apps/user-profile/friends",
              },
              {
                id: uniqueId(),
                name: "Gallery",
                url: "/apps/user-profile/gallery",
              },
            ],
          },

          {
            name: "Invoice",
            id: uniqueId(),
            icon: "solar:bill-check-outline",
            children: [
              {
                id: uniqueId(),
                name: "List",
                url: "/apps/invoice/list",
              },
              {
                id: uniqueId(),
                name: "Details",
                url: "/apps/invoice/detail/PineappleInc",
              },
              {
                id: uniqueId(),
                name: "Create",
                url: "/apps/invoice/create",
              },
              {
                id: uniqueId(),
                name: "Edit",
                url: "/apps/invoice/edit/PineappleInc",
              },
            ],
          },

          {
            id: uniqueId(),
            name: "Notes",
            icon: "solar:document-text-outline",
            url: "/apps/notes",
          },
          {
            id: uniqueId(),
            name: "Calendar",
            icon: "solar:calendar-mark-line-duotone",
            url: "/apps/calendar",
          },
          {
            id: uniqueId(),
            name: "Email",
            icon: "solar:letter-linear",
            url: "/apps/email",
          },
          {
            id: uniqueId(),
            name: "Tickets",
            icon: "solar:ticker-star-outline",
            url: "/apps/tickets",
          },
          {
            id: uniqueId(),
            name: "Kanban",
            icon: "solar:notebook-linear",
            url: "/apps/kanban",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    name: "Pages",
    items: [
      {
        heading: "Pages",
        children: [
          {
            name: "Account Setting",
            icon: "solar:settings-minimalistic-line-duotone",
            id: uniqueId(),
            url: "/theme-pages/account-settings",
          },
          {
            name: "FAQ",
            icon: "solar:question-circle-line-duotone",
            id: uniqueId(),
            url: "/theme-pages/faq",
          },
          {
            name: "Pricing",
            icon: "solar:dollar-minimalistic-linear",
            id: uniqueId(),
            url: "/theme-pages/pricing",
          },

          {
            name: "Roll Base Access",
            icon: "solar:accessibility-broken",
            id: uniqueId(),
            url: "/theme-pages/casl",
          },
          {
            id: uniqueId(),
            name: "Integrations",
            icon: "solar:home-add-linear",
            url: "/theme-pages/inetegration",
            badge: true,
            badgeType: 'filled',
            badgeContent: 'New',
          },
          {
            id: uniqueId(),
            name: "API Keys",
            icon: "solar:key-linear",
            url: "/theme-pages/apikey",
            badge: true,
            badgeType: 'filled',
            badgeContent: 'New',
          },
        ],
      },
      {
        heading: "Widgets",
        children: [
          {
            id: uniqueId(),
            name: "Cards",
            icon: "solar:cardholder-line-duotone",
            url: "/widgets/cards",
          },
          {
            id: uniqueId(),
            name: "Banners",
            icon: "solar:align-vertical-spacing-line-duotone",
            url: "/widgets/banners",
          },
          {
            id: uniqueId(),
            name: "Charts",
            icon: "solar:chart-square-line-duotone",
            url: "/widgets/charts",
          },
        ],
      },
      {
        heading: "Icons",
        children: [
          {
            id: uniqueId(),
            name: "Solar Icons",
            icon: "solar:sticker-smile-circle-outline",
            url: "/icons/solar",
          },

        ],
      },
    ],
  },


  {
    id: 4,
    name: "Tables",
    items: [

      {
        heading: "React Tables",
        children: [

          {
            id: uniqueId(),
            name: "Order Table",
            icon: "solar:round-transfer-vertical-broken",

            url: "/react-tables/order-datatable",
          }, {
            id: uniqueId(),
            name: "Customers",
            icon: "solar:round-transfer-vertical-broken",

            url: "/react-tables/user-datatable",
          },
          {
            id: uniqueId(),
            name: "Basic",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/basic",
          },
          {
            id: uniqueId(),
            name: "Dense",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/dense",
          },
          {
            id: uniqueId(),
            name: "Sorting",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/sorting",
          },
          {
            id: uniqueId(),
            name: "Filtering",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/filtering",
          },
          {
            id: uniqueId(),
            name: "Pagination",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/pagination",
          },
          {
            id: uniqueId(),
            name: "Row Selection",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/row-selection",
          },
          {
            id: uniqueId(),
            name: "Column Visibility",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/columnvisibility",
          },
          {
            id: uniqueId(),
            name: "Editable",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/editable",
          },
          {
            id: uniqueId(),
            name: "Sticky",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/sticky",
          },
          {
            id: uniqueId(),
            name: "Drag & Drop",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/drag-drop",
          },
          {
            id: uniqueId(),
            name: "Empty",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/empty",
          },
          {
            id: uniqueId(),
            name: "Expanding",
            icon: "solar:round-transfer-vertical-broken",
            url: "/react-tables/expanding",
          },
        ],
      },
      {
        heading: "Shadcn Table",
        children: [
          {
            id: uniqueId(),
            name: "Basic",
            icon: "solar:command-line-duotone",
            url: "/shadcn-tables/basic",
          },

          {
            id: uniqueId(),
            name: "Striped Row Table",
            icon: "solar:command-line-duotone",
            url: "/shadcn-tables/striped-row",
          },

          {
            id: uniqueId(),
            name: "Hover  Table",
            icon: "solar:command-line-duotone",
            url: "/shadcn-tables/hover-table",
          },
          {
            id: uniqueId(),
            name: "Checkbox Table",
            icon: "solar:command-line-duotone",
            url: "/shadcn-tables/checkbox-table",
          },
        ],
      },
    ],
  },

  {
    id: 5,
    name: "Charts",
    items: [
      {
        heading: "Apex Charts",
        children: [
          {
            name: "Line Chart",
            icon: "solar:chart-square-line-duotone",
            id: uniqueId(),
            url: "/charts/line",
          },
          {
            name: "Area Chart",
            icon: "solar:graph-new-broken",
            id: uniqueId(),
            url: "/charts/area",
          },
          {
            name: "Gradient Chart",
            icon: "solar:round-graph-outline",
            id: uniqueId(),
            url: "/charts/gradient",
          },
          {
            name: "Candlestick",
            icon: "solar:chandelier-outline",
            id: uniqueId(),
            url: "/charts/candlestick",
          },
          {
            name: "Column",
            icon: "solar:chart-2-bold-duotone",
            id: uniqueId(),
            url: "/charts/column",
          },
          {
            name: "Doughnut & Pie",
            icon: "solar:pie-chart-2-linear",
            id: uniqueId(),
            url: "/charts/doughnut",
          },
          {
            name: "Radialbar & Radar",
            icon: "solar:graph-line-duotone",
            id: uniqueId(),
            url: "/charts/radialbar",
          },
        ],
      },
      {
        heading: "Shadcn Charts",

        icon: "solar:chart-2-linear",
        children: [
          {
            id: uniqueId(),
            name: "Line Chart",
            url: "/shadcn-charts/line",
            icon: "solar:chart-square-line-duotone",

          },
          {
            id: uniqueId(),
            name: "Area Chart",
            url: "/shadcn-charts/area",
            icon: "solar:graph-new-broken",

          },

          {
            id: uniqueId(),
            name: "Radar",
            url: "/shadcn-charts/radar",
            icon: "solar:round-graph-outline",

          },
          {
            id: uniqueId(),
            name: "Bar",
            url: "/shadcn-charts/bar",
            icon: "solar:chandelier-outline",

          },
          {
            id: uniqueId(),
            name: "Doughnut & Pie",
            url: "/shadcn-charts/pie",
            icon: "solar:pie-chart-2-linear",

          },
          {
            id: uniqueId(),
            name: "Radialbar & Radar",
            url: "/shadcn-charts/radial",
            icon: "solar:graph-line-duotone",
          },
        ],
      },
    ],
  },

  {
    id: 6,
    name: "Forms",
    items: [
      {
        heading: "Forms",
        children: [
          {
            id: uniqueId(),
            name: "Forms Elements",
            icon: "solar:text-selection-line-duotone",
            url: "/forms/form-elements",
          },
          {
            id: uniqueId(),
            name: "Forms Layouts",
            icon: "solar:document-text-outline",
            url: "/forms/form-layouts",
          },
          {
            id: uniqueId(),
            name: "Forms Horizontal",
            icon: "solar:slider-horizontal-line-duotone",
            url: "/forms/form-horizontal",
          },
          {
            id: uniqueId(),
            name: "Forms Vertical",
            icon: "solar:slider-vertical-line-duotone",
            url: "/forms/form-vertical",
          },
          {
            id: uniqueId(),
            name: "Forms Custom",
            icon: "solar:document-text-outline",
            url: "/forms/form-custom",
          },
          {
            id: uniqueId(),
            name: "Form Validation",
            icon: "solar:bill-check-linear",
            url: "/forms/form-validation",
          },
          {
            id: uniqueId(),
            name: "Form Example",
            icon: "solar:document-text-outline",
            url: "/forms/form-example",
          },
          {
            id: uniqueId(),
            name: "Form Repeater",
            icon: "solar:slider-horizontal-line-duotone",

            url: "/forms/form-repeater",
          }, {
            id: uniqueId(),
            name: "Form Wizard",
            icon: "solar:text-selection-line-duotone",
            url: "/forms/form-wizard",
          },
          {
            id: uniqueId(),
            name: "Form Addons",
            icon: "solar:file-favourite-linear",

            children: [
              {
                id: uniqueId(),
                name: "Select2",
                url: "/forms/form-select2",
              },
              {
                id: uniqueId(),
                name: "Autocomplete",
                url: "/forms/form-autocomplete",
              },
              {
                id: uniqueId(),
                name: "Dropzone",
                url: "/forms/form-dropzone",
              },
            ],
          },
        ],
      },
      {
        heading: "Shadcn Form UI",
        children: [

          {
            id: uniqueId(),
            name: "Badge",
            icon: "solar:tag-horizontal-line-duotone",
            url: "/shadcn-ui/badge",
          },
          {
            id: uniqueId(),
            name: "Button",
            icon: "solar:airbuds-case-minimalistic-line-duotone",
            url: "/shadcn-ui/buttons",
          },
          {
            id: uniqueId(),
            name: "Avatar",
            icon: "solar:user-line-duotone",
            url: "/shadcn-ui/avatar",
          },
          {
            id: uniqueId(),
            name: "Input",
            icon: "solar:text-circle-linear",
            url: "/shadcn-form/input",
          },
          {
            id: uniqueId(),
            name: "Select",
            icon: "solar:round-alt-arrow-down-outline",
            url: "/shadcn-form/select",
          },
          {
            id: uniqueId(),
            name: "Checkbox",
            icon: "solar:shield-check-linear",
            url: "/shadcn-form/checkbox",
          },
          {
            id: uniqueId(),
            name: "Radio",
            icon: "solar:record-linear",
            url: "/shadcn-form/radio",
          },
        ]
      },
    ],
  },

  {
    id: 7,
    name: "Ui ",
    items: [
      {
        heading: "Shadcn Ui",
        children: [
          {
            id: uniqueId(),
            name: "Badge",
            icon: "solar:tag-horizontal-line-duotone",
            url: "/shadcn-ui/badge",
          },
          {
            id: uniqueId(),
            name: "Button",
            icon: "solar:airbuds-case-minimalistic-line-duotone",
            url: "/shadcn-ui/buttons",
          },
          {
            id: uniqueId(),
            name: "Dropdowns",
            icon: "solar:airbuds-case-line-duotone",
            url: "/shadcn-ui/dropdown",
          },
          {
            id: uniqueId(),
            name: "Dialogs",
            icon: "solar:bolt-line-duotone",
            url: "/shadcn-ui/dialogs",
          },
          {
            id: uniqueId(),
            name: "Alert",
            icon: "solar:flag-line-duotone",
            url: "/shadcn-ui/alert",
          },

          {
            id: uniqueId(),
            name: "Breadcrumbs",
            icon: "solar:slider-minimalistic-horizontal-line-duotone",
            url: "/shadcn-ui/breadcrumb",
          },

          {
            id: uniqueId(),
            name: "Carousel",
            icon: "solar:align-horizonta-spacing-line-duotone",
            url: "/shadcn-ui/carousel",
          },

          {
            id: uniqueId(),
            name: "Card",
            icon: "solar:card-line-duotone",
            url: "/shadcn-ui/card",
          },
          {
            id: uniqueId(),
            name: "Datepicker",
            icon: "solar:calendar-search-linear",
            url: "/shadcn-ui/datepicker",
          },
          {
            id: uniqueId(),
            name: "Combobox",
            icon: "solar:wad-of-money-outline",
            url: "/shadcn-ui/combobox",
          },
          {
            id: uniqueId(),
            name: "Collapsible",
            icon: "solar:list-up-minimalistic-bold-duotone",
            url: "/shadcn-ui/collapsible",
          },
          {
            id: uniqueId(),
            name: "Command",
            icon: "solar:command-outline",
            url: "/shadcn-ui/command",
          },
          {
            id: uniqueId(),
            name: "Skeleton",
            icon: "solar:soundwave-bold-duotone",
            url: "/shadcn-ui/skeleton",
          },
          {
            id: uniqueId(),
            name: "Avatar",
            icon: "solar:user-line-duotone",
            url: "/shadcn-ui/avatar",
          },

          {
            id: uniqueId(),
            name: "Tooltip",
            icon: "solar:feed-line-duotone",
            url: "/shadcn-ui/tooltip",
          },
          {
            name: "Accordion",
            icon: "solar:round-alt-arrow-down-outline",
            id: uniqueId(),
            url: "/shadcn-ui/accordion",
          },
          {
            id: uniqueId(),
            name: "Tab",
            icon: "solar:box-minimalistic-line-duotone",
            url: "/shadcn-ui/tab",
          },
          {
            id: uniqueId(),
            name: "Progressbar",
            icon: "solar:programming-line-duotone",
            url: "/shadcn-ui/progressbar",
          },
          {
            id: uniqueId(),
            name: "Drawer",
            icon: "solar:laptop-minimalistic-line-duotone",
            url: "/shadcn-ui/drawer",
          },
        ],
      },

    ],
  },

  {
    id: 8,
    name: "Headless",
    items: [
      {
        heading: "Headless Ui Elements",
        children: [
          {
            name: "Dropdown",
            icon: "solar:round-alt-arrow-down-outline",
            id: uniqueId(),
            url: "/headless-ui/dropdown",
          },
          {
            name: "Disclosure",
            icon: "solar:accumulator-broken",
            id: uniqueId(),
            url: "/headless-ui/disclosure",
          },
          {
            name: "Dialog",
            icon: "solar:smartphone-update-line-duotone",
            id: uniqueId(),
            url: "/headless-ui/dialog",
          },
          {
            name: "Popover",
            icon: "solar:airbuds-case-charge-line-duotone",
            id: uniqueId(),
            url: "/headless-ui/popover",
          },
          {
            name: "Tabs",
            icon: "solar:clapperboard-text-linear",
            id: uniqueId(),
            url: "/headless-ui/tabs",
          },
          {
            name: "Transition",
            icon: "solar:round-transfer-horizontal-line-duotone",
            id: uniqueId(),
            url: "/headless-ui/transition",
          },
        ],
      },
      {
        heading: "Headless Form Elements",
        children: [
          {
            id: uniqueId(),
            name: "Buttons",
            icon: "solar:adhesive-plaster-outline",
            url: "/headless-form/buttons",
          },
          {
            id: uniqueId(),
            name: "Checkbox",
            icon: "solar:check-circle-linear",
            url: "/headless-form/checkbox",
          },
          {
            id: uniqueId(),
            name: "Combobox",
            icon: "solar:archive-down-minimlistic-broken",
            url: "/headless-form/combobox",
          },
          {
            id: uniqueId(),
            name: "Fieldset",
            icon: "solar:password-minimalistic-input-outline",
            url: "/headless-form/fieldset",
          },
          {
            id: uniqueId(),
            name: "Input",
            icon: "solar:text-italic-circle-linear",
            url: "/headless-form/input",
          },
          {
            id: uniqueId(),
            name: "Listbox",
            icon: "solar:list-check-linear",
            url: "/headless-form/listbox",
          },
          {
            id: uniqueId(),
            name: "Radio Group",
            icon: "solar:round-graph-linear",
            url: "/headless-form/radiogroup",
          },
          {
            id: uniqueId(),
            name: "Select",
            icon: "solar:minimize-square-3-outline",
            url: "/headless-form/select",
          },
          {
            id: uniqueId(),
            name: "Switch",
            icon: "solar:branching-paths-down-outline",
            url: "/headless-form/switch",
          },
          {
            id: uniqueId(),
            name: "Textarea",
            icon: "solar:text-square-2-linear",
            url: "/headless-form/textarea",
          },
        ],
      },
    ],
  },

  {
    id: 9,
    name: "Auth",
    items: [
      {
        heading: "Auth",
        children: [
          {
            name: "Error",
            icon: "solar:bug-minimalistic-line-duotone",
            id: uniqueId(),
            url: "/auth/error",
          },
          {
            name: "Side Login",
            icon: "solar:login-3-line-duotone",
            id: uniqueId(),
            url: "/auth/auth1/login",
          },
          {
            name: "Boxed Login",
            icon: "solar:login-3-line-duotone",
            id: uniqueId(),
            url: "/auth/auth2/login",
          },
          {
            name: "Side Register",
            icon: "solar:user-plus-rounded-line-duotone",
            id: uniqueId(),
            url: "/auth/auth1/register",
          },
          {
            name: "Boxed Register",
            icon: "solar:user-plus-rounded-line-duotone",
            id: uniqueId(),
            url: "/auth/auth2/register",
          },
          {
            name: "Side Forgot Pwd",
            icon: "solar:password-outline",
            id: uniqueId(),
            url: "/auth/auth1/forgot-password",
          },
          {
            name: "Boxed Forgot Pwd",
            icon: "solar:password-outline",
            id: uniqueId(),
            url: "/auth/auth2/forgot-password",
          },
          {
            name: "Side Two Steps",
            icon: "solar:password-outline",
            id: uniqueId(),
            url: "/auth/auth1/two-steps",
          },
          {
            name: "Boxed Two Steps",
            icon: "solar:password-outline",
            id: uniqueId(),
            url: "/auth/auth2/two-steps",
          },
          {
            name: "Maintenance",
            icon: "solar:settings-outline",
            id: uniqueId(),
            url: "/auth/maintenance",
          },
        ],
      },
    ],
  },

  {
    id: 10,
    name: "Menu",
    items: [
      {
        heading: "Multi level",
        children: [
          {
            name: "Menu Level",
            icon: "solar:widget-add-line-duotone",
            id: uniqueId(),
            children: [
              {
                id: uniqueId(),
                name: "Level 1",
                url: "",
              },
              {
                id: uniqueId(),
                name: "Level 1.1",
                icon: "fad:armrecording",
                url: "",
                children: [
                  {
                    id: uniqueId(),
                    name: "Level 2",
                    url: "",
                  },
                  {
                    id: uniqueId(),
                    name: "Level 2.1",
                    icon: "fad:armrecording",
                    url: "",
                    children: [
                      {
                        id: uniqueId(),
                        name: "Level 3",
                        url: "",
                      },
                      {
                        id: uniqueId(),
                        name: "Level 3.1",
                        url: "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "More Options",
        children: [
          {
            id: uniqueId(),
            url: "/sample-page",
            name: "Applications",
            icon: "solar:check-circle-bold",
            color: "text-primary",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Form Options",
            icon: "solar:check-circle-bold",
            color: "text-secondary",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Table Variations",
            icon: "solar:check-circle-bold",
            color: "text-info",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Charts Selection",
            icon: "solar:check-circle-bold",
            color: "text-warning",
          },
          {
            id: uniqueId(),
            url: "",
            name: "Widgets",
            icon: "solar:check-circle-bold",
            color: "text-success",
          },
        ],
      },
    ],
  },
];
export default SidebarContent;
