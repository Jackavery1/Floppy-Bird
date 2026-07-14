/** RNG et horloge figés pour snapshots canvas reproductibles. */

/** @param {import('@playwright/test').Page} page */
export async function installVisualDeterminism(page) {
    await page.addInitScript(() => {
        const fixed = new Date('2024-07-15T12:00:00');
        const RealDate = Date;
        // @ts-expect-error remplacement contrôlé pour e2e visuel
        globalThis.Date = class extends RealDate {
            constructor(...args) {
                if (args.length === 0) {
                    super(fixed.getTime());
                    return;
                }
                super(...args);
            }

            static now() {
                return fixed.getTime();
            }
        };

        let seed = 42;
        Math.random = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
    });
}
