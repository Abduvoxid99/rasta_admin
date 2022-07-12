import FullScreenLoader from "../components/Skeleton"
import Loadable from "react-loadable"

const Dashboard = Loadable({
  loader: () => import("../views/dashboard/index"),
  loading: FullScreenLoader,
})
const Clients = Loadable({
  loader: () => import("../views/clients"),
  loading: FullScreenLoader,
})
const ClientsCreate = Loadable({
  loader: () => import("../views/clients/Create"),
  loading: FullScreenLoader,
})
const Profile = Loadable({
  loader: () => import("../views/profile"),
  loading: FullScreenLoader,
})
const Orders = Loadable({
  loader: () => import("../views/orders"),
  loading: FullScreenLoader,
})
const OrderForm = Loadable({
  loader: () => import("../views/orders/form"),
  loading: FullScreenLoader,
})

const ShipperSettings = Loadable({
  loader: () => import("../views/settings/ShipperSettings"),
  loading: FullScreenLoader,
})

const ShipperBranchesForm = Loadable({
  loader: () => import("../views/settings/branches/form/index.jsx"),
  loading: FullScreenLoader,
})
const ShipperSettingsCreate = Loadable({
  loader: () => import("../views/settings/ShipperSettings/Create"),
  loading: FullScreenLoader,
})
const Stocks = Loadable({
  loader: () => import("../views/marketing/stocks"),
  loading: FullScreenLoader,
})
const Promotion = Loadable({
  loader: () => import("../views/marketing/promotion"),
  loading: FullScreenLoader,
})

const Tracking = Loadable({
  loader: () => import("../views/tracking"),
  loading: FullScreenLoader,
})

const StockCreate = Loadable({
  loader: () => import("../views/marketing/stocks/form"),
  loading: FullScreenLoader,
})
const PromotionCreate = Loadable({
  loader: () => import("../views/marketing/promotion/form"),
  loading: FullScreenLoader,
})

const Roles = Loadable({
  loader: () => import("../views/roles/Index"),
  loading: FullScreenLoader,
})

const Payme = Loadable({
  loader: () => import("../views/settings/payme"),
  loading: FullScreenLoader,
})

const RolesCreate = Loadable({
  loader: () => import("../views/roles/Create"),
  loading: FullScreenLoader,
})

const Reviews = Loadable({
  loader: () => import("../views/marketing/reviews"),
  loading: FullScreenLoader,
})
const ReviewsCreate = Loadable({
  loader: () => import("../views/marketing/reviews/form"),
  loading: FullScreenLoader,
})
const Newsletter = Loadable({
  loader: () => import("../views/marketing/newsletter"),
  loading: FullScreenLoader,
})
const NewsletterCreate = Loadable({
  loader: () => import("../views/marketing/newsletter/form"),
  loading: FullScreenLoader,
})
const Stories = Loadable({
  loader: () => import("../views/marketing/stories"),
  loading: FullScreenLoader,
})
const StoriesCreate = Loadable({
  loader: () => import("../views/marketing/stories/form"),
  loading: FullScreenLoader,
})

const MenuItems = Loadable({
  loader: () => import("../views/menu/menuItems"),
  loading: FullScreenLoader,
})
const ProductCreate = Loadable({
  loader: () => import("../views/menu/productCreate"),
  loading: FullScreenLoader,
})
const CategoryCreate = Loadable({
  loader: () => import("../views/menu/categoryCreate/index"),
  loading: FullScreenLoader,
})
const News = Loadable({
  loader: () => import("../views/catalog/news"),
  loading: FullScreenLoader,
})
const NewsCreate = Loadable({
  loader: () => import("../views/catalog/news/form"),
  loading: FullScreenLoader,
})

const ProductsCollection = Loadable({
  loader: () => import("../views/catalog/products"),
  loading: FullScreenLoader,
})
const ProductsCollectionCreate = Loadable({
  loader: () => import("../views/catalog/products/form"),
  loading: FullScreenLoader,
})

const CompanyCategory = Loadable({
  loader: () => import("../views/catalog/company_category"),
  loading: FullScreenLoader,
})
// Text banner components
const TextBanner = Loadable({
  loader: () => import("../views/textBanner/index.jsx"),
  loading: FullScreenLoader,
})
const TextBannerForm = Loadable({
  loader: () => import("../views/textBanner/form/index.jsx"),
  loading: FullScreenLoader,
})
const CompanyCategoryCreate = Loadable({
  loader: () => import("../views/catalog/company_category/form"),
  loading: FullScreenLoader,
})
const Banner = Loadable({
  loader: () => import("../views/catalog/banner"),
  loading: FullScreenLoader,
})

