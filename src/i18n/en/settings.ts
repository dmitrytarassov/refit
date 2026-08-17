export const SETTINGS_EN = {
  title: "Settings",
  powerDefaults: {
    title: "Power estimation defaults",
    text: "Applied to every newly loaded ride. Changing these on a ride’s dashboard also updates the defaults.",
  },
  weight: {
    title: "Weight",
    text: (rider: number, bike: number, gear: number): string =>
      `Default rider, bike and gear mass for the power model — copied into every newly loaded ride (each ride can then override them in its power settings). Gear is everything the rider carries: helmet, shoes, phone, bike computer and so on. When not set, defaults of ${rider} kg (rider), ${bike} kg (bike) and ${gear} kg (gear) are used and the dashboard shows a reminder.`,
    riderKg: "Rider, kg",
    bikeKg: "Bike, kg",
    gearKg: "Gear, kg",
    clear: "Clear weights",
  },
  bottles: {
    title: "Bottles",
    text: "Water you start the ride with — each bottle’s volume is added to the total mass (1 L ≈ 1 kg), counted full for the whole ride. Copied into every newly loaded ride; each ride can edit its own set in its power settings.",
  },
  ftp: {
    title: "FTP",
    text: "Your Functional Threshold Power. When set, it replaces the per-ride estimate everywhere — power zones, TSS and Intensity Factor. Clear it to go back to the estimated lower bound.",
    label: "Manual FTP",
    placeholder: "e.g. 250",
    clear: "Clear FTP",
  },
};
