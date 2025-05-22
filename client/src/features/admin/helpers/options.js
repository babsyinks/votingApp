export default function getOptions() {
  const positions = [
    "President",
    "Vice President",
    "General Secretary",
    "Assistant General Secretary",
    "National Treasurer",
    "National Financial Secretary",
    "National Social Welfare Officer",
    "National Public Relations Officer",
    "National Legal Adviser",
    "National Internal Auditor",
    "Chief Whip",
  ];
  return positions.map((pos) => ({
    optionLabel: pos,
    optionValue: pos.toLowerCase(),
  }));
}