const CallsNew = Loadable({
  loader: () => import("../views/calls/new"),
  loading: FullScreenLoader,
})
const BannerCreate = Loadable({
  loader: () => import("../views/catalog/banner/form"),
  loading: FullScreenLoader,
})
const Courier = Loadable({
  loader: () => import("../views/personal/courier"),
  loading: FullScreenLoader,
})
const CourierCreate = Loadable({
  loader: () => import("../views/personal/courier/form"),
  loading: FullScreenLoader,
})
const Operator = Loadable({
  loader: () => import("../views/personal/operator"),
  loading: FullScreenLoader,
})
const OperatorCreate = Loadable({
  loader: () => import("../views/personal/operator/form"),
  loading: FullScreenLoader,
})
const ReportsCourier = Loadable({
  loader: () => import("../views/reports/courier/index"),
  loading: FullScreenLoader,
})

const ReportsBranch = Loadable({
  loader: () => import("../views/reports/branch/index"),
  loading: FullScreenLoader,
})

const ReportsBranchItemTable = Loadable({
  loader: () => import("../views/reports/branch/branchItemTable/index"),
  loading: FullScreenLoader,
})
const ReportsCourierItemTable = Loadable({
  loader: () => import("../views/reports/courier/courierItemTable/index"),
  loading: FullScreenLoader,
})
const ReportsUser = Loadable({
  loader: () => import("../views/reports/users/index"),
  loading: FullScreenLoader,
})
const ReportsRegion = Loadable({
  loader: () => import("../views/reports/region"),
  loading: FullScreenLoader,
})

const CourierType = Loadable({
  loader: () => import("../views/personal/courierType"),
  loading: FullScreenLoader,
})
const CourierTypeCreate = Loadable({
  loader: () => import("../views/personal/courierType/form"),
  loading: FullScreenLoader,
})
const Fares = Loadable({
  loader: () => import("../views/settings/rates"),
  loading: FullScreenLoader,
})
const Debt = Loadable({
  loader: () => import("../views/personal/courier/form/transactions/debt"),
  loading: FullScreenLoader,
})
const TariffCreate = Loadable({
  loader: () => import("../views/settings/rates/form"),
  loading: FullScreenLoader,
})
const GeoFence = Loadable({
  loader: () => import("../views/settings/geofence"),
  loading: FullScreenLoader,
})
const GeoFenceCreate = Loadable({
  loader: () => import("../views/settings/geofence/form"),
  loading: FullScreenLoader,
})
const BranchUser = Loadable({
  loader: () => import("../views/shipperCompany/branchUsers"),
  loading: FullScreenLoader,
})
const BranchUserCreate = Loadable({
  loader: () => import("../views/shipperCompany/branchUsers/form"),
  loading: FullScreenLoader,
})
const Settlement = Loadable({
  loader: () => import("../views/shipperCompany/settlements"),
  loading: FullScreenLoader,
})
const SettlementCreate = Loadable({
  loader: () => import("../views/shipperCompany/settlements/form"),
  loading: FullScreenLoader,
})

const ShipperUserCreate = Loadable({
  loader: () => import("../views/shipperCompany/shipperUsers/form"),
  loading: FullScreenLoader,
})

const ShipperBranchesUsersForm = Loadable({
  loader: () => import("../views/settings/branches/form/users/form"),
  loading: FullScreenLoader,
})

