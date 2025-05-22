export default function tooltipBtnDetails() {
  return [
    {
      data: "Add A New Contestant",
      custClass: "shd-grn",
      route: null,
      iClasses: "fa-plus",
    },
    {
      data: "Go To The Home Page",
      custClass: "shd-vlt",
      route: "/",
      iClasses: "fa-home",
    },
    {
      data: "Go To The Voting Page",
      custClass: "shd-blu",
      route: "/vote",
      iClasses: "fa-poll",
    },
    {
      data: "Go To The Election Schedule Page",
      custClass: "shd-red",
      route: "/time",
      iClasses: "fa-stopwatch",
    },
  ];
}
