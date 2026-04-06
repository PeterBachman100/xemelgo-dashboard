export const formatLabel = (str) => {
  if (!str) return "";

  // Special overrides for specific business terms
  const overrides = {
    workOrder: "Work Order",
  };

  if (overrides[str]) return overrides[str];

  // Generic CamelCase to Space (e.g., "solutionType" -> "Solution Type")
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (match) => match.toUpperCase()) // Capitalize first letter
    .trim();
};