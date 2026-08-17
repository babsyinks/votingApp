"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimerService = void 0;
const createTimerService = (TimerModel) => {
    return {
        /**
         * Fetch all timers.
         *
         * @param options.raw Indicates if the timer model should be returned in raw form
         * @returns Promise<TimerAttributes[]>
         */
        async getAllTimers({ raw = false } = {}) {
            const timers = await TimerModel.findAll();
            return timers.map((timer) => (raw ? timer.get() : timer.toJSON()));
        },
        /**
         * Find timer by ID.
         *
         * @param timer_id ID of the timer to find
         * @returns Promise<TimerAttributes | undefined>
         */
        async findTimerById(timer_id) {
            const timer = await TimerModel.findOne({ where: { timer_id } });
            return timer?.toJSON();
        },
        /**
         * Create a new timer.
         *
         * @param timer Timer configuration object
         * @returns Promise<Timer>
         */
        async createTimer(timer) {
            return TimerModel.create(timer);
        },
        /**
         * Update existing timer.
         *
         * @param timer Existing timer instance
         * @param update Partial update object
         * @returns Promise<void>
         */
        async updateExistingTimer(timer, update) {
            timer.set(update);
            await timer.save();
        },
        /**
         * Delete/reset all timers.
         *
         * @returns Promise<number> number of destroyed rows
         */
        async clearTimer() {
            return TimerModel.destroy({ truncate: true });
        },
    };
};
exports.createTimerService = createTimerService;
exports.default = exports.createTimerService;
