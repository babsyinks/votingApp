import getStatusMessage from "features/home/helpers/getStatusMessage";

describe('getStatusMessage', () => {
  it('returns correct message for "active_preElectionCountdown"', () => {
    expect(getStatusMessage('active_preElectionCountdown')).toBe('Election Countdown In Progress');
  });

  it('returns correct message for "active_election_live"', () => {
    expect(getStatusMessage('active_election_live')).toBe('🟢 Election Is Live');
  });

  it('returns correct message for "active_election_ended"', () => {
    expect(getStatusMessage('active_election_ended')).toBe('⚠️ Election Has Ended');
  });

  it('returns empty string for unknown status', () => {
    expect(getStatusMessage('some_unknown_status')).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(getStatusMessage(undefined)).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(getStatusMessage(null)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(getStatusMessage('')).toBe('');
  });

  it('returns empty string for number input', () => {
    expect(getStatusMessage(123)).toBe('');
  });

  it('returns empty string for object input', () => {
    expect(getStatusMessage({})).toBe('');
  });
});
