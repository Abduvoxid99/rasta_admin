import {
  Settings,
  People,
  Person,
  Restaurant,
  DirectionsCar,
  LocalGroceryStore,
  GpsFixedOutlined,
  Dashboard,
} from "@material-ui/icons"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
export const menu = [
  {
    id: "dashboard",
    title: "dashboard",
    path: "/home/dashboard",
    isActive: false,
    icon: Dashboard,
    permission: "clients",
  },
  {
    id: "orders",
    title: "Заказы",
    path: "/home/orders",
    isActive: false,
    icon: LocalGroceryStore,
    permission: "order",
  },
  {
    id: "personal-clienst",
    title: "Клиенты",
    path: "/home/personal/clients",
    isActive: true,
    permission: "clients",
    icon: People,
  },
  {
    id: "person",
    title: "operator",
    path: "/home/operator/list",
    isActive: true,
    //redirect: "/home/operator/list",
    permission: "operator-list",
    icon: Person,
    // children: [
    //   {
    //     id: "users-company",
    //     title: "operator",
    //     path: "/home/operator/list",
    //     isActive: false,
    //     permission: "operator-list",
    //     isChild: true,
    //   },
    //   {
    //     id: "users-role",
    //     title: "role",
    //     path: "/home/operator/role/list",
    //     isActive: false,
    //     permission: "operator-role-list",
    //     isChild: true,
    //   },
    // ],
  },
  {
    id: "company",
    title: "Список ресторанов",
    path: "/home/company/shipper-company",
    // redirect: '/home/settings/shipper-settings',
    isActive: true,
    icon: Restaurant,
    permission: "shipper-company",
    // children: [
    //   // {
    //   //   id: 'company.settings',
    //   //   title: 'company.settings',
    //   //   path: '/home/settings/shipper-settings',
    //   //   isChild: true,
    //   //   permission: 'settings'
    //   // },
    // ],
  },
  {
    id: "marketing",
    title: "marketing",
    path: "/home/marketing",
    redirect: "/home/marketing/company_category",
    isActive: true,
    icon: GpsFixedOutlined,
    children: [
      {
        id: "company_category",
        title: "company_category",
        path: "/home/marketing/company_category",
        isActive: false,
        permission: "marketing-company-category",
        isChild: true,
      },
      {
        id: "stories",
        title: "Сторис",
        path: "/home/marketing/stories",
        isActive: false,
        permission: "marketing-stories",
        isChild: true,
      },
      {
        id: "stock",
        title: "stock",
        path: "/home/marketing/stocks",
        isChild: true,
        permission: "marketing-promotions",
      },
      {
        id: "promotion",
        title: "promotion",
        path: "/home/marketing/promotion",
        isChild: true,
        permission: "marketing-promotions",
      },
      {
        id: "banners",
        title: "banners",
        path: "/home/marketing/banners",
        isChild: true,
        permission: "marketing-banner",
      },
      {
        id: "textBanner",
        title: "textBanner",
        path: "/home/marketing/text-banner",
        isChild: true,
        permission: "marketing-banner",
      },
      {
        id: "reviews",
        title: "reviews",
        path: "/home/marketing/reviews",
        isChild: true,
        permission: "marketing-reviews",
      },
      {
        id: "newsletter",
        title: "newsletter",
        path: "/home/marketing/newsletter",
        isChild: true,
        permission: "marketing-newsletter",
      },
      {
        id: "news",
        title: "company.collection",
        path: "/home/marketing/news",
        isActive: false,
        permission: "marketing-company-collection",
        isChild: true,
      },
      {
        id: "product.collection",
        title: "product.collection",
        path: "/home/marketing/products-collection",
        isActive: false,
        permission: "marketing-company-collection",
        isChild: true,
      },
    ],
  },
  {
    id: "courier",
    title: "courier",
    path: "/home/courier",
    isActive: true,
    icon: DirectionsCar,
    permission: "courier",
    redirect: "/home/courier/list",
    children: [
      {
        id: "courier_child",
        title: "courier",
        path: "/home/courier/list",
        isActive: false,
        permission: "courier-list",
        isChild: true,
      },
      {
        id: "courier_type",
        title: "courier.type",
        path: "/home/courier/courier-type",
        isActive: false,
        permission: "courier-type",
        isChild: true,
      },
      {
        id: "courier_child_orders",
        title: "courier.offer",
        path: "/home/courier/offer",
        isActive: false,
        permission: "courier-list",
        isChild: true,
      },
    ],
  },
  {
    id: "reports",
    title: "reports",
    path: "/home/reports",
    isActive: true,
    icon: InsertDriveFileIcon,
    permission: "reports",
    redirect: "/home/reports/courier",
    children: [
      {
        id: "reports/courier",
        title: "courier",
        path: "/home/reports/courier",
        isActive: false,
        permission: "reports-courier",
        isChild: true,
      },
      {
        id: "reports/restaurants",
        title: "restaurants",
        path: "/home/reports/restaurants",
        isActive: false,
        permission: "reports-restaurant",
        isChild: true,
      },
      {
        id: "/reports/users",
        title: "users",
        path: "/home/reports/users",
        isActive: false,
        permission: "reports-users",
        isChild: true,
      },
      {
        id: "/reports/cities",
        title: "cities",
        path: "/home/reports/cities",
        isActive: false,
        permission: "reports-region",
        isChild: true,
      },
    ],
  },
  // {
  //   id: "catalog",
  //   title: "catalog",
  //   path: "/home/catalog",
  //   isActive: true,
  //   redirect: "/home/catalog/news",
  //   icon: MenuBook,
  //   children: [
  //     {
  //       id: "news",
  //       title: "news",
  //       path: "/home/catalog/news",
  //       isActive: false,
  //       permission: "news",
  //       isChild: true,
  //     },
  //     {
  //       id: "company_category",
  //       title: "company_category",
  //       path: "/home/catalog/company_category",
  //       isActive: false,
  //       permission: "company_category",
  //       isChild: true,
  //     },
  //     {
  //       id: "banner",
  //       title: "banner",
  //       path: "/home/catalog/banner",
  //       isActive: false,
  //       permission: "banner",
  //       isChild: true,
  //     },
  //   ],
  // },
  {
    id: "settings",
    title: "settings",
    path: "/home/settings",
    isActive: true,
    icon: Settings,
    redirect: "/home/settings/fares",
    children: [
      {
        id: "fares",
        title: "fares",
        path: "/home/settings/fares",
        isActive: false,
        permission: "settings-tariff",
        isChild: true,
      },
      {
        id: "geofence",
        title: "regions",
        path: "/home/settings/geofence",
        isActive: false,
        permission: "settings-region",
        isChild: true,
      },
      {
        id: "users-role",
        title: "role",
        path: "/home/settings/role/list",
        isActive: false,
        permission: "operator-role-list",
        isChild: true,
      },
      {
        id: "users-role",
        title: "Payme",
        path: "/home/settings/payme",
        isActive: false,
        permission: "operator-role-list",
        isChild: true,
      },
    ],
  },

  // {
  //   id: 'new-offers',
  //   title: 'new.offers',
  //   path: '/home/new-offers',
  //   isActive: false,
  //   icon: Work,
  //   permission: 'new_offers'
  // },
  // {
  //   id: 'settings',
  //   title: 'settings',
  //   path: '/home/settings',
  //   isActive: true,
  //   icon: Settings,
  //   children: [
  //     {
  //       id: 'entity.types',
  //       title: 'entity.types',
  //       path: '/home/settings/entity-type',
  //       isChild: true,
  //       permission: 'entity_type'
  //     },
  //     {
  //       id: 'the.logic.of.the.discussion.of.applications',
  //       title: 'the.logic.of.the.discussion.of.applications',
  //       path: '/home/settings/diagram-list',
  //       isChild: true,
  //       permission: 'settings_permission_diagram'
  //     },
  //   ],
  // },
]

export const settings = []

// export default menu