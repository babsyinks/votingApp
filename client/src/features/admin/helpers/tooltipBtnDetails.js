export default function tooltipBtnDetails() {
  return [
    {
      data: "Add A New Contestant",
      compClass: "shd-grn",
      route: null,
      iClasses: "fa-plus",
    },
    {
      data: "Go To The Home Page",
      compClass: "shd-vlt",
      route: "/",
      iClasses: "fa-home",
    },
    {
      data: "Go To The Voting Page",
      compClass: "shd-blu",
      route: "/vote",
      iClasses: "fa-poll",
    },
    {
      data: "Go To The Election Schedule Page",
      compClass: "shd-red",
      route: "/time",
      iClasses: "fa-stopwatch",
    },
  ];
}
