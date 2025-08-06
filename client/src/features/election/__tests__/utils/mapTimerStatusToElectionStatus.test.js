import { mapTimerStatusToElectionStatus } from "features/election/utils/mapTimerStatusToElectionStatus";

describe('mapTimerStatusToElectionStatus', () => {
  const fixedNow = new Date('2025-01-01T00:00:00Z');
  const fixedNowTimestamp = fixedNow.getTime();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow); // freeze time to a known moment
  });
 
  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns "inActive" when timerStatus is undefined', () => {
    expect(mapTimerStatusToElectionStatus(undefined)).toBe('inActive');
  });

  it('returns "inActive" when timerStatus is null', () => {
    expect(mapTimerStatusToElectionStatus(null)).toBe('inActive');
  });

  it('returns "inActive" when timerStatus is an empty object', () => {
    expect(mapTimerStatusToElectionStatus({})).toBe('inActive');
  });

  it('returns "active_preElectionCountdown" when startDate is in the future', () => {
    const timerStatus = {
      startDate: fixedNowTimestamp + 100000,  // future start date
      endDate: fixedNowTimestamp + 200000,
    };
    expect(mapTimerStatusToElectionStatus(timerStatus)).toBe('active_preElectionCountdown');
  });

  it('returns "active_election_live" when startDate <= now and endDate > now', () => {
    const timerStatus = {
      startDate: fixedNowTimestamp - 100000,  // already started
      endDate: fixedNowTimestamp + 100000,    // not yet ended
    };
    expect(mapTimerStatusToElectionStatus(timerStatus)).toBe('active_election_live');
  });

  it('returns "active_election_ended" when endDate <= now', () => {
    const timerStatus = {
      startDate: fixedNowTimestamp - 200000,  // started long ago
      endDate: fixedNowTimestamp - 100000,    // ended before now
    };
    expect(mapTimerStatusToElectionStatus(timerStatus)).toBe('active_election_ended');
  });

  it('returns "inActive" as fallback when inputs are malformed or invalid', () => {
    const timerStatus = {
      startDate: NaN,
      endDate: undefined,
    };
    expect(mapTimerStatusToElectionStatus(timerStatus)).toBe('inActive');
  });
});

