import { SRS_RANKS } from "common/constants";
import groupByRank from "../groupByRank";

const items = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  streak: Math.floor(i * 0.5),
}));

describe("groupByRank()", () => {
  it("should have a safe default", () => {
    expect(groupByRank()).toMatchSnapshot();
  });

  it("should group ids under named srs ranks", () => {
    const grouped = groupByRank(items);
    expect(grouped).toMatchSnapshot();
    expect(grouped[SRS_RANKS.ZERO].length).toMatchSnapshot();
    expect(grouped[SRS_RANKS.ONE].length).toMatchSnapshot();
    expect(grouped[SRS_RANKS.TWO].length).toMatchSnapshot();
    expect(grouped[SRS_RANKS.THREE].length).toMatchSnapshot();
    expect(grouped[SRS_RANKS.FOUR].length).toMatchSnapshot();
    expect(grouped[SRS_RANKS.FIVE].length).toMatchSnapshot();
  });
});
