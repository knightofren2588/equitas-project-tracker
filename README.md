# Mike's Project Tracker - Equitas Health

A modern, interactive project tracking system for Safety & Web Development projects at Equitas Health.

## Features

- **Visual Project Cards** - Modern card-based layout with hover effects
- **Interactive Filtering** - Filter by status, project type, or search by name
- **Progress Tracking** - Visual progress bars and completion percentages
- **Statistics Dashboard** - Real-time project statistics
- **Dual View Options** - Switch between card and table views
- **Mobile Responsive** - Works on all devices
- **Color-Coded Priorities** - Visual priority indicators

## File Structure

```
project-tracker/
├── index.html      # Main HTML structure
├── styles.css      # All CSS styling
├── script.js       # JavaScript functionality
├── data.js         # Project data
└── README.md       # This file
```

## Getting Started

1. **Clone or download** all files to your local machine
2. **Open** `index.html` in your web browser
3. **Start tracking** your projects!

## Adding New Projects

Currently, new projects need to be added manually to the `data.js` file. Each project should follow this structure:

```javascript
{
    id: 29,
    name: "Project Name",
    status: "Not Started", // Options: "Not Started", "Ongoing", "Completed", "On Hold"
    priority: "High", // Options: "High", "Medium", "Low"
    type: "Web Development", // Options: "Web Development", "Safety", "Map Design"
    startDate: "2025-07-15",
    dueDate: "2025-07-30", // Optional, can be ""
    category: "Work - Web Dev",
    objective: "Brief description of current objective",
    notes: "Detailed project notes and current status",
    actions: "Next steps and upcoming actions",
    completion: 0 // 0-100 percentage
}
```

## Project Statistics

The tracker automatically calculates:
- Total number of projects
- Completed projects count
- Ongoing projects count
- Average completion percentage

## Filtering Options

- **Status Filter**: All Status, Completed, Ongoing, Not Started, On Hold
- **Type Filter**: All Types, Web Development, Safety, Map Design
- **Search**: Search by project name

## Future Enhancements

- [ ] Add Project Form (modal for adding new projects)
- [ ] Edit Project functionality
- [ ] Data persistence (local storage)
- [ ] Export to CSV/PDF
- [ ] Timeline/calendar view
- [ ] Team assignment features
- [ ] Due date notifications

## Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with Grid, Flexbox, and animations
- **JavaScript** - DOM manipulation and interactivity
- **No external dependencies** - Pure vanilla JavaScript

## Browser Support

Works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

This project is for internal use at Equitas Health. For updates or new features, contact Mike Butcher.

## License

Internal use only - Equitas Health

---

**Last Updated**: July 2025  
**Version**: 1.0  
**Maintainer**: Mike Butcher - Safety & Web Development