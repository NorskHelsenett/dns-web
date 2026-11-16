
// Colors for field change types in zone/record changes
// Old value: Orange background (what was removed/changed from)
// New value: Green background (what it changed to)
export const fieldChangeColors = (fieldType: 'old' | 'new') => {
  switch (fieldType) {
    case 'old':
      // Removed/Old value: Light orange background with dark orange text
      return { 
        backgroundColor: '#FEE4CC',  // Light orange
        color: '#92400E'              // Dark orange
      }
    case 'new':
      // Added/New value: Light green background with dark green text
      return { 
        backgroundColor: '#D1F4D4',  // Light green
        color: '#15803D'              // Dark green
      }
    default:
      return { backgroundColor: '#E4E2DC', color: '#1F2937' }
  }
}

// Additional color utilities for change display
export const changeDirectionColor = () => {
  // Arrow color for change direction indicator
  return '#6B7280'  // Gray
}

export const fieldNameColor = () => {
  // Color for field names
  return '#1F2937'  // Dark gray
}