export default [
  {
    component: Dashboard,
    path: "/dashboard",
    exact: true,
    title: "Dashboard",
    permission: "clients",
  },
  {
    component: Clients,
    path: "/personal/clients",
    exact: true,
    title: "clients",
    permission: "clients",
  },
  {
    component: ClientsCreate,
    path: "/personal/clients/create",
    exact: true,
    title: "client-create",
    permission: "clients",
  },
  {
    component: ClientsCreate,
    path: "/personal/clients/:id",
    exact: true,
    title: "client-edit",
    permission: "clients",
  },

  {
    component: CourierType,
    path: "/courier/courier-type",
    exact: true,
    title: "CourierType",
    permission: "courier-type",
  },
  {
    component: CourierTypeCreate,
    path: "/courier/courier-type/create",
    exact: true,
    title: "CourierTypeCreate",
    permission: "courier-type",
  },
  {
    component: CourierTypeCreate,
    path: "/courier/courier-type/:id",
    exact: true,
    title: "CourierTypeEdit",
    permission: "courier-type",
  },
  {
    component: Profile,
    path: "/profile",
    exact: true,
    title: "Profile",
    permission: "profile",
  },
  {
    component: Orders,
    path: "/orders",
    exact: true,
    title: "orders",
    permission: "order",
  },
  {
    component: OrderForm,
    path: "/orders/create",
    exact: true,
    title: "orderCreate",
    permission: "order",
  },
  {
    component: OrderForm,
    path: "/orders/:id",
    exact: true,
    title: "orderCreate",
    permission: "order",
  },
  // {
  //   component: Menu,
  //   path: "/company/shipper-company/menu",
  //   exact: true,
  //   title: "menu",
  //   permission: "menu",
  // },
  {
    component: MenuItems,
    path: "/company/shipper-company/menu/:shipper_id/:menu_id",
    exact: true,
    title: "menu",
    permission: "shipper-company-menu",
  },
  {
    component: Debt,
    path: "/courier/list/:courier_id/debt",
    exact: true,
    title: "debt",
    permission: "courier-list",
  },
  {
    component: CategoryCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/category/create",
    exact: true,
    title: "categoryCreate",
    permission: "shipper-company-menu",
  },
  {
    component: CategoryCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/category/:id",
    exact: true,
    title: "categoryEdit",
    permission: "shipper-company-menu",
  },
  {
    component: ProductCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/product/create",
    exact: true,
    title: "productCreate",
    permission: "shipper-company-menu",
  },
  {
    component: ProductCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/product/:id",
    exact: true,
    title: "productEdit",
    permission: "shipper-company-menu",
  },
  {
    component: ShipperSettings,
    path: "/company/shipper-company",
    exact: true,
    title: "ShipperSettings",
    permission: "shipper-company",
  },
  // Shipper branch crud
  // {
  //   component: ShipperBranches,
  //   path: "/company/shipper-company/:id/branches",
  //   exact: true,
  //   title: "shipperCompanyBranches",
  //   permission: "settings",
  // },
  // {
  //   component: ShipperBranches,
  //   path: "/company/shipper-company/:id/branches",
  //   exact: true,
  //   title: "shipperCompanyBranches",
  //   permission: "settings",
  // },
  {
    component: Tracking,
    path: "/tracking",
    exact: true,
    title: "shipperCompanyBranchesCreate",
    permission: "order",
  },
  {
    component: ShipperBranchesForm,
    path: "/company/shipper-company/:id/branches/create",
    exact: true,
    title: "shipperCompanyBranchesCreate",
    permission: "shipper-company-branch",
  },

  {
    component: ShipperBranchesForm,
    path: "/company/shipper-company/:id/branches/:branch_id",
    exact: true,
    title: "shipperCompanyBranchesEdit",
    permission: "shipper-company-branch",
  },
  {
    component: ShipperBranchesUsersForm,
    path: "/company/shipper-company/:id/branches/:branch_id/users/:user_id",
    exact: true,
    title: "shipperCompanyBranchesUserUpdate",
    permission: "shipper-company-branch-users",
  },
  {
    component: ShipperBranchesUsersForm,
    path: "/company/shipper-company/:id/branches/:branch_id/users/",
    exact: true,
    title: "shipperCompanyBranchesUserUpdate",
    permission: "shipper-company-branch-users",
  },
  {
    component: ShipperSettingsCreate,
    path: "/company/shipper-company/create",
    exact: true,
    title: "ShipperSettings",
    permission: "shipper-company",
  },
  {
    component: ShipperSettingsCreate,
    path: "/company/shipper-company/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "shipper-company",
  },
  {
    component: Stocks,
    path: "/marketing/stocks",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-promotions",
  },
  {
    component: StockCreate,
    path: "/marketing/stocks/create",
    exact: true,
    title: "StockCreate",
    permission: "marketing-promotions",
  },
  {
    component: StockCreate,
    path: "/marketing/stocks/create/:id",
    exact: true,
    title: "StockUpdate",
    permission: "marketing-promotions",
  },
  {
    component: Promotion,
    path: "/marketing/promotion",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-promotions",
  },
  {
    component: PromotionCreate,
    path: "/marketing/promotion/create",
    exact: true,
    title: "PromotionCreate",
    permission: "marketing-promotions",
  },
  {
    component: PromotionCreate,
    path: "/marketing/promotion/create/:id",
    exact: true,
    title: "StockUpdate",
    permission: "marketing-promotions",
  },
  {
    component: Banner,
    path: "/marketing/banners",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-banner",
  },
  {
    component: BannerCreate,
    path: "/marketing/banners/create",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-banner",
  },
  {
    component: BannerCreate,
    path: "/marketing/banners/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-banner",
  },
  {
    component: Reviews,
    path: "/marketing/reviews",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-reviews",
  },
  {
    component: ReviewsCreate,
    path: "/marketing/reviews/create",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-reviews",
  },
  {
    component: ReviewsCreate,
    path: "/marketing/reviews/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-reviews",
  },
  {
    component: Stories,
    path: "/marketing/stories",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-stories",
  },
  {
    component: StoriesCreate,
    path: "/marketing/stories/create",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-stories",
  },
  {
    component: StoriesCreate,
    path: "/marketing/stories/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-stories",
  },
  {
    component: Newsletter,
    path: "/marketing/newsletter",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-newsletter",
  },
  {
    component: NewsletterCreate,
    path: "/marketing/newsletter/create",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-newsletter",
  },
  {
    component: NewsletterCreate,
    path: "/marketing/newsletter/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "marketing-newsletter",
  },
  {
    component: News,
    path: "/marketing/news",
    exact: true,
    title: "News",
    permission: "marketing-company-collection",
  },
  {
    component: NewsCreate,
    path: "/marketing/news/create",
    exact: true,
    title: "NewsCreate",
    permission: "marketing-company-collection",
  },
  {
    component: NewsCreate,
    path: "/marketing/news/:id",
    exact: true,
    title: "NewsEdit",
    permission: "marketing-company-collection",
  },
  {
    component: ProductsCollection,
    path: "/marketing/products-collection",
    exact: true,
    title: "ProductsCollection",
    permission: "marketing-company-collection",
  },
  {
    component: ProductsCollectionCreate,
    path: "/marketing/products-collection/create",
    exact: true,
    title: "ProductsCollectionCreate",
    permission: "marketing-company-collection",
  },
  {
    component: ProductsCollectionCreate,
    path: "/marketing/products-collection/:id",
    exact: true,
    title: "ProductsCollectionEdit",
    permission: "marketing-company-collection",
  },
  {
    component: ReportsCourier,
    path: "/reports/courier",
    exact: true,
    title: "Reports",
    permission: "reports-courier",
  },
  {
    component: ReportsBranch,
    path: "/reports/restaurants",
    exact: true,
    title: "Reports",
    permission: "reports-restaurant",
  },
  {
    component: ReportsBranchItemTable,
    path: "/reports/restaurants/:id",
    exact: true,
    title: "Reports",
    permission: "reports-restaurant",
  },
  {
    component: ReportsCourierItemTable,
    path: "/reports/courier/:id",
    exact: true,
    title: "Reports",
    permission: "reports-restaurant",
  },
  {
    component: ReportsUser,
    path: "/reports/users",
    exact: true,
    title: "Reports",
    permission: "reports-users",
  },
  {
    component: ReportsRegion,
    path: "/reports/cities",
    exact: true,
    title: "Reports",
    permission: "reports-region",
  },
  {
    component: CompanyCategory,
    path: "/marketing/company_category",
    exact: true,
    title: "CompanyCategories",
    permission: "marketing-company-category",
  },
  // Text banner
  {
    component: TextBanner,
    path: "/marketing/text-banner",
    exact: true,
    title: "TextBanner",
    permission: "marketing-company-category",
  },
  {
    component: TextBannerForm,
    path: "/marketing/text-banner/create",
    exact: true,
    title: "TextBannerCreate",
    permission: "marketing-company-category",
  },
  {
    component: TextBannerForm,
    path: "/marketing/text-banner/:id",
    exact: true,
    title: "TextBannerEdit",
    permission: "marketing-company-category",
  },
  {
    component: CompanyCategoryCreate,
    path: "/marketing/company_category/create",
    exact: true,
    title: "CompanyCategoriesCreate",
    permission: "marketing-company-category",
  },
  {
    component: CompanyCategoryCreate,
    path: "/marketing/company_category/:id",
    exact: true,
    title: "CompanyCategoriesEdit",
    permission: "marketing-company-category",
  },
  {
    component: Banner,
    path: "/catalog/banner",
    exact: true,
    title: "Banner",
    permission: "banner",
  },
  {
    component: CallsNew,
    path: "/calls/new",
    exact: true,
    title: "Calls",
    permission: "calls",
  },
  {
    component: BannerCreate,
    path: "/catalog/banner/create",
    exact: true,
    title: "BannerCreate",
    permission: "banner",
  },
  {
    component: BannerCreate,
    path: "/catalog/banner/:id",
    exact: true,
    title: "BannerEdit",
    permission: "banner",
  },
  {
    component: Courier,
    path: "/courier/list",
    exact: true,
    title: "Courier",
    permission: "courier-list",
  },
  {
    component: Courier,
    path: "/courier/offer",
    exact: true,
    title: "Courier offers",
    permission: "courier-list",
  },
  {
    component: CourierCreate,
    path: "/courier/list/create",
    exact: true,
    title: "CourierCreate",
    permission: "courier-list",
  },
  {
    component: CourierCreate,
    path: "/courier/list/:id",
    exact: true,
    title: "CourierEdit",
    permission: "courier-list",
  },
  {
    component: Operator,
    path: "/operator/list",
    exact: true,
    title: "Operator",
    permission: "operator-list",
  },
  {
    component: OperatorCreate,
    path: "/operator/list/create",
    exact: true,
    title: "OperatorCreate",
    permission: "operator-list",
  },
  {
    component: OperatorCreate,
    path: "/operator/list/:id",
    exact: true,
    title: "OperatorEdit",
    permission: "operator-list",
  },
  {
    component: Roles,
    path: "/settings/role/list",
    exact: true,
    title: "OperatorEdit",
    permission: "operator-role-list",
  },
  {
    component: RolesCreate,
    path: "/settings/role/list/create",
    exact: true,
    title: "OperatorEdit",
    permission: "operator-role-list",
  },
  {
    component: RolesCreate,
    path: "/settings/role/list/:id",
    exact: true,
    title: "OperatorEdit",
    permission: "operator-role-list",
  },
  {
    component: Payme,
    path: "/settings/payme",
    exact: true,
    title: "OperatorEdit",
    permission: "operator-role-list",
  },
  {
    component: CourierType,
    path: "/personal/courier_type",
    exact: true,
    title: "CourierType",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/personal/courier_type/create",
    exact: true,
    title: "CourierTypeCreate",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/personal/courier_type/:id",
    exact: true,
    title: "CourierTypeEdit",
    permission: "courier_type",
  },
  {
    component: Fares,
    path: "/settings/fares",
    exact: true,
    title: "Fares",
    permission: "settings-tariff",
  },
  {
    component: TariffCreate,
    path: "/settings/fares/create",
    exact: true,
    title: "Fares.Create",
    permission: "settings-tariff",
  },
  {
    component: TariffCreate,
    path: "/settings/fares/:id",
    exact: true,
    title: "Fares.Edit",
    permission: "settings-tariff",
  },
  {
    component: GeoFence,
    path: "/settings/geofence",
    exact: true,
    title: "Geofence",
    permission: "settings-region",
  },
  {
    component: GeoFenceCreate,
    path: "/settings/geofence/create",
    exact: true,
    title: "GeofenceCreate",
    permission: "settings-region",
  },
  {
    component: GeoFenceCreate,
    path: "/settings/geofence/:geozone_id/:region_id",
    exact: true,
    title: "GeofenceUpdate",
    permission: "settings-region",
  },
  {
    component: BranchUser,
    path: "/company/users",
    exact: true,
    title: "BranchUsers",
    permission: "shipper-company-branch-users",
  },
  {
    component: BranchUserCreate,
    path: "/company/shipper-company/users/create/:shipper_id",
    exact: true,
    title: "BranchUserCreate",
    permission: "shipper-company-branch-users",
  },
  {
    component: BranchUserCreate,
    path: "/company/shipper-company/users/:shipper_id/:user_id",
    exact: true,
    title: "BranchUserUpdate",
    permission: "shipper-company-branch-users",
  },
  {
    component: Settlement,
    path: "/company/settlements",
    exact: true,
    title: "Settlements",
    permission: "shipper-company-settlements",
  },
  {
    component: SettlementCreate,
    path: "/company/settlements/create/:shipper_id",
    exact: true,
    title: "SettlementsCreate",
    permission: "shipper-company-settlements",
  },
  {
    component: ShipperUserCreate,
    path: "/company/shipper-users/create/:shipper_id/create",
    exact: true,
    title: "ShipperCreate",
    // check permission ! chapter
    permission: "shipper-company-settlements",
  },
  {
    component: ShipperUserCreate,
    path: "/company/shipper-users/create/:shipper_id/:id",
    exact: true,
    title: "ShipperEdit",
    // check permission ! chapter
    permission: "shipper-company-settlements",
  },
].map((route) => ({
  ...route,
  path: `/home${route.path}`,
  id: Math.random() + new Date().getTime(),
}))
