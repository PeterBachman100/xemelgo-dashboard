import { formatLabel } from "./stringUtils";

export const getNotificationMessage = (action, item) => {
  const { name, solutionType, location } = item;
  const type = formatLabel(solutionType || "Item");
  
  const pastTense = {
    move: "moved",
    scan: "scanned",
    receive: "received",
    missing: "marked as missing",
    consume: "marked as consumed",
    complete: "marked as complete",
  };

  const verb = pastTense[action] || "updated";

  // Logic for location-based actions
  if (["move", "scan", "receive"].includes(action)) {
    return `${type} ${name} ${verb} at ${location || 'new location'}`;
  }

  // Logic for status-based actions
  return `${type} ${name} ${verb}`;
};