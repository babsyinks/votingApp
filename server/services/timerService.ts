import type { TimerAttributes, TimerCreationAttributes } from "../models/timer";
import { Timer } from "../models/timer";

export const createTimerService = (TimerModel: typeof Timer) => {
  return {
    /**
     * Fetch all timers.
     *
     * @param options.raw Indicates if the timer model should be returned in raw form
     * @returns Promise<TimerAttributes[]>
     */
    async getAllTimers({ raw = false }: { raw?: boolean } = {}): Promise<
      TimerAttributes[] | Timer[]
    > {
      const timers = await TimerModel.findAll();
      return timers.map((timer) => (raw ? timer.get() : timer.toJSON()));
    },

    /**
     * Find timer by ID.
     *
     * @param timer_id ID of the timer to find
     * @returns Promise<TimerAttributes | undefined>
     */
    async findTimerById(
      timer_id: string,
    ): Promise<TimerAttributes | undefined> {
      const timer = await TimerModel.findOne({ where: { timer_id } });
      return timer?.toJSON();
    },

    /**
     * Create a new timer.
     *
     * @param timer Timer configuration object
     * @returns Promise<Timer>
     */
    async createTimer(timer: TimerCreationAttributes): Promise<Timer> {
      return TimerModel.create(timer);
    },

    /**
     * Update existing timer.
     *
     * @param timer Existing timer instance
     * @param update Partial update object
     * @returns Promise<void>
     */
    async updateExistingTimer(
      timer: Timer,
      update: Partial<TimerAttributes>,
    ): Promise<void> {
      timer.set(update);
      await timer.save();
    },

    /**
     * Delete/reset all timers.
     *
     * @returns Promise<number> number of destroyed rows
     */
    async clearTimer(): Promise<number> {
      return TimerModel.destroy({ truncate: true });
    },
  };
};
export type TimerService = ReturnType<typeof createTimerService>;
export default createTimerService;
