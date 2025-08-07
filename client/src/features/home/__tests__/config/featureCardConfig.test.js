import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("items config", () => {
  let items;

  const mockUUIDs = [
    "id-1",
    "id-2",
    "id-3",
    "id-4",
    "id-5", // for contents1
    "id-6",
    "id-7",
    "id-8",
    "id-9",
    "id-10", // for contents2
  ];

  beforeAll(() => {
    uuidv4.mockImplementation(() => mockUUIDs.shift());
    items = require("features/home/config/featureCardConfig").default;
  });

  it("should have correct structure for item1", () => {
    expect(items.item1.title).toBe("What You Can Expect:");

    const expectedContents = [
      { id: "id-1", content: "Transparent voting process" },
      { id: "id-2", content: "Real-time vote counting" },
      { id: "id-3", content: "Secure authentication for all voters" },
      { id: "id-4", content: "Intuitive user-friendly voting interface" },
      { id: "id-5", content: "Flexibility in setting election period" },
    ];

    expect(items.item1.contents).toEqual(expectedContents);
  });

  it("should have correct structure for item2", () => {
    expect(items.item2.title).toBe("Features of VoteNow:");

    const expectedContents = [
      { id: "id-6", content: "Real-time voting statistics" },
      { id: "id-7", content: "Candidate manifestos and profiles" },
      { id: "id-8", content: "Prevention of double voting" },
      { id: "id-9", content: "Easy-to-access results dashboard" },
      { id: "id-10", content: "Election start and end countdown timers" },
    ];

    expect(items.item2.contents).toEqual(expectedContents);
  });

  it("each content item should have a unique id and string content", () => {
    const allContents = [...items.item1.contents, ...items.item2.contents];

    const allIds = allContents.map((item) => item.id);
    const allText = allContents.map((item) => item.content);

    const uniqueIds = new Set(allIds);

    expect(allIds.length).toBe(10);
    expect(uniqueIds.size).toBe(10); // all IDs should be unique
    allText.forEach((text) => expect(typeof text).toBe("string"));
  });
});
